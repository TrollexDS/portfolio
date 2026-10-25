import { defineComponent, h } from 'vue'
import { isLazy, toggleLazy } from '../lazyMode.js'

/* ── Smooth / instant scroll toggle ───────────────────────────────────
   Icon-only, like the theme toggle beside it. The glyph is a cursor:
   with a comet tail of two ghost arrows behind it when scrolling is
   smooth (it glides), and a small click-burst at its tip when scrolling
   is instant (it lands). The arrow stays; the tail folds into it and the
   burst pops out, on the pill's own easing.

   The cursor is drawn with its tip at the origin so the ghosts are the
   same path, scaled down and stepped back along the diagonal.
──────────────────────────────────────────────────────────────────────── */
const ARROW = 'M0 0l9.5 6.3-4.4.9 2.5 4.5-1.9 1-2.5-4.5L0 11.6z'

export default defineComponent({
  name: 'LazyToggle',

  setup() {
    function onRelease() { toggleLazy() }

    const tooltip = () => isLazy.value
      ? 'Smooth scroll on · click for instant'
      : 'Instant scroll on · click for smooth'

    return () =>
      h('button', {
        class: ['lazy-toggle', 'lazy-toggle--icon', isLazy.value ? 'lazy-toggle--on' : 'lazy-toggle--off'],
        onPointerup: onRelease,
        'data-tooltip': tooltip(),
        'aria-label': tooltip(),
        'aria-pressed': isLazy.value ? 'true' : 'false',
      }, [
        h('svg', {
          class: 'lazy-toggle__icon',
          width: 18,
          height: 18,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        }, [
          // the tail: two ghosts, furthest first
          h('g', { class: 'lz-tail' }, [
            h('path', { class: 'lz-ghost lz-ghost--far',  d: ARROW, transform: 'translate(3,1.5) scale(.8)' }),
            h('path', { class: 'lz-ghost lz-ghost--near', d: ARROW, transform: 'translate(5.5,4) scale(.9)' }),
          ]),
          // the cursor
          h('path', { class: 'lz-arrow', d: ARROW, transform: 'translate(8,6.5)' }),
          // the click-burst at its tip
          h('path', { class: 'lz-burst', d: 'M5.2 3.7L3 1.5M8 3V.4M4.5 6.5H1.9' }),
        ]),
      ])
  },
})
