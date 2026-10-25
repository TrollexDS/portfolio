import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'

/* ── Text size control ────────────────────────────────────────────────
   A reading preference for the case study, beside Detailed / TL;DR.
   At rest it reads "Aa" - a glass pill the same as its neighbour, no
   fill. Hovered, focused from the keyboard, or tapped, the Aa gives way
   to the stepper in the same pill: smaller, the current size and larger;
   the size itself is a button that puts things back to 100%. The
   Detailed / TL;DR pill never moves: this one hangs off its right edge.

   The Aa is a label, not a control: the three buttons are always in the
   tab order and the accessibility tree, and the pill opens when any of
   them takes focus. A tap (no hover) pins it open; a tap outside closes.

   It scales the four case-study type tokens (title, section, subsection,
   body) through --cs-type-scale on <html>, multiplied on top of whatever
   the browser's own font size gives, so browser zoom and text-size
   settings still work and compose with this. The demos and widgets are
   left alone: they are laid out to the reading column, not to the prose.

   The choice is persisted to localStorage, like the theme, and applied
   on load before any case study opens.
──────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'cs-type-scale'
export const STEPS = [0.875, 1, 1.125, 1.25, 1.5]
const DEFAULT_INDEX = 1

function readIndex() {
  try {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY))
    const i = STEPS.indexOf(v)
    return i === -1 ? DEFAULT_INDEX : i
  } catch (e) { return DEFAULT_INDEX }
}

function applyScale(scale) {
  // the render script's document stub has no element to write to
  const root = typeof document !== 'undefined' && document.documentElement
  if (!root || !root.style) return
  if (scale === 1) root.style.removeProperty('--cs-type-scale')
  else root.style.setProperty('--cs-type-scale', String(scale))
}

// One shared index: every case study's control shows the same size.
const index = ref(readIndex())
applyScale(STEPS[index.value])

function setIndex(i) {
  index.value = Math.max(0, Math.min(STEPS.length - 1, i))
  applyScale(STEPS[index.value])
  try { localStorage.setItem(STORAGE_KEY, String(STEPS[index.value])) } catch (e) { /* private mode */ }
}

export default defineComponent({
  name: 'TextSizeControl',
  setup() {
    const pinned = ref(false)   // opened by a tap; hover and focus open it in CSS
    const root = ref(null)
    const percent = computed(() => Math.round(STEPS[index.value] * 100))
    const atMin = computed(() => index.value === 0)
    const atMax = computed(() => index.value === STEPS.length - 1)

    function onDocPointerDown(e) {
      if (pinned.value && root.value && !root.value.contains(e.target)) pinned.value = false
    }
    onMounted(() => document.addEventListener?.('pointerdown', onDocPointerDown))
    onUnmounted(() => document.removeEventListener?.('pointerdown', onDocPointerDown))

    const stepBtn = (dir) => h('button', {
      class: ['tsz-btn', `tsz-btn--${dir < 0 ? 'down' : 'up'}`],
      type: 'button',
      disabled: dir < 0 ? atMin.value : atMax.value,
      'aria-label': dir < 0 ? 'Smaller text' : 'Larger text',
      'data-tooltip': dir < 0 ? 'Smaller text' : 'Larger text',
      onClick: () => setIndex(index.value + dir),
    }, [
      h('span', { class: 'tsz-glyph', 'aria-hidden': 'true' }, 'A'),
      h('span', { class: 'tsz-sign', 'aria-hidden': 'true' }, dir < 0 ? '−' : '+'),
    ])

    return () => h('div', {
      ref: root,
      class: ['tsz', pinned.value ? 'tsz--open' : ''],
      role: 'group',
      'aria-label': 'Text size',
      'data-fallback': 'skip',
      // a tap on the resting Aa pins the pill open (touch has no hover)
      onClick: (e) => { if (e.target.closest('.tsz-label')) pinned.value = true },
    }, [
      // At rest: the Aa. Gives way to the stepper.
      h('span', { class: 'tsz-label', 'aria-hidden': 'true', 'data-tooltip': 'Text size' }, 'Aa'),
      // The stepper
      h('div', { class: 'tsz-steps' }, [h('div', { class: 'tsz-steps-inner' }, [
        stepBtn(-1),
        h('button', {
          class: 'tsz-value',
          type: 'button',
          'aria-label': `Text size ${percent.value}%. Reset to 100%`,
          'data-tooltip': 'Reset to 100%',
          disabled: index.value === DEFAULT_INDEX,
          onClick: () => setIndex(DEFAULT_INDEX),
        }, `${percent.value}%`),
        stepBtn(1),
      ])]),
      // Announce changes to screen readers
      h('span', { class: 'sr-only', 'aria-live': 'polite' }, `Text size ${percent.value}%`),
    ])
  },
})
