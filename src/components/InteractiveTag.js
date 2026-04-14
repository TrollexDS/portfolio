import { defineComponent, h } from 'vue'

/**
 * InteractiveTag — reusable pill badge to indicate interactive content.
 *
 * Usage:
 *   import InteractiveTag from '../InteractiveTag.js'
 *   h(InteractiveTag, { hint: 'Explore our colour variables' })
 *
 * Renders:
 *   <p class="cs-hint">
 *     <span class="cc-interactive-tag">Interactive</span>
 *     Explore our colour variables
 *   </p>
 */
export default defineComponent({
  name: 'InteractiveTag',
  props: {
    hint: { type: String, default: '' },
    centered: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h('p', {
        class: ['cs-hint', props.centered ? 'cs-hint--centered' : ''].filter(Boolean).join(' '),
      }, [
        h('span', { class: 'cc-interactive-tag' }, 'Interactive'),
        props.hint,
      ])
  },
})
