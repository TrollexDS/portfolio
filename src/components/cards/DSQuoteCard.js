import { defineComponent, h, ref, nextTick } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'

const QUOTE_ICON = 'src/assets/images/general/quote-icon.svg'

const ANIM_MS = 700
const EASE    = 'cubic-bezier(0.34, 1.1, 0.64, 1)'
const MAX_W   = 560
const MAX_H   = 660

const PARAGRAPHS = [
  ['A design system is a shared language. It helps teams move faster, stay aligned, and build with confidence, but it\'s a tool, ', { bold: 'not a rulebook' }, '. The moment a component or pattern gets in the way of a better experience, it should be challenged.'],
  ['I treat design systems as living foundations, not rigid constraints. If breaking a pattern means solving a real user problem more effectively, I\'ll break it, then feed what I\'ve learned back into the system so it evolves. The best design systems ', { bold: 'aren\'t the ones that enforce the most rules' }, ', but the ones that make it easier to ', { bold: 'do the right thing for users' }, '.'],
]

export default defineComponent({
  name: 'DSQuoteCard',

  setup() {
    const cardEl   = ref(null)
    const innerEl  = ref(null)
    const expanded = ref(false)
    const settled  = ref(false)
    const closing  = ref(false)
    const ripples  = ref([])

    let startRect  = null
    let closeTimer = null
    let rippleId   = 0

    function spawnRipple(e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const id   = rippleId++
      ripples.value.push({ id, x: e.clientX - rect.left, y: e.clientY - rect.top })
      setTimeout(() => { ripples.value = ripples.value.filter(r => r.id !== id) }, 520)
    }

    function expandedStyle() {
      if (!startRect) return {}
      const vpW     = window.innerWidth
      const vpH     = window.innerHeight
      const targetW = Math.min(MAX_W, vpW - 48)
      const targetH = Math.min(MAX_H, vpH * 0.85)
      const targetL = (vpW - targetW) / 2
      const targetT = (vpH - targetH) / 2

      if (!settled.value || closing.value) {
        return {
          left:   startRect.left   + 'px',
          top:    startRect.top    + 'px',
          width:  startRect.width  + 'px',
          height: startRect.height + 'px',
        }
      }
      return {
        left:   Math.max(24, targetL) + 'px',
        top:    Math.max(24, targetT) + 'px',
        width:  targetW + 'px',
        height: targetH + 'px',
      }
    }

    async function open() {
      if (expanded.value) return
      startRect      = cardEl.value.getBoundingClientRect()
      expanded.value = true
      settled.value  = false
      closing.value  = false
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow            = 'hidden'
      await nextTick()
      if (innerEl.value) innerEl.value.scrollTop = 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { settled.value = true })
      })
    }

    function close() {
      if (closing.value) return
      closing.value = true
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        expanded.value = false
        settled.value  = false
        closing.value  = false
        startRect      = null
        document.documentElement.style.overflow = ''
        document.body.style.overflow            = ''
      }, ANIM_MS + 20)
    }

    return () => h('div', { class: 'ds-quote-card-wrapper' }, [

      // ── Collapsed card ──────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', 'ds-quote-card', expanded.value ? 'ds-quote-card--ghost' : ''].filter(Boolean).join(' '),
        onClick:        open,
        'data-tooltip': 'My design system philosophy',
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('img', { class: 'quote-icon', src: QUOTE_ICON, alt: '' }),
        h('p', { class: 'quote-text' }, [
          'Design system improves efficiency and consistency, but ',
          h('strong', 'never at the cost of user experience'),
          '.',
        ]),
        h('span', { class: 'design-principle' }, 'My design principle'),
      ]),

      // ── Expanded overlay ────────────────────────────────────
      expanded.value ? h('div', null, [

        h('div', {
          class:       ['about-backdrop', closing.value ? 'about-backdrop--out' : ''].join(' '),
          onClick:     close,
          onWheel:     e => e.preventDefault(),
          onTouchmove: e => e.preventDefault(),
        }),

        h('div', {
          class: [
            'about-expanded-card',
            settled.value  ? 'about-expanded-card--settled' : '',
            closing.value  ? 'about-expanded-card--closing' : '',
          ].filter(Boolean).join(' '),
          style:   expandedStyle(),
          onClick: spawnRipple,
        }, [
          h('button', {
            class:        'about-shrink-btn',
            onClick:      e => { e.stopPropagation(); close() },
            'aria-label': 'Close',
          }, [h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 })]),

          h('div', { ref: innerEl, class: 'about-expanded-inner ds-quote-expanded-inner' }, [
            h('div', { class: 'about-expanded-content' }, [

              h('img', { class: 'ds-quote-expanded-icon', src: QUOTE_ICON, alt: '' }),

              h('p', { class: 'ds-quote-expanded-quote' }, [
                'Design system improves efficiency and consistency, but ',
                h('strong', 'never at the cost of user experience'),
                '.',
              ]),

              h('div', { class: 'ds-quote-expanded-body' },
                PARAGRAPHS.map(p => h('p', p.map(seg => typeof seg === 'string' ? seg : h('strong', seg.bold))))
              ),

              h('span', { class: 'design-principle' }, 'My design principle'),
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
