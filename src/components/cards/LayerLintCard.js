import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'

// ── Assets ──
const LOGO_SRC = 'src/assets/images/layerlint-logo.svg'
const HERO_SRC = 'src/assets/images/layerlint-hero.svg'
const IMG_CLEANUP = 'src/assets/images/layerlint/ll-cleanup.png'
const IMG_RENAME = 'src/assets/images/layerlint/ll-rename.png'
const IMG_SETTINGS = 'src/assets/images/layerlint/ll-settings.png'
const IMG_COVER = 'src/assets/images/layerlint/ll-cover.png'


/* ─────────────────────────────────────────────────────────────
   FloatingLayersBg — DOM-based animated Figma layer panel
   Fills the full height with rows mimicking a Figma layers panel.
   Animation loop per batch:
     1. All rows visible (staggered fade-in)
     2. Hidden layers wipe out right-to-left
     3. Typewriter-erase default names
     4. Typewriter-write semantic names (teal)
     5. Continuous scroll up — next batch enters from below
   Two panels rendered: current + next, in a tall container that
   translates up to create the infinite-scroll illusion.
   ───────────────────────────────────────────────────────────── */

// SVG paths for eye icons (16×16 viewBox)
const EYE_OPEN = 'M8 3C3.6 3 .5 8 .5 8s3.1 5 7.5 5 7.5-5 7.5-5S12.4 3 8 3Zm0 8.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'
const EYE_CLOSED = 'M13.36 3.35 2.65 14.06l.7.7 2.2-2.2A7.7 7.7 0 0 0 8 13c4.4 0 7.5-5 7.5-5a13 13 0 0 0-2.84-3.35l2.4-2.4-.7-.7ZM8 4.5c-.47 0-.93.06-1.37.16L8.2 6.24A2 2 0 0 1 9.76 7.8l1.58 1.57A3.5 3.5 0 0 0 8 4.5ZM.5 8s3.1 5 7.5 5c.67 0 1.32-.1 1.94-.3L8.2 10.96A3.5 3.5 0 0 1 4.54 7.3L2.84 5.62A13 13 0 0 0 .5 8Z'

const TYPE_ICONS = {
  frame: '#',
  rect: '▬',
  group: '◇',
  vector: '✦',
  ellipse: '○',
  text: 'T',
  line: '—',
}

const BATCHES = [
  [
    { name: 'Frame 114', semantic: 'product-card', type: 'frame', hidden: false },
    { name: 'Rectangle 47', semantic: 'card-image', type: 'rect', hidden: false },
    { name: 'Group 12', semantic: 'card-content', type: 'group', hidden: false },
    { name: 'Vector 2', semantic: null, type: 'vector', hidden: true },
    { name: 'Ellipse 9', semantic: 'product-icon', type: 'ellipse', hidden: false },
    { name: 'Frame 3', semantic: 'info-row', type: 'frame', hidden: false },
    { name: 'Rectangle 8', semantic: null, type: 'rect', hidden: true },
    { name: 'Text', semantic: 'product-label', type: 'text', hidden: false },
    { name: 'Group 5', semantic: null, type: 'group', hidden: true },
    { name: 'Line 4', semantic: 'divider', type: 'line', hidden: false },
  ],
  [
    { name: 'Frame 22', semantic: 'nav-header', type: 'frame', hidden: false },
    { name: 'Rectangle 19', semantic: 'search-input', type: 'rect', hidden: false },
    { name: 'Ellipse 1', semantic: null, type: 'ellipse', hidden: true },
    { name: 'Group 88', semantic: 'menu-list', type: 'group', hidden: false },
    { name: 'Frame 7', semantic: 'menu-item', type: 'frame', hidden: false },
    { name: 'Vector', semantic: null, type: 'vector', hidden: true },
    { name: 'Rectangle 3', semantic: 'avatar-circle', type: 'rect', hidden: false },
    { name: 'Text', semantic: 'username-label', type: 'text', hidden: false },
    { name: 'Line 9', semantic: null, type: 'line', hidden: true },
    { name: 'Component 3', semantic: 'logout-button', type: 'frame', hidden: false },
  ],
  [
    { name: 'Frame 51', semantic: 'hero-section', type: 'frame', hidden: false },
    { name: 'Rectangle 2', semantic: 'hero-image', type: 'rect', hidden: false },
    { name: 'Group 4', semantic: 'cta-group', type: 'group', hidden: false },
    { name: 'Frame 88', semantic: null, type: 'frame', hidden: true },
    { name: 'Text', semantic: 'headline-text', type: 'text', hidden: false },
    { name: 'Ellipse 5', semantic: 'play-button', type: 'ellipse', hidden: false },
    { name: 'Vector 7', semantic: null, type: 'vector', hidden: true },
    { name: 'Rectangle 31', semantic: 'overlay-bg', type: 'rect', hidden: false },
    { name: 'Frame 9', semantic: 'badge-row', type: 'frame', hidden: false },
    { name: 'Group 14', semantic: null, type: 'group', hidden: true },
  ],
]

// Row height (px) — must match CSS .ll-bg-row height + gap
const ROW_SLOT = 29  // 26px row + 3px gap

// Phase timing (ms)
const T_REVEAL_STAGGER = 40        // per-row stagger on reveal
const T_PAUSE_AFTER_REVEAL = 1800  // hold the messy state
const T_REMOVE_STAGGER = 100       // per-hidden-row stagger on wipe
const T_PAUSE_AFTER_REMOVE = 600   // breathe after cleanup
const T_ERASE_PER_CHAR = 32        // erase speed
const T_ERASE_STAGGER = 120        // per-row stagger for erase start
const T_PAUSE_AFTER_ERASE = 300    // gap between erase and write
const T_WRITE_PER_CHAR = 28        // write speed
const T_WRITE_STAGGER = 80         // per-row stagger for write start
const T_PAUSE_AFTER_WRITE = 2000   // hold the clean state
const T_SCROLL_DURATION = 800      // scroll-up transition time

// Repeat batch layers to fill a given pixel height.
// Accounts for hidden layers being removed — generates enough total rows
// so that the remaining visible ones still cover the full height.
function fillHeight(batch, height) {
  const visibleInBatch = batch.filter(l => !l.hidden).length
  const totalInBatch = batch.length
  // We need this many visible rows to fill the container after cleanup
  const visibleNeeded = Math.ceil(height / ROW_SLOT) + 2
  // Scale up by the hidden/visible ratio so we end up with enough after removal
  const totalNeeded = Math.ceil(visibleNeeded * totalInBatch / visibleInBatch)
  const out = []
  for (let i = 0; i < totalNeeded; i++) {
    out.push({ ...batch[i % batch.length], _idx: i })
  }
  return out
}

const FloatingLayersBg = defineComponent({
  name: 'FloatingLayersBg',

  setup() {
    const wrapRef = ref(null)
    const curPanelRef = ref(null)
    // Two panels: current (top) and next (bottom)
    const currentRows = ref([])
    const nextRows = ref([])
    const scrollOffset = ref(0)       // px to translate the track up
    const scrollTransition = ref(false) // true while CSS transition is active

    let batchIdx = 0
    let containerH = 500 // default, measured on mount
    let timers = []
    let destroyed = false

    function schedule(fn, ms) {
      const id = setTimeout(() => { if (!destroyed) fn() }, ms)
      timers.push(id)
      return id
    }

    function clearTimers() {
      timers.forEach(id => clearTimeout(id))
      timers = []
    }

    function buildRows(batch) {
      return fillHeight(batch, containerH).map(layer => ({
        ...layer,
        display: layer.name,
        visible: false,
        wiping: false,        // right-to-left clip-path wipe
        gapShift: 0,          // translateY px to close gap (GPU composited)
        gapDelay: 0,          // per-row transition-delay for momentum feel
        renamed: false,
        showCursor: false,
      }))
    }

    function getBatch(idx) {
      return BATCHES[idx % BATCHES.length]
    }

    // ── Phase 1: Reveal ──
    function startCycle() {
      // Measure container
      if (wrapRef.value) {
        containerH = wrapRef.value.getBoundingClientRect().height
      }

      const batch = getBatch(batchIdx)
      currentRows.value = buildRows(batch)
      scrollOffset.value = 0
      scrollTransition.value = false

      // Pre-build next batch (sits below, invisible until scroll)
      const nextBatch = getBatch(batchIdx + 1)
      nextRows.value = buildRows(nextBatch)

      // Staggered reveal
      currentRows.value.forEach((row, i) => {
        schedule(() => { row.visible = true }, i * T_REVEAL_STAGGER)
      })
      // Next rows stay invisible until scroll phase — prevents bleed-through

      const totalReveal = currentRows.value.length * T_REVEAL_STAGGER
      schedule(startCleanup, totalReveal + T_PAUSE_AFTER_REVEAL)
    }

    // ── Phase 2: Cleanup — wipe hidden layers right-to-left, then close gaps ──
    function startCleanup() {
      const rows = currentRows.value
      const hidden = rows.filter(r => r.hidden)
      if (hidden.length === 0) {
        schedule(startErase, T_PAUSE_AFTER_REMOVE)
        return
      }

      // Step 1: Staggered wipe across all hidden rows
      hidden.forEach((row, i) => {
        schedule(() => { row.wiping = true }, i * T_REMOVE_STAGGER)
      })

      // Wait for all wipes to finish (last wipe start + wipe duration)
      const allWipesDone = (hidden.length - 1) * T_REMOVE_STAGGER + 450

      // Step 2: Close gaps via translateY — rows near each gap move first.
      // Hidden rows stay in DOM as invisible spacers (wiped via clip-path).
      // Visible rows shift up with translateY to close the visual gaps.
      schedule(() => {
        const hiddenSet = new Set(hidden.map(r => rows.indexOf(r)))
        let gapsAbove = 0
        let lastGapIdx = -Infinity

        rows.forEach((row, i) => {
          if (hiddenSet.has(i)) {
            gapsAbove++
            lastGapIdx = i
            return
          }
          if (gapsAbove > 0) {
            const distFromGap = i - lastGapIdx // 1 = right next to gap
            row.gapShift = gapsAbove * ROW_SLOT
            row.gapDelay = Math.min((distFromGap - 1) * 30, 200) // ms, caps at 200
          }
        })
      }, allWipesDone + 150)

      // No DOM removal — hidden rows remain as invisible spacers.
      // Erase phase filters on !hidden && semantic, so they're skipped.
      const gapCloseTime = allWipesDone + 150 + 200 + 700 // delay-cap + transition
      schedule(startErase, gapCloseTime + T_PAUSE_AFTER_REMOVE)
    }

    // ── Phase 3: Typewriter erase ──
    function startErase() {
      const visible = currentRows.value.filter(r => !r.hidden && r.semantic)

      visible.forEach((row, i) => {
        const fullName = row.name
        const len = fullName.length

        schedule(() => {
          row.showCursor = true
          for (let c = 0; c < len; c++) {
            schedule(() => {
              row.display = fullName.slice(0, len - 1 - c)
            }, c * T_ERASE_PER_CHAR)
          }
          schedule(() => { row.display = '' }, len * T_ERASE_PER_CHAR)
        }, i * T_ERASE_STAGGER)
      })

      const longestName = Math.max(...visible.map(r => r.name.length))
      const totalErase = (visible.length - 1) * T_ERASE_STAGGER + longestName * T_ERASE_PER_CHAR
      schedule(startWrite, totalErase + T_PAUSE_AFTER_ERASE)
    }

    // ── Phase 4: Typewriter write ──
    function startWrite() {
      const visible = currentRows.value.filter(r => !r.hidden && r.semantic)

      visible.forEach((row, i) => {
        const target = row.semantic
        const len = target.length

        schedule(() => {
          row.renamed = true
          for (let c = 0; c <= len; c++) {
            schedule(() => { row.display = target.slice(0, c) }, c * T_WRITE_PER_CHAR)
          }
          schedule(() => { row.showCursor = false }, len * T_WRITE_PER_CHAR)
        }, i * T_WRITE_STAGGER)
      })

      const longestSemantic = Math.max(...visible.map(r => r.semantic.length))
      const totalWrite = (visible.length - 1) * T_WRITE_STAGGER + longestSemantic * T_WRITE_PER_CHAR
      schedule(startScroll, totalWrite + T_PAUSE_AFTER_WRITE)
    }

    // ── Phase 5: Continuous scroll up, next batch enters from below ──
    function startScroll() {
      // Reveal next-batch rows right before scrolling so they appear as they enter
      nextRows.value.forEach(row => { row.visible = true })

      // Measure real panel height (accounts for deleted rows) so scroll is seamless
      const panelH = curPanelRef.value ? curPanelRef.value.offsetHeight : containerH
      scrollTransition.value = true
      scrollOffset.value = panelH

      // After transition ends, swap: next becomes current, build new next
      schedule(() => {
        batchIdx++
        scrollTransition.value = false
        scrollOffset.value = 0

        // Promote next → current
        currentRows.value = nextRows.value

        // Build fresh next batch (off-screen)
        const upcomingBatch = getBatch(batchIdx + 1)
        nextRows.value = buildRows(upcomingBatch)
        nextRows.value.forEach(row => { row.visible = true })

        // Start the animation phases for the new current batch
        schedule(startCleanup, T_PAUSE_AFTER_REVEAL)
      }, T_SCROLL_DURATION + 50)
    }

    onMounted(() => {
      startCycle()
    })

    onUnmounted(() => {
      destroyed = true
      clearTimers()
    })

    // ── Render a panel of rows ──
    function renderPanel(panelRows, keyPrefix, panelRef) {
      return h('div', {
        class: 'll-bg-panel',
        ref: panelRef || null,
      },
        panelRows.map((row, i) => {
          // Build inline style for gap-close transform
          const style = {}
          if (row.gapShift > 0) {
            style.transform = `translateY(-${row.gapShift}px)`
            style.transition = `transform 0.65s cubic-bezier(0.25, 0.1, 0.25, 1)`
            style.transitionDelay = `${row.gapDelay}ms`
          }

          return h('div', {
            key: keyPrefix + '-' + row._idx + '-' + row.name,
            class: [
              'll-bg-row',
              row.visible ? 'll-bg-row--visible' : '',
              row.hidden ? 'll-bg-row--hidden' : '',
              row.wiping ? 'll-bg-row--wiping' : '',
              row.renamed ? 'll-bg-row--renamed' : '',
            ].filter(Boolean).join(' '),
            style,
          }, [
            h('span', { class: 'll-bg-icon' }, TYPE_ICONS[row.type] || '#'),
            h('span', { class: 'll-bg-name' }, [
              row.display,
              row.showCursor ? h('span', { class: 'll-bg-cursor' }) : null,
            ]),
            h('span', { class: 'll-bg-eye' }, [
              h('svg', {
                width: '12', height: '12', viewBox: '0 0 16 16',
                fill: 'currentColor',
                class: row.hidden ? 'll-bg-eye--closed' : '',
              }, [
                h('path', { d: row.hidden ? EYE_CLOSED : EYE_OPEN }),
              ]),
            ]),
          ])
        })
      )
    }

    // ── Main render ──
    return () =>
      h('div', { class: 'll-bg-wrap', ref: wrapRef }, [
        h('div', {
          class: 'll-bg-track',
          style: {
            transform: `translateY(-${scrollOffset.value}px)`,
            transition: scrollTransition.value
              ? `transform ${T_SCROLL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : 'none',
          },
        }, [
          renderPanel(currentRows.value, 'cur-' + batchIdx, curPanelRef),
          renderPanel(nextRows.value, 'nxt-' + (batchIdx + 1)),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   BeforeAfterToggle — messy vs clean layer panel
   Shows a side-by-side toggle between a cluttered Figma layer
   panel and a cleaned + renamed version.
   ───────────────────────────────────────────────────────────── */

const BEFORE_LAYERS = [
  { name: 'Frame 114', type: 'frame', indent: 0, hidden: false },
  { name: 'Rectangle 47', type: 'rect', indent: 1, hidden: false },
  { name: 'Group 12', type: 'group', indent: 1, hidden: false },
  { name: 'Vector 2', type: 'vector', indent: 2, hidden: true },
  { name: 'Ellipse 9', type: 'ellipse', indent: 2, hidden: false },
  { name: 'Frame 3', type: 'frame', indent: 2, hidden: false },
  { name: 'Rectangle 8', type: 'rect', indent: 3, hidden: true },
  { name: 'Text', type: 'text', indent: 3, hidden: false },
  { name: 'Group 5', type: 'group', indent: 1, hidden: true },
  { name: 'Line 4', type: 'line', indent: 1, hidden: false },
  { name: 'Rectangle 19', type: 'rect', indent: 1, hidden: false },
]

const AFTER_LAYERS = [
  { name: 'product-card', type: 'frame', indent: 0, hidden: false },
  { name: 'card-image', type: 'rect', indent: 1, hidden: false },
  { name: 'card-content', type: 'group', indent: 1, hidden: false },
  { name: 'product-icon', type: 'ellipse', indent: 2, hidden: false },
  { name: 'info-row', type: 'frame', indent: 2, hidden: false },
  { name: 'product-label', type: 'text', indent: 3, hidden: false },
  { name: 'divider', type: 'line', indent: 1, hidden: false },
  { name: 'price-tag', type: 'rect', indent: 1, hidden: false },
]

const BeforeAfterToggle = defineComponent({
  name: 'BeforeAfterToggle',
  setup() {
    const showAfter = ref(false)

    function renderPanel(layers, label) {
      return h('div', { class: 'll-panel' }, [
        h('div', { class: 'll-panel-bar' }, [
          h('span', { class: 'll-panel-title' }, 'Layers'),
          h('span', { class: 'll-panel-badge' }, label),
        ]),
        h('div', { class: 'll-panel-list' },
          layers.map((layer, i) =>
            h('div', {
              key: i,
              class: [
                'll-panel-row',
                layer.hidden ? 'll-panel-row--hidden' : '',
              ].filter(Boolean).join(' '),
              style: { paddingLeft: (12 + layer.indent * 16) + 'px' },
            }, [
              h('span', { class: 'll-panel-icon' }, TYPE_ICONS[layer.type] || '#'),
              h('span', { class: 'll-panel-name' }, layer.name),
              layer.hidden ? h('span', { class: 'll-panel-hidden-tag' }, '👁') : null,
            ])
          )
        ),
      ])
    }

    return () =>
      h('div', { class: 'll-before-after' }, [
        h('div', { class: 'll-toggle-bar' }, [
          h('button', {
            class: ['ll-toggle-btn', !showAfter.value ? 'll-toggle-btn--active' : ''].filter(Boolean).join(' '),
            onClick: () => { showAfter.value = false },
          }, 'Before'),
          h('button', {
            class: ['ll-toggle-btn', showAfter.value ? 'll-toggle-btn--active' : ''].filter(Boolean).join(' '),
            onClick: () => { showAfter.value = true },
          }, 'After'),
        ]),
        h('div', { class: 'll-panels-wrap' }, [
          h('div', {
            class: ['ll-panels-track', showAfter.value ? 'll-panels-track--after' : ''].filter(Boolean).join(' '),
          }, [
            renderPanel(BEFORE_LAYERS, 'Raw Figma'),
            renderPanel(AFTER_LAYERS, 'After Layer Lint'),
          ]),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   Main case study component
   ───────────────────────────────────────────────────────────── */
export default defineComponent({
  name: 'LayerLintCard',

  setup() {
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'layerlint',
        cardClass: 'll-card',
        imageSrc: HERO_SRC,
        imageClass: 'll-hero-img',
        heroWrapClass: 'll-hero-wrap',
        tooltip: 'Clean your Figma layers\nso AI agents can read them 🧹',
        heroSize: 448,
      }, {
        // ── Collapsed card face: floating layers bg + logo + title ──
        default: () => [
          h(FloatingLayersBg),
          h('div', { class: 'll-card-face' }, [
            h('img', { src: LOGO_SRC, alt: 'Layer Lint', class: 'll-card-logo' }),
            h('p', { class: 'll-card-title' }, 'Layer\nLint'),
          ]),
        ],

        // ── Hero overlay: live canvas on top of the placeholder ──
        heroOverlay: () => h('div', { class: 'll-hero-overlay' }, [
          h(FloatingLayersBg),
          h('div', { class: 'll-card-face' }, [
            h('img', { src: LOGO_SRC, alt: 'Layer Lint', class: 'll-card-logo' }),
            h('p', { class: 'll-card-title' }, 'Layer\nLint'),
          ]),
        ]),

        // ── Fly content ──
        flyContent: () => h('div', { class: 'll-fly-overlay' }, [
          h('img', { src: LOGO_SRC, alt: 'Layer Lint', class: 'll-card-logo' }),
          h('p', { class: 'll-card-title' }, 'Layer\nLint'),
        ]),

        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          h('div', { class: 'cs-body' }, [

            // ═══════════════════════════════════════════
            // TITLE + INTRO
            // ═══════════════════════════════════════════
            h('h1', { class: 'cs-title' },
              'Your layers are the prompt. Make sure they\u2019re worth reading.'),

            full(
              h('p', { class: 'cs-body-text' },
                'Every time an AI coding agent reads a Figma file, it encounters your layer names. "Rectangle 47" tells it nothing. "product-card" gives it meaningful context. The gap between those two names is the gap between an agent that guesses and one that builds closer to what you designed.'),

              h('p', { class: 'cs-body-text' },
                'Layer Lint is a Figma plugin I built to close that gap between design files and AI agents. It scans your files for hidden and empty layers cluttering the panel, then uses Claude to batch-rename auto-generated names into semantic, developer-friendly ones - optimised for both AI agents and the humans who review their output.'),
              
                h('p', { class: 'cs-body-text' },
                'It has already been published and currently waiting for Figma\u2019s approval.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, [
              'Side project - design & development'
            ]),

            // ═══════════════════════════════════════════
            // IMPACT
            // ═══════════════════════════════════════════
            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '🧹 One-Click Layer Cleanup'),
            full(
              h('p', { class: 'cs-body-text' },
                'Scans the current page and flags every hidden subtree and invisible shape - the forgotten artifacts that accumulate in any working Figma file. Select all or pick individually, then remove them in a single action.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🤖 AI-Powered Semantic Renaming'),
            full(
              h('p', { class: 'cs-body-text' },
                'Claude reads each layer\u2019s type, text content, layout direction, children, and - for visually complex nodes - an exported PNG. It proposes kebab-case names that describe purpose, not appearance. Every suggestion is reviewable: edit, accept, or skip individually before applying.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🛡️ Instance-Safe by Design'),
            full(
              h('p', { class: 'cs-body-text' },
                'The plugin never walks into or modifies content inside component instances. Instance contents belong to their main component - renaming them locally would create overrides that break on the next component update. Layer Lint respects that boundary automatically.'),
            ),
          ]),

          // ── Cover image ──
          h('img', { class: 'cs-cover-img', src: IMG_COVER, alt: 'Layer Lint plugin interface showing cleanup and rename tabs' }),
          h('p', { class: 'cs-hint' }, 'Cleanup and rename - the two tabs of Layer Lint'),

          // ═══════════════════════════════════════════
          // PROBLEM
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Problem'),
            h('p', { class: 'cs-body-text' },
              'Figma auto-generates layer names like "Rectangle 47", "Frame 3", and "Group 12". For a designer working visually, these names are harmless - you can see what each layer is on the canvas. But for anything reading the file programmatically - an AI coding agent, a design-to-code tool, a developer in Dev Mode - those names are noise. They carry zero semantic information.'),

            h('p', { class: 'cs-body-text' },
              'On top of that, working Figma files accumulate hidden layers, empty shapes, and forgotten artifacts. These don\u2019t affect the visual output, but they bloat the layer panel, slow down file loading, and confuse any tool or agent trying to parse the file\u2019s structure. The problem compounds at scale: the more complex the file, the harder it is to maintain manually.'),
          ]),

          // ── Before/After toggle ──
          h(BeforeAfterToggle),
          h(InteractiveTag, { hint: 'Toggle between the raw and cleaned layer panel' }),

          // ═══════════════════════════════════════════
          // SOLUTION — CLEANUP
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Cleanup: finding what\u2019s invisible'),
            full(
              h('p', { class: 'cs-body-text' },
                'The cleanup scan walks the page tree and flags two types of node: hidden subtrees (where only the root needs removing) and leaf shapes with no visible fill, stroke, or effect - visually indistinguishable from hidden layers but technically still "visible" in Figma\u2019s model. Mixed fills are treated as intentional. The scan never enters component instances.'),

              h('p', { class: 'cs-body-text' },
                'Results appear as a checklist with each layer\u2019s name, type, and reason (hidden or empty). Clicking a row zooms to the node on the canvas. Select all or cherry-pick, then remove.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_CLEANUP, alt: 'Layer Lint cleanup tab showing flagged hidden and empty layers' }),
          h('p', { class: 'cs-hint' }, 'Cleanup results with hidden and empty layer badges'),

          // ═══════════════════════════════════════════
          // SOLUTION — RENAME
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Rename: giving layers meaning'),
            full(
              h('p', { class: 'cs-body-text' },
                'The rename flow collects context for each candidate layer: its type, dimensions, parent path, up to 10 children, layout direction, fill classification, and for text nodes (the first 200 characters of content.) For visually complex nodes (vectors, images) above a minimum size, it also exports a 1x PNG so Claude can see what the layer actually looks like.'),

              h('p', { class: 'cs-body-text' },
                'Candidates are batched to stay within API limits - 50 text-only layers per request, 10 visual layers. Claude is instructed via a constrained tool-use pattern: it must call a submit_names tool with exactly one kebab-case name per layer ID. The plugin deduplicates sibling names automatically (appending -2, -3 if needed) and sanitises every response to enforce the naming convention.'),

              h('p', { class: 'cs-body-text' },
                'Two scope modes let the designer choose: rename only default-named layers (the "Rectangle 47" pattern) or all layers including manually named ones. The results appear in a side-by-side list where every proposal is editable before applying.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_RENAME, alt: 'Layer Lint rename tab showing AI-proposed names alongside originals' }),
          h('p', { class: 'cs-hint' }, 'Side-by-side rename review - edit any suggestion before applying'),

          // ═══════════════════════════════════════════
          // MODEL SELECTION + COST
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Model selection and cost transparency'),
            full(
              h('p', { class: 'cs-body-text' },
                'The settings panel lets designers choose between Haiku (fast and cheap - the default), Sonnet (balanced), or Opus (highest quality). Haiku handles most files well. Sonnet or Opus are worth switching to for dense layouts or when Haiku is overloaded. The plugin tracks input and output token usage per session and displays it after each rename run, so designers always know what a batch cost.'),

              h('p', { class: 'cs-body-text' },
                'Transient errors (rate limits, overload, server errors) are retried automatically with exponential backoff - up to three attempts with clear status messages between each retry so the designer knows the plugin isn\u2019t stuck.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_SETTINGS, alt: 'Layer Lint settings panel showing model selector and API key management' }),
          h('p', { class: 'cs-hint' }, 'BYOK settings with model selection and cost tracking'),

          // ═══════════════════════════════════════════
          // CONNECTION TO AGENTIC DS
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'The other side of the agentic equation'),
            full(
              h('p', { class: 'cs-body-text' }, [
                'In the ',
                h('a', {
                  class: 'cs-link',
                  role: 'link',
                  tabindex: '0',
                  onClick: () => { window.open('#agenticds', '_blank') },
                }, 'Agentic Design System'),
                ' case study, I structured a design system so AI agents could operate within it - auditing tokens, catching drift, keeping Figma and code in sync. That work assumed the Figma files were already well-structured. Layer Lint tackles the prerequisite: making sure the raw design files are readable by machines in the first place.',
              ]),

              h('p', { class: 'cs-body-text' },
                'Together they form two halves of the same thesis. A semantically named layer tree means an AI agent reading the file via Figma MCP gets meaningful context instead of "Frame 3 contains Rectangle 47". And a well-structured design system means the agent knows what those layers should be called, what tokens they should reference, and how they relate to code. Layer Lint is the cleanup. The agentic DS is the vocabulary.'),
            ),

            // ═══════════════════════════════════════════
            // OUTCOME
            // ═══════════════════════════════════════════
            h('h2', { class: 'cs-section-title' }, 'What I took away'),

            h('p', { class: 'cs-body-text' }, [
              'The biggest insight was that ',
              h('strong', null, 'layer names are an interface'),
              '. Not only for humans to navigate visually. But for every machine that reads the file: AI coding agents, design-to-code tools, accessibility audits, automated testing. A layer called "user-avatar" is a contract. A layer called "Ellipse 9" is a guessing game.',
            ]),

            full(
              h('p', { class: 'cs-body-text' }, [
                'Layer Lint came out of preparing our production Figma files at work for an agentic design system. As I started cleaning up, I discovered just how many dead layers and default names had accumulated. Hidden groups, unnamed rectangles, orphaned vectors everywhere. Renaming them one by one was ',
                h('strong', null, 'time-consuming and mentally draining'),
                '. I needed a way to semi-automate the process, so I built one. What started as solving my own frustration became something broader: as AI agents become a bigger part of the design-to-code pipeline, the quality of what they build depends on the quality of what they read. Clean layers aren\u2019t housekeeping - they\u2019re infrastructure.',
              ]),
            ),
          ]),
        ],
      })
  },
})
