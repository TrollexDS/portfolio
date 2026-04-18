import { defineComponent, h, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { isLazy }     from './lazyMode.js'
import NavBar         from './components/NavBar.js'
import BentoCard      from './components/BentoCard.js'
import AboutCard      from './components/cards/AboutCard.js'
import GmailCard      from './components/cards/GmailCard.js'
import LinkedInCard   from './components/cards/LinkedInCard.js'
import BulbCard       from './components/cards/BulbCard.js'
import SimplestreamDSCard from './components/cards/SimplestreamDSCard.js'
import RayoDSCard     from './components/cards/RayoDSCard.js'
import PluginCard     from './components/cards/PluginCard.js'
import AlexaCard      from './components/cards/AlexaCard.js'
import ScheduleCard   from './components/cards/ScheduleCard.js'
import DuolingoCard   from './components/cards/DuolingoCard.js'
import StravaCard     from './components/cards/StravaCard.js'
import ClawInvestCard from './components/cards/ClawInvestCard.js'
import AgenticDSCard  from './components/cards/AgenticDSCard.js'
import LayerLintCard from './components/cards/LayerLintCard.js'
import UXQuoteCard   from './components/cards/UXQuoteCard.js'
import DSQuoteCard   from './components/cards/DSQuoteCard.js'
import CursorTooltip  from './components/CursorTooltip.js'
import CursorShape    from './components/CursorShape.js'
import BackToTop      from './components/BackToTop.js'
import { LAYOUTS, MOBILE_LAYOUTS, MOBILE_BREAKPOINT } from './filterLayouts.js'


/* ── Static card definitions ─────────────────────────────────────────────
   Each entry maps a layout key → its Vue component + any static props.
   Order here determines DOM order (which only matters for tab order /
   accessibility — visual order is controlled entirely by grid placement).
──────────────────────────────────────────────────────────────────────── */
const CARD_ENTRIES = [
  { key: 'about',      comp: AboutCard },
  { key: 'gmail',      comp: GmailCard },
  { key: 'linkedin',   comp: LinkedInCard },
  { key: 'bulb',       comp: BulbCard },
  { key: 'duolingo',   comp: DuolingoCard },
  { key: 'plugin',     comp: PluginCard },
  { key: 'ds',         comp: RayoDSCard },
  { key: 'dsquote', comp: DSQuoteCard },
  { key: 'uxquote', comp: UXQuoteCard },
  { key: 'alexa',      comp: AlexaCard },
  { key: 'schedule',   comp: ScheduleCard },
  { key: 'ssds',      comp: SimplestreamDSCard },
  { key: 'clawinvest', comp: ClawInvestCard },
  { key: 'strava',     comp: StravaCard },
  { key: 'agenticds', comp: AgenticDSCard },
  { key: 'layerlint', comp: LayerLintCard },
]


export default defineComponent({
  name: 'App',
  setup() {
    const activeFilter = ref('All')
    const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT)

    // Keep isMobile in sync with viewport width
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    mql.addEventListener('change', (e) => { isMobile.value = e.matches })

    // ── Deep-link: open a case study card from URL hash ──
    function openCardFromHash() {
      const hash = window.location.hash.slice(1)
      if (!hash) return
      // Small delay to ensure cards are mounted and listening
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cs:open', { detail: hash }))
      }, 300)
    }
    onMounted(() => {
      openCardFromHash()
      window.addEventListener('hashchange', openCardFromHash)
    })
    onUnmounted(() => {
      window.removeEventListener('hashchange', openCardFromHash)
    })

    // Direct DOM refs for each grid-slot wrapper (keyed by card key).
    // Stored outside Vue reactivity for 60 fps FLIP perf.
    const slotEls = {}

    /* ── FLIP animation engine ──────────────────────────────────────────
       1. Snapshot every slot's bounding rect (First)
       2. Let Vue apply the new grid positions  (Last)
       3. Invert: translate each slot back to its old visual position
       4. Play:   animate to transform:none
    ──────────────────────────────────────────────────────────────────── */
    async function onFilterChange(newFilter) {
      if (newFilter === activeFilter.value) return

      // Scroll to top on every filter switch
      window.scrollTo({ top: 0, behavior: isLazy.value ? 'smooth' : 'instant' })

      // ── F: snapshot current rects ──
      const prevRects = {}
      for (const key in slotEls) {
        const el = slotEls[key]
        if (el) prevRects[key] = el.getBoundingClientRect()
      }

      // ── L: update state → Vue re-renders with new grid positions ──
      activeFilter.value = newFilter
      await nextTick()

      // ── I + P: invert then play ──
      const movers = []
      for (const key in slotEls) {
        const el = slotEls[key]
        if (!el || !prevRects[key]) continue
        const newRect = el.getBoundingClientRect()
        const dx = prevRects[key].left - newRect.left
        const dy = prevRects[key].top  - newRect.top
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue

        // Snap to old position instantly
        el.style.transition = 'none'
        el.style.transform  = `translate(${dx}px, ${dy}px)`
        movers.push(el)
      }

      if (!movers.length) return

      // Promote to GPU layers only for the duration of the animation
      movers.forEach(el => { el.style.willChange = 'transform' })

      // Force reflow so the snap is committed before we animate
      movers[0].getBoundingClientRect()

      // Animate to final position
      requestAnimationFrame(() => {
        movers.forEach(el => {
          el.style.transition =
            'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
          el.style.transform = 'none'

          // Clean up inline styles after animation finishes
          const cleanup = () => {
            el.style.transition = ''
            el.style.transform  = ''
            el.style.willChange = ''
            el.removeEventListener('transitionend', cleanup)
          }
          el.addEventListener('transitionend', cleanup, { once: true })
        })
      })
    }

    /* ── Render ──────────────────────────────────────────────────────── */
    return () => {
      const layoutMap = isMobile.value ? MOBILE_LAYOUTS : LAYOUTS
      const layout = layoutMap[activeFilter.value] || layoutMap.All

      const cardSlots = CARD_ENTRIES.map(({ key, comp, props }) => {
        const pos = layout[key]
        if (!pos) return null

        return h('div', {
          key,
          class: ['grid-slot', pos.dim ? 'grid-slot--dim' : ''],
          style: {
            gridColumn: pos.col,
            gridRow:    pos.row,
          },
          ref: el => { slotEls[key] = el },
        }, [
          h(comp, props || {}),
        ])
      }).filter(Boolean)

      return h('div', [
        // ── Animated cursor shape (arrow ↔ I-beam) ──
        h(CursorShape),

        // ── Global cursor tooltip ────────────────
        h(CursorTooltip),

        // ── Navigation ──────────────────────────
        h(NavBar, { onFilterChange }),

        // ── Back to top button ───────────────────
        h(BackToTop),

        // ── Bento Grid ──────────────────────────
        h('main', { class: 'main' }, [
          h('img', { class: 'mobile-page-logo', src: 'src/assets/logos/alex-logo.svg', alt: 'Alex Chiu' }),
          h('div', { class: 'grid' }, cardSlots),
        ]),
      ])
    }
  },
})
