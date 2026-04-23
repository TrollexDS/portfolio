import { defineComponent, h, ref, nextTick, onUnmounted, watch, onMounted } from 'vue'
import { ICON_SHRINK, ICON_FULL_SCREEN } from '../assets/icons/icons.js'
import { useRipple } from '../composables/useRipple.js'
import { isLazy } from '../lazyMode.js'

const ANIM_MS = 700
const EASE = 'cubic-bezier(0.34, 1.1, 0.64, 1)'
const FLY_TRANSITION = `left ${ANIM_MS}ms ${EASE}, top ${ANIM_MS}ms ${EASE}, width ${ANIM_MS}ms ${EASE}, height ${ANIM_MS}ms ${EASE}, border-radius ${ANIM_MS}ms ${EASE}`

// Card-key → canonical URL slug. Mirrors scripts/case-studies.config.js.
// Used to (a) push the per-case-study path into history on open, and
// (b) detect when a popstate has navigated *away* from this card so the
// overlay can close itself.
const CARD_KEY_TO_SLUG = {
  agenticds: 'agentic-design-system',
  ds:        'rayo-design-system',
  ssds:      'simplestream-design-system',
  plugin:    'figma-plugin-rayo-thumbnails',
  alexa:     'rayo-in-alexa',
  schedule:  'rayo-schedule',
  layerlint: 'figma-plugin-layer-lint',
}

/**
 * CaseStudyOverlay — shared expand-to-fullscreen component for case study cards.
 *
 * Props:
 *   cardClass    : string  — CSS class for the collapsed card (e.g. 'plugin-card')
 *   videoSrc     : string  — source URL for the card/hero video
 *   videoClass   : string  — CSS class for the video element (e.g. 'plugin-video')
 *   tooltip      : string  — tooltip text for cursor hover
 *   heroSize     : number  — width/height of the hero video in expanded view (default 448)
 *
 * Slots:
 *   default      — collapsed card overlay content (optional, rendered on top of video)
 *   content      — expanded case study body (sections below the hero video)
 */
export default defineComponent({
  name: 'CaseStudyOverlay',

  props: {
    cardClass:  { type: String, default: '' },
    cardKey:    { type: String, default: '' },
    videoSrc:   { type: String, default: '' },
    videoClass: { type: String, default: '' },
    imageSrc:      { type: String, default: '' },
    imageClass:    { type: String, default: '' },
    heroWrapClass: { type: String, default: '' },
    tooltip:       { type: String, default: '' },
    heroSize:   { type: Number, default: 448 },
  },

  setup(props, { slots }) {
    const cardEl    = ref(null)
    const videoEl   = ref(null)
    const expanded  = ref(false)
    const settled   = ref(false)
    const closing   = ref(false)
    const flyActive  = ref(false)
    const flyFading  = ref(false)   // true while flying video is crossfading out
    const heroReady  = ref(false)
    const wasOpen    = ref(false)
    const flyStyle  = ref({})
    const { spawnRipple, renderRipples } = useRipple()

    let startRect  = null   // collapsed card bounding rect
    let videoStart = null   // collapsed video bounding rect
    let closeTimer = null
    let flyTimer   = null
    let imgObserver = null
    let savedScrollY = 0

    // ── Back-to-top inside case study ──
    const scrollHost = ref(null)   // .cs-expanded-inner
    const bttVisible = ref(false)

    // Lock inner scroll while fly animation is active
    function lockInnerScroll() {
      const el = scrollHost.value
      if (el) el.style.overflowY = 'hidden'
    }
    function unlockInnerScroll() {
      const el = scrollHost.value
      if (el) el.style.overflowY = ''
    }

    let csScrolling = false

    function onCsScroll(e) {
      if (csScrolling) return
      bttVisible.value = e.target.scrollTop > window.innerHeight * 0.5
    }

    function scrollCsToTop() {
      const el = scrollHost.value
      if (!el) return
      const start = el.scrollTop
      if (start === 0) return

      csScrolling = true
      const startTime = performance.now()
      const duration = 500
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        el.scrollTo(0, start * (1 - ease))
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          csScrolling = false
          bttVisible.value = false
        }
      }
      requestAnimationFrame(step)
    }

    // ── Scroll-triggered fade-slide-up for static images ──
    const contentEl = ref(null)

    function setupImageObserver() {
      if (imgObserver) imgObserver.disconnect()
      const container = contentEl.value
      if (!container) return

      imgObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('cs-img-visible')

              // Lazy-load videos: swap data-src → src and autoplay
              if (entry.target.tagName === 'VIDEO' && entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src
                entry.target.removeAttribute('data-src')
                entry.target.play().catch(() => {})
              }

              imgObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0, rootMargin: '200px', root: container.closest('.cs-expanded-inner') }
      )

      // Observe all static images, videos, and grouped image containers
      container.querySelectorAll('.cs-cover-img, .cs-demo-video, .cs-account-link-steps, .ba-wrap').forEach(el => {
        imgObserver.observe(el)
      })

      // Safety net: force-play ALL videos after 1s
      // (IO unreliable inside scroll containers on mobile)
      setTimeout(() => {
        container.querySelectorAll('video').forEach(v => {
          // Swap data-src if still present
          if (v.dataset.src) {
            v.src = v.dataset.src
            v.removeAttribute('data-src')
          }
          v.muted = true                       // ensure muted (autoplay policy)
          v.play().catch(() => {})
          v.classList.add('cs-img-visible')
        })
      }, 1000)
    }

    function teardownImageObserver() {
      if (imgObserver) { imgObserver.disconnect(); imgObserver = null }
    }

    onUnmounted(teardownImageObserver)

    // ── Escape key to close ──
    function onKeydown(e) { if (e.key === 'Escape') close() }
    onUnmounted(() => document.removeEventListener('keydown', onKeydown))

    // ── Deep-link + URL sync ──
    // App.js dispatches 'cs:open' with a cardKey when the current URL resolves
    // to a case study (either /case-studies/<slug>/ or legacy /#<cardKey>).
    function onHashOpen(e) {
      if (e.detail === props.cardKey) open()
    }
    // Close the overlay if the browser navigates to a URL that no longer
    // points at this card — covers the back button after opening, and any
    // other history nav while the overlay is up.
    function onPopState() {
      if (!expanded.value) return
      const slug = CARD_KEY_TO_SLUG[props.cardKey]
      const onMyPath = slug && window.location.pathname === `/case-studies/${slug}/`
      if (!onMyPath) close({ skipUrlUpdate: true })
    }
    onMounted(() => {
      window.addEventListener('cs:open', onHashOpen)
      window.addEventListener('popstate', onPopState)
    })
    onUnmounted(() => {
      window.removeEventListener('cs:open', onHashOpen)
      window.removeEventListener('popstate', onPopState)
    })

    // ── Ripple on expanded card click (skip interactive widgets) ──
    function onExpandedClick(e) {
      if (e.target.closest('.cc-outer') || e.target.closest('.cv-outer') || e.target.closest('.tldr-bar')) return
      spawnRipple(e)
    }

    // ── Where the video lands in the expanded view ──
    function videoTarget() {
      const vpW = window.innerWidth
      // On mobile, cap to viewport width minus 48px padding (24px each side)
      const size = Math.min(props.heroSize, vpW - 48)
      return {
        left: (vpW - size) / 2,
        top: 40,
        size,
      }
    }

    // ── Expanded card position (FLIP: starts at card rect, ends fullscreen) ──
    function expandedStyle() {
      if (!startRect) return {}

      if (!settled.value || closing.value) {
        return {
          left:   startRect.left   + 'px',
          top:    startRect.top    + 'px',
          width:  startRect.width  + 'px',
          height: startRect.height + 'px',
        }
      }
      return {
        left:   '0px',
        top:    '0px',
        width:  '100vw',
        height: '100vh',
      }
    }

    // ── Open ──
    async function open() {
      if (expanded.value) return

      startRect  = cardEl.value.getBoundingClientRect()
      videoStart = videoEl.value.getBoundingClientRect()

      // Place flying video exactly over the collapsed video (no transition)
      flyStyle.value = {
        left:         videoStart.left   + 'px',
        top:          videoStart.top    + 'px',
        width:        videoStart.width  + 'px',
        height:       videoStart.height + 'px',
        borderRadius: '32px',
        transition:   'none',
      }
      flyActive.value = true
      heroReady.value = false
      bttVisible.value = false
      expanded.value  = true
      settled.value   = false
      closing.value   = false
      wasOpen.value   = true
      savedScrollY = window.scrollY
      // Push the canonical case-study URL so the address bar, history, and
      // sharing all reflect the open overlay. Skip the push when we're
      // already on that URL (direct landing, or re-opening via popstate)
      // to avoid duplicate history entries.
      const slug = CARD_KEY_TO_SLUG[props.cardKey]
      if (slug) {
        const target = `/case-studies/${slug}/`
        if (window.location.pathname !== target) {
          history.pushState(null, '', target)
        }
      }
      document.body.style.position = 'fixed'
      document.body.style.top = `-${savedScrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)

      await nextTick()
      lockInnerScroll()

      // Let the start-state paint, then trigger FLIP
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settled.value = true

          // Set up image reveal observer once content is rendered
          nextTick(() => setupImageObserver())

          const t = videoTarget()
          flyStyle.value = {
            left:         t.left + 'px',
            top:          t.top  + 'px',
            width:        t.size + 'px',
            height:       t.size + 'px',
            borderRadius: '32px',
            transition:   FLY_TRANSITION,
          }

          // Hand off to static hero video once flight completes AND hero is ready
          // Uses a crossfade to avoid a flash when switching from flying to static video
          clearTimeout(flyTimer)
          flyTimer = setTimeout(() => {
            const doHandoff = () => {
              flyFading.value = true          // hero starts fading in (fly stays opaque)
              // Wait for hero to fully paint and transition in, then snap-remove fly
              requestAnimationFrame(() => requestAnimationFrame(() => {
                setTimeout(() => {
                  flyActive.value = false
                  flyFading.value = false
                  unlockInnerScroll()
                }, 250)  // matches hero transition duration + margin
              }))
            }
            if (heroReady.value) {
              doHandoff()
            } else {
              let handedOff = false
              const poll = setInterval(() => {
                if (heroReady.value) {
                  clearInterval(poll)
                  if (!handedOff) { handedOff = true; doHandoff() }
                }
              }, 50)
              // Safety: unlock scroll even if hero media never loads
              setTimeout(() => {
                clearInterval(poll)
                if (!handedOff) { handedOff = true; doHandoff() }
              }, 500)
            }
          }, ANIM_MS + 150)
        })
      })
    }

    // ── Close ──
    // opts.skipUrlUpdate: skip the history.pushState back to '/'. Used when
    // close() is called from a popstate handler (the browser already moved
    // the URL; pushing again would corrupt history).
    function close(opts = {}) {
      if (closing.value) return

      const useFly = !flyActive.value

      if (useFly && videoStart) {
        // Place flying video at expanded hero position (no transition)
        const t = videoTarget()
        flyStyle.value = {
          left:         t.left + 'px',
          top:          t.top  + 'px',
          width:        t.size + 'px',
          height:       t.size + 'px',
          borderRadius: '32px',
          transition:   'none',
        }
        flyActive.value = true

        // Fly back to collapsed position
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            flyStyle.value = {
              left:         videoStart.left   + 'px',
              top:          videoStart.top    + 'px',
              width:        videoStart.width  + 'px',
              height:       videoStart.height + 'px',
              borderRadius: '32px',
              transition:   FLY_TRANSITION,
            }
          })
        })
      }

      closing.value = true
      teardownImageObserver()
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        expanded.value  = false
        settled.value   = false
        closing.value   = false
        flyActive.value = false
        flyFading.value = false
        startRect  = null
        videoStart = null
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, savedScrollY)
        document.removeEventListener('keydown', onKeydown)
        // Return the URL to the site root when the overlay closes. Skip
        // when close() was triggered by popstate (browser already moved
        // the URL). Also clear any legacy /#<cardKey> hash that might
        // still be present from old bookmarks.
        if (!opts.skipUrlUpdate) {
          const slug = CARD_KEY_TO_SLUG[props.cardKey]
          const onMyPath = slug && window.location.pathname === `/case-studies/${slug}/`
          if (onMyPath) {
            history.pushState(null, '', '/')
          } else if (props.cardKey && window.location.hash === '#' + props.cardKey) {
            history.replaceState(null, '', window.location.pathname + window.location.search)
          }
        }
      }, ANIM_MS + 20)
    }

    // ── Render ──
    return () => h('div', { class: 'cs-card-wrapper' }, [

      // ── Flying media (position:fixed, above everything) ──
      flyActive.value
        ? (slots.flyContent
            // If a flyContent slot is provided, wrap image + slot content in a div
            ? h('div', {
                class: 'cs-video-fly',
                style: { ...flyStyle.value, overflow: 'hidden' },
              }, [
                h('img', {
                  src: props.imageSrc,
                  alt: '',
                  style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
                }),
                slots.flyContent(),
              ])
            : props.imageSrc
              ? h('img', {
                  class: 'cs-video-fly',
                  src:   props.imageSrc,
                  alt:   '',
                  style: { ...flyStyle.value, objectFit: 'cover' },
                })
              : h('video', {
                  class: 'cs-video-fly',
                  src:      props.videoSrc,
                  autoplay: true,
                  loop:     true,
                  muted:    true,
                  playsinline: true,
                  style: flyStyle.value,
                })
          )
        : null,

      // ── Collapsed card ──
      h('div', {
        ref:     cardEl,
        class:   [
          'bento-card', 'dark',
          props.cardClass,
          expanded.value ? 'cs-card--ghost' : '',
          wasOpen.value ? 'cs-card--was-open' : '',
        ].filter(Boolean).join(' '),
        onClick: open,
        ...(props.tooltip && { 'data-tooltip': props.tooltip }),
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_FULL_SCREEN, alt: 'Open case study' })]),

        props.imageSrc
          ? h('img', {
              ref:   videoEl,
              src:   props.imageSrc,
              class: props.imageClass || props.videoClass,
              alt:   '',
              style: flyActive.value
                ? 'pointer-events: none; opacity: 0;'
                : 'pointer-events: none;',
            })
          : h('video', {
              ref:      videoEl,
              'data-src': props.videoSrc,
              class:    props.videoClass,
              loop:     true,
              muted:    true,
              preload:  'none',
              playsinline:          true,
              disablePictureInPicture: true,
              controlsList: 'nodownload nofullscreen noremoteplayback',
              style: flyActive.value
                ? 'pointer-events: none; opacity: 0;'
                : 'pointer-events: none;',
            }),

        // Optional collapsed overlay content
        slots.default?.(),
      ]),

      // ── Expanded fullscreen overlay ──
      expanded.value ? h('div', null, [

        // Backdrop
        h('div', {
          class:   ['cs-backdrop', closing.value ? 'cs-backdrop--out' : ''].filter(Boolean).join(' '),
          onClick:     close,
          onWheel:     e => e.preventDefault(),
          onTouchmove: e => e.preventDefault(),
        }),

        // Fullscreen card
        h('div', {
          class: [
            'cs-expanded',
            settled.value ? 'cs-expanded--settled' : '',
            closing.value ? 'cs-expanded--closing' : '',
          ].filter(Boolean).join(' '),
          style: expandedStyle(),
          onClick: onExpandedClick,
        }, [

          // ── Header bar (exit button only) ──
          h('div', { class: 'cs-header' }, [
            h('button', {
              class:           'cs-header-close',
              onClick:         e => { e.stopPropagation(); close() },
              'aria-label':    'Close case study',
              'data-tooltip':  'Press Esc to exit fullscreen',
            }, [
              h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 }),
            ]),
          ]),

          // ── Scrollable content area ──
          h('div', { ref: scrollHost, class: 'cs-expanded-inner', onScroll: onCsScroll }, [
            h('div', { ref: contentEl, class: 'cs-expanded-content' }, [

              // Hero media (static, replaces flying media after animation)
              props.imageSrc
                ? h('div', {
                    class: ['cs-hero-wrap', props.heroWrapClass].filter(Boolean).join(' '),
                    style: {
                      width:    props.heroSize + 'px',
                      height:   props.heroSize + 'px',
                      position: 'relative',
                      marginLeft:  'auto',
                      marginRight: 'auto',
                    },
                  }, [
                    h('img', {
                      class:  'cs-hero-video',
                      src:    props.imageSrc,
                      alt:    '',
                      onLoad: () => { heroReady.value = true },
                      style: {
                        width:      '100%',
                        height:     '100%',
                        objectFit:  'cover',
                        opacity:    flyActive.value && !flyFading.value ? 0 : 1,
                        transition: 'opacity 0.2s ease',
                      },
                    }),
                    // Optional overlay content on top of hero (e.g. logo rail)
                    slots.heroOverlay?.(),
                  ])
                : h('video', {
                    class:    'cs-hero-video',
                    src:      props.videoSrc,
                    autoplay: true,
                    loop:     true,
                    muted:    true,
                    playsinline: true,
                    onLoadeddata: () => { heroReady.value = true },
                    style: {
                      width:      props.heroSize + 'px',
                      height:     props.heroSize + 'px',
                      opacity:    flyActive.value && !flyFading.value ? 0 : 1,
                      transition: 'opacity 0.2s ease',
                    },
                  }),

              // Case study sections (passed via slot)
              slots.content?.(),
            ]),
          ]),

          // Ripples
          ...renderRipples(),

          // Back-to-top button (inside expanded card)
          h('button', {
            class: ['cs-back-to-top', bttVisible.value ? 'cs-back-to-top--visible' : ''],
            onClick: e => { e.stopPropagation(); scrollCsToTop() },
            'aria-label': 'Back to top',
          }, [
            h('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '20', height: '20', viewBox: '0 0 24 24',
              fill: 'none', stroke: 'currentColor',
              'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            }, [h('polyline', { points: '18 15 12 9 6 15' })]),
          ]),
        ]),
      ]) : null,
    ])
  },
})
