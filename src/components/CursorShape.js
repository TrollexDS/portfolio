import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { isLazy } from '../lazyMode.js'

const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, span, a, li, label, td, th, blockquote'

// Clickable things get the dot, and never the I-beam, even when the
// pointer is over their text (a card title, a link label). Whole bento
// cards count: they open on click.
const CLICKABLE_SELECTOR = 'a[href], button:not(:disabled), [role="button"], select, summary, .bento-card'
// Clickable, but they draw their own hover: the nav's ghost pill, and the
// scroll toggle's ghosts/ticks (which are drawn from the arrow).
const OWN_HOVER_SELECTOR = '.nav-pills, .lazy-toggle:not(.theme-toggle)'

/* ── Shape definitions ──────────────────────────────────────
   Each shape = { start: [x,y], segs: [[cp1x,cp1y, cp2x,cp2y, ex,ey], …] }
   Both must have exactly 8 cubic-bézier segments so every
   vertex on the arrow has a partner on the beam to lerp to.
   ViewBox: 0 0 28 30  →  rendered at 17 × 18 px.
─────────────────────────────────────────────────────────── */

// Arrow — original path with L commands promoted to cubics
const ARROW = {
  start: [1.02, 2.21],
  segs: [
    [0.85, 1.38,   1.73,  0.72,   2.47,  1.12],   // tip curve
    [10.75, 5.28,  25.86, 13.61,  25.86, 13.61],   // right edge
    [26.62, 14.01, 26.54, 15.14,  25.72, 15.43],   // right-point curve
    [22.41, 16.61, 15.79, 18.98,  15.79, 18.98],   // to elbow
    [15.23, 19.18, 14.73, 19.55,  14.38, 20.04],   // elbow curve
    [12.30, 23.02,  8.16, 28.56,   8.16, 28.56],   // to bottom
    [7.65,  29.26,  6.55, 29.02,   6.37, 28.17],   // bottom curve
    [4.59,  19.52,  1.02,  2.21,   1.02,  2.21],   // closing edge
  ],
}

// I-beam — thin rounded rect, 8 matching segments
const BEAM = {
  start: [2, 1],
  segs: [
    [3.10,  1.00,  4.00,  1.45,   4.00,  2.50],   // top-right corner
    [4.00,  6.00,  4.00, 10.00,   4.00, 15.00],   // right side upper
    [4.00, 20.00,  4.00, 24.00,   4.00, 27.50],   // right side lower
    [4.00, 28.55,  3.10, 29.00,   2.00, 29.00],   // bottom-right corner
    [0.90, 29.00,  0.00, 28.55,   0.00, 27.50],   // bottom-left corner
    [0.00, 24.00,  0.00, 20.00,   0.00, 15.00],   // left side lower
    [0.00, 10.00,  0.00,  6.00,   0.00,  2.50],   // left side upper
    [0.00,  1.45,  0.90,  1.00,   2.00,  1.00],   // top-left corner → close
  ],
}

// Dot — a circle in 8 x 45° arcs, starting top-left and running clockwise
// like the arrow (which starts at its tip), so each arc meets the arrow
// segment nearest it and the morph doesn't twist.
const DOT_R  = 13          // viewBox units (≈ 16 px across as drawn; 13.25 is the most that fits the 28 × 30 box with its stroke)
const DOT_CX = 14
const DOT_CY = 15
const DOT = (() => {
  const k  = 4 / 3 * Math.tan(Math.PI / 16)   // 45° arc → cubic handle length
  const pt = a => [DOT_CX + DOT_R * Math.cos(a), DOT_CY + DOT_R * Math.sin(a)]
  const a0 = -3 * Math.PI / 4
  const segs = []
  for (let i = 0; i < 8; i++) {
    const a = a0 + i * Math.PI / 4, b = a + Math.PI / 4
    const [x0, y0] = pt(a), [x1, y1] = pt(b)
    segs.push([
      x0 - k * DOT_R * Math.sin(a), y0 + k * DOT_R * Math.cos(a),
      x1 + k * DOT_R * Math.sin(b), y1 - k * DOT_R * Math.cos(b),
      x1, y1,
    ])
  }
  return { start: pt(a0), segs }
})()

/* ── Hotspot offsets (px) ───────────────────────────────────
   Arrow tip  ≈ (1, 2)  in viewBox → basically (0, 0) in px
   Beam centre ≈ (2, 15) in viewBox → needs ≈ (−1.2, −9) px
────────────────────────────────────────────────────────── */
const ARROW_OFFSET = [0, 0]
const BEAM_OFFSET  = [-1.2, -9]
const DOT_OFFSET   = [-DOT_CX * 17 / 28, -DOT_CY * 18 / 30]   // centre on the pointer

const ARROW_SCALE  = 17 / 28   // viewBox units → px, as the cursor is drawn

/* ── Over the scroll toggle ─────────────────────────────────
   The cursor demonstrates the mode it is in, without moving:
   smooth, it sheds ghost arrows behind itself that drift back
   and fade (a comet); instant, crosshair ticks snap in around
   its tip and lock, then let go, on a beat. The same two marks
   as the toggle's icon (LazyToggle.js).
─────────────────────────────────────────────────────────── */
const FX_SELECTOR   = '.lazy-toggle:not(.theme-toggle)'
const GHOST_EVERY   = 340    // ms between ghosts (half speed: was 170)
const GHOST_LIFE    = 1440   // ms a ghost lasts (half speed: was 720)
const GHOST_DRIFT   = 16     // px it travels back along the diagonal
const TICK_BEAT     = 900    // ms per lock-and-release
const TICKS_PATH    = 'M1 -6V-2.5M-6 2H-2.5M-4.6 -3.4L-2.3 -1.2'
const SVG_NS        = 'http://www.w3.org/2000/svg'

const ARROW_STROKE = 2
const BEAM_STROKE  = 1.2
const DOT_STROKE   = 1.5
// The dot sits on top of what it points at, so it's see-through
const DOT_FILL_OPACITY = 0.55
const DURATION     = 200  // ms
const LERP_POS     = 0.25 // responsive but still smooth (overridden to 1.0 when lazy off)

/* ── Helpers ────────────────────────────────────────────── */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a, b, t) { return a + (b - a) * t }

function buildPath(a, b, t) {
  const sx = lerp(a.start[0], b.start[0], t)
  const sy = lerp(a.start[1], b.start[1], t)
  let d = `M${sx.toFixed(2)},${sy.toFixed(2)}`
  for (let i = 0; i < a.segs.length; i++) {
    const sa = a.segs[i], sb = b.segs[i]
    const v = sa.map((val, j) => lerp(val, sb[j], t).toFixed(2))
    d += `C${v[0]},${v[1]} ${v[2]},${v[3]} ${v[4]},${v[5]}`
  }
  return d + 'Z'
}

/* ── Cursor states ──────────────────────────────────────────
   Everything the morph tweens, per state, as one flat object, so a
   change of target can start from whatever is drawn mid-morph.
─────────────────────────────────────────────────────────── */
const STATES = {
  arrow: { shape: ARROW, offset: ARROW_OFFSET, stroke: ARROW_STROKE, fill: 1 },
  beam:  { shape: BEAM,  offset: BEAM_OFFSET,  stroke: BEAM_STROKE,  fill: 1 },
  dot:   { shape: DOT,   offset: DOT_OFFSET,   stroke: DOT_STROKE,   fill: DOT_FILL_OPACITY },
}

function mixState(a, b, t) {
  return {
    shape: {
      start: [lerp(a.shape.start[0], b.shape.start[0], t), lerp(a.shape.start[1], b.shape.start[1], t)],
      segs:  a.shape.segs.map((sa, i) => sa.map((v, j) => lerp(v, b.shape.segs[i][j], t))),
    },
    offset: [lerp(a.offset[0], b.offset[0], t), lerp(a.offset[1], b.offset[1], t)],
    stroke: lerp(a.stroke, b.stroke, t),
    fill:   lerp(a.fill, b.fill, t),
  }
}

/* ── Component ──────────────────────────────────────────── */
export default defineComponent({
  name: 'CursorShape',

  setup() {
    // Raw mouse target — updated instantly on mousemove
    let rawX = -200
    let rawY = -200

    // Smoothed display position — lerped in tick(), drives the template
    const sx      = ref(-200)
    const sy      = ref(-200)
    const visible = ref(false)

    // Morph state (all mutated inside rAF — not reactive on purpose)
    let mode     = 'arrow' // 'arrow' | 'beam' | 'dot'
    let shown    = STATES.arrow   // what's drawn now (may be mid-morph)
    let animFrom = STATES.arrow
    let animTo   = STATES.arrow
    let animStart = null
    let rafId    = null
    let isNavPill = false

    // Direct DOM refs (bypass Vue reactivity for 60 fps perf)
    let svgEl  = null
    let pathEl = null

    // The over-the-toggle drawing (see FX_SELECTOR)
    let fxGhosts = null      // <g> the ghosts go in
    let fxTicks  = null      // the crosshair <path>
    let onToggle = false
    let lastGhost = 0
    let beatStart = 0
    const ghosts = []        // { el, born }
    let arrowD = ''
    let dirty  = true        // shape changed since last written to the path

    function shedGhost(now) {
      const el = document.createElementNS(SVG_NS, 'path')
      el.setAttribute('class', 'cs-fx-ghost')
      el.setAttribute('d', arrowD)
      fxGhosts.appendChild(el)
      ghosts.push({ el, born: now })
    }

    function tickFx(now) {
      if (!fxGhosts || !fxTicks) return
      const lazy = isLazy.value
      // smooth: a ghost every so often while hovering
      if (onToggle && lazy && now - lastGhost > GHOST_EVERY) { shedGhost(now); lastGhost = now }
      // ghosts drift back along the diagonal, shrink a little, fade
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i]
        const a = (now - g.born) / GHOST_LIFE
        if (a >= 1) { g.el.remove(); ghosts.splice(i, 1); continue }
        const ease = 1 - (1 - a) * (1 - a)
        const d = GHOST_DRIFT * ease
        g.el.setAttribute('transform', `translate(${(-d * 0.9).toFixed(2)},${(-d * 0.75).toFixed(2)}) scale(${(ARROW_SCALE * (0.95 - 0.35 * a)).toFixed(3)})`)
        g.el.style.opacity = (0.42 * (1 - a)).toFixed(3)
      }
      // instant: the ticks snap in and lock, then release, on a beat
      // writes only on change: an unchanged inline style still costs a
      // style recalc every frame
      let op = '0', tf = null
      if (onToggle && !lazy) {
        if (!beatStart) beatStart = now
        const ph = ((now - beatStart) % TICK_BEAT) / TICK_BEAT
        const on = ph > 0.2 && ph < 0.65
        op = on ? '0.95' : '0'
        tf = on ? (ph < 0.26 ? 'scale(1.35)' : 'scale(1)') : 'scale(1.4)'
      } else {
        beatStart = 0
      }
      if (fxTicks.style.opacity !== op) fxTicks.style.opacity = op
      if (tf !== null && fxTicks.style.transform !== tf) fxTicks.style.transform = tf
    }

    function onMouseMove(e) {
      rawX = e.clientX
      rawY = e.clientY
      if (!visible.value) {
        // Snap smoothed position to avoid lerping in from off-screen
        sx.value = rawX
        sy.value = rawY
        visible.value = true
      }
      isNavPill = !!e.target?.closest?.('.nav-pills')
    }

    function onMouseLeave() {
      // Hide immediately — don't lerp toward an off-screen target
      visible.value = false
    }

    // Settle: once the smoothed position is within a hair of the mouse it
    // snaps there, so the refs stop changing and Vue stops re-rendering.
    const settle = (from, to, t) => {
      const v = lerp(from, to, t)
      return Math.abs(to - v) < 0.05 ? to : v
    }

    // Hit-testing is a forced layout, so it runs when something could have
    // changed what's under the cursor (it moved, the page scrolled, or a
    // short heartbeat for content that moves on its own, like a case study
    // opening) rather than on every frame.
    let probeX = NaN, probeY = NaN, lastProbe = 0, probeDirty = true
    const markDirty = () => { probeDirty = true }

    function tick(now) {
      // Smooth cursor position
      const lp = isLazy.value ? LERP_POS : 1
      sx.value = settle(sx.value, rawX, lp)
      sy.value = settle(sy.value, rawY, lp)

      // Detect text under cursor — handles case study opening, scrolling
      // content, and any situation where mousemove doesn't fire
      if (visible.value && (probeDirty || rawX !== probeX || rawY !== probeY || now - lastProbe > 200)) {
        probeDirty = false; probeX = rawX; probeY = rawY; lastProbe = now
        const el = document.elementFromPoint(rawX, rawY)
        onToggle = !!el?.closest?.(FX_SELECTOR)
        const clickable = !!el?.closest?.(CLICKABLE_SELECTOR)
        const newMode =
            clickable && !el.closest(OWN_HOVER_SELECTOR) ? 'dot'
          : !clickable && el?.closest?.(TEXT_SELECTOR)
              && !el.closest('.about-shrink-btn, .nav-pills, .cv-wrap, .cc-outer') ? 'beam'
          : 'arrow'
        if (newMode !== mode) {
          mode      = newMode
          animFrom  = shown            // start from what's on screen
          animTo    = STATES[mode]
          animStart = performance.now()
        }
      }

      // Advance morph
      if (animStart !== null) {
        const raw = Math.min((now - animStart) / DURATION, 1)
        shown = raw >= 1 ? animTo : mixState(animFrom, animTo, easeInOut(raw))
        if (raw >= 1) animStart = null
        dirty = true
      }

      if (svgEl && pathEl && dirty) {
        dirty = false
        // Hotspot offset
        svgEl.style.transform = `translate(${shown.offset[0].toFixed(1)}px,${shown.offset[1].toFixed(1)}px)`

        // Path + stroke + fill
        pathEl.setAttribute('d', buildPath(shown.shape, shown.shape, 0))
        pathEl.setAttribute('stroke-width', shown.stroke.toFixed(2))
        pathEl.setAttribute('fill-opacity', shown.fill.toFixed(2))
      }

      tickFx(now)

      rafId = requestAnimationFrame(tick)
    }

    // Skip entirely on touch / mobile devices, or when reduced motion is preferred
    const prefersReducedMotion = typeof matchMedia !== 'undefined'
      && matchMedia('(prefers-reduced-motion: reduce)').matches

    const isTouch = prefersReducedMotion
      || 'ontouchstart' in window
      || navigator.maxTouchPoints > 0
      || (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches)
      || window.innerWidth <= 768

    onMounted(() => {
      if (isTouch) return

      svgEl  = document.getElementById('cs-svg')
      pathEl = document.getElementById('cs-path')

      // Set initial arrow frame
      if (pathEl) {
        pathEl.setAttribute('d', buildPath(ARROW, BEAM, 0))
      }
      arrowD   = buildPath(ARROW, BEAM, 0)
      fxGhosts = document.getElementById('cs-fx-ghosts')
      fxTicks  = document.getElementById('cs-fx-ticks')

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('scroll', markDirty, { passive: true, capture: true })
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
      rafId = requestAnimationFrame(tick)
    })

    onUnmounted(() => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', markDirty, { capture: true })
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    })

    return () => {
      if (isTouch) return null

      return h('div', {
        class: 'cs-root',
        // transform, not left/top: moving the cursor shouldn't re-run layout
        style: `transform:translate3d(${sx.value}px,${sy.value}px,0);opacity:${visible.value ? 1 : 0}`,
      }, [
        h('svg', {
          id: 'cs-svg',
          width: 17,
          height: 18,
          viewBox: '0 0 28 30',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        }, [
          h('defs', null, [
            h('filter', { id: 'cs-shadow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, [
              h('feDropShadow', { dx: 0, dy: 1, stdDeviation: 1, 'flood-color': 'rgba(0,0,0,0.25)' }),
            ]),
          ]),
          h('path', {
            id: 'cs-path',
            fill: '#333333',
            stroke: 'white',
            'stroke-width': ARROW_STROKE,
            filter: 'url(#cs-shadow)',
          }),
        ]),
        // the over-the-toggle drawing, around the tip (CSS: .cs-fx)
        h('svg', {
          class: 'cs-fx',
          width: 60,
          height: 60,
          viewBox: '-30 -30 60 60',
          'aria-hidden': 'true',
          xmlns: 'http://www.w3.org/2000/svg',
        }, [
          h('g', { id: 'cs-fx-ghosts' }),
          h('path', { id: 'cs-fx-ticks', class: 'cs-fx-ticks', d: TICKS_PATH }),
        ]),
      ])
    }
  },
})
