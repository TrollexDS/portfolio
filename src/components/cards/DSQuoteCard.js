import { defineComponent, h } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'
import { useExpandOverlay } from '../../composables/useExpandOverlay.js'
import { useRipple } from '../../composables/useRipple.js'

const QUOTE_ICON = '/src/assets/images/general/quote-icon.svg'

const PARAGRAPHS = [
  ['A design system is a shared language. It helps teams move faster, stay aligned, and build with confidence, but it\'s a tool, ', { bold: 'not a rulebook' }, '. The moment a component or pattern gets in the way of a better experience, it should be challenged.'],
  ['I treat design systems as living foundations, not rigid constraints. If breaking a pattern means solving a real user problem more effectively, I\'ll break it, then feed what I\'ve learned back into the system so it evolves. The best design systems ', { bold: 'aren\'t the ones that enforce the most rules' }, ', but the ones that make it easier to ', { bold: 'do the right thing for users' }, '.'],
]

export default defineComponent({
  name: 'DSQuoteCard',

  setup() {
    const { cardEl, innerEl, expanded, settled, closing, expandedStyle, open, close } = useExpandOverlay()
    const { spawnRipple, renderRipples } = useRipple()

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
            class:          'about-shrink-btn',
            onClick:        e => { e.stopPropagation(); close() },
            'aria-label':   'Close',
            'data-tooltip': 'Press Esc to exit',
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
          ...renderRipples(),
        ]),

      ]) : null,
    ])
  },
})
