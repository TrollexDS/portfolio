import { defineComponent, h } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'
import { useExpandOverlay } from '../../composables/useExpandOverlay.js'
import { useRipple } from '../../composables/useRipple.js'

const QUOTE_ICON = '/src/assets/images/general/quote-icon.svg'

const QUOTE = () => [
  'An AI workflow ',
  h('strong', 'only one person can run'),
  ' isn’t a workflow, it’s a bottleneck.',
]

const PARAGRAPHS = [
  ['I’m not cautious about AI, and I think some of what we do today will simply stop being necessary. But being right about ', { bold: 'where things are going' }, ' doesn’t make you right about the pace. Push it onto someone still learning the craft, and what looks like resistance is usually a gap in support nobody asked about.'],
  ['So I treat it like any other change to how a team works: agree it together, and close the gap before widening it. Ask what’s making someone uncomfortable and the answer is nearly always specific and fixable - they haven’t been shown the tool, or they don’t know what’s still their call. ', { bold: 'A team where everyone can work the new way' }, ' beats one person working ten times faster.'],
]

export default defineComponent({
  name: 'AIQuoteCard',

  setup() {
    const { cardEl, innerEl, expanded, settled, closing, expandedStyle, open, close } = useExpandOverlay()
    const { spawnRipple, renderRipples } = useRipple()

    return () => h('div', { class: 'ai-quote-card-wrapper' }, [

      // ── Collapsed card ──────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', 'ai-quote-card', expanded.value ? 'ai-quote-card--ghost' : ''].filter(Boolean).join(' '),
        onClick:        open,
        'data-tooltip': 'My philosophy on adopting AI',
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('img', { class: 'quote-icon', src: QUOTE_ICON, alt: '' }),
        h('p', { class: 'quote-text' }, QUOTE()),
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
            settled.value ? 'about-expanded-card--settled' : '',
            closing.value ? 'about-expanded-card--closing' : '',
          ].filter(Boolean).join(' '),
          style:   expandedStyle(),
          onClick: spawnRipple,
        }, [
          h('button', {
            class:          'about-shrink-btn',
            onClick:        e => { e.stopPropagation(); close() },
            'aria-label':   'Close',
            'data-tooltip': 'Press Esc to exit',
          }, [h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 })]),

          h('div', { ref: innerEl, class: 'about-expanded-inner ai-quote-expanded-inner' }, [
            h('div', { class: 'about-expanded-content' }, [

              h('img', { class: 'ai-quote-expanded-icon', src: QUOTE_ICON, alt: '' }),

              h('p', { class: 'ai-quote-expanded-quote' }, QUOTE()),

              h('div', { class: 'ai-quote-expanded-body' },
                PARAGRAPHS.map(p => h('p', p.map(seg => typeof seg === 'string' ? seg : h('strong', seg.bold))))
              ),

              h('span', { class: 'design-principle' }, 'My design principle'),
            ]),
          ]),

          // Ripples
          ...renderRipples(),
        ]),

      ]) : null,
    ])
  },
})
