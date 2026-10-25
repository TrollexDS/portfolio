import { defineComponent, h, ref, nextTick, Teleport } from 'vue'

/* ── Theme toggle ─────────────────────────────────────────────────────
   Sits next to the smooth-scroll toggle in the nav and shares its round
   icon-only styling. Sun in light mode, moon in dark; the tooltip names
   the switch.

   Theme is stored on <html data-theme>, matching the rest of the app:
   '' = light, 'dark' = dark. The choice is persisted to localStorage so
   it survives a reload.

   Hovered, a circle around the button shows the other theme - a lens over
   the page, breathing - and the icon turns into the one you would get.
   Clicked, that circle grows until the new theme covers the page: the
   View Transitions API snapshots the page as it was, renders the new
   theme live, and the new picture is clipped to a circle on the button
   that grows to the farthest corner. One picture over another, so glass,
   text and images all change at the moment the edge passes them.

   The lens sits out the wipe (the new theme is already growing out of
   its circle) and, if the pointer is still on the button when the wipe
   ends, comes back offering the theme you came from.

   The circle is written in percentages of the snapshot, not pixels: the
   snapshot's box isn't always CSS pixels, and percentages mean the same
   place in every browser. Reduced motion gets a plain cross-fade; a
   browser without the API swaps straight over.
──────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'theme'
const WIPE_MS     = 700
const WIPE_EASE   = 'cubic-bezier(0.2, 0, 0, 1)'

const SUN_PATHS = [
  'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  'M12 1.5v2M12 20.5v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1.5 12h2M20.5 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
]

const MOON_PATH = 'M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z'

function writeTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : ''
  try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light') } catch (e) { /* private mode */ }
}

/* The wipe. `at` is the button's centre and the radius the circle starts
   at (the lens's, if it is showing). `apply` writes the new theme and
   returns once the page shows it. Settles when the wipe is over. */
function wipeTheme(at, apply) {
  const root = document.documentElement
  if (!document.startViewTransition) return Promise.resolve(apply())

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) root.dataset.themeWipe = ''
  root.dataset.themeSwitching = ''
  const clear = () => {
    delete root.dataset.themeWipe
    delete root.dataset.themeSwitching
  }

  const transition = document.startViewTransition(apply)
  if (!reduced) {
    // Fractions of the viewport: a circle's percentage radius resolves
    // against the box's diagonal over √2.
    const w = window.innerWidth
    const h = window.innerHeight
    const unit = Math.hypot(w, h) / Math.SQRT2
    const pct = n => `${((n / unit) * 100).toFixed(3)}%`
    const centre = `${((at.x / w) * 100).toFixed(3)}% ${((at.y / h) * 100).toFixed(3)}%`
    // far enough to reach the corner farthest from the button
    const to = Math.hypot(Math.max(at.x, w - at.x), Math.max(at.y, h - at.y))
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(${pct(at.from)} at ${centre})`, `circle(${pct(to)} at ${centre})`] },
          { duration: WIPE_MS, easing: WIPE_EASE, pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(clear)
  }
  return transition.finished.then(clear, clear)
}

export default defineComponent({
  name: 'ThemeToggle',

  setup() {
    const isDark = ref(document.documentElement.dataset.theme === 'dark')
    const button = ref(null)
    const lens   = ref(null)
    const spot   = ref(null)   // where the lens sits, once it has been hovered
    const lit    = ref(false)  // the lens is up
    let over  = false          // the pointer is on the button
    let spent = false          // a wipe is running: no lens

    const centre = () => {
      const box = button.value && button.value.getBoundingClientRect()
      return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null
    }

    function show() {
      over = true
      if (spent) return
      spot.value = centre()
      // lit a frame after it is placed, so even the first hover grows the
      // lens from the button's centre rather than drawing it at full size
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (over && !spent) lit.value = true
      }))
    }

    function hide() {
      over = false
      lit.value = false
    }

    function choose() {
      if (spent) return
      const at = centre()
      const next = !isDark.value
      spent = true
      const apply = () => {
        lit.value = false
        isDark.value = next
        writeTheme(next)
        return nextTick()
      }
      const done = () => {
        spent = false
        // still hovering once the page is plain again: the lens comes
        // back with the other theme, the one you just left, under it
        if (over) show()
      }
      if (!at) return apply().then(done)
      // the circle starts as big as the lens, if the lens is showing
      const from = lit.value && lens.value ? lens.value.offsetWidth / 2 : 0
      wipeTheme({ ...at, from }, apply).then(done)
    }

    const offer = () => (isDark.value ? 'Switch to light mode ☀️' : 'Switch to dark mode 🌙')

    return () => {
      // the theme's own icon at rest; while the lens previews the other
      // theme, that theme's icon - the moon in light, the sun in dark
      const showMoon = isDark.value !== lit.value
      return h('button', {
        ref: button,
        class: ['lazy-toggle', 'lazy-toggle--icon', 'theme-toggle', isDark.value ? 'theme-toggle--dark' : 'theme-toggle--light'],
        onPointerup: choose,
        // a mouse only: a touch has no hover to preview with
        onPointerenter: e => { if (e.pointerType === 'mouse') show() },
        onPointerleave: hide,
        'data-tooltip': offer(),
        'aria-label': offer(),
      }, [
        h('svg', {
          class: ['lazy-toggle__icon', 'theme-toggle__icon', 'theme-toggle__sun', showMoon ? 'theme-toggle__icon--out' : ''],
          width: 18, height: 18, viewBox: '0 0 24 24',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
        }, SUN_PATHS.map(d => h('path', { d }))),
        h('svg', {
          class: ['lazy-toggle__icon', 'theme-toggle__icon', 'theme-toggle__moon', showMoon ? '' : 'theme-toggle__icon--out'],
          width: 18, height: 18, viewBox: '0 0 24 24',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
        }, [h('path', { d: MOON_PATH })]),
        // the lens: over the page, not in the nav, so nothing clips it and
        // its backdrop is everything under it
        spot.value
          ? h(Teleport, { to: 'body' }, [
              h('span', {
                ref: lens,
                class: ['theme-lens', lit.value ? 'theme-lens--lit' : ''],
                style: { left: `${spot.value.x}px`, top: `${spot.value.y}px` },
                'aria-hidden': 'true',
              }),
            ])
          : null,
      ])
    }
  },
})
