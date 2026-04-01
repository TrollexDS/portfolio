import { defineComponent, h, ref, onMounted } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const FIRE      = 'src/assets/images/duolingo/duolingo-fire.svg'
const APP_ICON  = 'src/assets/logos/duolingo.svg'
const AVATAR    = 'src/assets/videos/duolingo-avatar.webm'
const PROFILE   = 'https://www.duolingo.com/profile/TrollexHK'

// Ease-out cubic: fast start, decelerates at the end
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

export default defineComponent({
  name: 'DuolingoCard',
  props: {
    streak: { type: Number, default: 810 },
  },
  setup(props) {
    const displayed = ref(0)

    onMounted(() => {
      const target   = props.streak
      const duration = 1800 // ms

      setTimeout(() => {
        const start = performance.now()

        function tick(now) {
          const elapsed  = now - start
          const progress = Math.min(elapsed / duration, 1)
          displayed.value = Math.round(easeOutCubic(progress) * target)
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      }, 500)
    })

    return () =>
      h(BentoCard, { classes: 'duolingo-card', href: PROFILE, actionIconSrc: ICON_EXTERNAL_LINK, tooltip: 'I am learning Japanese 🇯🇵\nFollow me on Duolingo' }, {
        default: () => [
          h('div', { class: 'duolingo-streak' }, [
            h('img', { class: 'duolingo-fire', src: FIRE, alt: 'Fire' }),
            h('span', { class: 'streak-number' }, String(displayed.value)),
          ]),
          h('video', {
            class: 'duolingo-avatar',
            src: AVATAR,
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
          }),
          h('div', { class: 'duolingo-app-icon' }, [
            h('img', { src: APP_ICON, alt: 'Duolingo' }),
          ]),
        ],
      })
  },
})
