import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'

/**
 * IconCard — simple card with a centred icon image.
 * Used for Gmail, LinkedIn, Lightbulb.
 *
 * Props:
 *   src     : string — image URL
 *   alt     : string — alt text
 *   size    : number — icon size in px (default 88)
 *   rotate  : number — CSS rotation in deg (default 0)
 *   classes : string — grid placement class
 *   href    : string — action icon link
 */
export default defineComponent({
  name: 'IconCard',
  props: {
    src:           { type: String,  required: true },
    alt:           { type: String,  default: '' },
    size:          { type: Number,  default: 88 },
    rotate:        { type: Number,  default: 0 },
    classes:       { type: String,  default: '' },
    href:          { type: String,  default: '#' },
    actionIconSrc: { type: String,  default: undefined },
    tooltip:       { type: String,  default: '' },
  },
  setup(props) {
    return () =>
      h(BentoCard, { classes: props.classes, href: props.href, actionIconSrc: props.actionIconSrc, tooltip: props.tooltip }, {
        default: () =>
          h('img', {
            src: props.src,
            alt: props.alt,
            style: {
              width: `${props.size}px`,
              height: `${props.size}px`,
              transform: props.rotate ? `rotate(${props.rotate}deg)` : null,
            },
          }),
      })
  },
})
