import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_FULL_SCREEN } from '../../assets/icons/icons.js'

const VIDEO_SRC = 'src/assets/videos/rayo-alexa.mp4'

export default defineComponent({
  name: 'AlexaCard',
  setup() {
    return () =>
      h(BentoCard, { classes: 'alexa-card', href: '#', actionIconSrc: ICON_FULL_SCREEN, tooltip: 'Improve the voice UX of\nthe Rayo skill in Alexa 🗣️' }, {
        default: () =>
          h('video', {
            'data-src': VIDEO_SRC,
            loop: true,
            muted: true,
            playsinline: true,
            preload: 'none',
            disablePictureInPicture: true,
            controlsList: 'nodownload nofullscreen noremoteplayback',
            style: 'pointer-events: none;',
            class: 'alexa-video',
          }),
      })
  },
})
