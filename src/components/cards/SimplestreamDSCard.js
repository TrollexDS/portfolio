import { defineComponent, h, ref } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'

const IMAGE_SRC       = 'src/assets/images/simplestream/ss-ds-card.png'
const LOGO_SRC        = './src/assets/images/general/SS-clients-logo.png'
const IMG_COVER       = 'src/assets/images/simplestream/ss--ds-cover.png'
const IMG_COMPONENTS  = 'src/assets/images/simplestream/ss-ds-components.png'
const IMG_SWAP_DEMO   = 'src/assets/images/simplestream/figma-swap-library-demo.gif'
const IMG_COLOURS     = 'src/assets/images/simplestream/ss-ds-colours.png'
const IMG_SWAP        = 'src/assets/images/simplestream/ss-ds-swap.png'
const IMG_COLLAGE     = 'src/assets/images/simplestream/the-app-platform-collage.png'
const IMG_TYPOGRAPHY  = 'src/assets/images/simplestream/ss-ds-typography.png'

export default defineComponent({
  name: 'SimplestreamDSCard',
  setup() {
    const tldr = ref(false)

    // Wrap content that collapses in TL;DR mode
    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardClass: 'ss-ds-card',
        imageSrc: IMAGE_SRC,
        imageClass: 'ss-ds-image',
        tooltip: 'Scaling a white-label design system\nto manage 50+ clients 🎨',
        heroWrapClass: 'ss-ds-hero-wrap',
        heroSize: 448,
      }, {

        // ── Collapsed card overlay (scrolling logo banner) ──
        default: () => [
          h('div', { class: 'pc1-banner' },
            h('div', { class: 'pc1-track' }, [
              h('img', { src: LOGO_SRC, alt: 'Clients', draggable: false }),
              h('img', { src: LOGO_SRC, alt: '',        draggable: false, 'aria-hidden': 'true' }),
            ])
          ),
        ],

        // ── Logo rail overlaid on the hero visual ──
        heroOverlay: () =>
          h('div', { class: 'ss-ds-hero-overlay' }, [
            h('div', { class: 'pc1-banner pc1-banner--expanded' },
              h('div', { class: 'pc1-track' }, [
                h('img', { src: LOGO_SRC, alt: 'Client logos', draggable: false }),
                h('img', { src: LOGO_SRC, alt: '',             draggable: false, 'aria-hidden': 'true' }),
              ])
            ),
          ]),

        // ── Expanded case study content ──
        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          // ── Top body: title, intro, role, impact ──
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Brand Switching in Seconds: Scaling a White-Label Design System'),

              h('p', { class: 'cs-body-text' },
                'Simplestream is a B2B OTT service provider - we design and build streaming apps across mobile, tablet, web, and TV for clients around the world. As one of two designers, I was responsible for maintaining a white-label design system that powered 50+ client brands, each with their own look and feel across 100+ screens.'),
              h('p', { class: 'cs-body-text' },
                'The challenge wasn\u2019t just designing at scale - it was making it possible for a tiny team to move fast without breaking things.'),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Product Designer'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '⌛️ From Minutes to Seconds'),
            full(
              h('p', { class: 'cs-body-text' },
                'Reduced brand-switching time from 5-10 minutes down to seconds by replacing a third-party plugin with Figma\u2019s native Swap Library feature - eliminating freezes, glitches, and manual error-checking entirely.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🛠️ Zero Glitches, Zero Manual Fixes'),
            full(
              h('p', { class: 'cs-body-text' },
                'The old plugin frequently caused Figma to freeze or produce errors on large files, requiring time-consuming manual checks. The new approach is completely reliable - no crashes, no broken tokens, no cleanup.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🏗️ Restructured Design Files'),
            full(
              h('p', { class: 'cs-body-text' },
                'Defined a new token naming structure and renamed every colour token, font style, and layer across the entire system to make it compatible with Figma\u2019s Swap Library feature.'),
            ),
          ]),

          // ── Components image after Impact (full-width, no padding) ──
          h('img', {
            class: 'cs-cover-img ss-ds-img-full',
            src: IMG_COMPONENTS,
            alt: 'Design system components',
          }),

          // ── Problem section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Problem'),
            h('p', { class: 'cs-body-text' },
              'We relied on a third-party Figma plugin to swap brand themes across our design files. On paper, it solved the right problem. In practice, it took 5\u201310 minutes to process 100+ screens \u2014 frequently freezing Figma, producing broken tokens, and requiring manual checks to fix what it missed.'),
              h('p', { class: 'cs-body-text' },
                'For a two-person team managing 50+ clients, every failed swap meant lost time we couldn\u2019t afford. It slowed onboarding, ate into design time, and eroded trust in the system itself.'),
          ]),

          // ── Cover image after Problem ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_COVER,
            alt: 'Simplestream design system overview',
          }),

          // ── Turning Point section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Turning Point'),
            full(
              h('p', { class: 'cs-body-text' }, [
                'When Figma released the ',
                h('a', {
                  href: 'https://help.figma.com/hc/en-us/articles/4404856784663-Swap-style-and-component-libraries',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  class: 'cs-link',
                }, 'Swap Library'),
                ' feature, I saw an opportunity to solve this properly - not with another workaround, but by rethinking how our system was structured.',
              ]),
            ),
            full(
              h('p', { class: 'cs-body-text' },
                'Swap Library allows you to swap an entire linked library for another in one action - natively, without plugins. But it wasn\u2019t a drop-in fix. For it to work, every token and layer in the system needed to follow a specific naming structure. The existing system wasn\u2019t set up for this. Rather than patching the old workflow, I committed to restructuring the entire design system from the ground up.'),
            ),
          ]),

          // ── Figma Swap Library demo ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_SWAP_DEMO,
            alt: 'Figma Swap Library feature demo',
          }),
          h('p', { class: 'cs-hint' }, 'Figma\u2019s native Swap Library feature in action'),

          // ── Solution: Token Structure ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Defining a New Token Structure'),
            full(
              h('p', { class: 'cs-body-text' },
                'I defined a new naming structure and went through every token in the system - renaming each one so that libraries could be swapped cleanly. This wasn\u2019t just a find-and-replace job; it meant rethinking how our tokens were organised to be compatible with Figma\u2019s Swap Library feature.'),
            ),
          ]),

          // ── App platform collage ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_COLLAGE,
            alt: 'The app platform across multiple clients',
          }),
          h('p', { class: 'cs-hint' }, 'A UI sheet we share with clients to choose features they need'),

          // ── Solution: Colour Tokens ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Colour Tokens'),
            full(
              h('p', { class: 'cs-body-text' },
                'Our colour token template contains a wide range of component-specific colour tokens, giving clients greater flexibility to customise the look and feel of their apps. In order for these tokens to be compatible with the Swap Library feature, I defined a new structure and renamed every token to follow a consistent convention that Figma could map between libraries.'),
            ),
          ]),

          // ── Colour tokens image ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_COLOURS,
            alt: 'Colour token structure',
          }),
          h('p', { class: 'cs-hint' }, 'Component-specific colour tokens mapped for library swapping'),

          // ── Solution: Typography ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Typography'),
            full(
              h('p', { class: 'cs-body-text' },
                'Font styles are fixed in size and weight to ensure text remains visible and the app stays accessible. However, we give clients the flexibility to choose a single typeface to be used consistently across all their apps. This maps cleanly to the library swap - the typeface changes, but the scale stays locked.'),
            ),
          ]),

          // ── Typography image (scrollable container) ──
          h('div', { class: 'ss-ds-scroll-container cs-cover-img' }, [
            h('img', {
              src: IMG_TYPOGRAPHY,
              alt: 'Typography styles and type scale',
              class: 'ss-ds-scroll-img',
            }),
          ]),
          h(InteractiveTag, { hint: 'Fixed sizes and weights, flexible typeface per client' }),

          // ── Solution: New Onboarding Workflow ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'The New Onboarding Workflow'),
            full(
              h('p', { class: 'cs-body-text' },
                'Every time we onboard a new client, we duplicate our templates and set up a custom theme. By swapping the design library, we can instantly apply the client\u2019s unique look and feel. What used to take minutes of anxious waiting and manual fixing now happens in seconds.'),
            ),
          ]),

          // ── Swap result image ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_SWAP,
            alt: 'Design library swap in action',
          }),
          h('p', { class: 'cs-hint' }, 'Swapping a client\u2019s brand with one click'),

          // ── Outcome section ──
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Outcome'),
            h('p', { class: 'cs-body-text' }, [
              'The refactored design system ',
              h('strong', null, 'eliminated freezes, glitches, and errors entirely'),
              '. Brand switching went from 5-10 minutes of anxious waiting and manual cleanup to seconds. The swap just works, every time.',
            ]),
            h('p', { class: 'cs-body-text' }, [
              'A team of 2 designers can now confidently ',
              h('strong', null, 'manage 50+ client brands'),
              ' across 100+ screens each - a workload that would typically demand a much larger team. The design system became something we could trust, not work around.',
            ]),
            h('p', { class: 'cs-body-text' }, [
              'This wasn\u2019t a flashy redesign - it was the kind of foundational work that makes everything else possible. By investing the time to restructure our system properly, we gave ourselves the ',
              h('strong', null, 'ability to scale'),
              ' without scaling the team.',
            ]),
          ]),
        ],
      })
  },
})
