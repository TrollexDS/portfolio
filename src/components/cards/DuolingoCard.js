import { defineComponent, h, ref, onMounted } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const FIRE         = 'src/assets/images/duolingo/duolingo-fire.svg'
const APP_ICON     = 'src/assets/logos/duolingo.svg'
const AVATAR_WEBM  = 'src/assets/videos/duolingo-avatar.webm'
const AVATAR_PNG   = 'src/assets/images/duolingo/duolingo-avatar-fallback.png'
const PROFILE      = 'https://www.duolingo.com/profile/TrollexHK'

// Safari can't play VP9/WebM (which has alpha). Detect support once.
const _v = document.createElement('video')
const CAN_WEBM_ALPHA = _v.canPlayType('video/webm; codecs="vp9"') === 'probably'

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
          CAN_WEBM_ALPHA
            ? h('video', {
                class: 'duolingo-avatar',
                autoplay: true,
                loop: true,
                muted: true,
                playsinline: true,
              }, [
                h('source', { src: AVATAR_WEBM, type: 'video/webm' }),
              ])
            : h('img', {
                class: 'duolingo-avatar',
                src: AVATAR_PNG,
                alt: 'Duolingo avatar',
              }),
          h('div', { class: 'duolingo-app-icon' }, [
            h('img', { src: APP_ICON, alt: 'Duolingo' }),
          ]),
        ],
      })
  },
})
