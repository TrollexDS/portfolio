import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'

const QUOTE_ICON = 'src/assets/images/general/quote-icon.svg'

/**
 * QuoteCard — a card displaying a quote with a centred gradient quote icon
 * and a "My design principle" label beneath.
 *
 * Props:
 *   classes  : string — grid placement class (e.g. 'quote-card-1')
 *   segments : Array<{ text: string, bold?: boolean }>
 *              — the quote broken into plain and bold (gradient) segments
 */
export default defineComponent({
  name: 'QuoteCard',
  props: {
    classes:  { type: String, required: true },
    segments: { type: Array,  required: true },
  },
  setup(props) {
    return () => {
      const textNodes = props.segments.map(({ text, bold }) =>
        bold ? h('strong', text) : text
      )

      return h(BentoCard, { classes: props.classes }, {
        default: () => [
          h('img', { class: 'quote-icon', src: QUOTE_ICON, alt: '' }),
          h('p', { class: 'quote-text' }, textNodes),
          h('span', { class: 'design-principle' }, 'My design principle'),
        ],
      })
    }
  },
})
