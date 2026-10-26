import { defineComponent, h, ref, onMounted, onBeforeUnmount } from 'vue'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const HREF    = 'https://www.linkedin.com/in/alexmchiu/'
const TOOLTIP = 'Connect with me on LinkedIn 💼'

export default defineComponent({
  name: 'LinkedInCard',

  props: {
    classes: { type: String, default: '' },
  },

  setup(props) {
    // intro: the "in" draws itself once on mount, then hands over to the idle loop
    const intro   = ref(true)
    const hovered = ref(false)
    let introTimer = null

    onMounted(() => {
      introTimer = setTimeout(() => { intro.value = false }, 1400)
    })
    onBeforeUnmount(() => clearTimeout(introTimer))

    return () => {
      const classes = ['bento-card', 'linkedin-card', hovered.value && 'is-hovered', props.classes]
        .filter(Boolean).join(' ')

      return h('div', {
        class: classes,
        'data-tooltip': TOOLTIP,
        onMouseenter: () => { hovered.value = true },
        onMouseleave: () => { hovered.value = false },
        onClick: () => window.open(HREF, '_blank', 'noopener,noreferrer'),
      }, [
        // Action icon link
        h('a', {
          class: 'action-icon',
          href: HREF,
          target: '_blank',
          rel: 'noopener noreferrer',
          onClick: (e) => e.stopPropagation(),
        }, [
          h('img', { src: ICON_EXTERNAL_LINK, alt: 'Open LinkedIn' }),
        ]),

        // LinkedIn "in". Idle: the dot of the i nods every few seconds.
        // Hover: the blue tile pops in behind and the letters redraw in white.
        h('svg', {
          class: `li-svg${intro.value ? ' li-svg--intro' : ''}`,
          viewBox: '0 0 36 36',
          fill: 'none',
          width: '88',
          height: '88',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
        }, [
          // Brand tile — hidden until hover
          h('rect', { class: 'li-tile', x: '4', y: '4', width: '28', height: '28', rx: '6' }),
          // Dot above the "i"
          h('circle', {
            class: 'li-dot',
            cx: '11', cy: '10', r: '2.2',
          }),
          // Vertical bar of the "i"
          h('path', {
            class: 'li-path',
            d: 'M11 15.5 L11 26',
            style: { '--len': '11', '--draw-dur': '0.38s', '--draw-delay': '0.08s' },
          }),
          // Left stem of the "n"
          h('path', {
            class: 'li-path',
            d: 'M17 15.5 L17 26',
            style: { '--len': '11', '--draw-dur': '0.38s', '--draw-delay': '0.14s' },
          }),
          // Arch + right leg of the "n"
          h('path', {
            class: 'li-path',
            d: 'M17 19.5 C17 17 19 15.5 21 15.5 C23 15.5 25 17 25 19.5 L25 26',
            style: { '--len': '22', '--draw-dur': '0.42s', '--draw-delay': '0.20s' },
          }),
        ]),
      ])
    }
  },
})
