import { defineComponent, h, ref, nextTick, onUnmounted } from 'vue'

/* ── End of a case study ───────────────────────────────────────────────
   Three ways on, in order of weight: the next case study (a card with
   its title), back to the grid, and a quiet "get in touch" that copies
   the email rather than opening a mail client - the same as the Gmail
   card on the grid.

   Rendered once, by CaseStudyOverlay, after every case study's content.

   Order follows the grid (CARD_ENTRIES in src/App.js) and wraps round.
   Slugs and titles mirror scripts/case-studies.config.js; duplicated
   here, like SLUG_TO_CARD_KEY in App.js, because the config isn't an
   ES module.

   Next and Home are real links, so the no-JS fallback page gets them
   too. With JS, Next closes this case study and opens the next one only
   once the close has finished: the two overlays share the body's scroll
   lock, and opening during the close would have the close undo it. */

const CASE_STUDIES = [
  { key: 'plugin',    slug: 'figma-plugin-rayo-thumbnails', title: 'Streamlining the Design Process & Improving Efficiency at Scale' },
  { key: 'layerlint', slug: 'figma-plugin-layer-lint',      title: "Your layers are the prompt. Make sure they're worth reading." },
  { key: 'designlab', slug: 'rayo-design-lab',              title: 'The Platform That Lets Our Whole Design Team Prototype with AI' },
  { key: 'agenticds', slug: 'agentic-design-system',        title: "I didn't use AI to build a design system. I built a design system that AI can use." },
  { key: 'ds',        slug: 'rayo-design-system',           title: 'Refactoring the Rayo Design System for Scalability & Consistency' },
  { key: 'schedule',  slug: 'rayo-schedule',                title: 'Challenging the Brief: From Station Pages to Schedule' },
  { key: 'alexa',     slug: 'rayo-in-alexa',                title: 'Bringing Design to a Team That Had Never Had a Designer' },
  { key: 'ssds',      slug: 'simplestream-design-system',   title: 'Brand Switching in Seconds: Scaling a White-Label Design System' },
]

const EMAIL = 'alex@mchiu.co.uk'
const COPIED_MS = 2000

const svg = (children, size = 18, width = 2.5) =>
  h('svg', {
    'aria-hidden': 'true', width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': width,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }, children)

const ICON_NEXT  = () => svg([h('line', { x1: 5, y1: 12, x2: 19, y2: 12 }), h('polyline', { points: '13 6 19 12 13 18' })])
const ICON_HOME  = () => svg([h('line', { x1: 19, y1: 12, x2: 5, y2: 12 }), h('polyline', { points: '11 6 5 12 11 18' })])
const ICON_COPY  = () => svg([h('rect', { x: 9, y: 9, width: 12, height: 12, rx: 2 }), h('path', { d: 'M5 15V5a2 2 0 0 1 2-2h10' })], 16, 2.2)
const ICON_CHECK = () => svg([h('polyline', { points: '5 12 10 17 19 7' })], 16, 2.8)

export default defineComponent({
  name: 'CaseStudyEnd',
  props: {
    cardKey: { type: String, required: true },
  },
  setup(props) {
    const copied = ref(false)
    let copiedTimer = 0
    let pendingOpen = null

    function nextOf(key) {
      const i = CASE_STUDIES.findIndex(c => c.key === key)
      return i === -1 ? null : CASE_STUDIES[(i + 1) % CASE_STUDIES.length]
    }

    function goNext(e, next) {
      e.preventDefault()
      e.stopPropagation()
      if (pendingOpen) return
      pendingOpen = () => {
        window.removeEventListener('cs:closed', pendingOpen)
        pendingOpen = null
        // The close has pushed '/': swap it for the next case study, so
        // Back returns to the one just read, then let App open it.
        history.replaceState(null, '', `/case-studies/${next.slug}/`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
      window.addEventListener('cs:closed', pendingOpen)
      window.dispatchEvent(new CustomEvent('cs:close'))
    }

    function goHome(e) {
      e.preventDefault()
      e.stopPropagation()
      window.dispatchEvent(new CustomEvent('cs:close'))
    }

    // The cursor tooltip only rereads its text on a mousemove: nudge it
    // where the pointer already is, so "Copied" shows without moving.
    function refreshTooltip(el, x, y) {
      nextTick(() => el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y })))
    }

    function copyEmail(e) {
      e.stopPropagation()
      const el = e.currentTarget
      const { clientX: x, clientY: y } = e
      const done = () => {
        copied.value = true
        refreshTooltip(el, x, y)
        clearTimeout(copiedTimer)
        copiedTimer = setTimeout(() => {
          copied.value = false
          if (el.matches(':hover')) refreshTooltip(el, x, y)
        }, COPIED_MS)
      }
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, () => {})
    }

    onUnmounted(() => {
      clearTimeout(copiedTimer)
      if (pendingOpen) window.removeEventListener('cs:closed', pendingOpen)
    })

    return () => {
      const next = nextOf(props.cardKey)

      return h('nav', { class: 'cse', 'aria-label': 'More case studies' }, [
        next
          ? h('a', {
              class: 'cse-next',
              href: `/case-studies/${next.slug}/`,
              onClick: e => goNext(e, next),
            }, [
              h('span', { class: 'cse-next__text' }, [
                h('span', { class: 'cse-next__label' }, 'Next case study'),
                h('span', { class: 'cse-next__title' }, next.title),
              ]),
              h('span', { class: 'cse-next__arrow' }, [ICON_NEXT()]),
            ])
          : null,

        h('div', { class: 'cse-row' }, [
          h('a', { class: 'cse-home', href: '/', onClick: goHome }, [ICON_HOME(), 'Back to home']),

          // Needs JS to copy: left out of the no-JS fallback.
          h('button', {
            type: 'button',
            class: ['cse-contact', copied.value ? 'cse-contact--copied' : ''],
            onClick: copyEmail,
            'aria-label': `Copy email address ${EMAIL}`,
            'data-tooltip': copied.value ? 'Copied ✓' : 'Click to copy my email address 📨',
            'data-fallback': 'skip',
          }, [
            'Get in touch',
            h('span', { class: 'cse-contact__email' }, EMAIL),
            // only the icon changes: copy → tick
            copied.value
              ? h('span', { class: 'cse-contact__icon cse-contact__tick' }, [ICON_CHECK()])
              : h('span', { class: 'cse-contact__icon' }, [ICON_COPY()]),
          ]),
        ]),

        h('span', { class: 'sr-only', 'aria-live': 'polite', 'data-fallback': 'skip' }, copied.value ? 'Email address copied' : ''),
      ])
    }
  },
})
