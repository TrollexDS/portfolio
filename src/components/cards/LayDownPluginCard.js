import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'

const COVER_SRC = 'src/assets/images/laydown-cover.svg'

export default defineComponent({
  name: 'LayDownPluginCard',

  setup() {
    return () =>
      h(BentoCard, {
        classes: 'placeholder-card',
        dark: true,
        actionLabel: 'Coming soon',
        tooltip: 'Currently in development - A Figma plugin\nthat utilises AI to optimise your Figma layers.',
      }, {
        default: () => [
          // SVG illustration (rectangles only, no text)
          h('img', {
            class: 'laydown-cover',
            src: COVER_SRC,
            alt: '',
          }),
          // Title — top area, matching SVG y=130/680 ≈ 19%
          h('span', { class: 'laydown-title' }, 'Lay.Down'),
          // Bottom text group — matching SVG y≈600/680 ≈ 88%
          h('div', { class: 'laydown-bottom' }, [
            h('span', { class: 'laydown-subtitle' }, 'AI layer cleanup for Figma'),
          ]),
        ],
      })
  },
})
