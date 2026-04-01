import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'BackToTop',
  setup() {
    const visible = ref(false)

    function onScroll() {
      visible.value = window.scrollY > window.innerHeight
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
    onUnmounted(() => window.removeEventListener('scroll', onScroll))

    return () =>
      h(
        'button',
        {
          class: ['back-to-top', visible.value ? 'back-to-top--visible' : ''],
          onClick: scrollToTop,
          'aria-label': 'Back to top',
        },
        // Up-arrow SVG icon
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '20',
            height: '20',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('polyline', { points: '18 15 12 9 6 15' }),
          ]
        )
      )
  },
})
