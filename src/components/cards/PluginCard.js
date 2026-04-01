import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import InteractiveTag from '../InteractiveTag.js'

/* ── Shared responsive scale (680 = Figma design width) ────────── */
const CS_BASE = 680
const csW     = ref(Math.min(CS_BASE, window.innerWidth - 48))
const csScale = computed(() => csW.value / CS_BASE)
const canHover = computed(() => csW.value >= CS_BASE)
function _onResize() { csW.value = Math.min(CS_BASE, window.innerWidth - 48) }
window.addEventListener('resize', _onResize)

const VIDEO_SRC = 'src/assets/videos/rayo-plugin-clip.mp4'
const SCREENSHOT         = 'src/assets/images/rayo/plugin/rayo-plugin-screenshot.png'
const PODCAST_SCREENSHOT = 'src/assets/images/rayo/plugin/rayo-plugin-podcast-screenshot.png'
const IMG_SEL_REGION = 'src/assets/images/rayo/plugin/select-a-region-hover.png'
const IMG_FIND_ST = 'src/assets/images/rayo/plugin/find-a-station-hover.png'
const IMG_QUICK = 'src/assets/images/rayo/plugin/quick-guide-hover.png'

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

const AntonymSection = defineComponent({
  name: 'AntonymSection',
  setup() {
    const active = ref(null)

    return () => {
      const s = csScale.value
      const hover = canHover.value

      // ── Mobile: flex layout — cards left, screenshot right ──
      if (!hover) {
        return h('div', {
          class: 'cs-antonym-section cs-antonym-section--mobile',
          style: { width: csW.value + 'px' },
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

// Figma: bg-white, 32px radius, images absolutely positioned within ~680px container
// V1: left 58, w 100 | V2–V5: left 182/298/414/530, w 92 | all: top 52, h 175
const V_IMGS = [
  { src: 'src/assets/images/rayo/plugin/rayo-plugin-V1.png', left: 58, width: 100 },
  { src: 'src/assets/images/rayo/plugin/rayo-plugin-V2.png', left: 182, width: 92 },
  { src: 'src/assets/images/rayo/plugin/rayo-plugin-V3.png', left: 298, width: 92 },
  { src: 'src/assets/images/rayo/plugin/rayo-plugin-V4.png', left: 414, width: 92 },
  { src: 'src/assets/images/rayo/plugin/rayo-plugin-V5.png', left: 530, width: 92 },
]

const CONTAINER_H  = 419
const BASE_IMG_H   = 175
const HOV_IMG_H    = Math.round(BASE_IMG_H * 2)      // 350
const BASE_TOP     = Math.round((CONTAINER_H - BASE_IMG_H) / 2)  // 122
const HOV_TOP      = Math.round((CONTAINER_H - HOV_IMG_H)  / 2)  //  96
const RIPPLE_MS    = 55   // delay increment per distance step

function getWrapStyle(img, i, hovIdx) {
  const s = csScale.value

  let left   = img.left
  let top    = BASE_TOP
  let width  = img.width
  let height = BASE_IMG_H
  let delay  = 0

  if (hovIdx !== null && canHover.value) {
    const hovW  = V_IMGS[hovIdx].width
    const shift = Math.round(hovW * 0.5)
    delay = Math.abs(i - hovIdx) * RIPPLE_MS

    if (i === hovIdx) {
      width  = Math.round(img.width * 2)
      height = HOV_IMG_H
      top    = HOV_TOP
      left   = img.left - Math.round((width - img.width) / 2)
    } else if (i < hovIdx) {
      left = img.left - shift
    } else {
      left = img.left + shift
    }
  }

  return {
    left:            Math.round(left   * s) + 'px',
    top:             Math.round(top    * s) + 'px',
    width:           Math.round(width  * s) + 'px',
    height:          Math.round(height * s) + 'px',
    transitionDelay: delay  + 'ms',
    '--i':           i,
  }
}

const VersionSection = defineComponent({
  name: 'VersionSection',
  setup() {
    const sectionEl = ref(null)
    const triggered = ref(false)
    const hovered   = ref(null)

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

    return () => {
      const s = csScale.value
      const hover = canHover.value

      return h('div', {
        ref: sectionEl,
        class: 'cs-versions-section',
        style: { width: csW.value + 'px', height: Math.round(CONTAINER_H * s) + 'px' },
      },
      V_IMGS.map((img, i) =>
        h('div', {
          key: i,
          class: ['cs-version-wrap', triggered.value ? 'cs-version-wrap--visible' : ''].join(' ').trim(),
          style: getWrapStyle(img, i, hovered.value),
          ...(hover ? {
            onMouseenter: () => { hovered.value = i },
            onMouseleave: () => { hovered.value = null },
          } : {}),
        }, [
          h('img', {
            class: 'cs-version-img',
            src: img.src,
            alt: `Rayo Plugin V${i + 1}`,
          }),
        ])
      ))
    }
  },
})

const ERROR_IMGS = [
  'src/assets/images/rayo/plugin/rayo-plugin-error-station.png',
  'src/assets/images/rayo/plugin/rayo-plugin-error-show.png',
  'src/assets/images/rayo/plugin/rayo-plugin-error-podcast.png',
  'src/assets/images/rayo/plugin/rayo-plugin-error-episode.png',
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

    return () => h('div', { class: 'cs-error-section' }, [

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
        src: 'src/assets/images/rayo/plugin/figma-bar.png',
        alt: 'Figma toolbar',
      }),
    ])
  },
})

// ── Marquee background rows ──
const MARQUEE_ROWS = [
  { imgs: Array.from({ length: 11 }, (_, i) => `src/assets/images/rayo/plugin/rayo-plugin-row/${String(i + 1).padStart(2, '0')}.png`),  dir: 'left'  },
  { imgs: Array.from({ length: 10 }, (_, i) => `src/assets/images/rayo/plugin/rayo-plugin-row/${String(i + 12).padStart(2, '0')}.png`), dir: 'right' },
  { imgs: Array.from({ length: 11 }, (_, i) => `src/assets/images/rayo/plugin/rayo-plugin-row/${String(i + 22).padStart(2, '0')}.png`), dir: 'left'  },
  { imgs: Array.from({ length: 10 }, (_, i) => `src/assets/images/rayo/plugin/rayo-plugin-row/${String(i + 33).padStart(2, '0')}.png`), dir: 'right' },
]

const HITS_IMG = 'src/assets/images/rayo/plugin/rayo-plugin-hits.png'

const MarqueeSection = defineComponent({
  name: 'MarqueeSection',
  setup() {
    return () =>
      h('div', { class: 'cs-marquee-section' }, [
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
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardClass: 'plugin-card',
        videoSrc: VIDEO_SRC,
        videoClass: 'plugin-video',
        tooltip: 'Streamline the design process\nwith a Figma plugin 🔁',
        heroSize: 448,
      }, {
        content: () => [

          // ── TL;DR toggle ──
          h('div', { class: 'tldr-bar' }, [
            h('div', { class: 'tldr-indicator', style: { left: tldr.value ? 'calc(50% - 2px)' : '4px' } }),
            h('button', {
              class: ['tldr-pill', !tldr.value ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
              onClick: () => { tldr.value = false },
            }, 'Detailed'),
            h('button', {
              class: ['tldr-pill', tldr.value ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
              onClick: () => { tldr.value = true },
            }, 'TL;DR'),
          ]),

          // ── Top body: title, intro, role, impact ──
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Streamlining the Design Process & Improving Efficiency at Scale'),

            h('p', { class: 'cs-body-text' },
              'Rayo Thumbnails is a Figma plugin that connects directly to Bauer\'s Listen API, instantly applying live assets and metadata to selected layers. It empowers designers to move faster. From early concepts to production-ready designs—without manual asset handling.'),

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
          h(InteractiveTag, { hint: 'Hover on the cards to learn more' }),

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
            'data-src': 'src/assets/videos/rayo-plugin-demo.mp4',
            loop: true,
            muted: true,
            playsinline: true,
            preload: 'none',
            disablePictureInPicture: true,
            controlsList: 'nodownload nofullscreen noremoteplayback',
            style: 'pointer-events: none;',
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
          h(InteractiveTag, { hint: 'Version history from left to right' }),

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
              'Rayo Thumbnails has become an integral part of our design workflow, enabling the team to work faster, stay aligned with live content, and scale design output across multiple regions with confidence. By removing repetitive tasks and reducing errors, it allows designers to focus on what matters most - crafting better user experiences.'),
          ]),

          // ── Moving background — radio station tiles ──
          h(MarqueeSection),
        ],
      })
  },
})
