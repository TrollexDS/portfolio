import { defineComponent, h, ref } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import ColourVariables from './ColourVariables.js'
import CollectionCard from './CollectionCard.js'

const VIDEO_SRC         = 'src/assets/videos/rayo-ds-clip.mp4'
const IMG_DS_POST       = 'src/assets/images/rayo/design-system/rayo-ds-post-update.png'
const IMG_DS_PRE        = 'src/assets/images/rayo/design-system/rayo-ds-pre-update.png'

const BeforeAfterToggle = defineComponent({
  name: 'BeforeAfterToggle',
  setup() {
    // Preload both images immediately so the browser decodes them before first toggle
    ;[IMG_DS_POST, IMG_DS_PRE].forEach(src => { const i = new Image(); i.src = src })

    const showNew    = ref(true)
    const animating  = ref(false)
    const enterClass = ref('')
    const exitClass  = ref('')
    const exitSrc    = ref('')

    function toggle() {
      if (animating.value) return
      const goingToNew = !showNew.value

      // Capture the image that's leaving before we flip state
      exitSrc.value   = showNew.value ? IMG_DS_POST : IMG_DS_PRE
      // New is on the right → entering from right / exiting to left
      // Old is on the left  → entering from left  / exiting to right
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
        // Exiting image — absolutely layered behind, slides out
        animating.value && exitSrc.value
          ? h('img', { class: ['ba-img', 'ba-img--abs', exitClass.value].join(' '), src: exitSrc.value, alt: '' })
          : null,
        // Entering (or static) image
        h('img', {
          class: ['ba-img', animating.value ? enterClass.value : ''].filter(Boolean).join(' '),
          src: showNew.value ? IMG_DS_POST : IMG_DS_PRE,
          alt: showNew.value ? 'Updated system architecture' : 'Previous system architecture',
        }),
      ]),
      h('div', { class: 'ba-toggle', onClick: toggle }, [
        h('span', { class: ['ba-label', !showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, 'Old'),
        h('div', { class: ['ba-track', showNew.value ? 'ba-track--on' : ''].filter(Boolean).join(' ') }, [
          h('div', { class: 'ba-thumb' }),
        ]),
        h('span', { class: ['ba-label', showNew.value ? 'ba-label--active' : ''].filter(Boolean).join(' ') }, 'New'),
      ]),
    ])
  },
})

export default defineComponent({
  name: 'RayoDSCard',
  setup() {
    const tldr = ref(false)

    // Wrap content that collapses in TL;DR mode
    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardClass: 'ds-card',
        videoSrc: VIDEO_SRC,
        videoClass: 'ds-video',
        tooltip: 'Maximise efficiency and consistency\nby refactoring the Rayo Design System 🎨',
        heroSize: 448,
      }, {
        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          // ── Top body: title, intro, role, impact ──
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Refactoring the Rayo Design System for Scalability & Consistency'),

            full(
              h('p', { class: 'cs-body-text' },
                'A comprehensive overhaul of the Rayo Design System, restructuring components, tokens, and documentation to support rapid multi-brand scaling while maintaining visual consistency across all products.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Design system lead'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '🧩 Simplified Component Architecture'),
            full(
              h('p', { class: 'cs-body-text' },
                'Reduced the overall complexity of the system by minimising the number of variants and introducing nested components. This created a more modular and flexible structure, making components easier to maintain, scale, and reuse without duplication.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🤝 Improved Design–Engineering Alignment'),
            full(
              h('p', { class: 'cs-body-text' },
                'Streamlined the handoff process by introducing clear documentation, structured usage notes, and leveraging Figma\u2019s Dev Mode. This ensured design intent was communicated more effectively, reducing back-and-forth and increasing implementation accuracy.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🎨 Reliable Theming with Colour Variables'),
            full(
              h('p', { class: 'cs-body-text' },
                'Eliminated light and dark mode inconsistencies by implementing Figma colour variables. This removed manual overrides and significantly reduced the risk of human error, ensuring themes remain consistent and scalable across the system.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🚀 Accessible & Easy to Adopt'),
            full(
              h('p', { class: 'cs-body-text' },
                'Lowered the barrier to entry for new designers by simplifying the system and improving guidance. Even new joiners can quickly understand and use the design system with confidence, without feeling overwhelmed by complexity.'),
            ),
          ]),

          // ── Cover image ──
          h('img', {
            class: 'cs-cover-img',
            src: 'src/assets/images/rayo/design-system/rayo-ds-cover.png',
            alt: 'Rayo Design System cover',
          }),

          // ── Problem section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Problem'),
            h('p', { class: 'cs-body-text' },
              'Designers often felt overwhelmed navigating the design system due to the high volume of components and lack of clear structure. Nested instances were frequently overlooked when not visible within master components, leading to duplicated components and inconsistencies.'),
            h('p', { class: 'cs-body-text' },
              'In addition, an outdated colour token system required manual switching between light and dark modes. This increased the number of unnecessary variants and introduced a higher risk of human error in production-ready designs.'),
          ]),

          // ── Colour variables section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Colour variables'),
            full(
              h('p', { class: 'cs-body-text' }, [
                'Following ',
                h('a', {
                  href: 'https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables-and-collections',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  class: 'cs-link',
                }, 'Figma\u2019s variable framework'),
                ', I collaborated with another designer to establish a scalable colour system. We defined primitive variables based on the brand style guide, and mapped them into semantic tokens for both light and dark modes. This removed the need for manual theme switching and created a more consistent and maintainable foundation for theming.',
              ]),
            ),
          ]),

          h(ColourVariables),

          // ── Spacing & Responsiveness section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Spacing & Responsiveness'),
            full(
              h('p', { class: 'cs-body-text' },
                'Working closely with the team, we standardised spacing and radius values to improve visual consistency across components. I also introduced breakpoints as variables, enabling responsive behaviour within components and automating layout adjustments across different screen sizes.'),
            ),
          ]),

          h('video', {
            class: 'cs-demo-video',
            src: 'src/assets/videos/figma-auto-responsive.mp4',
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            preload: 'auto',
            onLoadeddata: (e) => { e.target.play().catch(() => {}) },
          }),
          h('p', { class: 'cs-hint' }, 'Automated responsive and light and dark mode'),

          // ── Components refactor section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Components refactor'),
            full(
              h('p', { class: 'cs-body-text' },
                'The collection card component was a key focus of the refactor. Previously, it contained 48 variants that largely duplicated the same structure, differing only in background styles and spacing adjustments for tablet layouts.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: 'src/assets/images/rayo/design-system/component-optimisation-old.png',
            alt: 'Component optimisation — before refactor',
          }),
          h('p', { class: 'cs-hint' }, '[BEFORE] On-demand card component'),

          full(
            h('div', { class: 'cs-body cs-body--continued' }, [
              h('p', { class: 'cs-body-text' },
                'Instead of encoding these differences as variants, I extracted background styles into a separate, reusable background component. This allowed backgrounds to be applied as nested instances, exposed through a simple dropdown selection, making them easier to manage and update.'),
            ]),
          ),

          h('img', {
            class: 'cs-cover-img',
            src: 'src/assets/images/rayo/design-system/component-refactor-gradients.png',
            alt: 'New gradient background component',
          }),
          h('p', { class: 'cs-hint' }, '[NEW] Gradient background component'),

          full(
            h('div', { class: 'cs-body cs-body--continued' }, [
              h('p', { class: 'cs-body-text' },
                'As a result, the number of variants was reduced from 48 to just 4, while maintaining the same level of flexibility. This approach also scaled across other components with similar background requirements, significantly reducing duplication and improving overall system efficiency.'),
            ]),
          ),

          h(CollectionCard),

          // ── One Component, Multiple Contexts ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'One Component, Multiple Contexts'),
            full(
              h('p', { class: 'cs-body-text' },
                'As part of the design system optimisation, we leveraged auto layout wherever possible. Since most components share the same structure across mobile and tablet (differing primarily in width), this approach allowed us to use a single variant across breakpoints. By simply adjusting width within designs, components can responsively adapt without the need for separate variants, reducing duplication and improving consistency.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: 'src/assets/images/rayo/design-system/component-examples.png',
            alt: 'Component examples across breakpoints',
          }),
          h('p', { class: 'cs-hint' }, 'Responsive component structure'),

          // ── System Architecture section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Intuitive System Architecture'),
            full(
              h('p', { class: 'cs-body-text' },
                'The existing file structure could no longer support the growing complexity of the design system. Components were spread across multiple pages with unclear grouping logic, making them difficult to locate and navigate.'),
              h('p', { class: 'cs-body-text' },
                'To address this, I redesigned the system architecture with clarity and usability in mind. This ensures even new or less experienced designers can navigate it with ease. Each component now has its own dedicated page, structured into three clear sections:'),
              h('ul', { class: 'cs-body-list' }, [
                h('li', { class: 'cs-body-text' }, 'Overview for context and usage guidance'),
                h('li', { class: 'cs-body-text' }, 'Component for the master variants'),
                h('li', { class: 'cs-body-text' }, 'Examples to showcase real use cases and expose nested configurations'),
              ]),
              h('p', { class: 'cs-body-text' },
                'The example section also allows designers to quickly copy and paste production-ready instances directly into their work, streamlining adoption and reducing setup time.'),
            ),
          ]),

          h(BeforeAfterToggle),

          // ── Outcome section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Outcome'),
            h('p', { class: 'cs-body-text' }, [
              'The refactoring of the Rayo Design System transformed it into a scalable, intuitive, and production-ready foundation for the team. Component variants were reduced by over 90% in key areas, ',
              h('strong', null, 'significantly lowering complexity'),
              ' while maintaining full flexibility through modular and nested approaches.',
            ]),
            h('p', { class: 'cs-body-text' }, [
              'By introducing colour variables and responsive foundations, manual theming and layout adjustments were largely eliminated, ',
              h('strong', null, 'reducing errors and ensuring consistency'),
              ' across light and dark modes. Designers can now build responsive layouts using a single component across breakpoints, instead of managing multiple variants.',
            ]),
            h('p', { class: 'cs-body-text' }, [
              'The redesigned system architecture and improved documentation also reduced onboarding friction, ',
              h('strong', null, 'enabling new designers to confidently adopt the system faster'),
              '. In parallel, clearer specifications and Dev Mode usage improved design–engineering alignment, resulting in smoother handoffs and more accurate implementation.',
            ]),
            h('p', { class: 'cs-body-text' },
              'Overall, the system reduced duplication, minimised human error, and accelerated design workflows, allowing the team to deliver high-quality, consistent designs more efficiently at scale.'),
          ]),
        ],
      })
  },
})
