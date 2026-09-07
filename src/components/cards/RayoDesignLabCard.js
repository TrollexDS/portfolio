import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'

/* ─────────────────────────────────────────────────────────────
   Assets - three real screenshots, everything else is drawn.

   Nothing from inside a prototype's phone frame appears here except
   IMG_HARNESS, which shows a direction that was NOT taken forward.
   The explorations are live unpublished work.
   ───────────────────────────────────────────────────────────── */
const HERO_SRC     = '/src/assets/images/rayo-design-lab/rdl-hero.svg'
const IMG_POC      = '/src/assets/images/rayo-design-lab/rayo-design-lab-mvp.png'
const IMG_NOW      = '/src/assets/images/rayo-design-lab/rayo-design-lab-current.png'
const IMG_HARNESS  = '/src/assets/images/rayo-design-lab/rayo-design-lab-prototype-harness.png'
const IMG_STORAGE  = '/src/assets/images/rayo-design-lab/rayo-design-lab-prototype-download-storag.png'
const IMG_SEARCH   = '/src/assets/images/rayo-design-lab/rayo-design-lab-search.png'

/**
 * softImg - an <img> that degrades to a labelled placeholder instead of a
 * broken-image icon when the file isn't there yet. Dropping the src is what
 * stops the browser drawing its own glyph; the class supplies the frame.
 */
const softImg = (src, alt, cls) =>
  h('img', {
    class: cls,
    src,
    alt,
    loading: 'lazy',
    onError: (e) => {
      const el = e.target
      el.classList.add('rdl-img--missing')
      el.removeAttribute('src')
      el.setAttribute('data-missing', alt)
    },
  })


/* ─────────────────────────────────────────────────────────────
   LabLoop - the card face.

   The lab's own intro, then one pass of the loop the case study
   describes: a prompt is typed and worked on, a prototype arrives,
   options are tried, it is shared, and it becomes a file in the repo.

   The wordmark is sampled the way the real splash samples it - the
   word is rendered once to an offscreen canvas in the display face and
   cut into columns, so the type is the actual font rather than a
   hand-drawn bar alphabet. Quantised horizontally, exact vertically:
   a bar only has to be a bar in x, and snapping in y turns every thin
   horizontal stroke into a square dot.
   ───────────────────────────────────────────────────────────── */
const WORD   = 'Rayo Design Lab'
const PROMPT = 'Add download function in the Rayo app'

const CELL = 5        // sampling pitch - the horizontal resolution
const PITCH = 6       // display pitch - deliberately wider than CELL
const BAR_W = 4
const FONT_PX = 76
const TRACKING = 1.5
const INK = 132       // alpha at which a pixel counts as ink
const MERGE_GAP = 2   // vertical gaps below this are antialiasing
const MIN_RUN = 3
const PEAK = 1.18     // how far past its own height the wave crests
const SWEEP_STEP = 6  // per-column delay: the wave's travel speed

// Rayo's brand gradient, painted one column at a time - a real gradient
// can't paint a few hundred separate boxes as one image.
const G_FROM = '#ED4AD9'
const G_TO   = '#8132FE'

const TIMELINE = [
  [0,     { phase: 'splash', pill: 0 }],
  [2650,  { phase: 'clear'   }],   // the word stands for a beat first
  [3800,  { phase: 'prompt'  }],
  [5900,  { phase: 'loading' }],
  [7900,  { phase: 'sent'    }],   // the bar moves up out of the way
  [8500,  { phase: 'proto'   }],
  [9300,  { phase: 'options' }],
  [10200, { pill: 1 }],
  [11100, { pill: 2 }],
  [12000, { phase: 'share'   }],
  [12700, { phase: 'shared'  }],
  [13500, { phase: 'fold'    }],   // it becomes a file; the bar leaves
  [14700, { phase: 'upload'  }],   // and goes up into the cloud
  [15700, { phase: 'rest'    }],   // filled and holding
  [16050, { phase: 'done'    }],   // then goes, leaving the frame empty
]

// The cloud no longer waits for `rest` to light up - it does that on
// contact, from inside `upload`. `rest` is the beat it holds for after.
// `done` at 16050 plus its own exit lands on an empty frame at ~16500,
// and the loop turns 1.45s after that - the pause is the point.
const LOOP_MS = 17950

const ICON_SHARE = 'M12 3v12M12 3l-4 4M12 3l4 4M5 14v5a1 1 0 001 1h12a1 1 0 001-1v-5'
const ICON_CHECK = 'M5 12.5l4.2 4.2L19 7'
const ICON_CLOUD = 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'

function sampleWord() {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    const root = getComputedStyle(document.documentElement)
    const family = root.getPropertyValue('--font-family-display').trim() ||
                   root.getPropertyValue('--font-family-primary').trim() || 'sans-serif'
    const font = `700 ${FONT_PX}px ${family}`

    ctx.letterSpacing = `${TRACKING}px`
    ctx.font = font
    const m = ctx.measureText(WORD)
    const ascent = Math.ceil(m.actualBoundingBoxAscent)
    const descent = Math.ceil(m.actualBoundingBoxDescent)
    canvas.width = Math.ceil(m.width) + CELL * 2
    canvas.height = ascent + descent + CELL * 2
    // resizing resets the context, so both go on again
    ctx.letterSpacing = `${TRACKING}px`
    ctx.font = font
    ctx.fillText(WORD, CELL, ascent + CELL)

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const cols = Math.floor(canvas.width / CELL)
    const raw = []
    let minY = canvas.height, maxY = 0, firstCol = -1, lastCol = -1

    for (let cx = 0; cx < cols; cx++) {
      const x0 = cx * CELL
      const x1 = Math.min(x0 + CELL, canvas.width)
      // full vertical resolution: any ink in the column counts, because a
      // one-pixel stroke still has to survive and averaging deletes it
      const ink = []
      for (let py = 0; py < canvas.height; py++) {
        let hit = false
        for (let px = x0; px < x1 && !hit; px++) {
          if (data[(py * canvas.width + px) * 4 + 3] > INK) hit = true
        }
        ink.push(hit)
      }
      let py = 0
      while (py < canvas.height) {
        if (!ink[py]) { py++; continue }
        let end = py
        while (end + 1 < canvas.height && ink[end + 1]) end++
        let next = end + 1
        while (next < canvas.height && next - end <= MERGE_GAP) {
          if (ink[next]) { end = next; while (end + 1 < canvas.height && ink[end + 1]) end++; next = end + 1 }
          else next++
        }
        const height = Math.max(MIN_RUN, end - py + 1)
        raw.push({ x: cx, top: py, bottom: py + height })
        minY = Math.min(minY, py); maxY = Math.max(maxY, py + height)
        if (firstCol < 0) firstCol = cx
        lastCol = cx
        py = end + 1
      }
    }
    if (!raw.length) return null

    const span = Math.max(1, lastCol - firstCol)
    const width = (lastCol - firstCol + 1) * PITCH - (PITCH - BAR_W)
    const height = maxY - minY
    const midY = height / 2

    // Fill the empty columns so the resting line is continuous and the wave
    // passes through the spaces instead of breaking apart at them.
    const inked = new Set(raw.map(r => r.x))
    const dotTop = minY + midY - BAR_W / 2
    const fillers = new Set()
    for (let cx = firstCol; cx <= lastCol; cx++) {
      if (inked.has(cx)) continue
      fillers.add(cx)
      raw.push({ x: cx, top: dotTop, bottom: dotTop + BAR_W })
    }

    const bits = raw.map(({ x, top, bottom }) => {
      const col = x - firstCol
      const y = top - minY
      const hh = bottom - top
      return {
        x: col * PITCH, y, w: BAR_W, h: hh,
        dy: midY - (y + hh / 2),
        c: Math.min(1, BAR_W / hh),
        p: (height * PEAK) / hh,
        e: fillers.has(x) ? 0 : 1,
        delay: col * SWEEP_STEP,
        t: col / span,
      }
    })
    return { bits, width, height, built: 300 + span * SWEEP_STEP + 420 }
  } catch (e) {
    return null
  }
}

const LabLoop = defineComponent({
  name: 'LabLoop',
  setup() {
    const phase = ref('splash')
    const pill  = ref(0)
    const typed = ref('')
    const word  = ref(null)
    // bumped once per pass so the splash remounts and its build keyframes
    // replay - an animation that has already run will not run again
    const cycle = ref(0)
    const root  = ref(null)

    let timers = []
    let typer  = null
    let ro     = null

    function clearAll() {
      timers.forEach(clearTimeout); timers = []
      if (typer) { clearInterval(typer); typer = null }
      if (ro) { ro.disconnect(); ro = null }
    }

    /* The wordmark is sampled at a fixed 76px, so it has one true size in
       pixels. The card face does not - it is a grid cell on the board and
       the full width of the overlay. One scalar, measured, keeps the word
       at the same share of the frame in both. */
    function fit() {
      const el = root.value
      if (!el || !word.value || !word.value.width) return
      const k = Math.max(0.28, Math.min(1, (el.clientWidth * 0.82) / word.value.width))
      el.style.setProperty('--rdlv-k', String(k))
    }

    function typeOut() {
      let i = 0
      typed.value = ''
      if (typer) clearInterval(typer)
      typer = setInterval(() => {
        i += 1
        typed.value = PROMPT.slice(0, i)
        if (i >= PROMPT.length) { clearInterval(typer); typer = null }
      }, 48)
    }

    function run() {
      cycle.value += 1
      TIMELINE.forEach(([at, change]) => {
        timers.push(setTimeout(() => {
          if (change.phase) phase.value = change.phase
          if (change.pill !== undefined) pill.value = change.pill
          if (change.phase === 'prompt') typeOut()
        }, at))
      })
      timers.push(setTimeout(run, LOOP_MS))
    }

    onMounted(() => {
      const still = typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Sampling before the display face has loaded would bake the fallback
      // font into the bars, so it waits for it.
      const start = () => {
        word.value = sampleWord()
        fit()
        if (typeof ResizeObserver !== 'undefined' && root.value) {
          ro = new ResizeObserver(fit)
          ro.observe(root.value)
        }
        if (still) { phase.value = 'options'; typed.value = PROMPT; return }
        run()
      }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start)
      else start()
    })
    onUnmounted(clearAll)

    const svg = (d, cls) =>
      h('svg', { class: cls, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d, stroke: 'currentColor', 'stroke-width': '2',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ])

    /* Each option is a different arrangement of fake components. */
    const SCREENS = [
      [['hero'], ['row'], ['row'], ['row']],
      [['row'], ['toggle'], ['row'], ['row'], ['toggle']],
      [['banner'], ['tiles'], ['row'], ['row']],
    ]

    const part = (kind, i) => {
      if (kind === 'hero')   return h('span', { class: 'rdlv-hero', key: i })
      if (kind === 'banner') return h('span', { class: 'rdlv-banner', key: i })
      if (kind === 'tiles')  return h('span', { class: 'rdlv-tiles', key: i }, [h('i'), h('i'), h('i'), h('i')])
      if (kind === 'toggle') return h('span', { class: 'rdlv-toggle', key: i }, [h('span', { class: 'rdlv-tg-l' }), h('span', { class: 'rdlv-tg-s' })])
      return h('span', { class: 'rdlv-row', key: i }, [
        h('span', { class: 'rdlv-thumb' }),
        h('span', { class: 'rdlv-lines' }, [h('span', { class: 'rdlv-l1' }), h('span', { class: 'rdlv-l2' })]),
      ])
    }

    return () =>
      h('div', { class: 'rdlv', ref: root, 'data-phase': phase.value, 'aria-hidden': 'true' }, [
        h('div', { class: 'rdlv-wash' }),

        // ── the wordmark, built and cleared by two waves ──
        word.value
          ? h('div', { class: 'rdlv-splash', key: cycle.value }, [
              h('div', {
                class: 'rdlv-word',
                style: { width: word.value.width + 'px', height: word.value.height + 'px' },
              }, word.value.bits.map((b, i) =>
                h('span', {
                  key: i,
                  class: 'rdlv-bit',
                  style: {
                    left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px',
                    background: `color-mix(in srgb, ${G_FROM} ${Math.round((1 - b.t) * 100)}%, ${G_TO})`,
                    '--dy': b.dy + 'px', '--c': b.c, '--p': b.p, '--e': b.e,
                    '--d': b.delay + 'ms',
                  },
                })
              )),
            ])
          : null,

        // ── the prompt, with the loader at the end of the bar ──
        h('div', { class: 'rdlv-prompt' }, [
          h('span', { class: 'rdlv-spark' }),
          h('span', { class: 'rdlv-text' }, typed.value),
          h('span', { class: 'rdlv-caret' }),
          h('span', { class: 'rdlv-load' }),
        ]),

        // ── the options ──
        h('div', { class: 'rdlv-pills' },
          [0, 1, 2].map(i =>
            h('span', {
              key: i,
              class: ['rdlv-pill', pill.value === i ? 'rdlv-pill--on' : ''].filter(Boolean).join(' '),
              style: { transitionDelay: (i * 55) + 'ms' },
            })
          )
        ),

        // ── the prototype, and the file it becomes ──
        h('div', { class: 'rdlv-phone' }, [
          h('span', { class: 'rdlv-notch' }),
          h('div', { class: 'rdlv-screen', key: pill.value }, [
            h('span', { class: 'rdlv-title' }),
            ...SCREENS[pill.value].map(([kind], i) => part(kind, i)),
          ]),
          h('span', { class: 'rdlv-tabs' }, [h('i'), h('i'), h('i'), h('i')]),
        ]),

        h('span', { class: 'rdlv-share' }, [
          svg(ICON_SHARE, 'rdlv-icon rdlv-icon--share'),
          svg(ICON_CHECK, 'rdlv-icon rdlv-icon--check'),
        ]),

        // ── where it goes ──
        h('div', { class: 'rdlv-cloud' }, [
          // a cloud-shaped patch of the card's own ground, so the file is
          // occluded rather than overlaid as it goes in
          h('span', { class: 'rdlv-cloud-fill' }),
          h('svg', { class: 'rdlv-cloud-svg', viewBox: '0 0 24 24' }, [
            h('path', { class: 'rdlv-cloud-p', d: ICON_CLOUD }),
          ]),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   BeforeAfterToggle - the first build against the same page today.

   Same pattern and the same `ba-*` styles as the Rayo Design System
   case study: an Old/New switch, with the outgoing image sliding out
   as the incoming one slides in from the opposite side.
   ───────────────────────────────────────────────────────────── */
const BeforeAfterToggle = defineComponent({
  name: 'BeforeAfterToggle',
  setup() {
    // Preload both so the browser has decoded them before the first toggle
    ;[IMG_NOW, IMG_POC].forEach(src => { const i = new Image(); i.src = src })

    const showNew    = ref(true)
    const animating  = ref(false)
    const enterClass = ref('')
    const exitClass  = ref('')
    const exitSrc    = ref('')

    function toggle() {
      if (animating.value) return
      const goingToNew = !showNew.value

      // Capture the image that's leaving before we flip state
      exitSrc.value    = showNew.value ? IMG_NOW : IMG_POC
      // New sits on the right → enters from right / exits to left
      // Old sits on the left  → enters from left  / exits to right
      enterClass.value = goingToNew ? 'ba-img--enter-from-right' : 'ba-img--enter-from-left'
      exitClass.value  = goingToNew ? 'ba-img--exit-to-left'     : 'ba-img--exit-to-right'

      showNew.value   = goingToNew
      animating.value = true
      setTimeout(() => {
        animating.value = false
        exitSrc.value   = ''
      }, 1220)
    }

    return () => h('div', { class: 'ba-wrap' }, [
      h('div', { class: 'ba-img-clip' }, [
        animating.value && exitSrc.value
          ? h('img', { class: ['ba-img', 'ba-img--abs', exitClass.value].join(' '), src: exitSrc.value, alt: '' })
          : null,
        h('img', {
          class: ['ba-img', animating.value ? enterClass.value : ''].filter(Boolean).join(' '),
          src: showNew.value ? IMG_NOW : IMG_POC,
          alt: showNew.value
            ? 'The Design Lab today: two portals, sidebar and the component grid'
            : 'The first build: a plain column of components',
        }),
      ]),
      h('div', { class: 'ba-toggle', onClick: toggle }, [
        h('span', { class: ['ba-label', !showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, 'First build'),
        h('div', { class: ['ba-track', showNew.value ? 'ba-track--on' : ''].filter(Boolean).join(' ') }, [
          h('div', { class: 'ba-thumb' }),
        ]),
        h('span', { class: ['ba-label', showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, 'Today'),
      ]),
    ])
  },
})


/* ─────────────────────────────────────────────────────────────
   BetSwitcher - the harness's own mechanic, in miniature.

   Prose and grey schematics only. The bets ARE the content, so
   this loses nothing by carrying no screenshots.
   ───────────────────────────────────────────────────────────── */
const BETS = [
  { id: 'a', label: 'A · Ring only',
    text: 'What the screen draws today, finished: the icon’s own circle becomes a progress ring, and nothing else moves. No layout shift, no reserved space. Its cost is legibility - at that size a ring reads as “something is happening”, not as “42%, about a minute left”. If downloading is meant to sit in the background, this is right and the rest are over-design.' },
  { id: 'b', label: 'B · Ring + status line',
    text: 'The ring, plus one line of status under the title. It is the only treatment with room for the detail a ring can’t carry - and the only one that can ever say “Waiting for Wi-Fi”, the state that otherwise looks like the tap did nothing. The cost is a line of permanently reserved space: reserve it and you lose it always, don’t and the layout jumps every time a download starts.' },
  { id: 'c', label: 'C · B + snackbar', rec: true,
    text: 'The recommendation. Ring for the glance, status line for the detail, and a snackbar when a download starts - confirming a background action you can’t otherwise see. Nothing on completion: the status line is the receipt, and it fades, leaving the filled icon as the permanent state.' },
  { id: 'd', label: 'D · Labels under icons', rejected: true,
    text: 'Rejected, and built so the reason is visible. The icon row sits near the bottom edge with the home indicator below it, so labels have to push all four icons up into the gradient - and labelling only the download icon would break the row’s rhythm, so it is all four or none.' },
  { id: 'e', label: 'E · Badge on artwork', rejected: true,
    text: 'Rejected. The most visible option by a distance, and it spends the one element the screen exists to show. Audio is the subject and the interface is the frame; a badge over the artwork is the opposite trade. Built anyway, because “too loud” is an opinion until you see it.' },
  { id: 'f', label: 'F · Second scrubber lane', rejected: true,
    text: 'The one to actively avoid. Download progress drawn as a pale lane behind the playback fill is the buffered-video convention, in the one lane already spoken for - it will be read as buffering, and on a finished download it reads as “fully buffered”, which is not what it means.' },
]

/* ─────────────────────────────────────────────────────────────
   BetSwitcher - a replica of the lab's own controls rail.

   The panel on the left is the exploration's treatment list as it
   appears in the Design Lab; the panel on the right is the bet for
   whichever option is selected. No phone preview: the point here is
   the argument, not the screen.
   ───────────────────────────────────────────────────────────── */
const BetSwitcher = defineComponent({
  name: 'BetSwitcher',
  setup() {
    const active = ref(BETS[0])

    return () =>
      h('div', { class: 'rdl-lab' }, [
        h('div', { class: 'rdl-lab-rail' }, [
          h('div', { class: 'rdl-lab-head' }, [
            h('span', { class: 'rdl-lab-title' }, 'Downloading in the player'),
            h('span', { class: 'rdl-lab-help', 'aria-hidden': 'true' }, '?'),
          ]),
          h('span', { class: 'rdl-lab-group' }, 'Treatment'),
          h('div', { class: 'rdl-lab-opts', role: 'group', 'aria-label': 'Treatment' },
            BETS.map(b =>
              h('button', {
                key: b.id,
                class: ['rdl-lab-opt', active.value.id === b.id ? 'rdl-lab-opt--on' : ''].filter(Boolean).join(' '),
                'aria-pressed': String(active.value.id === b.id),
                onClick: () => { active.value = b },
              }, b.label)
            )
          ),
        ]),
        h('div', { class: 'rdl-lab-note' }, [
          h('span', { class: 'rdl-lab-note-label' }, [
            'The bet',
            active.value.rec ? h('span', { class: 'rdl-lab-flag rdl-lab-flag--rec' }, 'Recommended') : null,
            active.value.rejected ? h('span', { class: 'rdl-lab-flag' }, 'Rejected') : null,
          ]),
          h('p', { class: 'rdl-lab-note-text' }, active.value.text),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   StateWalk - the download control's six states.

   Built from scratch. Nothing confidential: it is a state machine,
   not a design.
   ───────────────────────────────────────────────────────────── */
const STATES = [
  { id: 'idle',        name: 'Idle',        tone: 'quiet',  desc: 'Nothing has been asked for. The control is an invitation, not a status.' },
  { id: 'queued',      name: 'Queued',      tone: 'quiet',  desc: 'Accepted but not started, because something else is transferring first. Skipped by most designs, and the reason a tap can feel ignored.' },
  { id: 'downloading', name: 'Downloading', tone: 'live',   desc: 'The one state everybody draws. Determinate progress, and cancellable at any point.' },
  { id: 'downloaded',  name: 'Downloaded',  tone: 'done',   desc: 'Finished and available with no signal. The permanent state, and the only one that has to survive the app being closed.' },
  { id: 'waiting',     branch: true, name: 'Waiting',     tone: 'warn',   desc: 'Tapped on mobile data with mobile-data downloads switched off. Not an error and not progress - and the one that generates the support ticket, because the listener tapped download, nothing happened, and no screen says why.' },
  { id: 'failed',      branch: true, name: 'Failed',      tone: 'error',  desc: 'The transfer broke, or there is no connection at all. Recoverable, and it has to say what to do next rather than apologise.' },
]

const StateWalk = defineComponent({
  name: 'StateWalk',
  setup() {
    // Opens on `waiting` - it is the state the section exists to talk about.
    const active = ref(STATES.find(x => x.id === 'waiting'))

    return () =>
      h('div', { class: 'rdl-lab' }, [
        h('div', { class: 'rdl-lab-rail' }, [
          h('div', { class: 'rdl-lab-head' }, [
            h('span', { class: 'rdl-lab-title' }, 'Download control'),
            h('span', { class: 'rdl-lab-help', 'aria-hidden': 'true' }, '?'),
          ]),
          h('span', { class: 'rdl-lab-group' }, 'State'),
          h('div', { class: 'rdl-lab-opts', role: 'group', 'aria-label': 'State' },
            STATES.map(st =>
              h('button', {
                key: st.id,
                class: [
                  'rdl-lab-opt',
                  st.branch ? 'rdl-lab-opt--branch' : '',
                  active.value.id === st.id ? 'rdl-lab-opt--on' : '',
                ].filter(Boolean).join(' '),
                'aria-pressed': String(active.value.id === st.id),
                onClick: () => { active.value = st },
              }, st.name)
            )
          ),
          h('p', { class: 'rdl-lab-foot' }, 'The first four are the main line. The outlined two branch off it, and they are the ones most designs skip.'),
        ]),
        h('div', { class: 'rdl-lab-note' }, [
          h('span', { class: 'rdl-lab-note-label' }, active.value.name),
          h('p', { class: 'rdl-lab-note-text' }, active.value.desc),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   ContractFile - the component contract, as the file it actually is.

   Rendered as a Markdown file open in an editor: window chrome, a
   filename tab, line numbers, and the markdown syntax left visible.
   The point of the section is that this is a document sitting next to
   the code, so it should look like one rather than like prose.
   ───────────────────────────────────────────────────────────── */
const CONTRACT_LINES = [
  ['h',  '## Use when / Don’t use when'],
  ['',   ''],
  ['li', '**Don’t use** for navigation between tabs or list rows.'],
  ['li', '**Don’t use** for playback controls — playback has its own'],
  ['c',  '  components, with different sizing and hit areas.'],
  ['',   ''],
  ['h',  '## Anti-patterns'],
  ['',   ''],
  ['li', '**Don’t add a `disabled` boolean.** The iOS API models'],
  ['c',  '  disabled as a *style*; duplicating it as a prop lets the'],
  ['c',  '  two disagree.'],
  ['',   ''],
  ['li', 'Pressed state drops to `0.1` opacity over `200ms`. This is'],
  ['c',  '  unusually aggressive — it is the intended feel, so don’t'],
  ['c',  '  “fix” it.'],
]

/* Renders **bold**, `code` and *emphasis*, keeping the markers visible
   the way an editor would. */
function md(text) {
  const out = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let last = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const cls = tok.startsWith('**') ? 'rdl-md-strong' : tok.startsWith('`') ? 'rdl-md-code' : 'rdl-md-em'
    out.push(h('span', { class: cls }, tok))
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const ContractFile = () =>
  h('div', { class: 'rdl-file' }, [
    h('div', { class: 'rdl-file-bar' }, [
      h('span', { class: 'rdl-file-dots', 'aria-hidden': 'true' }, [h('i'), h('i'), h('i')]),
      h('span', { class: 'rdl-file-tab' }, [
        h('span', { class: 'rdl-file-ext' }, 'MD'),
        'Button.md',
      ]),
    ]),
    h('pre', { class: 'rdl-file-body' },
      CONTRACT_LINES.map(([kind, text], i) =>
        h('code', { class: 'rdl-file-line', key: i }, [
          h('span', { class: 'rdl-file-num', 'aria-hidden': 'true' }, String(i + 1)),
          h('span', { class: ['rdl-file-text', kind ? 'rdl-file-text--' + kind : ''].filter(Boolean).join(' ') },
            kind === 'li' ? ['- ', ...md(text)] : md(text)),
        ])
      )
    ),
  ])


/* ─────────────────────────────────────────────────────────────
   Drawn diagrams - inline SVG, theme-aware via currentColor.
   ───────────────────────────────────────────────────────────── */

// Cover: the anatomy of one exploration. The phone is an empty outline.
const HarnessAnatomy = () =>
  h('div', { class: 'rdl-fig rdl-fig--cover' }, [
    h('div', { class: 'rdl-anat' }, [
      h('div', { class: 'rdl-anat-col' }, [
        h('div', { class: 'rdl-anat-group' }, [
          h('span', { class: 'rdl-anat-label' }, 'Which design'),
          h('div', { class: 'rdl-anat-pills' }, [
            h('span', { class: 'rdl-anat-pill rdl-anat-pill--on' }, 'A'),
            h('span', { class: 'rdl-anat-pill' }, 'B'),
            h('span', { class: 'rdl-anat-pill' }, 'C'),
            h('span', { class: 'rdl-anat-pill' }, 'D'),
          ]),
        ]),
        h('div', { class: 'rdl-anat-group' }, [
          h('span', { class: 'rdl-anat-label' }, 'What condition'),
          h('div', { class: 'rdl-anat-seg' }, [
            h('span', { class: 'rdl-anat-segopt rdl-anat-segopt--on' }, 'Default'),
            h('span', { class: 'rdl-anat-segopt' }, 'Offline'),
            h('span', { class: 'rdl-anat-segopt' }, 'Error'),
          ]),
        ]),
        h('div', { class: 'rdl-anat-panel' }, [
          h('span', { class: 'rdl-anat-label' }, 'The bet'),
          h('span', { class: 'rdl-anat-line' }),
          h('span', { class: 'rdl-anat-line' }),
          h('span', { class: 'rdl-anat-line rdl-anat-line--short' }),
        ]),
        h('div', { class: 'rdl-anat-panel' }, [
          h('span', { class: 'rdl-anat-label' }, 'Needs a system decision'),
          h('span', { class: 'rdl-anat-line' }),
          h('span', { class: 'rdl-anat-label' }, 'Still unverified'),
          h('span', { class: 'rdl-anat-line rdl-anat-line--short' }),
        ]),
      ]),
      h('div', { class: 'rdl-anat-phone' }, [
        h('span', { class: 'rdl-anat-phone-note' }, 'the screen under test'),
      ]),
    ]),
  ])

/* ─────────────────────────────────────────────────────────────
   GlassSpecimen - the lab's chrome, rebuilt.

   Not a screenshot: the same four things the lab's own glass needs,
   assembled here so the material can be looked at directly.
     1. something behind it with structure - a blurred flat colour is
        still a flat colour, so the field carries an arc of light
     2. lift, with the saturation kept low - blur alone averages the
        backdrop towards grey, but over-saturating it turns the veil
        purple and it stops reading as neutral
     3. a directional rim - bright at the top-left, dark at the
        bottom-right. A uniform 1px border is the tell of fake glass,
        so there isn't one anywhere in here
     4. a response to the pointer - a specular highlight on the pane
        you're pointing at, rather than a spotlight roaming the page
   ───────────────────────────────────────────────────────────── */
const GlassSpecimen = defineComponent({
  name: 'GlassSpecimen',
  setup() {
    const root = ref(null)
    let frame = 0

    function onMove(e) {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = root.value
        if (!el) return
        el.querySelectorAll('[data-glass]').forEach((pane) => {
          const r = pane.getBoundingClientRect()
          pane.style.setProperty('--px', ((e.clientX - r.left) / r.width) * 100 + '%')
          pane.style.setProperty('--py', ((e.clientY - r.top) / r.height) * 100 + '%')
        })
      })
    }

    onMounted(() => { if (root.value) root.value.addEventListener('pointermove', onMove) })
    onUnmounted(() => {
      if (root.value) root.value.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    })

    const line = (w) => h('span', { class: 'gs-line', style: { width: w } })

    return () =>
      h('div', { class: 'gs', ref: root }, [
        h('div', { class: 'gs-field', 'aria-hidden': 'true' }),

        h('div', { class: 'gs-stage' }, [
          // header island
          h('div', { class: 'gs-pane gs-island', 'data-glass': '' }, [
            h('span', { class: 'gs-mark', 'aria-hidden': 'true' }),
            h('span', { class: 'gs-brand' }, 'Rayo Design Lab'),
            h('span', { class: 'gs-seg' }, [
              h('span', { class: 'gs-seg-opt gs-seg-opt--on' }, 'Prototypes'),
              h('span', { class: 'gs-seg-opt' }, 'Components'),
            ]),
          ]),

          h('div', { class: 'gs-row' }, [
            // sidebar
            h('div', { class: 'gs-pane gs-side', 'data-glass': '' }, [
              h('span', { class: 'gs-side-row gs-side-row--on' }, 'Downloads'),
              h('span', { class: 'gs-side-row' }, 'Sharing'),
              h('span', { class: 'gs-side-row' }, 'Subscriptions'),
            ]),
            // a content card
            h('div', { class: 'gs-pane gs-card', 'data-glass': '' }, [
              h('span', { class: 'gs-card-title' }, 'A pane, not a panel'),
              line('92%'), line('78%'), line('60%'),
            ]),
          ]),
        ]),
      ])
  },
})

// How work gets from one designer's laptop to the whole team.
// Grouped by who does it - the last two steps do themselves, which is
// the part that makes it a shared tool rather than a folder of demos.
const FLOW = [
  { lane: 'Any designer', steps: [
    ['1', 'Clone it',            'GitHub Desktop, once.'],
    ['2', 'Build the idea',      'Describe it to Claude Code; it builds in the real components.'],
    ['3', 'Open a pull request', 'When it’s worth the rest of the team seeing.'],
  ]},
  { lane: 'Me, for now', steps: [
    ['4', 'Review and merge',    'Merging is where a repo can get messy.'],
  ]},
  { lane: 'Automatic', steps: [
    ['5', 'It publishes itself', 'Merging to main deploys the lab.'],
    ['6', 'Everyone has it',     'One internal link, never out of date.'],
  ]},
]

const TeamFlow = () =>
  h('div', { class: 'rdl-fig' }, [
    h('div', { class: 'rdl-flow' },
      FLOW.flatMap((group, gi) => {
        const block = h('div', { class: 'rdl-flow-group', key: group.lane }, [
          h('span', { class: 'rdl-flow-lane' }, group.lane),
          h('div', { class: 'rdl-flow-steps' },
            group.steps.map(([n, label, detail]) =>
              h('div', { class: 'rdl-flow-step', key: n }, [
                h('span', { class: 'rdl-flow-num' }, n),
                h('span', { class: 'rdl-flow-label' }, label),
                h('span', { class: 'rdl-flow-detail' }, detail),
              ])
            )
          ),
        ])
        return gi < FLOW.length - 1
          ? [block, h('span', { class: 'rdl-flow-arrow', key: 'a' + gi, 'aria-hidden': 'true' }, '→')]
          : [block]
      })
    ),
  ])

// The gap → token loop.
const GapLoop = () =>
  h('div', { class: 'rdl-fig' }, [
    h('div', { class: 'rdl-loop' }, [
      h('div', { class: 'rdl-loop-node' }, [
        h('span', { class: 'rdl-loop-step' }, '01'),
        h('span', { class: 'rdl-loop-title' }, 'An exploration hits a gap'),
        h('span', { class: 'rdl-loop-body' }, '“No gradient tokens exist” - on a product whose signature device is a full-bleed gradient hero.'),
      ]),
      h('span', { class: 'rdl-loop-arrow' }, '→'),
      h('div', { class: 'rdl-loop-node' }, [
        h('span', { class: 'rdl-loop-step' }, '02'),
        h('span', { class: 'rdl-loop-title' }, 'It goes on the notes, not in a backlog'),
        h('span', { class: 'rdl-loop-body' }, 'Named under “Needs a system decision”, in the frame, next to the thing that needed it.'),
      ]),
      h('span', { class: 'rdl-loop-arrow' }, '→'),
      h('div', { class: 'rdl-loop-node rdl-loop-node--done' }, [
        h('span', { class: 'rdl-loop-step' }, '03'),
        h('span', { class: 'rdl-loop-title' }, 'The system grows'),
        h('span', { class: 'rdl-loop-body' }, 'Gradient tokens now exist - sampled from the Figma exports, with their uncertainty written down.'),
      ]),
    ]),
  ])


/* ─────────────────────────────────────────────────────────────
   Main case study component
   ───────────────────────────────────────────────────────────── */
export default defineComponent({
  name: 'RayoDesignLabCard',
  setup() {
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    const cardFace = () => [h(LabLoop)]

    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'designlab',
        cardClass: 'rayo-design-lab-card',
        imageSrc: HERO_SRC,
        imageClass: 'rdl-hero-img',
        heroWrapClass: 'rdl-hero-wrap',
        tooltip: 'Turning AI’s nonsense into\nideas worth taking forward 🧪',
        heroSize: 448,
      }, {
        default: () => cardFace(),
        heroOverlay: () => h('div', { class: 'rdl-hero-overlay' }, cardFace()),
        flyContent: () => h('div', { class: 'rdl-fly-overlay' }, cardFace()),

        content: () => [

          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' }, 'From Hit-and-Miss to Ideas We Took Forward'),

            // Deliberately short. Everything this used to spell out - the
            // states, the gambling, “nearly right” - is the Problem section
            // two screens down, where it has the room to land. An intro that
            // makes the same case first only spends the good lines twice.
            full(
              h('p', { class: 'cs-body-text' }, 'Exploring a design properly is expensive, so a feature gets one direction drawn at its happy path, and the states that actually decide it never get drawn at all. AI looked like the fix, and at first it made things worse. So I built the Rayo Design Lab, where AI builds inside our own design system, with the rules for using it written down where it can read them. What comes out is worth arguing over, and some of it we’ve taken forward.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Design and development. I built the lab and ran the sessions to onboard the design team. Work goes in by pull request, and for now I’m the one reviewing and merging (I built it, so I know where it can drift). That moves to the other senior designers as they get comfortable operating it.'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '💡 New ideas land inside the product, not beside it'),
            full(h('p', { class: 'cs-body-text' }, 'The lab knows how a screen is already built (which components it uses, what the page is already doing), so a new idea gets designed into that screen rather than generated as a fresh page of invented parts. That’s the difference between reviewing a change to the product and reviewing something that merely resembles it.')),

            h('h3', { class: 'cs-subsection-title' }, '🗺️ A feature arrives as competing directions, not one frame'),
            full(h('p', { class: 'cs-body-text' }, 'Every exploration puts several working options side by side rather than one frame. Each option stating what it’s betting and what it costs, measured, in the frame, next to the thing it describes.')),

            h('h3', { class: 'cs-subsection-title' }, '⚠️ States we’d have got to last'),
            full(h('p', { class: 'cs-body-text' }, 'Building this way surfaces the states nobody has got to yet. The ones that are neither an error nor progress, and so get drawn last or not at all. More than once they’ve changed the direction we took rather than just how quickly we got there.')),

            h('h3', { class: 'cs-subsection-title' }, '⛹️‍♂️ A playground designers can actually work in'),
            full(h('p', { class: 'cs-body-text' }, 'It’s meant to be somewhere you try things, and the designers do the trying. I ran the sessions that got the team cloning the repo, running it locally and building their own ideas in it. The exploration lives in the shared lab rather than on one laptop. When something is worth sharing they raise a pull request, and once it’s merged everyone has it.')),
          ]),

          HarnessAnatomy(),
          h('p', { class: 'cs-hint' }, 'The anatomy of one exploration'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Problem'),

            h('p', { class: 'cs-body-text' }, 'Two things were true at once, and each made the other worse.'),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Exploration was expensive, so it stayed narrow.'),
              ' Producing screens in Figma was never the problem; prototyping them is. A Figma prototype is a graph of screens, and every state is another screen (loading, empty, error, offline, locked etc.) each one drawn, linked and kept in step by hand. Three directions across five states is fifteen screens to maintain, and a change to one of them is a change to all of them. That cost lands hardest on user testing, where the version you test stays the version you drew first, whichever way the first session went.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'And AI, on its own, made it worse rather than better.'),
              ' Designing with it felt like gambling: write a prompt, spin, mostly miss. The output was always ',
              h('em', null, 'nearly'),
              ' right, which is the worst kind of wrong: a colour close to ours, a component we don’t have, a locked state invented from scratch. You can’t decide anything from a screen that is approximately the product.',
            ]),

            h('p', { class: 'cs-body-text' }, 'It wasn’t the tool, it happened across every AI design tool I tried. Give a capable model nothing of ours to work from and you get something plausible and generic, because that is all the information it has.'),

            h('h2', { class: 'cs-section-title' }, 'It started as the Storybook iOS can’t have'),

            full(
              h('p', { class: 'cs-body-text' }, 'Rayo ships on iOS and Android, and the two platforms aren’t equally stuck. Android has workable routes to a browsable component gallery, iOS doesn’t. SwiftUI previews live inside Xcode, which is not a place a designer goes. I started from the iOS side, which is the half with no answer, and mirrored it in React: I extracted it from the iOS source with Claude Code: colours from the asset catalogue, spacing and radius constants, type sizes and weights, and each component’s variants, states and animation timings from its Swift file.'),

              h('p', { class: 'cs-body-text' }, 'It is a smaller library than a designer expects, and that is worth explaining. Engineering makes something a component when it gets reused; designers make components of almost everything, including modules assembled out of other modules. So a library mirrored from the app is structurally short - a dozen or so real primitives, and the composing happens in the prototype instead. Which turns out to be the right split: what the app guarantees lives in the library, and everything still being decided stays where it can be argued with.'),

              h('p', { class: 'cs-body-text' }, 'That alone would have been useful. It’s also the least interesting thing here: a library is a catalogue, so it tells you which components exist. It doesn’t tell you which of them is the wrong choice for the screen in front of you.'),
            ),

          ]),

          h(BeforeAfterToggle),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'The part that made the AI useful'),

            full(
              h('p', { class: 'cs-body-text' }, 'Each component ships a contract beside it - a Markdown file next to the code, and where they disagree the Markdown wins. Not an API reference. Use when, don’t use when, content rules, anti-patterns.'),

              h('p', { class: 'cs-body-text' }, 'None of that is in the code, and none of it was written down anywhere. It lived in designers’ heads and in review comments. It’s also exactly what an agent needs, because an agent doesn’t hedge and doesn’t ask: given a list of components and no rules, it picks something reasonable-looking and is confidently wrong.'),
            ),

            ContractFile(),
            h('p', { class: 'cs-hint' }, 'One component’s rules, in a file an agent can read'),

            h('h2', { class: 'cs-section-title' }, 'The cold-start test'),

            full(
              h('p', { class: 'cs-body-text' }, 'Documentation nobody can fail is documentation nobody maintains. So the system has a test. Open a fresh agent session in the repo - no history, no hints - and give it one prompt: build a list screen for a piece of locked content. Then audit what comes back. Right components? Tokens throughout? Locked state handled the way the pattern doc describes? Both themes?'),

              h('p', { class: 'cs-body-text' }, [
                'The rule that makes it useful is how you read the result: ',
                h('strong', null, 'every failure is a documentation bug, not a model failure.'),
                ' Don’t rewrite the prompt and don’t add context in the chat - find the missing rule, put it in the contract, run it again.',
              ]),
            ),

            h('h2', { class: 'cs-section-title' }, 'Then it became a place to explore'),

            full(
              h('p', { class: 'cs-body-text' }, 'Once real components existed with rules attached, building a screen stopped being the expensive part, and in code a state is a prop, not another screen. That single difference is what makes exploring several directions across all their states affordable at all. So the lab grew a prototype harness, and the harness is built around the argument rather than the screen.'),

              h('p', { class: 'cs-body-text' }, 'Each exploration has two sets of controls. One switches between the design options; the other switches the state: offline, error, loading, locked. They look different on purpose, because they aren’t the same kind of choice. Any option can be seen in any state, which is the thing a static mockup can’t do.'),
            ),
          ]),

          softImg(IMG_HARNESS, 'The prototype harness: option and condition switchers, the bet panel, and a phone frame', 'cs-cover-img'),
          h('p', { class: 'cs-hint' }, 'An example of the Design Lab’s prototype harness'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, 'Each option carries a bet: what it’s good for, and what it costs, written next to it. Not a description of the layout - an argument, with the trade-off named and measured where it can be. Rejected options keep their place, with the reason they lost written next to them. It is much easier to agree that something is too loud once you can see it, and easier still not to have the same argument again in three months.'),
            ),

            h(BetSwitcher),
            h(InteractiveTag, { hint: 'Click to see the argument for each bet', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, 'Every prototype also carries two lists underneath it. The first is called Needs a system decision, and it collects the gaps that exploration ran into. The second is Still unverified, and it lists everything in the screen we made up: invented content, guessed values, placeholder copy. One prototype says outright that a number in it is invented and has to be replaced before anyone sees it, because that number is the whole thing a test of that screen would measure. Both lists are part of the work rather than an appendix to it. A prototype that hides what it guessed is worse than one that stops and asks.'),

              h('p', { class: 'cs-body-text' }, 'Which is the opposite of where I started. When I began, designing with AI was a bet I couldn’t see the odds on. Now every option has to state its own.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'The states we’d have got to last'),

            full(h('p', { class: 'cs-body-text' }, 'This is where it stopped being a faster way to do the same work. Downloading a podcast has a state most download UIs skip: the listener taps download while on mobile data, with mobile-data downloads switched off, and nothing happens. The control ended up with six states rather than the obvious four.')),


            h(StateWalk),
            h(InteractiveTag, { hint: 'Step through the six states', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, 'The other was storage: how much room downloads are taking and how much is left, at the top of the screen. Obvious once it’s there, and a list of episodes cannot answer the question everyone actually has before a flight. Neither is decoration, and the second one carried weight in where the feature landed.'),
            ),

          ]),

          softImg(IMG_STORAGE, 'A downloads exploration in the lab, with a storage meter at the top of the screen showing space used and space left', 'cs-cover-img'),
          h('p', { class: 'cs-hint' }, 'Example of a great suggestion that we kept'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            full(

              h('p', { class: 'cs-body-text' }, [
                'I don’t read that as the model being clever. The house rules in the repo say build the unhappy states, and the design doc says a screen isn’t finished until loading, empty, error and locked all exist. What happened is that a rule I’d written got applied further than I’d applied it myself - because state exploration is tedious, so humans do it last and under time pressure, which is exactly why unhappy states ship broken. ',
                h('strong', null, 'Write the intent down properly and it holds you to it too.'),
              ]),
            ),

            h('h2', { class: 'cs-section-title' }, 'It finds what the system is missing'),

            full(
              h('p', { class: 'cs-body-text' }, 'Building real things in a design system is the fastest way to discover what it doesn’t have, and the gap lists turned out to be a channel rather than a complaint box.'),
            ),
          ]),

          GapLoop(),
          h('p', { class: 'cs-hint' }, 'A gap list is a feedback channel' ),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, [
                'The audit file that started as a record of what was inferred from the Swift now runs to twelve sections, and the later ones are all things found by using the system rather than reading it: no motion, elevation or blur primitives; a secondary text colour that doesn’t survive being placed on anything tinted; a button with no nav-bar size; a selected state that is a colour and nothing else, still open. ',
                h('strong', null, 'Each one is a question the design system now has to answer, raised by something real rather than in the abstract.'),
              ]),
            ),

            h('h2', { class: 'cs-section-title' }, 'Designing the lab itself'),

            full(
              h('p', { class: 'cs-body-text' }, 'I should admit a bias here. I like the way Apple’s software feels - Liquid Glass, the spatial UI direction, that sense of something modern and slightly ahead of itself - and I wanted this to feel like that rather than like a documentation site. It’s where the name came from: a lab is somewhere you try things, not somewhere you file them.'),

              h('p', { class: 'cs-body-text' }, 'There are two sections. Prototypes is what people open the lab for, so it’s the front door; Components sits one click away in the top bar. Moving between prototypes doesn’t send you back to an index either. You go straight from one to the next, which is what makes comparing them quick. And ⌘K searches everything at once. It runs locally, with no model behind it, and the panel says so, because a search box shaped like a prompt that could only match text would be lying about what the tool does.'),
            ),

            full(
              h('p', { class: 'cs-body-text' }, [
                'The one rule the whole thing is built on: ',
                h('strong', null, 'the shell is transparent, the frame is not.'),
                ' The lab’s own chrome is deliberately unlike Rayo - glass over a slow wash of light, permanently dark - and it stops dead at the edge of the phone frame. Inside, the screen under test sits on a real Rayo surface and is judged against it, never through a veil. Light and dark belong to the screen being reviewed, not to the tool, so the appearance switch sits above the frame rather than in the header. That rule is what stops a nicely-designed tool contaminating the thing it’s supposed to help you judge.',
              ]),
            ),
          ]),

          softImg(IMG_SEARCH,
            'The lab’s command palette open over a blurred background: a search field reading “Jump to a prototype, a component, a state”, results grouped under Prototypes and Components, and a footer reading “Search is local - no model, no network”',
            'cs-cover-img'),
          h('p', { class: 'cs-hint' }, '⌘K across prototypes and components, with the panel saying search is local'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Getting the team into it'),

            full(
              h('p', { class: 'cs-body-text' }, 'A prototyping tool one designer uses is a hobby. The work that made it a team tool was the unglamorous half. The repo is written for designers, not engineers: install Node, clone it with GitHub Desktop, run it locally, and let Claude Code handle the git commands. I ran the sessions that walked the team through all of it, so they build their own ideas rather than asking me to.'),

              h('p', { class: 'cs-body-text' }, 'The pull request is the publishing step rather than a request: when something is worth the rest of the team seeing, it goes up, and once it’s merged everyone’s copy has it. I’m the one merging for now, and not because I’m checking the design. Whoever built it is better placed to judge that. It’s because merging is where a repo can get into a mess, and I’m the only designer on the team who’d be comfortable untangling it. That’s a reason to hold the door for a while, not to keep holding it.'),
            ),

            full(
              h('p', { class: 'cs-body-text' }, 'And it deploys itself - merging to main publishes the lab internally, so an exploration is a link you send in Slack rather than an export, and the link is never out of date because it is the repo.'),
            ),

          ]),

          TeamFlow(),
          h('p', { class: 'cs-hint' }, 'From one laptop to the whole team'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            full(
              h('p', { class: 'cs-body-text' }, 'It doesn’t have to stay a design-team tool, and that’s the next thing I want to test. Anyone who can describe a screen can now get a real one built from the real system: an engineer sketching a feature they’ve been thinking about, a product manager putting an idea in front of people instead of describing it. The platform is open to them; whether they take it up is the interesting question.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'What’s next'),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Production fidelity and handoff annotations.'),
              ' The UI is close to the app but not pixel-perfect. Until that pass is done and the annotations exist, this is a system for exploring and deciding internally, not for handing over.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Android.'),
              ' Everything in the lab mirrors the iOS Swift components, which is half the product. Feeding it the Android side would make it the whole of it.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Prototypes built for real user testing.'),
              ' Everything so far has been for internal decisions: arguing a direction out among ourselves. The next step is somewhere in the lab built for putting a prototype in front of actual listeners. The form isn’t decided yet, but a prototype made of the real system, with its states already built, is most of the way to being testable already.',
            ]),

            h('h2', { class: 'cs-section-title' }, 'Outcome'),

            h('p', { class: 'cs-body-text' }, [
              'The team works in it, and what changed isn’t the speed. ',
              h('strong', null, 'We can see many ways of doing the same thing side by side, each with its argument and its cost attached, before anyone commits.'),
              ' It’s an ideation tool more than a decision tool, and that’s the honest description: the downloads work ran through three destinations for where downloaded episodes should live, and the one we took forward won on grounds the exploration made visible - separating managing saved content from managing downloaded content, and being the only place that could show storage.',
            ]),

            h('p', { class: 'cs-body-text' }, 'It isn’t finished, and the list above is honest about that. The team also isn’t yet at the point where designers push pull requests for UI changes, which is a question about how design and engineering work together rather than about the repo.'),

            h('p', { class: 'cs-body-text' }, [
              'What I’d take from it is narrower than “AI makes design faster”, and more useful. ',
              h('strong', null, 'The models were never the constraint. The constraint was that they had nothing of ours to build with'),
              ' - no tokens they could reach, no components that were really ours, and no written rules about when each one is the wrong choice. Give an agent the actual system and the rules that go with it, and the work it produces is something you can decide from.',
            ]),

            h('p', { class: 'cs-closing' }, 'It didn’t make us faster. It let us explore more of the options before we chose.'),
          ]),
        ],
      })
  },
})
