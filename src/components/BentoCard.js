import { defineComponent, h, ref } from 'vue'
import { ICON_EXPAND } from '../assets/icons/icons.js'
import { useRipple } from '../composables/useRipple.js'

const ACTION_ICON = ICON_EXPAND

/**
 * BentoCard — reusable base card component.
 *
 * Props:
 *   tag           : string  — wrapper element (default 'div')
 *   dark          : boolean — use dark card variant (deeper hover shadow)
 *   classes       : string  — extra CSS classes for grid placement
 *   href          : string  — optional link target for the action icon
 *   actionIconSrc : string  — custom action icon image URL (falls back to default expand icon)
 */
export default defineComponent({
  name: 'BentoCard',

  props: {
    tag:           { type: String,  default: 'div' },
    dark:          { type: Boolean, default: false },
    classes:       { type: String,  default: '' },
    href:          { type: String,  default: '#' },
    actionIconSrc: { type: String,  default: ACTION_ICON },
    actionLabel:   { type: String,  default: '' },
    tooltip:       { type: String,  default: '' },
  },

  setup(props, { slots }) {
    const pressed = ref(false)
    const { spawnRipple, renderRipples } = useRipple()

    return () => {
      const classes = [
        'bento-card',
        props.dark ? 'dark' : '',
        pressed.value ? 'bento-card--pressed' : '',
        props.classes,
      ].filter(Boolean).join(' ')

      const actionIcon = h('a', {
        class: ['action-icon', props.actionLabel ? 'action-icon--label' : ''].filter(Boolean).join(' '),
        href: props.href,
        target: props.href !== '#' ? '_blank' : null,
        rel: props.href !== '#' ? 'noopener noreferrer' : null,
        onClick: (e) => e.stopPropagation(),
      }, [
        props.actionLabel
          ? h('span', { class: 'action-icon__text' }, props.actionLabel)
          : h('img', { src: props.actionIconSrc, alt: 'Open' }),
      ])

      const rootProps = {
        class: classes,
        ...(props.tooltip && { 'data-tooltip': props.tooltip }),
        onTouchstart: () => { pressed.value = true },
        onTouchend:   () => { pressed.value = false },
        onTouchcancel:() => { pressed.value = false },
        onClick: (e) => {
          spawnRipple(e)
          if (props.href !== '#') window.open(props.href, '_blank', 'noopener,noreferrer')
        },
      }

      return h(props.tag, rootProps, [
        actionIcon,
        slots.default?.(),
        ...renderRipples(),
      ])
    }
  },
})
