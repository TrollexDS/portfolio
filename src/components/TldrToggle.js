import { defineComponent, h, ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * TldrToggle — reusable Detailed / TL;DR pill-bar toggle.
 *
 * Props:
 *   modelValue : boolean — true = TL;DR mode active
 *
 * Emits:
 *   update:modelValue : boolean
 *
 * Usage:
 *   h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } })
 *
 * The bar sits in the page where the case study puts it and sticks to the
 * top once scrolled past. A sentinel just above it tells the two apart:
 * while stuck (`tldr-bar--stuck`) it hides and returns with the header
 * row; in place it stays put.
 */
export default defineComponent({
  name: 'TldrToggle',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const sentinel = ref(null)
    const stuck = ref(false)
    let io = null

    onMounted(async () => {
      await nextTick()
      const el = sentinel.value
      if (!el || typeof IntersectionObserver === 'undefined') return
      // the case study's own scroller, when there is one
      const scroller = el.closest('.cs-expanded-inner')
      io = new IntersectionObserver(([entry]) => {
        stuck.value = !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds ? entry.rootBounds.top : 0) + 2
      }, { root: scroller || null, rootMargin: '-1px 0px 0px 0px', threshold: 0 })
      io.observe(el)
    })
    onUnmounted(() => { if (io) io.disconnect() })

    return () => [
      h('div', { ref: sentinel, class: 'tldr-sentinel', 'aria-hidden': 'true' }),
      h('div', { class: ['tldr-bar', stuck.value ? 'tldr-bar--stuck' : ''] }, [
        h('div', {
          class: 'tldr-indicator',
          style: { transform: props.modelValue ? 'translateX(calc(100% + 4px))' : 'translateX(0)' },
        }),
        h('button', {
          class: ['tldr-pill', !props.modelValue ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
          onClick: () => emit('update:modelValue', false),
        }, 'Detailed'),
        h('button', {
          class: ['tldr-pill', props.modelValue ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
          onClick: () => emit('update:modelValue', true),
        }, 'TL;DR'),
      ]),
    ]
  },
})
