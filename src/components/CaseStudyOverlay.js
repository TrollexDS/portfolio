import { defineComponent, h, ref, nextTick, onUnmounted } from 'vue'
import { ICON_SHRINK, ICON_FULL_SCREEN } from '../assets/icons/icons.js'

const ANIM_MS = 700
const EASE = 'cubic-bezier(0.34, 1.1, 0.64, 1)'
const FLY_TRANSITION = `left ${ANIM_MS}ms ${EASE}, top ${ANIM_MS}ms ${EASE}, width ${ANIM_MS}ms ${EASE}, height ${ANIM_MS}ms ${EASE}, border-radius ${ANIM_MS}ms ${EASE}`

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
    videoSrc:   { type: String, required: true },
    videoClass: { type: String, default: '' },
    tooltip:    { type: String, default: '' },
    heroSize:   { type: Number, default: 448 },
  },

  setup(props, { slots }) {
    const cardEl    = ref(null)
    const videoEl   = ref(null)
    const expanded  = ref(false)
    const settled   = ref(false)
    const closing   = ref(false)
    const flyActive  = ref(false)
    const heroReady  = ref(false)
    const wasOpen    = ref(false)
    const flyStyle  = ref({})
    const ripples   = ref([])

    let startRect  = null   // collapsed card bounding rect
    let videoStart = null   // collapsed video bounding rect
    let closeTimer = null
    let flyTimer   = null
    let rippleId   = 0

    // ── Escape key to close ──
    function onKeydown(e) { if (e.key === 'Escape') close() }
    onUnmounted(() => document.removeEventListener('keydown', onKeydown))

    // ── Ripple on expanded card click (skip interactive widgets) ──
    function spawnRipple(e) {
      if (e.target.closest('.cc-outer') || e.target.closest('.cv-outer') || e.target.closest('.tldr-bar')) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = rippleId++
      ripples.value.push({ id, x, y })
      setTimeout(() => { ripples.value = ripples.value.filter(r => r.id !== id) }, 520)
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
      expanded.value  = true
      settled.value   = false
      closing.value   = false
      wasOpen.value   = true
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)

      await nextTick()

      // Let the start-state paint, then trigger FLIP
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settled.value = true

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
          clearTimeout(flyTimer)
          flyTimer = setTimeout(() => {
            if (heroReady.value) {
              flyActive.value = false
            } else {
              // Poll until the hero video has decoded enough to display
              const poll = setInterval(() => {
                if (heroReady.value) {
                  clearInterval(poll)
                  flyActive.value = false
                }
              }, 50)
            }
          }, ANIM_MS + 150)
        })
      })
    }

    // ── Close ──
    function close() {
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
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        expanded.value  = false
        settled.value   = false
        closing.value   = false
        flyActive.value = false
        startRect  = null
        videoStart = null
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.removeEventListener('keydown', onKeydown)
      }, ANIM_MS + 20)
    }

    // ── Render ──
    return () => h('div', { class: 'cs-card-wrapper' }, [

      // ── Flying video (position:fixed, above everything) ──
      flyActive.value ? h('video', {
        class: 'cs-video-fly',
        src:      props.videoSrc,
        autoplay: true,
        loop:     true,
        muted:    true,
        playsinline: true,
        style: flyStyle.value,
      }) : null,

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

        h('video', {
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
          onClick: spawnRipple,
        }, [

          // ── Header bar (exit button only) ──
          h('div', { class: 'cs-header' }, [
            h('button', {
              class:        'cs-header-close',
              onClick:      e => { e.stopPropagation(); close() },
              'aria-label': 'Close case study',
            }, [
              h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 }),
            ]),
          ]),

          // ── Scrollable content area ──
          h('div', { class: 'cs-expanded-inner' }, [
            h('div', { class: 'cs-expanded-content' }, [

              // Hero video (static, replaces flying video after animation)
              h('video', {
                class:    'cs-hero-video',
                src:      props.videoSrc,
                autoplay: true,
                loop:     true,
                muted:    true,
                playsinline: true,
                onLoadeddata: () => { heroReady.value = true },
                style: {
                  width:  props.heroSize + 'px',
                  height: props.heroSize + 'px',
                  opacity: flyActive.value ? 0 : 1,
                },
              }),

              // Case study sections (passed via slot)
              slots.content?.(),
            ]),
          ]),

          // Ripples
          ...ripples.value.map(r =>
            h('div', {
              key:   r.id,
              class: 'card-ripple',
              style: { left: r.x + 'px', top: r.y + 'px', width: '20px', height: '20px', marginLeft: '-10px', marginTop: '-10px' },
            })
          ),
        ]),
      ]) : null,
    ])
  },
})
