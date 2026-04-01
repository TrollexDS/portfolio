import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'

const LOGO_SRC = './src/assets/images/general/SS-clients-logo.png'

/**
 * ProjectCard — dark project showcase card.
 *
 * Props:
 *   classes : string — grid placement class
 *   href    : string — link to case study
 *   imgSrc  : string — optional fill image (device mockup etc.)
 */
export default defineComponent({
  name: 'ProjectCard',
  props: {
    classes: { type: String, default: '' },
    href:    { type: String, default: '#' },
    imgSrc:  { type: String, default: '' },
    tooltip: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h(BentoCard, { classes: props.classes, dark: true, href: props.href, tooltip: props.tooltip }, {
        default: () => [

          // Full-card background image
          props.imgSrc
            ? h('img', { class: 'project-card-img', src: props.imgSrc, alt: '', draggable: false })
            : null,

          // Infinite scrolling logo banner
          h('div', { class: 'pc1-banner' },
            h('div', { class: 'pc1-track' }, [
              h('img', { src: LOGO_SRC, alt: 'Clients', draggable: false }),
              h('img', { src: LOGO_SRC, alt: '',        draggable: false, 'aria-hidden': 'true' }),
            ])
          ),
        ],
      })
  },
})
