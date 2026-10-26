import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'
import { useInView } from '../../composables/useInView.js'

/* ─────────────────────────────────────────────────────────────
   AlexaFace — the Alexa card face. One pass of the linking journey
   from the case study's "three surfaces" figure: it starts in voice,
   crosses into Amazon's side (the notification, the Alexa app), and
   comes back to voice, where the exit teaches the utterance that
   checks it. The dashed line down the middle is the partner boundary;
   everything right of it is Amazon's.

   What crosses it is the link itself: a "Link" pill leaves the speaker
   and docks on the phone as the notification; a "Linked" pill comes
   back and is taken in by the speaker. Each pill is drawn twice, once
   clipped to each half, so its colour changes exactly at the boundary.

   Only words the case study gives are spoken. The phone is drawn
   unbranded: it stands for the Alexa app, not the Rayo app.

   Timing comes from one shared clock, so the card, the flying element
   and the hero all show the same moment and opening the case study
   doesn't restart the loop. A light ticker derives the beat from that
   clock while the face is on screen; off-screen it stops. Reduced
   motion holds the last beat. Decorative: aria-hidden, skipped by the
   no-JS fallback.
   ───────────────────────────────────────────────────────────── */

const LOOP_MS = 15000
const TYPE_MS = 42

const ASK    = 'Alexa, ask Rayo to link my accounts'
const REPLY  = 'I’ll send you a link.'
const VERIFY = 'Alexa, ask Rayo if I am account linked'

// [start ms, beat]. Each beat holds until the next one starts.
const BEATS = [
  [0,     'idle'],
  [500,   'ask'],
  [2300,  'checks'],
  [4300,  'send'],
  [5500,  'notify'],
  [6500,  'tap'],
  [8500,  'return'],
  [9600,  'verify'],
  [11500, 'linked'],
  [14300, 'out'],
]
// Who says what, and when. A line types in from `from` and holds until
// `end`, then slides up and fades over LEAVE_MS.
const LINES = [
  { id: 'ask',    who: 'User',  text: ASK,    from: 500,  end: 4300 },
  { id: 'reply',  who: 'Alexa', text: REPLY,  from: 4600, end: 8500 },   // waits for 'ask' to clear
  { id: 'verify', who: 'User',  text: VERIFY, from: 9600, end: 14300 },
]
const LEAVE_MS = 550

// The pills that cross the boundary. Each runs once per pass, from `start`.
const PILLS = [
  { id: 'out',  label: 'Link',   icon: 'link',  start: 4400, dur: 1100 },
  { id: 'back', label: 'Linked', icon: 'check', start: 8500, dur: 1100 },
]

const CHECKS = ['Alexa app installed', 'Primary profile', 'Notifications on']
const STEPS  = ['Sign in', 'Link', 'Agree', 'Done']

const T0 = typeof performance !== 'undefined' ? performance.now() : 0
const STILL_T = 13000   // the frame reduced motion holds: linked, asked and confirmed

function beatAt(t) {
  let b = BEATS[0][1]
  for (const [at, name] of BEATS) if (t >= at) b = name
  return b
}

function typedAt(text, t, from) {
  const n = Math.floor((t - from) / TYPE_MS)
  return text.slice(0, Math.max(0, Math.min(text.length, n)))
}

export default defineComponent({
  name: 'AlexaFace',
  setup() {
    const root = ref(null)
    const t    = ref(0)
    let ticker = null
    let still  = false

    const tick = () => { t.value = (performance.now() - T0) % LOOP_MS }
    const stop = () => { if (ticker) { clearInterval(ticker); ticker = null } }
    const start = () => { if (still || ticker) return; tick(); ticker = setInterval(tick, 40) }

    useInView(root, { rootMargin: '120px' }, v => { v ? start() : stop() })

    onMounted(() => {
      still = typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      t.value = still ? STILL_T : (performance.now() - T0) % LOOP_MS
    })
    onUnmounted(stop)

    const beat = computed(() => beatAt(t.value))
    const after = name => BEATS.findIndex(b => b[1] === beat.value) >= BEATS.findIndex(b => b[1] === name)

    // The caption: the line being said now, and the one before it while it
    // slides up and out. Both come from the clock, like everything else.
    const lines = computed(() => {
      const now = t.value
      const out = []
      for (const l of LINES) {
        if (now >= l.end && now < l.end + LEAVE_MS) out.push({ ...l, shown: l.text, typing: false, leaving: true })
        else if (now >= l.from && now < l.end) {
          const shown = typedAt(l.text, now, l.from)
          out.push({ ...l, shown, typing: shown.length < l.text.length, leaving: false })
        }
      }
      return out
    })

    const listening = computed(() => ['ask', 'checks', 'send', 'verify'].includes(beat.value))

    const ring = () => h('div', { class: 'alxf-dot' }, [
      h('span', { class: 'alxf-ring' }),
      h('span', { class: 'alxf-dot-top' }, [h('i'), h('i'), h('i'), h('i')]),
    ])

    const phone = () => h('div', { class: 'alxf-phone' }, [
      h('span', { class: 'alxf-island' }),
      h('div', { class: 'alxf-screen' }, [
        h('div', { class: 'alxf-banner' }, [
          h('span', { class: 'alxf-banner-icon' }),
          h('span', { class: 'alxf-banner-text' }, [
            h('b', null, 'Alexa'),
            h('span', null, 'Link your Rayo account'),
          ]),
        ]),
        h('div', { class: 'alxf-link' }, [
          h('p', { class: 'alxf-link-title' }, 'Link account'),
          h('div', { class: 'alxf-steps' }, STEPS.map((s, i) =>
            h('div', { class: 'alxf-step', style: { '--i': i }, key: s }, [
              h('span', { class: 'alxf-step-dot' }),
              h('span', { class: 'alxf-step-name' }, s),
            ]))),
        ]),
      ]),
    ])

    // A pill's CSS animation is seeked to the shared clock once, when it
    // mounts (so the card, fly and hero agree), then left to run.
    const pillDelays = new Map()
    const delayFor = (p, now) => {
      const k = p.id + ':' + Math.floor((performance.now() - T0) / LOOP_MS)
      if (!pillDelays.has(k)) {
        pillDelays.set(k, -Math.max(0, now - p.start) + 'ms')
        if (pillDelays.size > 6) pillDelays.delete(pillDelays.keys().next().value)
      }
      return pillDelays.get(k)
    }

    const ICONS = {
      link:  'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
      check: 'M5 12.5l4.5 4.5L19 7.5',
    }
    const pill = (p, delay) => h('div', {
      key: p.id,
      class: 'alxf-pill alxf-pill--' + p.id,
      style: { animationDelay: delay, animationDuration: p.dur + 'ms' },
    }, [
      h('svg', { class: 'alxf-pill-icon', viewBox: '0 0 24 24' }, [h('path', { d: ICONS[p.icon] })]),
      p.label,
    ])

    // Both halves, each showing the same pills, clipped to its own side
    const pills = () => {
      const now = t.value
      const live = PILLS.filter(p => now >= p.start && now < p.start + p.dur)
      if (!live.length) return null
      const at = live.map(p => [p, delayFor(p, now)])
      return ['rayo', 'amazon'].map(side =>
        h('div', { class: 'alxf-pills alxf-pills--' + side, key: side }, at.map(([p, d]) => pill(p, d))))
    }

    return () => {
      const b = beat.value
      const cls = ['alxf', 'alxf--' + b]
      if (listening.value) cls.push('alxf--listening')
      if (after('notify') && b !== 'out') cls.push('alxf--phone-on')
      if (after('tap') && b !== 'out') cls.push('alxf--linking')
      if (b === 'linked') cls.push('alxf--is-linked')

      return h('div', {
        ref: root,
        class: cls.join(' '),
        'aria-hidden': 'true',
        'data-fallback': 'skip',
      }, [
        h('div', { class: 'alxf-zone' }),
        h('span', { class: 'alxf-boundary' }),


        h('div', { class: 'alxf-speaker' }, [
          ring(),
          h('div', { class: 'alxf-checks' }, CHECKS.map((s, i) =>
            h('span', { class: 'alxf-check', style: { '--i': i }, key: s }, s))),
          h('span', { class: 'alxf-status' }, [h('i'), 'Linked']),
        ]),

        phone(),

        pills(),

        h('div', { class: 'alxf-caption' }, lines.value.map(l =>
          h('div', {
            key: l.id + (l.leaving ? ':leave' : ''),
            class: ['alxf-line', l.leaving ? 'alxf-line--leave' : ''].filter(Boolean).join(' '),
          }, [
            h('span', { class: 'alxf-who alxf-who--' + l.who.toLowerCase() }, l.who),
            h('span', { class: 'alxf-said' }, [
              // Alexa's line is quoted; the closing quote lands when the typing ends
              l.who === 'Alexa' ? '\u201C' + l.shown + (l.typing ? '' : '\u201D') : l.shown,
              l.typing ? h('span', { class: 'alxf-caret' }) : null,
            ]),
          ]))),
      ])
    }
  },
})
