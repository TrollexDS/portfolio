import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_FULL_SCREEN } from '../../assets/icons/icons.js'

const VIDEO_SRC = 'src/assets/videos/rayo-schedule.mp4'

export default defineComponent({
  name: 'ScheduleCard',
  setup() {
    return () =>
      h(BentoCard, { classes: 'schedule-card', href: '#', actionIconSrc: ICON_FULL_SCREEN, tooltip: 'Introduce schedule function to\nhelp users find catchup shows 📻' }, {
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
            class: 'schedule-video',
          }),
      })
  },
})
