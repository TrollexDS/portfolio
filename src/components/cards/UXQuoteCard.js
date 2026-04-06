import { defineComponent, h } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'
import { useExpandOverlay } from '../../composables/useExpandOverlay.js'
import { useRipple } from '../../composables/useRipple.js'

const QUOTE_ICON = 'src/assets/images/general/quote-icon.svg'

export default defineComponent({
  name: 'UXQuoteCard',

  setup() {
    const { cardEl, innerEl, expanded, settled, closing, expandedStyle, open, close } = useExpandOverlay()
    const { spawnRipple, renderRipples } = useRipple()

    return () => h('div', { class: 'ux-quote-card-wrapper' }, [

      // ── Collapsed card ──────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', 'ux-quote-card', expanded.value ? 'ux-quote-card--ghost' : ''].filter(Boolean).join(' '),
        onClick:        open,
        'data-tooltip': 'My UX philosophy',
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('img', { class: 'quote-icon', src: QUOTE_ICON, alt: '' }),
        h('p',    { class: 'quote-text' }, [
          'Great UX is to make users ',
          h('strong', 'feel in control'),
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

          h('div', { ref: innerEl, class: 'about-expanded-inner ux-quote-expanded-inner' }, [
            h('div', { class: 'about-expanded-content' }, [

              h('img', { class: 'ux-quote-expanded-icon', src: QUOTE_ICON, alt: '' }),

              h('p', { class: 'ux-quote-expanded-quote' }, [
                'Great UX is to make users ',
                h('strong', 'feel in control'),
                '.',
              ]),

              h('div', { class: 'ux-quote-expanded-body' }, [
                h('p', ['The best interfaces don\'t just work well, they make people ', h('strong', 'feel confident'), ' using them. When someone can predict what will happen next, recover easily from mistakes, and move through a flow without second-guessing themselves, that\'s not accidental. That\'s designed.']),
                h('p', ['I focus on creating experiences where users always know where they are, what they can do, and what just happened. Not by simplifying everything down to nothing, but by making complexity feel manageable. Control isn\'t about fewer options, it\'s about ', h('strong', 'clarity at every decision point'), '.']),
              ]),

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
