import { defineComponent, h, ref } from 'vue'
import { ICON_EXPAND } from '../assets/icons/icons.js'

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
    tooltip:       { type: String,  default: '' },
  },

  setup(props, { slots }) {
    const ripples = ref([])
    let nextId = 0

    function spawnRipple(e) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX ?? rect.left + rect.width  / 2) - rect.left
      const y = (e.clientY ?? rect.top  + rect.height / 2) - rect.top
      const id = nextId++
      ripples.value.push({ id, x, y })
      setTimeout(() => {
        ripples.value = ripples.value.filter(r => r.id !== id)
      }, 520)
    }

    return () => {
      const classes = [
        'bento-card',
        props.dark ? 'dark' : '',
        props.classes,
      ].filter(Boolean).join(' ')

      const actionIcon = h('a', {
        class: 'action-icon',
        href: props.href,
        target: props.href !== '#' ? '_blank' : null,
        rel: props.href !== '#' ? 'noopener noreferrer' : null,
        onClick: (e) => e.stopPropagation(),
      }, [
        h('img', { src: props.actionIconSrc, alt: 'Open' }),
      ])

      const rootProps = {
        class: classes,
        ...(props.tooltip && { 'data-tooltip': props.tooltip }),
        onClick: (e) => {
          spawnRipple(e)
          if (props.href !== '#') window.open(props.href, '_blank', 'noopener,noreferrer')
        },
      }

      const rippleEls = ripples.value.map(r =>
        h('div', {
          key:   r.id,
          class: 'card-ripple',
          style: {
            left:       r.x + 'px',
            top:        r.y + 'px',
            width:      '20px',
            height:     '20px',
            marginLeft: '-10px',
            marginTop:  '-10px',
          },
        })
      )

      return h(props.tag, rootProps, [
        actionIcon,
        slots.default?.(),
        ...rippleEls,
      ])
    }
  },
})
