// Stand-in for src/components/CaseStudyOverlay.js during server rendering:
// renders only the case study body (the `content` slot).
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'CaseStudyOverlayStub',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => h('div', { class: 'ssr-overlay-stub' }, slots.content?.())
  },
})
