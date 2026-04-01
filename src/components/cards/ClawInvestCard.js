import { defineComponent, h } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const HREF       = 'https://t.me/alexchiuclawbot'
const TOOLTIP    = 'Utilising OpenClaw & local LLM to generate daily market briefs 📈\nDeliver via a Telegram channel'
const APP_ICON   = 'src/assets/logos/telegram-icon.svg'

export default defineComponent({
  name: 'ClawInvestCard',

  setup() {
    return () =>
      h(BentoCard, {
        classes:       'claw-invest-card',
        dark:          true,
        href:          HREF,
        actionIconSrc: ICON_EXTERNAL_LINK,
        tooltip:       TOOLTIP,
      }, {
        default: () => [
          // Background image layer
          h('div', { class: 'claw-invest-bg' }),

          // Telegram badge — bottom right (matches duolingo-app-icon spec)
          h('div', { class: 'claw-invest-badge' }, [
            h('img', { src: APP_ICON, alt: 'Telegram' }),
          ]),
        ],
      })
  },
})
