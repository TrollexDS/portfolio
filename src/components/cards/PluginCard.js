import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'
import { useResponsiveScale } from '../../composables/useResponsiveScale.js'
import { PLUGIN_LIBRARY } from './pluginLibrary.data.js'

const PLUGIN_ICON = '/src/assets/images/rayo/plugin/rayo-assets-icon.webp'
const PLUGIN_HERO = '/src/assets/images/rayo/plugin/rayo-plugin-hero.svg'
const SCREENSHOT         = '/src/assets/images/rayo/plugin/rayo-plugin-screenshot.png'
const PODCAST_SCREENSHOT = '/src/assets/images/rayo/plugin/rayo-plugin-podcast-screenshot.png'
const IMG_SEL_REGION = '/src/assets/images/rayo/plugin/select-a-region-hover.png'
const IMG_FIND_ST = '/src/assets/images/rayo/plugin/find-a-station-hover.png'
const IMG_QUICK = '/src/assets/images/rayo/plugin/quick-guide-hover.png'

// Card positions taken directly from Figma (680px-wide container)
const CARDS = [
  { id: 'select-region', title: 'Select a region', desc: 'Pick a region across 9 markets that Bauer Media operates.', left: 55, top: 88, hoverImg: IMG_SEL_REGION },
  { id: 'find-station', title: 'Find a station', desc: 'Pick a station from the selected region to browse available radio shows.', left: 55, top: 217, hoverImg: IMG_FIND_ST },
  { id: 'content-type', title: 'Content type', desc: 'Switch between Radio Show and Podcast.', left: 472, top: 63, hoverImg: null },
  { id: 'quick-guide', title: 'Quick guide', desc: 'Guidelines on conditions and structures.', left: 472, top: 178, hoverImg: IMG_QUICK },
  { id: 'apply-designs', title: 'Apply to designs', desc: 'Click on a show to update your designs.', left: 472, top: 313, hoverImg: null },
]

const ANTONYM_H = 600                        // Figma design height
const ANTONYM_SCREENSHOT_W = 225
const ANTONYM_SCREENSHOT_H = 476
const ANTONYM_CARD_W       = 152

// Mobile card order: content-type first, then the rest stacked
const MOBILE_CARDS = [CARDS[2], CARDS[0], CARDS[1], CARDS[3], CARDS[4]]

/* ─────────────────────────────────────────────────────────────
   RayoLibraryBg — DOM-based animated plugin panel for the card face.
   Walks the asset library: for each region, the Radio Show tab with
   one station's shows, then the Podcast tab with that region's
   podcasts. Rows stagger in, hold, stagger out; the segmented
   control slides and the region/station labels swap between steps.
   Decorative only (aria-hidden); the prose carries the meaning.
   ───────────────────────────────────────────────────────────── */
const PC_STEPS = PLUGIN_LIBRARY.flatMap(r => {
  const radio = {
    key: r.region + '-radio', tab: 'radio', flag: r.flag, regionName: r.name, station: r.station,
    rows: [
      ...(r.logo ? [{ title: r.station, img: r.logo, logo: true }] : []),
      ...r.shows,
    ],
  }
  const pods = r.pods.length
    ? { key: r.region + '-pods', tab: 'podcast', flag: r.flag, regionName: r.name, station: 'All podcasts', rows: r.pods }
    : null
  return pods ? [radio, pods] : [radio]
})

const PC_T = {
  rowIn:   70,    // stagger between rows entering
  hold:    2300,  // all rows visible
  rowOut:  35,    // stagger between rows leaving
  outDur:  320,   // row exit transition
  inLag:   140,   // new rows start entering this long after the old start leaving
}

const RayoLibraryBg = defineComponent({
  name: 'RayoLibraryBg',

  setup() {
    const stepIdx     = ref(0)
    const rowsIn      = ref(0)      // rows of the current step revealed so far
    const leavingRows = ref(null)   // previous step's rows while they animate out
    const leavingOut  = ref(0)      // how many of those have been dismissed
    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let timers = []
    let destroyed = false
    const step = () => PC_STEPS[stepIdx.value % PC_STEPS.length]

    function schedule(fn, ms) {
      const id = setTimeout(() => { if (!destroyed) fn() }, ms)
      timers.push(id)
    }

    // Reveal the current step's rows, then hand over to the next step.
    function enter(lag = 0) {
      const n = step().rows.length
      rowsIn.value = 0
      for (let i = 0; i < n; i++) schedule(() => { rowsIn.value = i + 1 }, lag + i * PC_T.rowIn)
      schedule(advance, lag + n * PC_T.rowIn + PC_T.hold)
    }

    // The switch: tab, labels and rows all change together. The old rows
    // stagger out on top while the new ones stagger in underneath.
    function advance() {
      const old = step().rows
      leavingRows.value = old
      leavingOut.value = 0
      for (let i = 0; i < old.length; i++) schedule(() => { leavingOut.value = i + 1 }, i * PC_T.rowOut)
      schedule(() => { leavingRows.value = null }, old.length * PC_T.rowOut + PC_T.outDur)

      stepIdx.value = (stepIdx.value + 1) % PC_STEPS.length
      enter(PC_T.inLag)
    }

    onMounted(() => {
      if (reduced) { rowsIn.value = step().rows.length; return }
      schedule(() => enter(0), 250)
    })
    onUnmounted(() => { destroyed = true; timers.forEach(clearTimeout) })

    const chevron = () => h('svg', { class: 'pc-chevron', viewBox: '0 0 12 12', width: 10, height: 10 }, [
      h('path', { d: 'M2.5 4.5 6 8l3.5-3.5', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ])

    const rowNode = (row, i, cls, key) =>
      h('div', { key, class: ['pc-row', ...cls, row.logo ? 'pc-row--logo' : ''].filter(Boolean).join(' ') }, [
        h('img', { class: 'pc-thumb', src: row.img, alt: '', loading: 'lazy', decoding: 'async' }),
        h('span', { class: 'pc-name' }, row.title),
      ])

    return () => {
      const s = step()
      return h('div', { class: 'pc-bg-wrap', 'aria-hidden': 'true' }, [
        h('div', { class: 'pc-panel' }, [

          // Segmented control — pill slides between tabs
          h('div', { class: ['pc-seg', s.tab === 'podcast' ? 'pc-seg--podcast' : ''].filter(Boolean).join(' ') }, [
            h('span', { class: 'pc-seg-pill' }),
            h('span', { class: ['pc-seg-item', s.tab === 'radio' ? 'pc-seg-item--on' : ''].filter(Boolean).join(' ') }, 'Radio Show'),
            h('span', { class: ['pc-seg-item', s.tab === 'podcast' ? 'pc-seg-item--on' : ''].filter(Boolean).join(' ') }, 'Podcast'),
          ]),

          // Region
          h('div', { class: 'pc-select' }, [
            h('span', { key: s.regionName, class: 'pc-select-label pc-select-label--in' }, s.flag + ' ' + s.regionName),
            chevron(),
          ]),

          // Station / podcast scope
          h('div', { class: 'pc-select pc-select--station' }, [
            h('span', { key: s.key, class: 'pc-select-label pc-select-label--in' }, s.station),
            chevron(),
          ]),

          h('div', { class: 'pc-divider' }),

          // Asset rows — two stacked lists during a switch: leaving on top, entering below
          h('div', { class: 'pc-list' }, [
            h('div', { key: s.key, class: 'pc-list-layer' },
              s.rows.map((row, i) => rowNode(row, i, [i < rowsIn.value ? 'pc-row--in' : ''], s.key + '-' + i))
            ),
            leavingRows.value
              ? h('div', { key: 'leaving', class: 'pc-list-layer pc-list-layer--leaving' },
                  leavingRows.value.map((row, i) =>
                    rowNode(row, i, ['pc-row--in', i < leavingOut.value ? 'pc-row--out' : ''], 'leaving-' + i))
                )
              : null,
          ]),
        ]),
      ])
    }
  },
})

// Collapsed face + hero overlay + fly content share this block: the card
// reads as the plugin's window, with Figma's title bar across the top
// (no close button) over the live panel.
const pluginFace = () => h('div', { class: 'pc-window-bar' }, [
  h('img', { src: PLUGIN_ICON, alt: '', class: 'pc-window-icon' }),
  h('p', { class: 'pc-window-title' }, 'Rayo Assets Plugin'),
])

const AntonymSection = defineComponent({
  name: 'AntonymSection',
  setup() {
    const { containerW: csW, scale: csScale, canHover } = useResponsiveScale(680)
    const active = ref(null)

    return () => {
      const s = csScale.value
      const hover = canHover.value

      // aria-hidden: decorative interactive demo of the plugin's UI cards.
      // The case-study prose covers the meaning; card titles/descriptions
      // would otherwise leak as run-on text into Reader Mode and screen readers.

      // ── Mobile: flex layout — cards left, screenshot right ──
      if (!hover) {
        return h('div', {
          class: 'cs-antonym-section cs-antonym-section--mobile',
          style: { width: csW.value + 'px' },
          'aria-hidden': 'true',
        }, [
          h('div', { class: 'cs-antonym-mobile-cards' },
            MOBILE_CARDS.map(card =>
              h('div', { key: card.id, class: 'cs-antonym-card' }, [
                h('p', { class: 'cs-antonym-card-title' }, card.title),
                h('p', { class: 'cs-antonym-card-desc' }, card.desc),
              ])
            )
          ),
          h('div', { class: 'cs-antonym-mobile-screenshot' }, [
            h('img', {
              class: 'cs-antonym-screenshot',
              src: SCREENSHOT,
              alt: 'Rayo Plugin interface',
            }),
          ]),
        ])
      }

      // ── Desktop: absolute positioning from Figma ──
      return h('div', {
        class: 'cs-antonym-section',
        style: { width: csW.value + 'px', height: Math.round(ANTONYM_H * s) + 'px' },
        'aria-hidden': 'true',
      }, [

        h('div', {
          class: 'cs-antonym-screenshot-wrap',
          style: {
            left: 'calc(50% - ' + Math.round(ANTONYM_SCREENSHOT_W * s / 2) + 'px)',
            top:  Math.round(62 * s) + 'px',
            width:  Math.round(ANTONYM_SCREENSHOT_W * s) + 'px',
            height: Math.round(ANTONYM_SCREENSHOT_H * s) + 'px',
          },
        }, [
          h('img', {
            class: ['cs-antonym-screenshot', active.value === 'content-type' ? 'cs-antonym-screenshot--exit' : ''].filter(Boolean).join(' '),
            src: SCREENSHOT,
            alt: 'Rayo Plugin interface',
          }),
          h('img', {
            class: ['cs-antonym-screenshot', 'cs-antonym-screenshot--podcast', active.value === 'content-type' ? 'cs-antonym-screenshot--active' : ''].join(' '),
            src: PODCAST_SCREENSHOT,
            alt: 'Rayo Plugin podcast interface',
          }),
        ]),

        ...CARDS.map(card =>
          h('div', {
            key: card.id,
            class: 'cs-antonym-card-wrapper',
            style: {
              left:  Math.round(card.left * s) + 'px',
              top:   Math.round(card.top * s)  + 'px',
              width: Math.round(ANTONYM_CARD_W * s) + 'px',
            },
            onMouseenter: () => { active.value = card.id },
            onMouseleave: () => { active.value = null },
          }, [

            h('div', {
              class: 'cs-antonym-card',
              style: { opacity: active.value && active.value !== card.id ? 0.3 : 1 },
            }, [
              h('p', { class: 'cs-antonym-card-title' }, card.title),
              h('p', { class: 'cs-antonym-card-desc' }, card.desc),
            ]),

            card.hoverImg
              ? h('img', {
                class: ['cs-antonym-hover-img', active.value === card.id ? 'cs-antonym-hover-img--visible' : ''].join(' ').trim(),
                src: card.hoverImg,
                alt: card.title,
              })
              : null,
          ])
        ),
      ])
    }
  },
})

const V_IMGS = [
  { src: '/src/assets/images/rayo/plugin/rayo-plugin-V1.png?v=2', hint: 'POC' },
  { src: '/src/assets/images/rayo/plugin/rayo-plugin-V2.png', hint: 'Included podcast' },
  { src: '/src/assets/images/rayo/plugin/rayo-plugin-V3.png', hint: 'Expanded Regions' },
  { src: '/src/assets/images/rayo/plugin/rayo-plugin-V4.png', hint: 'Added episodes' },
  { src: '/src/assets/images/rayo/plugin/rayo-plugin-V5.png', hint: 'Developed guidelines' },
]

const VersionSection = defineComponent({
  name: 'VersionSection',
  setup() {
    const { containerW: csW } = useResponsiveScale(680)
    const sectionEl = ref(null)
    const triggered = ref(false)

    onMounted(() => {
      const el = sectionEl.value
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            triggered.value = true
            observer.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      observer.observe(el)
    })

    // aria-hidden: decorative version-history demo. Version hint labels
    // would otherwise leak into Reader Mode alongside the case-study prose.
    return () =>
      h('div', {
        ref: sectionEl,
        class: 'cs-versions-section',
        style: { width: Math.round(csW.value * 1.5) + 'px' },
        'aria-hidden': 'true',
      },
      V_IMGS.map((img, i) =>
        h('div', {
          key: i,
          class: ['cs-version-wrap', triggered.value ? 'cs-version-wrap--visible' : ''].join(' ').trim(),
          style: { '--i': i },
        }, [
          h('img', {
            class: 'cs-version-img',
            src: img.src,
            alt: `Rayo Plugin V${i + 1}`,
          }),
          h('p', { class: 'cs-hint' }, img.hint),
        ])
      ))
  },
})

const ERROR_IMGS = [
  '/src/assets/images/rayo/plugin/rayo-plugin-error-station.png',
  '/src/assets/images/rayo/plugin/rayo-plugin-error-show.png',
  '/src/assets/images/rayo/plugin/rayo-plugin-error-podcast.png',
  '/src/assets/images/rayo/plugin/rayo-plugin-error-episode.png',
]

const ErrorSection = defineComponent({
  name: 'ErrorSection',
  setup() {
    const activeIdx = ref(0)
    const prevIdx = ref(null)

    const timer = setInterval(() => {
      prevIdx.value = activeIdx.value
      activeIdx.value = (activeIdx.value + 1) % ERROR_IMGS.length
      // Clear leaving state once animation completes
      setTimeout(() => { prevIdx.value = null }, 420)
    }, 2500)
    onUnmounted(() => clearInterval(timer))

    // aria-hidden: decorative rotating error-state demo. The case-study
    // prose explains the error guidance; the rotating images are visual
    // illustration only.
    return () => h('div', { class: 'cs-error-section', 'aria-hidden': 'true' }, [

      // ── Rotating error bar — slide-up in, slide-up out ──
      h('div', { class: 'cs-error-bar' },
        ERROR_IMGS.map((src, i) => {
          const isActive = activeIdx.value === i
          const isLeaving = prevIdx.value === i
          return h('img', {
            key: i,
            src,
            alt: `Plugin error guidance ${i + 1}`,
            class: [
              'cs-error-img',
              isActive ? 'cs-error-img--active' : '',
              isLeaving ? 'cs-error-img--leaving' : '',
            ].filter(Boolean).join(' '),
          })
        })
      ),

      // ── Static Figma toolbar ──
      h('img', {
        class: 'cs-figma-bar',
        src: '/src/assets/images/rayo/plugin/figma-bar.png',
        alt: 'Figma toolbar',
      }),
    ])
  },
})

// ── Marquee background rows ──
const MARQUEE_ROWS = [
  { imgs: Array.from({ length: 11 }, (_, i) => `/src/assets/images/rayo/plugin/plugin-row/${String(i + 1).padStart(2, '0')}.png`),  dir: 'left'  },
  { imgs: Array.from({ length: 10 }, (_, i) => `/src/assets/images/rayo/plugin/plugin-row/${String(i + 12).padStart(2, '0')}.png`), dir: 'right' },
  { imgs: Array.from({ length: 11 }, (_, i) => `/src/assets/images/rayo/plugin/plugin-row/${String(i + 22).padStart(2, '0')}.png`), dir: 'left'  },
  { imgs: Array.from({ length: 10 }, (_, i) => `/src/assets/images/rayo/plugin/plugin-row/${String(i + 33).padStart(2, '0')}.png`), dir: 'right' },
]

const HITS_IMG = '/src/assets/images/rayo/plugin/rayo-plugin-hits.png'

const MarqueeSection = defineComponent({
  name: 'MarqueeSection',
  setup() {
    // aria-hidden: decorative scrolling marquee of station tiles.
    // Purely visual flourish — no meaningful content for a11y tree.
    return () =>
      h('div', { class: 'cs-marquee-section', 'aria-hidden': 'true' }, [
        // Scrolling rows
        ...MARQUEE_ROWS.map((row, ri) =>
          h('div', {
            key: ri,
            class: ['cs-marquee-track', row.dir === 'right' ? 'cs-marquee-track--right' : ''].filter(Boolean).join(' '),
          }, [
            ...[0, 1].map(copy =>
              h('div', { key: copy, class: 'cs-marquee-set', 'aria-hidden': copy === 1 ? 'true' : undefined },
                row.imgs.map((src, ii) =>
                  h('img', { key: ii, class: 'cs-marquee-img', src, alt: '', loading: 'lazy' })
                )
              )
            ),
          ])
        ),
        // Centred hero image
        h('img', { class: 'cs-marquee-hero', src: HITS_IMG, alt: 'Rayo Plugin — Hits Radio' }),
      ])
  },
})

export default defineComponent({
  name: 'PluginCard',
  setup() {
    const { canHover } = useResponsiveScale(680)
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'plugin',
        cardClass: 'plugin-card',
        imageSrc: PLUGIN_HERO,
        imageClass: 'pc-hero-img',
        heroWrapClass: 'pc-hero-wrap',
        tooltip: 'Streamline the design process\nwith a Figma plugin 🔁',
        heroSize: 448,
      }, {
        // ── Collapsed card face: animated plugin panel + logo + title ──
        default: () => [
          h(RayoLibraryBg),
          pluginFace(),
        ],

        // ── Hero overlay: live panel on top of the placeholder ──
        heroOverlay: () => h('div', { class: 'pc-hero-overlay' }, [
          h(RayoLibraryBg),
          pluginFace(),
        ]),

        // ── Fly content ──
        flyContent: () => h('div', { class: 'pc-fly-overlay' }, [
          pluginFace(),
        ]),

        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          // ── Top body: title, intro, role, impact ──
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Streamlining the Design Process & Improving Efficiency at Scale'),

            full(
              h('p', { class: 'cs-body-text' },
                'Rayo Assets Plugin is a Figma plugin that connects directly to Bauer\'s Listen API, instantly applying live assets and metadata to selected layers. It empowers designers to move faster. From early concepts to production-ready designs—without manual asset handling.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Design and development'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '⚡️ Faster Design Execution'),
            full(
              h('p', { class: 'cs-body-text' },
                'Reduced hours of manual work into seconds. Designers can instantly populate and update thumbnails, logos, and metadata. Freeing up time to focus on higher-value design decisions.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🆕 Always Up-to-Date by Default'),
            full(
              h('p', { class: 'cs-body-text' },
                'Eliminated outdated assets in design files. By pulling directly from the API, designs automatically reflect the latest content, therefore removing the need for constant library maintenance.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🌍 Scaled Design Across Regions'),
            full(
              h('p', { class: 'cs-body-text' },
                'Unlocked the ability to design for multiple markets with ease. Region-specific APIs enable rapid creation of localised concepts, supporting global product teams without added complexity.'),
            ),
          ]),

          // ── Antonym section (above Problem) ──
          h(AntonymSection),
          canHover.value ? h(InteractiveTag, { hint: 'Hover on the cards to learn more' }) : null,

          // ── Bottom body: problem, solution ──
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Problem'),
            h('p', { class: 'cs-body-text' },
              'Bauer Media operates 150+ radio brands across 9 European markets, with content that is constantly evolving across regions and languages. As a UK-based design team of seven, maintaining a scalable and up-to-date asset library was not sustainable. Manual asset sourcing significantly slowed down the creation of prototypes and production-ready designs, creating inefficiencies across the design workflow.'),

            h('h2', { class: 'cs-section-title' }, 'Solution'),
            full(
              h('p', { class: 'cs-body-text' },
                'I designed and developed a Figma plugin that integrates directly with Bauer\'s Listen API, enabling designers to access live content within their workflow. The plugin allows users to search and filter by content type, region, and brand, and instantly apply up-to-date assets and metadata to selected layers. This ensures consistency, reduces manual effort, and streamlines the transition from concept to developer handoff.'),
            ),
          ]),

          h('video', {
            class: 'cs-demo-video',
            src: '/src/assets/videos/rayo-plugin-demo.mp4',
            poster: '/src/assets/images/rayo/plugin/rayo-plugin-demo-poster.jpg',
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            preload: 'auto',
            disablePictureInPicture: true,
            controlsList: 'nodownload nofullscreen noremoteplayback',
            style: 'pointer-events: none;',
            onLoadeddata: (e) => { e.target.muted = true; e.target.play().catch(() => {}) },
          }),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Continuous Iteration'),
            full(
              h('p', { class: 'cs-body-text' },
                'I actively identify pain points in the team\'s workflow by observing how my team work in Figma in general, and how they use the plugin to gather regular feedback. This iterative approach allows me to continuously refine and expand its capabilities.'),
              h('p', { class: 'cs-body-text' },
                'The plugin evolved from a simple tool for pulling radio show thumbnails into a more comprehensive system. Features were progressively introduced, including podcast support, multi-region coverage, genre-based filtering, and individual episode-level assets. Most recently, I added an in-app guidance panel to streamline layer naming and improve usability.'),
            ),
          ]),

          // ── Version history ──
          h(VersionSection),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'User Guidance & Error Handling'),
            full(
              h('p', { class: 'cs-body-text' },
                'A key focus was ensuring the plugin remains intuitive and supportive, even when errors occur. Many issues stemmed from incorrect layer naming, preventing assets from being applied correctly.'),
              h('p', { class: 'cs-body-text' },
                'To address this, I designed a guidance overlay and clear, actionable error messages that help users quickly identify and resolve issues. This not only reduces friction but also builds confidence in using the tool as part of the design workflow.'),
            ),
          ]),

          // ── Error guidance ──
          h(ErrorSection),

          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Result'),
            h('p', { class: 'cs-body-text' },
              'Rayo Assets Plugin has become an integral part of our design workflow, enabling the team to work faster, stay aligned with live content, and scale design output across multiple regions with confidence. By removing repetitive tasks and reducing errors, it allows designers to focus on what matters most - crafting better user experiences.'),
          ]),

          // ── Moving background — radio station tiles ──
          h(MarqueeSection),
        ],
      })
  },
})
