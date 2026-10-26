import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { useInView } from '../../composables/useInView.js'

/* ─────────────────────────────────────────────────────────────
   ScheduleFace — the Schedule card face. The case study in four steps,
   tracked at the top as they happen: The brief › User testing › Build ›
   Shipped.

   The brief: the station page the product team asked for. User testing:
   three findings land as sticky notes and each strikes out the sections
   it argues against, until only the schedule is left. Build: the schedule
   opens into a simple card; "Episode" becomes "Catch-up" and the
   breakfast show is played. Shipped: the card flips to the real screen
   on an iPhone 16 Pro, which is picked up, played and put down (the
   participant's own words), and the results take its place.

   Only words the case study gives are used. The shipped screen is a real
   screenshot, one per theme.

   Unlike AlexaFace, almost everything here moves every frame, so the DOM
   is built once on mount and a requestAnimationFrame loop writes styles
   straight onto it rather than re-rendering through Vue. Timing comes from
   one shared clock, so the card, the flying element and the hero show the
   same moment. The loop runs only while the face is on screen; reduced
   motion draws one still frame (the phone playing). Decorative:
   aria-hidden, skipped by the no-JS fallback.

   Geometry is in em on a stage whose font-size is 1cqmin, so 1em is 1% of
   the card and one drawing serves the 522 card, the 448 hero and mobile.
   ───────────────────────────────────────────────────────────── */

const LOOP = 21            // seconds
const STILL_T = 15.2       // the frame reduced motion holds: shipped screen, playing

const IMG_LIGHT = '/src/assets/images/rayo/schedule/schedule-shipped-light.webp'
const IMG_DARK  = '/src/assets/images/rayo/schedule/schedule-shipped-dark.webp'

const T0 = typeof performance !== 'undefined' ? performance.now() : 0

// ── Timeline helpers ──
const clamp = v => Math.max(0, Math.min(1, v))
const p    = (t, a, b) => clamp((t - a) / (b - a))
const io   = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
const out  = x => 1 - Math.pow(1 - x, 3)
const lerp = (a, b, k) => a + (b - a) * k
const em   = v => v + 'em'
const rr   = (a, b, f) => ({ x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), w: lerp(a.w, b.w, f), h: lerp(a.h, b.h, f) })

// ── Story ──
const STEPS = [[0, 'The brief'], [2.6, 'User testing'], [7.6, 'Build'], [11.7, 'Shipped']]

// The station page from the brief. `cut` names the finding that removes it.
const PAGE = { x: 29, w: 42, pad: 2.4, head: 6.4, gap: 1.6 }
const SECS = [
  { id: 'hero',      lbl: 'Hero content',     h: 15,  cut: 1 },
  { id: 'presenter', lbl: 'Presenter info',   h: 8,   cut: 2 },
  { id: 'schedule',  lbl: 'Schedule',         h: 8,   keep: true },
  { id: 'featured',  lbl: 'Featured content', h: 11,  cut: 1 },
  { id: 'social',    lbl: 'Social links',     h: 6.4, cut: 2 },
  { id: 'contact',   lbl: 'Contact form',     h: 8,   cut: 2 },
]

// Findings, from the case study. Each strikes out the sections it argues against.
const NOTES = [
  { at: 2.8, x: 3,    y: 17, r: -3, k: 'Research', t: '97.9% of listening is live', cut: 1 },
  { at: 4.6, x: 72.5, y: 24, r: 3,  k: 'Testing',  t: '“Pick the phone up, hit play, and put the phone down.”', cut: 2 },
  { at: 6.3, x: 3,    y: 52, r: -2, k: 'Testing',  t: '“I missed the breakfast show this morning”' },
]
const cutAt = c => NOTES.find(n => n.cut === c).at

// The schedule card the surviving block opens into
const CARD = { x: 28, y: 14, w: 44, h: 72 }
const ROWS = [
  { tm: '06:00', nm: 'Breakfast',   ep: 'Episode 47', art: 'linear-gradient(135deg,#FF8A3D,#FF4F7B)' },
  { tm: '10:00', nm: 'Mid-morning', ep: 'Episode 48', art: 'linear-gradient(135deg,#3DB6FF,#6A5BFF)' },
  { tm: '14:00', nm: 'Afternoon',   air: true,        art: 'linear-gradient(135deg,var(--schf-rayo),var(--schf-rayo-2))' },
  { tm: '19:00', nm: 'Evening',                       art: 'linear-gradient(135deg,#2EC4A5,#3D8BFF)' },
]

// iPhone 16 Pro: 402×874pt screen at 43.3em wide inside a 1.35em rim.
// Positions on the screen are read off the 920px-wide screenshot.
const PHONE = { x: 27, y: 14, w: 46, h: 96.83 }
const PX = v => v * 0.04707
const PLAY = { x: PX(828), y: PX(934), d: PX(76) }
const ART  = { x: PX(90), y: PX(772), w: PX(155) }   // the On-air photo, reused in the now-playing bar
const ART_K = 3.9 / ART.w

// Results, from the case study
const fmtInt = v => Math.round(v).toLocaleString('en-GB')
const STATS = [
  { at: 16.4, x: 50, y: 31, to: 46500, fmt: v => fmtInt(v) + '+',        size: 10, lsize: 2.4, label: 'Plays in the first full month' },
  { at: 17.1, x: 29, y: 63, to: 25,    fmt: v => '+' + fmtInt(v) + '%',  size: 6,  lsize: 2.1, label: 'Month-on-month growth' },
  { at: 17.4, x: 71, y: 63, to: 80,    fmt: v => fmtInt(v) + '+',        size: 6,  lsize: 2.1, label: 'Station schedules with plays' },
]

// ── DOM ──
function build(stage) {
  const el = (cls, parent = stage, html = '') => {
    const d = document.createElement('div')
    if (cls) d.className = cls
    if (html) d.innerHTML = html
    parent.appendChild(d)
    return d
  }
  const set = (n, s) => Object.assign(n.style, s)
  const E = { el, set }

  // steps
  E.steps = el('schf-steps')
  E.stepEls = STEPS.map((st, i) => {
    const sep = i ? el('schf-sep', E.steps) : null
    const n = el('schf-step', E.steps, '<i></i><span>' + st[1] + '</span>')
    return { n, sep, dot: n.querySelector('i'), at: st[0] }
  })

  // station page
  E.frame = el('schf-frame')
  el('schf-frame-title', E.frame, 'Station page')
  E.secs = SECS.map(s => {
    if (s.keep) return { s }
    const n = el('schf-sec' + (s.id === 'hero' ? ' schf-sec--hero' : ''))
    el('schf-sec-lbl', n, s.lbl)
    const strike = el('schf-strike', n)
    const bar = (st) => set(el('schf-bar', n), st)
    if (s.id === 'hero') el('schf-hero-logo', n)
    if (s.id === 'presenter') { bar({ left: '1.6em', top: '4.6em', width: '4em', height: '2.4em', borderRadius: '50%' }); bar({ left: '6.6em', top: '5.4em', width: '20em' }) }
    if (s.id === 'featured') for (let i = 0; i < 2; i++) bar({ left: em(1.6 + i * 18), top: '4.4em', width: '16.6em', height: '5.2em', borderRadius: '1em' })
    if (s.id === 'social') for (let i = 0; i < 4; i++) bar({ left: em(19 + i * 3.6), top: '1.5em', width: '2.6em', height: '2.6em', borderRadius: '50%' })
    if (s.id === 'contact') { bar({ left: '1.6em', top: '4.6em', width: '26em', height: '2.2em', borderRadius: '.7em' }); bar({ left: '29em', top: '4.6em', width: '7.4em', height: '2.2em', borderRadius: '.7em', background: 'var(--schf-rayo)', opacity: .6 }) }
    return { s, n, strike }
  })

  // notes
  E.notes = NOTES.map(n => ({ ...n, n: el('schf-note', stage, `<span class="schf-note-k">${n.k}</span><span class="schf-note-t">${n.t}</span>`) }))

  // schedule block → schedule card
  E.sched = el('schf-sched')
  E.mini = el('schf-mini', E.sched, '<div class="schf-mini-lbl">Schedule</div><div class="schf-mini-pills"><span>06:00</span><span>10:00</span><span>14:00</span></div>')
  E.full = el('schf-full', E.sched)
  el('schf-title', E.full, 'Schedule')
  el('schf-tabs', E.full, '<span>Yesterday</span><span class="on">Today</span><span>Tomorrow</span>')
  E.rows = ROWS.map((r, i) => {
    const n = el('schf-row', E.full); set(n, { top: em(16.8 + i * 13.2) })
    el('schf-row-art', n).style.background = r.art
    el('schf-row-tm', n, r.tm); el('schf-row-nm', n, r.nm)
    const tg = el('schf-tag', n)
    const row = { n }
    if (r.ep) { row.ep = el('schf-tag-ep', tg, r.ep); row.cu = el('schf-tag-cu', tg, 'Catch-up') }
    if (r.air) row.air = el('schf-tag-air', tg, 'On-air')
    el('schf-row-play', n)
    return row
  })
  E.cardTap = el('schf-ripple', E.full)

  // the shipped screen, on an iPhone 16 Pro
  E.phone = el('schf-phone')
  for (const [x, y, hh] of [[-0.3, 15.5, 4], [-0.3, 22.5, 7.5], [-0.3, 31.5, 7.5], [45.9, 26, 10.5], [45.9, 55, 7]]) set(el('schf-phone-btn', E.phone), { left: em(x), top: em(y), height: em(hh) })
  el('schf-bezel', E.phone)
  const scr = el('schf-screen', E.phone)
  E.shot = document.createElement('img'); E.shot.alt = ''; E.shot.decoding = 'async'; scr.appendChild(E.shot)
  el('schf-island', scr)
  E.pause = el('schf-pause', scr, '<i style="left:31%"></i><i style="left:55%"></i>')
  set(E.pause, { left: em(PLAY.x - PLAY.d / 2), top: em(PLAY.y - PLAY.d / 2), width: em(PLAY.d), height: em(PLAY.d) })
  E.tap = el('schf-ripple', scr)
  E.mp = el('schf-mp', scr)
  set(E.mp, { left: em(PX(48)), top: em(PX(1675)), width: em(PX(824)), height: '5.3em' })
  E.mpArt = el('schf-mp-art', E.mp)
  set(E.mpArt, { backgroundSize: em(43.3 * ART_K) + ' auto', backgroundPosition: em(-ART.x * ART_K) + ' ' + em(-ART.y * ART_K) })
  el('schf-mp-title', E.mp, '<span>Zoe Ball in the Afternoon</span>')
  el('schf-mp-sub', E.mp, '<span>Greatest Hits Radio</span>')
  const eq = el('schf-mp-eq', E.mp)
  E.eq = [0, 1, 2].map(i => { const b = el('', eq); b.style.left = em(i * .5); return b })
  el('schf-mp-pause', E.mp, '<i style="left:32%"></i><i style="left:54%"></i>')

  // results
  E.stats = STATS.map(st => {
    const n = el('schf-stat', stage, `<span class="schf-stat-n" style="font-size:${st.size}em"></span><span class="schf-stat-l" style="font-size:${st.lsize}em">${st.label}</span>`)
    set(n, { left: em(st.x), top: em(st.y) })
    return { ...st, n, num: n.querySelector('.schf-stat-n') }
  })
  E.rule = el('schf-rule'); set(E.rule, { left: '20em', top: '56.5em', width: '60em' })
  return E
}

// ── One frame ──
function draw(E, stage, t, dark) {
  const { set } = E
  stage.style.opacity = 1 - p(t, 20.4, 21.0)

  // steps: each arrives when its phase starts; only the current one is at full strength
  let active = 0
  E.stepEls.forEach((st, i) => { if (t >= st.at) active = i })
  E.stepEls.forEach((st, i) => {
    const next = E.stepEls[active]
    const on  = i === active ? (i === 0 ? 1 : p(t, st.at, st.at + .35)) : 0
    const was = i === active - 1 ? 1 - p(t, next.at, next.at + .35) : 0
    const k = Math.max(on, was)
    const shown = i === 0 ? out(p(t, 0, .4)) : out(p(t, st.at, st.at + .45))
    const slide = `translateX(${em((1 - shown) * -2)})`
    set(st.n, { opacity: shown * lerp(.35, 1, k), transform: slide })
    set(st.dot, { width: em(1.2 * k), marginRight: em(1.2 * k) })
    if (st.sep) set(st.sep, { opacity: shown * .5, transform: slide + ' rotate(45deg)' })
  })

  // station page: sections dim, strike, then close up
  const sec = E.secs.map((q, idx) => {
    const c = q.s.cut ? cutAt(q.s.cut) : null
    const dim = c ? p(t, c + .35, c + .65) : 0
    const col = c ? 1 - io(p(t, c + .95, c + 1.55)) : 1
    const appear = out(p(t, .25 + idx * .16, .75 + idx * .16))
    return { ...q, dim, col, appear, h: q.s.h * col }
  })
  const H = PAGE.head + PAGE.pad * 2 + sec.reduce((a, q, i) => a + q.h + (i ? PAGE.gap * q.col : 0), 0)
  const top = 50 - H / 2 + 3
  const frameOp = out(p(t, 0, .45)) * (1 - p(t, 7.7, 8.3))
  set(E.frame, { left: em(PAGE.x), top: em(top), width: em(PAGE.w), height: em(H), opacity: frameOp, transform: `translateY(${em((1 - out(p(t, 0, .5))) * 3)})` })
  let y = top + PAGE.head + PAGE.pad, schedRect = null
  sec.forEach((q, i) => {
    if (i) y += PAGE.gap * q.col
    const r = { x: PAGE.x + PAGE.pad, y, w: PAGE.w - PAGE.pad * 2, h: q.s.h }
    if (q.s.keep) schedRect = { ...r, appear: q.appear }
    else {
      set(q.n, { left: em(r.x), top: em(y), width: em(r.w), height: em(q.h), opacity: q.appear * (1 - .55 * q.dim) * frameOp * q.col * q.col })
      set(q.strike, { width: (q.dim * 88) + '%' })
    }
    y += q.h
  })

  // notes
  const gone = p(t, 7.3, 7.8)
  for (const n of E.notes) {
    const a = out(p(t, n.at, n.at + .45))
    set(n.n, { left: em(n.x), top: em(n.y), opacity: a * (1 - gone), transform: `translateY(${em((1 - a) * -5)}) rotate(${n.r}deg) scale(${lerp(1.08, 1, a)})` })
  }

  // the surviving block opens into the schedule card
  const m = io(p(t, 7.9, 9.0))
  const r = rr(schedRect, CARD, m)
  const glow = p(t, 6.75, 7.15)
  // flip: the card turns away 11.3–11.7, the shipped screen turns in 11.7–12.15
  const f1 = p(t, 11.3, 11.7), f2 = p(t, 11.7, 12.15)
  const dip = 1 - .05 * Math.sin(Math.PI * p(t, 11.3, 12.15))
  set(E.sched, {
    left: em(r.x), top: em(r.y), width: em(r.w), height: em(r.h),
    opacity: f1 >= 1 ? 0 : schedRect.appear,
    background: `color-mix(in srgb, var(--schf-surface) ${m * 100}%, var(--schf-surface-2))`,
    borderRadius: em(lerp(1.8, 3.2, m)),
    boxShadow: `0 0 0 ${em(.35 * glow)} var(--schf-rayo), 0 ${em(1.6 * m)} ${em(4 * m)} var(--schf-drop)`,
    transform: `perspective(180em) rotateY(${-90 * f1 * f1}deg) scale(${(1 + .04 * glow * (1 - m)) * dip})`,
  })
  E.mini.style.opacity = 1 - p(t, 7.9, 8.2)
  E.full.style.opacity = p(t, 8.15, 8.6)
  E.rows.forEach((row, i) => {
    const a = out(p(t, 8.3 + i * .12, 8.8 + i * .12))
    set(row.n, { opacity: a, transform: `translateY(${em((1 - a) * 2)})` })
    if (row.ep) {
      const k = p(t, 9.5 + i * .25, 9.85 + i * .25)
      set(row.ep, { opacity: 1 - k, transform: `translateY(${em(-k * 1.2)})` })
      set(row.cu, { opacity: k, transform: `translateY(${em((1 - k) * 1.2)})` })
    }
    if (row.air) row.air.style.opacity = .65 + .35 * Math.sin(t * 4)
  })
  // the breakfast show is picked, then played
  E.rows[0].n.style.background = `color-mix(in srgb, var(--schf-rayo) ${p(t, 10.1, 10.4) * 12}%, transparent)`
  const cp = p(t, 10.45, 11.0), cd = 4.8 + 6 * cp
  set(E.cardTap, { left: em(38 - cd / 2), top: em(22.6 - cd / 2), width: em(cd), height: em(cd), opacity: cp > 0 ? 1 - cp : 0 })

  // shipped: flip in, pick the phone up, hit play, put the phone down
  const src = dark ? IMG_DARK : IMG_LIGHT
  if (E.src !== src) { E.src = src; E.shot.src = src; E.mpArt.style.backgroundImage = `url(${src})` }
  const back = 1 - out(f2)
  const up = io(p(t, 12.9, 13.6))
  const down = io(p(t, 15.7, 16.6))
  set(E.phone, {
    left: em(PHONE.x), top: em(PHONE.y), width: em(PHONE.w), height: em(PHONE.h),
    opacity: f2 > 0 && down < 1 ? 1 : 0,
    transform: `perspective(180em) translateY(${em(-3 * up + 112 * down)}) rotateY(${90 * back}deg) rotateX(${16 * down}deg) scale(${dip * lerp(1, .885, up)})`,
  })
  const tp = p(t, 13.85, 14.45), td = PLAY.d + 6 * tp
  set(E.tap, { left: em(PLAY.x - td / 2), top: em(PLAY.y - td / 2), width: em(td), height: em(td), opacity: tp > 0 ? 1 - tp : 0 })
  const pressed = p(t, 13.85, 13.95) * (1 - p(t, 13.95, 14.1))
  set(E.pause, { opacity: t >= 14.0 ? 1 : 0, transform: `scale(${1 - .12 * pressed})` })
  const mpIn = out(p(t, 14.15, 14.7))
  set(E.mp, { opacity: mpIn, transform: `translateY(${em((1 - mpIn) * 4)})` })
  E.eq.forEach((b, i) => { b.style.height = em(.35 + .85 * Math.abs(Math.sin(t * (5 + i * 1.7) + i))) })

  // results rise into the space the phone leaves
  for (const st of E.stats) {
    const a = out(p(t, st.at, st.at + .6))
    st.num.textContent = st.fmt(st.to * out(p(t, st.at, st.at + 1.1)))
    set(st.n, { opacity: a, transform: `translateX(-50%) translateY(${em((1 - a) * 3)})` })
  }
  E.rule.style.opacity = p(t, 17.0, 17.4)
}

export default defineComponent({
  name: 'ScheduleFace',
  setup() {
    const root  = ref(null)
    const stage = ref(null)
    let E = null, raf = 0, still = false, themeObs = null

    const isDark = () => document.documentElement.dataset.theme === 'dark'
    const now = () => ((performance.now() - T0) / 1000) % LOOP
    const frame = () => { draw(E, stage.value, now(), isDark()); raf = requestAnimationFrame(frame) }
    const stop  = () => { if (raf) { cancelAnimationFrame(raf); raf = 0 } }
    const start = () => { if (still || raf || !E) return; raf = requestAnimationFrame(frame) }

    const inView = useInView(root, { rootMargin: '120px' }, v => { v ? start() : stop() })

    onMounted(() => {
      E = build(stage.value)
      still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      draw(E, stage.value, still ? STILL_T : now(), isDark())
      // a still frame still has to follow the theme
      themeObs = new MutationObserver(() => { if (!raf) draw(E, stage.value, still ? STILL_T : now(), isDark()) })
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      if (inView.value) start()
    })
    onUnmounted(() => { stop(); if (themeObs) themeObs.disconnect() })

    return () => h('div', {
      ref: root,
      class: 'schf',
      'aria-hidden': 'true',
      'data-fallback': 'skip',
    }, [h('div', { ref: stage, class: 'schf-stage' })])
  },
})
