import { defineComponent, h, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { MOBILE_BREAKPOINT } from '../filterLayouts.js'
import LazyToggle from './LazyToggle.js'
import ThemeToggle from './ThemeToggle.js'

const LOGO      = '/src/assets/logos/alex-logo.svg'
const ARROW_OUT = '/src/assets/icons/external-link.svg'
import { ICON_SHRINK } from '../assets/icons/icons.js'

const NAV_ITEMS = ['All', 'About', 'Work', 'Side Quests']

// Shorter labels for mobile to avoid two-line pills
const MOBILE_LABELS = { 'Side Quests': 'Hobbies' }
const SCROLL_THRESHOLD = 80  // px from top before hide kicks in

export default defineComponent({
  name: 'NavBar',
  emits: ['filterChange'],
  setup(props, { emit }) {
    const active = ref('All')
    const hidden = ref(false)
    const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT)
    const pillsRef = ref(null)
    const pillEls = ref([])
    const indicatorStyle = ref({ left: '0px', width: '0px' })
    const indicatorReady = ref(false)

    // Hover ghost pill state
    const hoverStyle = ref({ left: '0px', width: '0px', opacity: 0 })

    // Liquid-glass stretch state
    const isAnimating = ref(false)
    const stretchTransform = ref('')

    function getElMetrics(item) {
      const container = pillsRef.value
      if (!container) return null
      const idx = NAV_ITEMS.indexOf(item)
      const el = pillEls.value[idx]
      if (!el) return null
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      return {
        left: elRect.left - containerRect.left,
        width: elRect.width,
        centerX: (elRect.left - containerRect.left) + elRect.width / 2,
      }
    }

    function updateIndicator(skipTransition = false) {
      const m = getElMetrics(active.value)
      if (!m) return
      indicatorStyle.value = {
        left: `${m.left}px`,
        width: `${m.width}px`,
      }
      if (!skipTransition) indicatorReady.value = true
    }

    let lastScrollY = 0

    // The header stays over an open case study (body.cs-open): the logo and
    // the toggles keep their place and keep hiding on scroll, now against
    // the case study's own scroller rather than the window. The minimise
    // and the Detailed / TL;DR pill sit outside the part that hides.
    const csOpen = ref(document.body.classList.contains('cs-open'))

    function scrollerY() {
      if (csOpen.value) {
        const inner = document.querySelector('.cs-expanded-inner')
        return inner ? inner.scrollTop : 0
      }
      return window.scrollY
    }

    function onScroll(e) {
      // On mobile the nav lives at the bottom and is always visible
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        hidden.value = false
        lastScrollY = scrollerY()
        return
      }
      // Scrolls are captured document-wide: only the window's and the open
      // case study's count, not a carousel's or a code block's.
      if (e && e.target !== document && e.target !== window) {
        if (!(csOpen.value && e.target.classList && e.target.classList.contains('cs-expanded-inner'))) return
      }
      const currentY = scrollerY()
      if (currentY > lastScrollY && currentY > SCROLL_THRESHOLD) {
        hidden.value = true
      } else {
        hidden.value = false
      }
      lastScrollY = currentY
    }

    // Peek: while the row is hidden by scrolling, bringing the cursor to
    // the top of the window shows it, and taking the cursor away hides it
    // again - a way to reach Light/Dark without scrolling up. A little
    // hysteresis so the row doesn't flicker at the edge of the zone.
    const PEEK_IN  = 88
    const PEEK_OUT = 120
    const peek = ref(false)
    function onPointerMove(e) {
      if (window.innerWidth <= 768) return
      if (!peek.value && e.clientY <= PEEK_IN) peek.value = true
      else if (peek.value && e.clientY > PEEK_OUT) peek.value = false
    }
    function onPointerLeave() { peek.value = false }

    // The whole row hides together - logo, toggles, and the case study's
    // Detailed / TL;DR pill, which lives in the overlay and follows this
    // class. Only the minimise stays: an exit shouldn't move.
    const rowHidden = computed(() => hidden.value && !peek.value)
    watch(rowHidden, v => document.body.classList.toggle('nav-hidden', v), { immediate: true })

    // The minimise arrives and leaves as liquid: it splits off the theme
    // toggle when a case study opens and merges back into it when one
    // closes. The goo is a layer of its own behind the buttons - two solid
    // blobs under an SVG goo filter, shown only for the length of the move,
    // because glass and goo don't mix (a filtered parent takes the blur
    // away from the buttons inside it). The theme blob tracks the real
    // toggle, which slides 44px to make room; the minimise blob stays
    // where the toggle was and grows, so one circle divides into two.
    const closing = ref(false)   // the minimise is on its way out
    const goo = ref(null)        // 'in' | 'out' while the liquid plays
    let gooTimer = 0
    const GOO_MS = 800

    function playGoo(dir) {
      clearTimeout(gooTimer)
      goo.value = dir
      gooTimer = setTimeout(() => {
        goo.value = null
        if (dir === 'out') closing.value = false
      }, GOO_MS)
    }

    function onCsOpen() {
      csOpen.value = true; hidden.value = false; lastScrollY = 0
      closing.value = false
      if (!isMobile.value) playGoo('in')
    }
    function onCsClose() {
      csOpen.value = false; hidden.value = false; lastScrollY = window.scrollY
      if (isMobile.value) return
      closing.value = true
      // With the row hidden there is nothing to merge into: a plain fade.
      if (rowHidden.value) {
        clearTimeout(gooTimer)
        gooTimer = setTimeout(() => { closing.value = false }, 250)
      } else {
        playGoo('out')
      }
    }
    function closeCaseStudy() { window.dispatchEvent(new CustomEvent('cs:close')) }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    function onBreakpoint(e) { isMobile.value = e.matches }

    onMounted(() => {
      lastScrollY = window.scrollY
      document.addEventListener('scroll', onScroll, { passive: true, capture: true })
      document.addEventListener('mousemove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onPointerLeave)
      window.addEventListener('cs:open',  onCsOpen)
      window.addEventListener('cs:closed', onCsClose)
      mql.addEventListener('change', onBreakpoint)
      nextTick(() => {
        updateIndicator(true)
        requestAnimationFrame(() => { indicatorReady.value = true })
      })
    })

    onUnmounted(() => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      document.removeEventListener('mousemove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('cs:open',  onCsOpen)
      window.removeEventListener('cs:closed', onCsClose)
      mql.removeEventListener('change', onBreakpoint)
    })

    // ── Hover ghost pill handlers ──
    function onPillHover(item) {
      if (item === active.value) {
        hoverStyle.value = { ...hoverStyle.value, opacity: 0 }
        return
      }
      const m = getElMetrics(item)
      if (!m) return
      hoverStyle.value = {
        left: `${m.left}px`,
        width: `${m.width}px`,
        opacity: 1,
      }
    }

    function onPillLeave() {
      hoverStyle.value = { ...hoverStyle.value, opacity: 0 }
    }

    // ── Liquid-glass select ──
    function selectItem(item) {
      if (item === active.value) return

      const fromMetrics = getElMetrics(active.value)
      const toMetrics   = getElMetrics(item)

      // Hide hover ghost immediately
      hoverStyle.value = { ...hoverStyle.value, opacity: 0 }

      if (fromMetrics && toMetrics) {
        const distance = Math.abs(toMetrics.centerX - fromMetrics.centerX)
        // Stretch proportional to distance — capped for subtlety
        const stretchX = 1 + Math.min(distance / 280, 0.35)
        const squishY  = 1 - Math.min(distance / 900, 0.12)
        const dir = toMetrics.centerX > fromMetrics.centerX ? 1 : -1

        // Phase 1: stretch while moving
        isAnimating.value = true
        stretchTransform.value = `scaleX(${stretchX}) scaleY(${squishY})`

        active.value = item
        emit('filterChange', item)
        nextTick(() => {
          updateIndicator(false)

          // Phase 2: settle back to normal
          requestAnimationFrame(() => {
            setTimeout(() => {
              stretchTransform.value = 'scaleX(1) scaleY(1)'
              // Phase 3: done
              setTimeout(() => {
                isAnimating.value = false
                stretchTransform.value = ''
              }, 280)
            }, 80)
          })
        })
      } else {
        active.value = item
        emit('filterChange', item)
        nextTick(() => updateIndicator(false))
      }
    }

    return () => {
      // Build indicator style — merge stretch transform when animating
      const baseIndicator = { ...indicatorStyle.value }
      if (stretchTransform.value) {
        baseIndicator.transform = stretchTransform.value
      }

      return h('div', { class: 'nav-root' }, [

      // The liquid, behind the buttons (see onCsOpen).
      goo.value
        ? h('div', { key: `goo-${goo.value}`, class: ['nav-goo', `nav-goo--${goo.value}`] }, [
            h('svg', { class: 'nav-goo__filter', width: 0, height: 0, 'aria-hidden': 'true' }, [
              h('defs', [
                h('filter', { id: 'nav-goo', x: '-50%', y: '-50%', width: '200%', height: '200%', 'color-interpolation-filters': 'sRGB' }, [
                  h('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 5, result: 'blur' }),
                  h('feColorMatrix', { in: 'blur', mode: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10', result: 'goo' }),
                ]),
              ]),
            ]),
            h('div', { class: 'nav-goo__inner' }, [
              h('div', { class: 'nav-goo__blobs' }, [
                h('span', { class: 'nav-goo__blob nav-goo__blob--theme' }),
                h('span', { class: 'nav-goo__blob nav-goo__blob--close' }),
              ]),
            ]),
          ])
        : null,

      // The minimise lives outside the nav so the scroll-hide never takes it.
      (csOpen.value || closing.value)
        ? h('div', { class: 'nav-close' }, [
            h('div', { class: 'nav-close__inner' }, [
              h('button', {
                class:          ['nav-close__btn', closing.value ? 'nav-close__btn--out' : '', goo.value ? `nav-close__btn--goo-${goo.value}` : ''],
                onClick:        closeCaseStudy,
                'aria-label':   'Close case study',
                'data-tooltip': 'Press Esc to exit fullscreen',
              }, [h('img', { src: ICON_SHRINK, alt: '', width: 20, height: 20 })]),
            ]),
          ])
        : null,

      h('nav', { class: ['nav', rowHidden.value ? 'nav--hidden' : ''].filter(Boolean).join(' ') }, [
       h('div', { class: 'nav-inner' }, [
        h('img', {
          class: ['nav-logo', csOpen.value ? 'nav-logo--close' : ''].filter(Boolean).join(' '),
          src: LOGO,
          alt: 'Alex Chiu',
          // inside a case study the logo is a way home: it closes it
          onClick: () => { if (csOpen.value) closeCaseStudy() },
        }),

        h('div', {
          class: 'nav-pills',
          ref: pillsRef,
          onMouseleave: onPillLeave,
        }, [
          // Hover ghost pill (faint, follows hovered item)
          h('span', {
            class: 'nav-pill-hover-ghost',
            style: hoverStyle.value,
          }),
          // Sliding indicator with liquid-glass stretch
          h('span', {
            class: [
              'nav-pill-indicator',
              indicatorReady.value ? 'nav-pill-indicator--ready' : '',
              isAnimating.value ? 'nav-pill-indicator--liquid' : '',
            ],
            style: baseIndicator,
          }),
          // Pills
          ...NAV_ITEMS.map((item, i) =>
            h('a', {
              href: '#',
              class: ['nav-pill', active.value === item ? 'active' : ''],
              ref: (el) => { if (el) pillEls.value[i] = el },
              onClick: (e) => { e.preventDefault(); selectItem(item) },
              onMouseenter: () => onPillHover(item),
            }, isMobile.value && MOBILE_LABELS[item] ? MOBILE_LABELS[item] : item)
          ),
        ]),

        // ── Toggles (top-right): smooth scroll + colour theme ──
        h('div', { class: 'nav-toggles' }, [
          h(LazyToggle),
          h(ThemeToggle),
        ]),
       ]),
      ]),
      ])
    }
  },
})
