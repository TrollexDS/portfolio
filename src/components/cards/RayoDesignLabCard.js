import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { useInView } from '../../composables/useInView.js'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'

/* ─────────────────────────────────────────────────────────────
   Assets - real screenshots where the lab itself is the subject,
   everything else is drawn.

   Every lab capture comes as a light/dark pair (`…-dark`), captured with
   the lab's own theme switched, and the page's theme picks which shows.
   The three "before" shots are the old chrome, which only had a dark
   mode, so they are the same in both. Prototype screens shown: Station
   handover and Offline listening, both cleared by Alex (Oct 2026).
   ───────────────────────────────────────────────────────────── */
const HERO_SRC     = '/src/assets/images/rayo-design-lab/rdl-hero.svg'
const IMG_SKILLS   = '/src/assets/images/rayo-design-lab/rayo-design-lab-skills.png'   // the Guide's Skills chapter: the table of commands
const IMG_SKILLS_D = '/src/assets/images/rayo-design-lab/rayo-design-lab-skills-dark.png'
const IMG_KEPT     = '/src/assets/images/rayo-design-lab/rayo-design-lab-offline-b.png'   // Offline listening, direction B: the show page with one toggle, the mini player paused
const IMG_KEPT_D   = '/src/assets/images/rayo-design-lab/rayo-design-lab-offline-b-dark.png'
const VID_PAGES    = '/src/assets/videos/rayo-design-lab-pages.mp4'
const VID_PAGES_D  = '/src/assets/videos/rayo-design-lab-pages-dark.mp4'   // For you: iOS 26 → iOS 18 → Android → dark → Danish → iOS 26 → English → light, looping
const IMG_HARNESS_V2     = '/src/assets/images/rayo-design-lab/rayo-design-lab-harness-v2.png'
const IMG_HARNESS_V2_D   = '/src/assets/images/rayo-design-lab/rayo-design-lab-harness-v2-dark.png'
const IMG_SKETCHES       = '/src/assets/images/rayo-design-lab/rayo-design-lab-sketches.png'
const IMG_SKETCHES_D     = '/src/assets/images/rayo-design-lab/rayo-design-lab-sketches-dark.png'
const IMG_GUIDE_BEFORE   = '/src/assets/images/rayo-design-lab/rayo-design-lab-guide-before.png'
const IMG_GUIDE_AFTER    = '/src/assets/images/rayo-design-lab/rayo-design-lab-guide-after.png'
const IMG_GUIDE_AFTER_D  = '/src/assets/images/rayo-design-lab/rayo-design-lab-guide-after-dark.png'
const IMG_OPTIONS_BEFORE = '/src/assets/images/rayo-design-lab/rayo-design-lab-options-before.png'
const VID_OPTIONS_AFTER  = '/src/assets/videos/rayo-design-lab-options-after.mp4'   // iPhone → iPad portrait → landscape → iPhone, looping
const VID_OPTIONS_AFTER_D = '/src/assets/videos/rayo-design-lab-options-after-dark.mp4'

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


const isClip = src => /\.(mp4|webm|mov)$/i.test(src)

/** One piece of media: a looping clip for a video source, an image otherwise. */
const mediaEl = (src, alt, cls) =>
  isClip(src)
    ? h('video', { class: cls, src, autoplay: true, muted: true, loop: true, playsinline: true, 'aria-label': alt, key: src })
    : h('img',   { class: cls, src, alt, loading: 'lazy', key: src })

/**
 * themed - the same figure captured with the lab in light and in dark, in one
 * cover-image slot. Both are rendered; the page's `data-theme` decides which
 * one shows (CSS, `.rdl-themed`), so switching the portfolio's theme switches
 * the lab in every screenshot and clip with it. The wrapper carries the
 * cover-image class, so it gets the frame and the scroll reveal.
 */
const themed = (light, dark, alt, cls = 'cs-cover-img') =>
  h('div', { class: cls + ' rdl-themed' }, [
    mediaEl(light, alt, 'rdl-themed-light'),
    mediaEl(dark,  alt, 'rdl-themed-dark'),
  ])


/* ─────────────────────────────────────────────────────────────
   LabLoop - the card face.

   One pass of the loop the case study describes, with the two things
   that make the lab different from a chat window kept in: the answer
   arrives as options side by side, not one at a time, and the second
   prompt turns up the states nobody had designed yet.

   The lab boots like the app it builds - the name is the splash on the
   phone's own screen - then a prompt is typed and worked on. The answer
   starts with the design system: the component list is read, the useful
   ones light up, the screen is built from them, and where the system has
   a gap a new component is added to it. Then three prototypes fan out,
   one is kept, a follow-up prompt is asked of it, and its states branch
   off the frame. The pass ends there: the state branch is the part worth
   holding on.
   ───────────────────────────────────────────────────────────── */
const WORD    = 'Rayo Design Lab'
const PROMPT  = 'Add download function in the Rayo app'
const PROMPT2 = 'What if the download fails?'
const TYPE_MS = 46

const TIMELINE = [
  [0,     { phase: 'boot'     }],   // the lab starts: name on the phone's screen
  [1100,  { phase: 'clear'    }],   // splash leaves; an empty frame
  [1700,  { phase: 'prompt',  type: PROMPT }],
  [3900,  { phase: 'loading'  }],
  [4700,  { phase: 'library'  }],   // the component list, read top to bottom
  [6100,  { phase: 'select'   }],   // the useful ones light up
  [6800,  { phase: 'assemble' }],   // the screen is built from them
  [8000,  { phase: 'new'      }],   // and one component the system didn't have yet
  [9800,  { phase: 'fanout'   }],   // three answers, side by side
  [12100, { phase: 'pick'     }],   // the middle one is kept
  [13100, { phase: 'prompt2', type: PROMPT2 }],
  [14900, { phase: 'loading2' }],
  [16000, { phase: 'branch'   }],   // its states branch off the frame
  [18500, { phase: 'rest'     }],
  [19200, { phase: 'done'     }],   // and it all goes, leaving the frame empty
]
const LOOP_MS = 20500

/* The component list the lab reads first - the Rayo iOS design system,
   as the lab sees it. `use` is whether this screen needs it. The last
   one is not in the list yet: it is the gap the prompt turns up. */
const LIBRARY = [
  { id: 'nowplaying', name: 'Now playing',  use: true  },
  { id: 'station',    name: 'Station row',  use: true  },
  { id: 'hero',       name: 'Artwork hero', use: true  },
  { id: 'tiles',      name: 'Show tiles',   use: true  },
  { id: 'tabbar',     name: 'Tab bar',      use: true  },
  { id: 'search',     name: 'Search bar',   use: false },
]
const NEW_PART = 'Download toggle'

const ICON_CHECK = 'M5 12.5l4.2 4.2L19 7'

/* The three answers to the first prompt, and the kept one after the
   second. Each is an arrangement of Rayo-shaped parts: a now-playing
   hero, a station row, a download toggle, a grid of downloaded shows. */
const SCREENS = [
  ['hero', 'banner', 'row', 'row'],            // A: a download call-out under the artwork
  ['row', 'toggle', 'row', 'row'],             // B: one toggle on the show page (kept)
  ['tiles', 'row', 'row'],                     // C: a grid of what you've downloaded
]
const SCREEN_BUILD  = ['row', 'row', 'row']                 // B, before the system had a toggle
const SCREEN_FAILED = ['row', 'toggle', 'alert', 'row']

/* The states the second prompt turns up. Same tones the lab uses. */
const LOOP_STATES = [
  { id: 'loading', name: 'Loading',       tone: 'info'    },
  { id: 'failed',  name: 'Failed',        tone: 'error'   },
  { id: 'offline', name: 'No connection', tone: 'warning' },
]

const LabLoop = defineComponent({
  name: 'LabLoop',
  setup() {
    const phase = ref('boot')
    const typed = ref('')
    const root  = ref(null)

    let timers = []
    let typer  = null

    function stopLoop() {
      timers.forEach(clearTimeout); timers = []
      if (typer) { clearInterval(typer); typer = null }
    }

    // The loop only runs while the face is on (or near) screen and the tab
    // is visible; it stops off-screen and starts a fresh pass on return.
    let animate = false     // false under reduced motion
    let inView  = false
    useInView(root, { rootMargin: '120px' }, v => {
      inView = v
      if (!animate) return
      stopLoop()
      if (v) run()
    })

    function typeOut(text) {
      let i = 0
      typed.value = ''
      if (typer) clearInterval(typer)
      typer = setInterval(() => {
        i += 1
        typed.value = text.slice(0, i)
        if (i >= text.length) { clearInterval(typer); typer = null }
      }, TYPE_MS)
    }

    function run() {
      phase.value = 'boot'
      typed.value = ''
      TIMELINE.forEach(([at, change]) => {
        timers.push(setTimeout(() => {
          phase.value = change.phase
          if (change.type) typeOut(change.type)
        }, at))
      })
      timers.push(setTimeout(run, LOOP_MS))
    }

    onMounted(() => {
      const still = typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Under reduced motion the face holds on the last beat of the pass.
      if (still) { phase.value = 'branch'; typed.value = PROMPT2; return }
      animate = true
      if (inView) run()
    })
    onUnmounted(stopLoop)

    const svg = (d, cls) =>
      h('svg', { class: cls, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d, stroke: 'currentColor', 'stroke-width': '2.2',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ])

    const part = (kind, i) => {
      if (kind === 'hero')   return h('span', { class: 'rdlv-hero', key: 'hero' + i })
      if (kind === 'banner') return h('span', { class: 'rdlv-banner', key: 'banner' + i })
      if (kind === 'tiles')  return h('span', { class: 'rdlv-tiles', key: 'tiles' + i }, [h('i'), h('i'), h('i'), h('i')])
      if (kind === 'toggle') return h('span', { class: 'rdlv-toggle', key: 'toggle' + i }, [h('span', { class: 'rdlv-tg-l' }), h('span', { class: 'rdlv-tg-s' })])
      if (kind === 'alert')  return h('span', { class: 'rdlv-alert', key: 'alert' + i }, [h('i'), h('span', { class: 'rdlv-lines' }, [h('span', { class: 'rdlv-l1' }), h('span', { class: 'rdlv-l2' })])])
      return h('span', { class: 'rdlv-row', key: 'row' + i }, [
        h('span', { class: 'rdlv-thumb' }),
        h('span', { class: 'rdlv-lines' }, [h('span', { class: 'rdlv-l1' }), h('span', { class: 'rdlv-l2' })]),
      ])
    }

    // The kept phone is built from the system first, gets the new part,
    // and shows the failed state once the branch is drawn.
    const BUILDING     = new Set(['library', 'select', 'assemble'])
    const AFTER_BRANCH = new Set(['branch', 'rest', 'done'])
    const screenFor = (slot) => {
      if (slot !== 1) return SCREENS[slot]
      if (BUILDING.has(phase.value)) return SCREEN_BUILD
      if (AFTER_BRANCH.has(phase.value)) return SCREEN_FAILED
      return SCREENS[slot]
    }

    const phone = (slot) =>
      h('div', { class: 'rdlv-phone', 'data-slot': slot, key: 'phone' + slot }, [
        slot === 1
          ? h('div', { class: 'rdlv-boot' }, [
              h('span', { class: 'rdlv-boot-mark' }),
              h('span', { class: 'rdlv-boot-word' }, WORD),
            ])
          : null,
        h('span', { class: 'rdlv-notch' }),
        h('div', { class: 'rdlv-screen' }, [
          h('span', { class: 'rdlv-title' }),
          ...screenFor(slot).map((kind, i) => part(kind, i)),
        ]),
        h('span', { class: 'rdlv-mini' }, [h('i', { class: 'rdlv-mini-art' }), h('i', { class: 'rdlv-mini-line' }), h('i', { class: 'rdlv-mini-play' })]),
        h('span', { class: 'rdlv-tabs' }, [h('i'), h('i'), h('i'), h('i')]),
        slot === 1 ? h('span', { class: 'rdlv-kept' }, [svg(ICON_CHECK, 'rdlv-kept-icon')]) : null,
      ])

    return () =>
      h('div', { class: 'rdlv', ref: root, 'data-phase': phase.value, 'aria-hidden': 'true' }, [
        h('div', { class: 'rdlv-wash' }),

        h('div', { class: 'rdlv-prompt' }, [
          h('span', { class: 'rdlv-spark' }),
          h('span', { class: 'rdlv-text' }, typed.value),
          h('span', { class: 'rdlv-caret' }),
          h('span', { class: 'rdlv-load' }),
        ]),

        // the system, read before anything is drawn
        h('div', { class: 'rdlv-lib' }, [
          h('span', { class: 'rdlv-lib-head' }, 'Components'),
          h('span', { class: 'rdlv-lib-scan' }),
          ...LIBRARY.map((c, i) =>
            h('span', {
              class: ['rdlv-chip', c.use ? 'rdlv-chip--use' : ''].filter(Boolean).join(' '),
              style: { '--i': i },
              key: c.id,
            }, [h('i', { class: 'rdlv-chip-ico rdlv-chip-ico--' + c.id }), h('span', { class: 'rdlv-chip-name' }, c.name)])
          ),
          h('span', { class: 'rdlv-chip rdlv-chip--use rdlv-chip--new', style: { '--i': LIBRARY.length }, key: 'new' }, [
            h('i', { class: 'rdlv-chip-ico rdlv-chip-ico--toggle' }),
            h('span', { class: 'rdlv-chip-name' }, NEW_PART),
            h('span', { class: 'rdlv-chip-tag' }, 'New'),
          ]),
        ]),

        // the three answers: the kept one is in the middle, so the
        // frame you watched boot is the one that stays
        h('div', { class: 'rdlv-stage' }, [phone(0), phone(1), phone(2)]),

        // the states, branching off the kept frame
        h('div', { class: 'rdlv-states' }, [
          h('span', { class: 'rdlv-rail' }),
          ...LOOP_STATES.map((s, i) =>
            h('span', {
              class: ['rdlv-state', 'rdlv-state--' + s.tone, s.id === 'failed' ? 'rdlv-state--on' : ''].filter(Boolean).join(' '),
              style: { '--i': i },
              key: s.id,
            }, [h('i', { class: 'rdlv-state-dot' }), h('span', { class: 'rdlv-state-name' }, s.name)])
          ),
        ]),

        // the name, quietly, for the whole pass
        h('span', { class: 'rdlv-label' }, WORD),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   BeforeAfterToggle - the lab before a change against the lab after it.

   Same pattern and the same `ba-*` styles as the Rayo Design System
   case study: an Old/New switch, with the outgoing image sliding out
   as the incoming one slides in from the opposite side. Takes its two
   images as props, so one component serves every before/after here.
   ───────────────────────────────────────────────────────────── */
const BeforeAfterToggle = defineComponent({
  name: 'BeforeAfterToggle',
  props: {
    before:      { type: String, required: true },
    after:       { type: String, required: true },
    beforeAlt:   { type: String, default: '' },
    afterAlt:    { type: String, default: '' },
    beforeLabel: { type: String, default: 'Old' },
    afterLabel:  { type: String, default: 'New' },
    /** The same side captured with the lab in dark; shown when the page is. */
    beforeDark:  { type: String, default: '' },
    afterDark:   { type: String, default: '' },
    /** width / height of both sides, so the frame has its height before the
     *  incoming image or clip has loaded - otherwise the first toggle
     *  collapses the frame for a frame and the page jumps. */
    ratio:       { type: String, default: '1600 / 1039' },
  },
  setup(props) {
    // Preload the images so the browser has decoded them before the first toggle
    ;[props.after, props.before, props.afterDark, props.beforeDark]
      .filter(src => src && !isClip(src)).forEach(src => { const i = new Image(); i.src = src })

    const darkOf = src => (src === props.after ? props.afterDark : src === props.before ? props.beforeDark : '')

    // One side can be a short looping clip, and either side can come as a
    // light/dark pair; the page's theme picks (CSS, `.rdl-themed`).
    const media = (src, alt, cls) => {
      const dark = darkOf(src)
      return dark
        ? h('div', { class: cls + ' rdl-themed', key: src }, [mediaEl(src, alt, 'rdl-themed-light'), mediaEl(dark, alt, 'rdl-themed-dark')])
        : mediaEl(src, alt, cls)
    }

    const showNew    = ref(true)
    const animating  = ref(false)
    const enterClass = ref('')
    const exitClass  = ref('')
    const exitSrc    = ref('')

    function toggle() {
      if (animating.value) return
      const goingToNew = !showNew.value

      // Capture the image that's leaving before we flip state
      exitSrc.value    = showNew.value ? props.after : props.before
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

    return () => h('div', { class: 'ba-wrap ba-wrap--fixed', style: { '--ba-ratio': props.ratio } }, [
      h('div', { class: 'ba-img-clip' }, [
        animating.value && exitSrc.value
          ? media(exitSrc.value, '', ['ba-img', 'ba-img--abs', exitClass.value].join(' '))
          : null,
        media(
          showNew.value ? props.after : props.before,
          showNew.value ? props.afterAlt : props.beforeAlt,
          ['ba-img', animating.value ? enterClass.value : ''].filter(Boolean).join(' '),
        ),
      ]),
      h('div', { class: 'ba-toggle', onClick: toggle }, [
        h('span', { class: ['ba-label', !showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, props.beforeLabel),
        h('div', { class: ['ba-track', showNew.value ? 'ba-track--on' : ''].filter(Boolean).join(' ') }, [
          h('div', { class: 'ba-thumb' }),
        ]),
        h('span', { class: ['ba-label', showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, props.afterLabel),
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
      h('div', { class: 'rdl-lab cs-reveal' }, [
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
      h('div', { class: 'rdl-lab cs-reveal' }, [
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
  h('div', { class: 'rdl-file cs-reveal' }, [
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
  h('div', { class: 'rdl-fig rdl-fig--cover cs-reveal' }, [
    h('div', { class: 'rdl-anat' }, [

      // the options bar over the frame, as the lab draws it
      h('div', { class: 'rdl-anat-bar' }, [
        h('span', { class: 'rdl-anat-help', 'aria-hidden': 'true' }, '?'),
        h('span', { class: 'rdl-anat-chip rdl-anat-chip--on' }, [
          h('span', { class: 'rdl-anat-chip-key' }, 'A'),
          h('span', { class: 'rdl-anat-chip-sep' }, '·'),
          'Which design',
          h('span', { class: 'rdl-anat-chev', 'aria-hidden': 'true' }),
        ]),
        h('span', { class: 'rdl-anat-chip' }, [
          h('span', { class: 'rdl-anat-chip-name' }, 'State'),
          'What condition',
          h('span', { class: 'rdl-anat-chev', 'aria-hidden': 'true' }),
        ]),
        h('span', { class: 'rdl-anat-view', 'aria-hidden': 'true' }, [
          h('i', { class: 'rdl-anat-ico rdl-anat-ico--phone' }),
          h('i', { class: 'rdl-anat-ico rdl-anat-ico--sun' }),
        ]),
      ]),

      // the stage: the option menu open over the frame, the bet beside the list
      h('div', { class: 'rdl-anat-stage' }, [
        h('div', { class: 'rdl-anat-menu' }, [
          h('div', { class: 'rdl-anat-menu-list' }, [
            h('span', { class: 'rdl-anat-label' }, 'Option'),
            h('span', { class: 'rdl-anat-item rdl-anat-item--on' }, 'A'),
            h('span', { class: 'rdl-anat-item' }, 'B'),
            h('span', { class: 'rdl-anat-item' }, 'C'),
            h('span', { class: 'rdl-anat-item' }, 'D'),
          ]),
          h('div', { class: 'rdl-anat-menu-bet' }, [
            h('span', { class: 'rdl-anat-label rdl-anat-label--bet' }, 'The bet'),
            h('span', { class: 'rdl-anat-line' }),
            h('span', { class: 'rdl-anat-line' }),
            h('span', { class: 'rdl-anat-line rdl-anat-line--short' }),
          ]),
        ]),
        h('div', { class: 'rdl-anat-phone' }, [
          h('span', { class: 'rdl-anat-phone-note' }, 'the screen under test'),
        ]),
      ]),

      // the notes, under About
      h('div', { class: 'rdl-anat-notes' }, [
        h('div', { class: 'rdl-anat-note' }, [
          h('span', { class: 'rdl-anat-label' }, 'Needs a system decision'),
          h('span', { class: 'rdl-anat-line' }),
          h('span', { class: 'rdl-anat-line rdl-anat-line--short' }),
        ]),
        h('div', { class: 'rdl-anat-note' }, [
          h('span', { class: 'rdl-anat-label' }, 'Still unverified'),
          h('span', { class: 'rdl-anat-line rdl-anat-line--short' }),
        ]),
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
// Grouped by who does it. No step has my name on it: review is any other
// designer's, and the last two steps do themselves.
const FLOW = [
  { lane: 'Any designer', steps: [
    ['1', 'Set up from the Guide', 'No Terminal or git experience needed.'],
    ['2', 'Start a branch',        'Your own space. Nothing reaches anyone else yet.'],
    ['3', 'Build with Claude',     'Brief it like another designer; it builds in the real components.'],
    ['4', 'Open a pull request',   'When it’s worth the rest of the team seeing.'],
  ]},
  { lane: 'Another designer', steps: [
    ['5', 'Review and approve',    'One approval merges an exploration. Only the foundations need mine.'],
  ]},
  { lane: 'Automatic', steps: [
    ['6', 'It publishes itself',   'A build check, then merging to main deploys the lab.'],
    ['7', 'Everyone has it',       'One internal link, never out of date.'],
  ]},
]

const TeamFlow = () =>
  h('div', { class: 'rdl-fig cs-reveal' }, [
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
  h('div', { class: 'rdl-fig cs-reveal' }, [
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
        tooltip: 'Prototyping with AI,\nfor designers who don’t code 🧑‍🎨',
        heroSize: 448,
      }, {
        default: () => cardFace(),
        heroOverlay: () => h('div', { class: 'rdl-hero-overlay' }, cardFace()),
        flyContent: () => h('div', { class: 'rdl-fly-overlay' }, cardFace()),

        content: () => [

          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' }, 'The Platform That Lets Our Whole Design Team Prototype with AI'),

            // Short on purpose: the three problems get their room in Problem,
            // two screens down. The intro only has to say what was built and
            // what it changed.
            full(
              h('p', { class: 'cs-body-text' }, 'Exploring a design properly is expensive, so a feature gets one direction drawn at its happy path, and the states that actually decide it never get drawn at all. AI looked like the fix, and at first it made things worse: nearly right, which is the worst kind of wrong. And even once I’d got it working, it only worked for me.'),

              h('p', { class: 'cs-body-text' }, 'So I built the Rayo Design Lab: a platform where AI builds inside our own design system, with the rules written where it can read them, and where any designer - no Terminal, no git, no code - can brief it, see several directions side by side in every state, and share the result. The team works in it now. A prototype that took days to draw and link in Figma is a brief and a conversation, and the time that frees goes on looking at more ideas before we choose.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Design and development. I built the lab, designed the workflow and the Guide that get the team into it, and set up how work is checked and reviewed. I own the foundations every prototype sits on; the explorations are the team’s.'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '⛹️‍♂️ The whole team can build with AI, not just the person who set it up'),
            full(h('p', { class: 'cs-body-text' }, 'Every designer on the team has set up from the Guide alone, without a session with me. The whole workflow is four commands, each with a button that opens Claude with the prompt already typed, and a button that messages me on Teams if it goes wrong.')),

            h('h3', { class: 'cs-subsection-title' }, '⚡ Days of linking screens in Figma become a brief'),
            full(h('p', { class: 'cs-body-text' }, 'A clickable prototype with its states used to mean days of drawing and linking screens, and re-linking them after every change. Now it’s a sentence or a pasted brief, a couple of questions, and a working prototype in the real components, in code where a state is a prop rather than another screen.')),

            h('h3', { class: 'cs-subsection-title' }, '🗺️ A feature arrives as competing directions, not one frame'),
            full(h('p', { class: 'cs-body-text' }, 'Every exploration starts as three directions sketched side by side - one close to today’s app, two bold - before anything is built out. Each option states what it’s betting and what it costs, in the frame, next to the thing it describes.')),

            h('h3', { class: 'cs-subsection-title' }, '💡 New ideas land inside the product, not beside it'),
            full(h('p', { class: 'cs-body-text' }, 'The lab keeps the app’s own screens as they actually are, so a new idea gets designed into the real screen rather than generated as a fresh page of invented parts. That’s the difference between reviewing a change to the product and reviewing something that merely resembles it.')),

            h('h3', { class: 'cs-subsection-title' }, '⚠️ States we’d have got to last'),
            full(h('p', { class: 'cs-body-text' }, 'Building this way surfaces the states nobody has got to yet, the ones that are neither an error nor progress. More than once they’ve changed the direction we took rather than just how quickly we got there.')),
          ]),

          HarnessAnatomy(),
          h('p', { class: 'cs-hint' }, 'The anatomy of one exploration'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Problem'),

            h('p', { class: 'cs-body-text' }, 'Three things were true at once, and each made the others worse.'),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Exploration was expensive, so it stayed narrow.'),
              ' Drawing screens in Figma was never the problem; prototyping them is. Every state is another screen - loading, empty, error, offline, locked - drawn, linked and kept in step by hand. Three directions across five states is fifteen screens, and a change to one is a change to all. So a feature got one direction, and the argument happened over a frame that couldn’t answer the question.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'AI, on its own, made it worse.'),
              ' Write a prompt, spin, mostly miss. The output was always ',
              h('em', null, 'nearly'),
              ' right - a colour close to ours, a component we don’t have, a locked state invented from scratch - and you can’t decide anything from a screen that is approximately the product. It wasn’t the tool. Give a capable model nothing of ours to work from and you get something plausible and generic.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'And when I did get it working, it worked for one person.'),
              ' It took a repo, a terminal, git and a feel for how an agent reads a codebase, and none of that is a designer’s job. AI that makes one designer faster while the other six wait for them isn’t a gain for a team; it’s a bottleneck with a demo. The first two problems are about what the AI has to work with. The third is about who gets to use it, and it turned out to be most of the work.',
            ]),

            h('h2', { class: 'cs-section-title' }, 'The foundation: something true for the AI to build with'),

            full(
              h('p', { class: 'cs-body-text' }, 'The first job was giving the agent our system instead of its guesses. iOS has no browsable component gallery - SwiftUI previews live in Xcode, which is not a place a designer goes - so I mirrored the iOS design system in React, extracted from the Swift source with Claude Code: colours, spacing, type, and each component’s variants, states and animation timings.'),

              h('p', { class: 'cs-body-text' }, 'A library tells an agent which components exist, not which one is the wrong choice for the screen in front of it. So each component ships a contract: a Markdown file beside the code - use when, don’t use when, content rules, anti-patterns - and where the two disagree, the Markdown wins. None of that was written down before. It lived in designers’ heads, and it’s exactly what an agent needs, because an agent doesn’t hedge and doesn’t ask.'),
            ),

            ContractFile(),
            h('p', { class: 'cs-hint' }, 'One component’s rules, in a file an agent can read'),

            full(
              h('p', { class: 'cs-body-text' }, [
                'The system has a test. Open a fresh agent session with no history, give it one prompt - a list screen for locked content - and audit what comes back. Right components? Tokens throughout? Both themes? ',
                h('strong', null, 'Every failure is a documentation bug, not a model failure:'),
                ' find the missing rule, write it into the contract, run it again. The same rule turned out to apply to people, and it comes back later.',
              ]),

              h('p', { class: 'cs-body-text' }, 'The last piece was Pages. Once the team was exploring, the screens their ideas sat on drifted: every prototype rebuilt the existing screen first, and every rebuild lost something. Five ended up with a nav bar 20 points taller than the app’s, because there was no correct version to copy. So the lab grew Production: every screen in the app rebuilt as it is, on iPhone, iPad and Android, its source named, and not allowed to improve the screen even where the screen is wrong. A prototype now starts from a Page, so what differs between directions is the idea, not the screen underneath.'),
            ),
          ]),

          themed(VID_PAGES, VID_PAGES_D, 'The For you tab as a Page in the lab, switched through its faces: iOS 26, iOS 18, Android, then dark appearance and the Danish market, and back to iOS 26 in English, light'),
          h('p', { class: 'cs-hint' }, 'The For you tab as a Page: one truth, every face - iOS 26, iOS 18, Android, light and dark, and the Danish market - and the rest of the app in the sidebar'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Then it became a place to explore'),

            full(
              h('p', { class: 'cs-body-text' }, 'In code a state is a prop, not another screen, and that single difference is what makes exploring several directions in all their states affordable. So the lab grew a harness, built around the argument rather than the screen. Each exploration has two sets of controls: one switches the design option, the other the state - offline, error, loading, locked. Any option can be seen in any state, which a static mockup can’t do, and Compare puts them all on screen at once.'),

              ),
          ]),

          themed(IMG_HARNESS_V2, IMG_HARNESS_V2_D, 'The prototype harness: the options bar over the phone frame, with the Option menu open listing directions A to F and the bet for the selected one beside them'),
          h('p', { class: 'cs-hint' }, 'An exploration in the harness: every option in one menu, with its bet beside it'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, 'Each option carries a bet: what it’s good for and what it costs, written next to it. Not a description of the layout - an argument, with the trade-off named. Options that lost keep their place with the reason beside them, because it’s easier to agree something is too loud once you can see it, and easier still not to have the argument again in three months.'),
            ),

            h(BetSwitcher),
            h(InteractiveTag, { hint: 'Click to see the argument for each bet', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, [
                'Every prototype also carries two lists. ',
                h('strong', null, 'Needs a system decision'),
                ' collects the gaps the exploration ran into; ',
                h('strong', null, 'Still unverified'),
                ' lists everything in the screen we made up. Both are part of the work rather than an appendix to it. A prototype that hides what it guessed is worse than one that stops and asks.',
              ]),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'The states we’d have got to last'),

            full(h('p', { class: 'cs-body-text' }, 'This is where it stopped being only a faster way to do the same work. Downloading a podcast has a state most download UIs skip: the listener taps download on mobile data with mobile-data downloads off, and nothing happens. The control ended up with six states rather than four, and the waiting state is the one that generates the support ticket.')),

            h(StateWalk),
            h(InteractiveTag, { hint: 'Step through the six states', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, 'The other was a toggle on the show page: keep the newest episodes on this phone, on Wi-Fi, and they play without a signal. The download button on each episode stays; this sits above it, for the shows you never want to be without. One decision instead of a chore every week, and the kind of thing that only shows up when a direction is built out properly rather than drawn.'),
            ),
          ]),

          themed(IMG_KEPT, IMG_KEPT_D, 'The offline-listening exploration in the lab, direction B on the show page: a Keep new episodes on this phone toggle above the episode list, and the mini player holding a paused episode of the show'),
          h('p', { class: 'cs-hint' }, 'Example of a great suggestion that we kept'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, [
                'I don’t read that as the model being clever. The house rules say build the unhappy states; the design doc says a screen isn’t finished until loading, empty, error and locked exist. A rule I’d written got applied further than I’d applied it myself, because state exploration is tedious and humans do it last. ',
                h('strong', null, 'Write the intent down properly and it holds you to it too.'),
              ]),
            ),

            h('h2', { class: 'cs-section-title' }, 'Making it usable by someone who has never written code'),

            full(h('p', { class: 'cs-body-text' }, 'Everything above worked, for me. The people it was for are designers who have never opened Terminal, don’t know what a branch is, and shouldn’t have to. Most of the work since has been re-designing the process for them, and the test was simple: could someone set up and build their first prototype without me in the room?')),

            h('h3', { class: 'cs-subsection-title' }, 'The whole workflow is four commands'),

            full(
              h('p', { class: 'cs-body-text' }, [
                'I cut the process to what a designer actually does and made each step one command: ',
                h('strong', null, '/start'),
                ' opens the lab, gets everyone’s latest work and puts you on your own branch; ',
                h('strong', null, '/new-prototype'),
                ' takes the brief; ',
                h('strong', null, '/save'),
                ' commits and pushes; ',
                h('strong', null, '/submit'),
                ' checks the build and opens the pull request, written from the prototype itself. Git still happens. The designer never types it. Each command is a playbook Claude follows, so when a step trips someone, the fix goes in the playbook and nobody hits it again.',
              ]),
            ),

          ]),

          themed(IMG_SKILLS, IMG_SKILLS_D, 'The Guide’s Skills chapter: a table of the lab’s commands - start, setup-design-lab, new-prototype, save, submit and review-prototype - with what each does, how it starts and what to say'),
          h('p', { class: 'cs-hint' }, 'The skills, as the Guide lists them: what each one does, how it starts, and what to say'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h3', { class: 'cs-subsection-title' }, 'Briefing it like a designer, not prompting it like an engineer'),

            full(
              h('p', { class: 'cs-body-text' }, [
                'The command that matters most is the one that builds. Getting a good result out of an agent used to mean knowing what to ask for, which is the expertise I least wanted the team to need. So ',
                h('strong', null, '/new-prototype'),
                ' asks instead. Type an idea in a sentence, or paste the whole brief, and it comes back with at most two rounds of multiple-choice questions: three readings of the idea, from one close to your words to two you didn’t say, with “suggest bolder ones” as a fourth; where in the app someone meets it; which screen it starts from. Then it sketches each direction as one screen, side by side in Compare, and stops. Only the direction you pick gets built out, with what was dropped written into the notes.',
              ]),

              h('p', { class: 'cs-body-text' }, [
                'That order is the point. Building three directions across five states when two get dropped on first sight is where the time and the tokens went. ',
                h('strong', null, 'Sketch first, react, then build.'),
              ]),
            ),
          ]),

          themed(IMG_SKETCHES, IMG_SKETCHES_D, 'Compare in the lab: the three offline-listening directions side by side with the Screen set to Offline, each with its name and bet above its phone frame - a downloads list, a shelf of what is on the phone, and a pocket station that keeps playing'),
          h('p', { class: 'cs-hint' }, 'Compare: three answers to the same question, side by side, with the connection switched off for all of them'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h3', { class: 'cs-subsection-title' }, 'A Guide that does the typing'),

            full(
              h('p', { class: 'cs-body-text' }, 'The lab carries its own Guide, written for someone who has never opened Terminal. It started as a manual: eleven chapters, read top to bottom, that told you what to type. It’s now a workflow: a one-time setup, then the four steps drawn as a stepper across the top of every page, so you always know which one you’re on.'),

              h('p', { class: 'cs-body-text' }, [
                'What changed most is that it stopped asking people to type. Every step has a ',
                h('strong', null, 'Copy'),
                ' button for the exact command, because retyping is where a branch name gets mistyped, and an ',
                h('strong', null, 'Open in Claude'),
                ' button that opens the app with the prompt already in the box and the lab folder chosen. Setup is two downloads and one button. When something goes wrong, ',
                h('strong', null, 'Message Alex on Teams'),
                ' opens a chat with the message already drafted - which step, and a space for what Claude said - so asking for help costs one click.',
              ]),
            ),
          ]),

          h(BeforeAfterToggle, {
            before:    IMG_GUIDE_BEFORE,
            after:     IMG_GUIDE_AFTER,
            afterDark: IMG_GUIDE_AFTER_D,
            beforeAlt: 'The Guide before: chapter 06 of 11, Build with Claude, a good brief described in prose with numbered steps',
            afterAlt:  'The Guide after: the Build step with the four-step stepper across the top, the /new-prototype prompt with a Copy button and an Open in Claude button',
          }),
          h('p', { class: 'cs-hint' }, 'The Guide’s Build step, old and new: a chapter to read became a step to click'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, [
                'The details are where people get stuck, so that’s where the writing went: it works on Windows as well as a Mac, needs no administrator password, and has chapters for the words you’ll hear, for looking at someone else’s work, and for when something goes wrong. The Guide ends with a rule for itself: if a step tripped you, it will trip the next person, and the fix belongs on the page. ',
                h('strong', null, 'The cold-start test, pointed at people.'),
              ]),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'You can’t break it, and that’s enforced'),

            full(
              h('p', { class: 'cs-body-text' }, 'The line in the Guide that does the most work is near the top: you can’t break it. For someone who has never used git, that matters more than any instruction, so it isn’t a promise, it’s built in. Everyone works on their own branch; nothing reaches the published lab until it’s reviewed. Claude itself is fenced: a hook stops it touching anything platform-owned without asking, and refuses to hand-edit generated files at all. The build fails on a literal colour or font, so a prototype can’t quietly drift off-system.'),

              h('p', { class: 'cs-body-text' }, [
                'Approval was the other bottleneck. Every pull request needs one approval and a passing build, and any designer’s approval merges an exploration; only the foundations every prototype sits on need mine, because a change there moves everyone else’s screens. In practice the reviews have all been mine so far - reviewing each other is the next habit to form. Merging publishes the lab, so ',
                h('strong', null, 'an exploration is a link, never an export, and never out of date because it is the repo.'),
              ]),
            ),
          ]),

          TeamFlow(),
          h('p', { class: 'cs-hint' }, 'From a blank Mac to the whole team, with no step that waits for me'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Designing the lab itself'),

            full(
              h('p', { class: 'cs-body-text' }, 'The look is the Bauer AI team’s design system - their canvas, glass, type and components, used as they ship - so the lab sits with the rest of Bauer’s AI tools and I don’t maintain a visual language of my own. Everything else is mine: what the lab does, how it is laid out, how it moves.'),

              h('p', { class: 'cs-body-text' }, [
                'The options used to sit in a column beside the frame and took a third of a laptop window. They are now one bar over it, so the screen under review is as big as the window allows and the option and state chips are always in reach. The bar glides between screens, the view controls merge and split with the window, and the theme switch previews before it spreads. One rule holds all of it: ',
                h('strong', null, 'the chrome is Bauer’s, the screen under review is Rayo’s'),
                ', and nothing of theirs reaches inside the frame.',
              ]),
            ),
          ]),

          h(BeforeAfterToggle, {
            before:    IMG_OPTIONS_BEFORE,
            after:     VID_OPTIONS_AFTER,
            afterDark: VID_OPTIONS_AFTER_D,
            beforeAlt: 'Before: the lab’s own dark glass chrome, seven rows of switches in a column beside an iPad landscape Page that is cut off at the edge of the window',
            afterAlt:  'After: the Bauer AI design system chrome with one options bar over the frame, switching the same For you Page from iPhone to iPad portrait to iPad landscape and back, the frame resizing and rotating to fit',
          }),
          h('p', { class: 'cs-hint' }, 'Old and new: the lab’s own chrome with a column of switches beside a cut-off iPad, then the Bauer AI design system with one bar over the frame, and the frame changing device under it'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Where the team is with it'),

            full(
              h('p', { class: 'cs-body-text' }, 'Everyone on the team has set up from the Guide, without a session with me, and the buttons get used - the one that opens Claude with the message typed, and the Teams one when something stops. The first prototype through the sketch-first flow is an offline-listening exploration: four directions sketched, three built out across the whole journey, the fourth and the reason it was dropped written into the notes.'),

              h('p', { class: 'cs-body-text' }, 'It’s also finding what the design system is missing faster than one person reading it could. The gap lists became a channel: an exploration hits a gap, names it in the frame, and the system grows. Gradient tokens exist because a paywall prototype asked for them.'),
            ),
          ]),

          GapLoop(),
          h('p', { class: 'cs-hint' }, 'A gap list is a feedback channel'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' }, [
                'The audit file now runs to twelve sections, and the later ones are all things found by using the system - no motion, elevation or blur primitives; a secondary text colour that doesn’t survive a tint; a button with no nav-bar size. ',
                h('strong', null, 'Each one is a question the design system now has to answer, raised by something real rather than in the abstract.'),
              ]),
            ),

            h('h2', { class: 'cs-section-title' }, 'What’s next'),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Reviewing each other.'),
              ' The rule is live; the habit isn’t yet. The next thing I’m watching for is an exploration merged on another designer’s approval, not mine.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Designing together.'),
              ' Designing with AI is still a solo activity. Sharing the result is solved - a prototype is a link - but the session where the options get generated happens between one designer and one agent, and the feedback happens somewhere else, detached from the thing it’s about. There’s nowhere to pin a comment to the exact state you disagree with, and no way to pick up a colleague’s direction and take it somewhere new. The bets and gap lists were a first step towards the argument living inside the work. The next is making room for other people’s arguments there too.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Beyond the design team.'),
              ' Anyone who can describe a screen can now get a real one built from the real system: an engineer sketching a feature, a product manager putting an idea in front of people instead of describing it. The platform is open to them; whether they take it up is the interesting question.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              h('strong', null, 'Real listeners.'),
              ' Everything so far has been for internal decisions. A prototype made of the real system with its states already built is most of the way to being testable; the form that takes isn’t decided yet.',
            ]),

            h('h2', { class: 'cs-section-title' }, 'Outcome'),

            h('p', { class: 'cs-body-text' }, [
              'The team works in it. Making a prototype is faster - the days spent drawing and linking Figma screens are gone - and that’s the speed that matters, because it’s the cost that kept exploration narrow. ',
              h('strong', null, 'We can now see many ways of doing the same thing side by side, each with its argument attached, before anyone commits.'),
              ' The downloads work ran through three destinations for downloaded episodes, and the one we took forward won on grounds the exploration made visible.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              'What I’d take from it is more specific than “AI makes design faster”. ',
              h('strong', null, 'The models were never the constraint. The constraint was that they had nothing of ours to build with, and then that only one of us could use them.'),
              ' Give an agent the real system and its rules, and the work is something you can decide from. Take yourself out of the loop - the Guide, the commands, the guardrails, the baseline - and it’s something the whole team can decide from.',
            ]),

            h('p', { class: 'cs-closing' }, 'Faster to prototype, so more of us explore more of the options before we choose.'),
          ]),
        ],
      })
  },
})
