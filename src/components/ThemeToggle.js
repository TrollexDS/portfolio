import { defineComponent, h, ref } from 'vue'

/* ── Theme toggle ─────────────────────────────────────────────────────
   Sits next to the smooth-scroll toggle in the nav and shares its pill
   styling. Sun icon + "Light" in light mode, moon icon + "Dark" in dark.

   Theme is stored on <html data-theme>, matching the rest of the app:
   '' = light, 'dark' = dark. The choice is persisted to localStorage so
   it survives a reload.
──────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'theme'

const SUN_PATHS = [
  'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  'M12 1.5v2M12 20.5v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1.5 12h2M20.5 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
]

const MOON_PATH = 'M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z'

export default defineComponent({
  name: 'ThemeToggle',

  setup() {
    const isDark = ref(document.documentElement.dataset.theme === 'dark')
    const labelFading = ref(false)

    function onRelease() {
      labelFading.value = true

      isDark.value = !isDark.value
      document.documentElement.dataset.theme = isDark.value ? 'dark' : ''
      try { localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light') } catch (e) { /* private mode */ }

      setTimeout(() => { labelFading.value = false }, 100)
    }

    const tooltip = () => isDark.value
      ? 'Switch to light mode ☀️'
      : 'Switch to dark mode 🌙'

    return () =>
      h('button', {
        class: ['lazy-toggle', 'theme-toggle', isDark.value ? 'theme-toggle--dark' : 'theme-toggle--light'],
        onPointerup: onRelease,
        'data-tooltip': tooltip(),
        'aria-label': tooltip(),
      }, [
        h('svg', {
          class: 'lazy-toggle__icon',
          width: 16,
          height: 16,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2.2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }, isDark.value
          ? [h('path', { d: MOON_PATH })]
          : SUN_PATHS.map(d => h('path', { d }))
        ),
        h('span', {
          class: ['lazy-toggle__label', labelFading.value ? 'lazy-toggle__label--fading' : ''],
        }, isDark.value ? 'Dark' : 'Light'),
      ])
  },
})
