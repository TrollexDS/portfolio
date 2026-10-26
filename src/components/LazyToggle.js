import { defineComponent, h } from 'vue'
import { isLazy, toggleLazy } from '../lazyMode.js'

/* ── Smooth / instant scroll toggle ───────────────────────────────────
   Icon-only, like the theme toggle beside it. The glyph is a cursor:
   with a comet tail of two ghost arrows behind it when scrolling is
   smooth (it glides), and crosshair ticks around its tip when scrolling
   is instant (it lands exactly where you point). The arrow stays; the
   tail folds into it and the ticks snap in, on the pill's own easing.

   Hovered, the page's own cursor does the same (CursorShape.js): it sheds
   ghosts in smooth mode, and the ticks lock around its tip in instant.

   The cursor is drawn with its tip at the origin so the ghosts are the
   same path, scaled down and stepped back along the diagonal.
──────────────────────────────────────────────────────────────────────── */
const ARROW = 'M0 0l9.5 6.3-4.4.9 2.5 4.5-1.9 1-2.5-4.5L0 11.6z'

export default defineComponent({
  name: 'LazyToggle',

  setup() {
    function onRelease() { toggleLazy() }

    const tooltip = () => isLazy.value
      ? 'Switch to instant scroll ⚡️'
      : 'Switch to smooth scroll 🍃'

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
          // the crosshair ticks around its tip
          h('path', { class: 'lz-ticks', d: 'M8 0.5V3.5M2 6.5H5M3.6 2.1L5.5 4' }),
        ]),
      ])
  },
})
