import { defineComponent, h, ref, computed, Transition } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'
import MagneticTokensBg from '../MagneticTokensBg.js'

// ── Card face logos ──
const LOGO_STORYBOOK = 'src/assets/logos/storybook-logo.svg'
const LOGO_CLAUDE    = 'src/assets/logos/claude-logo.svg'
const LOGO_FIGMA     = 'src/assets/logos/figma-logo.svg'

// ── Hero placeholder (solid orange for fly animation) ──
const HERO_SRC = 'src/assets/images/agentic-ds/agentic-ds-hero.svg'

// ── Image assets (add screenshots as you take them) ──
const IMG_TOKEN_ARCH     = 'src/assets/images/agentic-ds/token-architecture.png'
const IMG_FIGMA_TOKENS   = 'src/assets/images/agentic-ds/figma-tokens.png'
const IMG_STORYBOOK_DARK = 'src/assets/images/agentic-ds/storybook-dark-mode.png'
const IMG_DRIFT_AUDIT    = 'src/assets/images/agentic-ds/drift-audit.png'
const IMG_CONSOLIDATION  = 'src/assets/images/agentic-ds/token-consolidation.png'
const IMG_DESCRIPTIONS   = 'src/assets/images/agentic-ds/component-descriptions.png'
const IMG_SECTIONS_FIGMA = 'src/assets/images/agentic-ds/figma-sections.png'
const IMG_STORYBOOK_SHOT = 'src/assets/images/agentic-ds/storybook-screenshot.png'
const STORYBOOK_URL      = 'https://main--69d91a00abeffaea79b942f8.chromatic.com/?path=/story/design-tokens-colours--semantic-colours'


/* ─────────────────────────────────────────────────────────────
   Interactive Token Layer Demo
   Shows the three-tier token architecture with expandable rows
   ───────────────────────────────────────────────────────────── */
const TOKEN_LAYERS = [
  {
    tier: 'Primitive',
    desc: 'Raw values named by hue + scale. Never used directly in components.',
    tokens: [
      { name: '--color-primitive-teal-500', value: '#008B8B', color: '#008B8B' },
      { name: '--color-primitive-purple-600', value: '#7c5cfc', color: '#7c5cfc' },
      { name: '--color-primitive-neutral-750', value: '#2c2c2c', color: '#2c2c2c' },
      { name: '--color-primitive-neutral-50', value: '#faf9f7', color: '#faf9f7' },
      { name: '--color-primitive-indigo-100', value: '#e0e0ea', color: '#e0e0ea' },
      { name: '--color-primitive-indigo-800', value: '#1a1a2e', color: '#1a1a2e' },
    ],
  },
  {
    tier: 'Semantic',
    desc: 'Intent-based aliases. Components reference these - they swap in dark mode.',
    tokens: [
      { name: '--color-text-primary', value: '→ Neutral/750', color: '#2c2c2c', dark: '→ Indigo/100', darkColor: '#e0e0ea' },
      { name: '--color-surface-card', value: '→ Neutral/50', color: '#faf9f7', dark: '→ Indigo/800', darkColor: '#1a1a2e' },
      { name: '--color-primary', value: '→ Teal/500', color: '#008B8B' },
      { name: '--gradient-brand', value: 'Teal/500 → Purple/600', color: 'linear-gradient(135deg, #008B8B, #7c5cfc)' },
    ],
  },
  {
    tier: 'Component',
    desc: 'Scoped to specific UI patterns like widgets and panels.',
    tokens: [
      { name: '--color-widget-bg', value: '→ Neutral/880', color: '#1e1e1e' },
      { name: '--color-widget-accent', value: '→ Purple/Widget', color: '#9945ff' },
      { name: '--color-panel-bg', value: '→ Neutral/0', color: '#ffffff' },
      { name: '--color-panel-focus', value: '→ Blue/Focus', color: '#589df6' },
    ],
  },
]

const TokenLayerDemo = defineComponent({
  name: 'TokenLayerDemo',
  setup() {
    const expanded = ref(null) // which tier is expanded

    function toggle(tier) {
      expanded.value = expanded.value === tier ? null : tier
    }

    return () =>
      h('div', { class: 'ads-token-demo' }, [
        ...TOKEN_LAYERS.map(layer =>
          h('div', {
            class: ['ads-token-layer', expanded.value === layer.tier ? 'ads-token-layer--open' : ''].filter(Boolean).join(' '),
            key: layer.tier,
          }, [
            h('div', { class: 'ads-token-header', onClick: () => toggle(layer.tier) }, [
              h('div', { class: 'ads-token-tier' }, [
                h('span', { class: 'ads-token-tier-badge' }, layer.tier),
                h('span', { class: 'ads-token-tier-desc' }, layer.desc),
              ]),
              h('span', { class: 'ads-token-chevron' }, expanded.value === layer.tier ? '−' : '+'),
            ]),
            h('div', { class: 'ads-token-rows-wrap' }, [
              h('div', { class: 'ads-token-rows' },
                layer.tokens.map(t =>
                  h('div', { class: 'ads-token-row', key: t.name }, [
                    h('span', {
                      class: 'ads-token-swatch',
                      style: {
                        background: t.color,
                        border: t.color === '#ffffff' || t.color === '#faf9f7' ? '1px solid #e0e0e0' : 'none',
                      },
                    }),
                    h('code', { class: 'ads-token-name' }, t.name),
                    h('span', { class: 'ads-token-value' }, t.value),
                    t.dark
                      ? h('span', { class: 'ads-token-dark' }, [
                          h('span', {
                            class: 'ads-token-swatch ads-token-swatch--sm',
                            style: { background: t.darkColor },
                          }),
                          'Dark: ' + t.dark,
                        ])
                      : null,
                  ])
                )
              ),
            ]),
          ])
        ),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   Agent Workflow Demo
   Shows before/after of an agent audit with animated reveal
   ───────────────────────────────────────────────────────────── */
const AGENT_ACTIONS = [
  {
    action: 'Drift audit',
    input: 'Agent scans every CSS token against Figma variables',
    output: 'Found 35 semantic tokens in code missing from Figma',
    outcome: 'Synced - all tokens now in both files',
  },
  {
    action: 'Token consolidation',
    input: 'Text/Primary (#2c2c2c) vs Text/Body (#181818) - two near-black text tokens',
    output: 'Agent identified they served the same purpose',
    outcome: 'Text/Body aliased to Text/Primary in both code and Figma',
  },
  {
    action: 'Unused token cleanup',
    input: 'Agent grepped all 468 tokens against every component file',
    output: 'Found 9 dead tokens: Surface/Bulb On, Surface/Ceiling Mount, Gradient Start/Mid/End, plus 4 overlay tokens',
    outcome: 'Removed from tokens.css - Figma checklist generated',
  },
  {
    action: 'Font mismatch',
    input: 'Agent inspected Data/Streak text style via Figma MCP',
    output: 'Flagged: using Inter instead of Fredoka for streak counter',
    outcome: 'Corrected in Figma to match code\'s --font-family-display',
  },
]

const AgentWorkflowDemo = defineComponent({
  name: 'AgentWorkflowDemo',
  setup() {
    const activeIdx = ref(0)
    const wrapRef = ref(null)

    return () =>
      h('div', { class: 'ads-workflow-demo' }, [
        // Tab bar
        h('div', { class: 'ads-workflow-tabs' },
          AGENT_ACTIONS.map((a, i) =>
            h('button', {
              class: ['ads-workflow-tab', activeIdx.value === i ? 'ads-workflow-tab--active' : ''].filter(Boolean).join(' '),
              key: i,
              onClick: () => { activeIdx.value = i },
            }, a.action)
          )
        ),
        // Active card with crossfade + height animation
        h('div', { class: 'ads-workflow-card-wrap', ref: wrapRef }, [
          h(Transition, {
            name: 'ads-fade',
            mode: 'out-in',
            onBeforeLeave(el) {
              const wrap = wrapRef.value
              if (wrap) wrap.style.height = wrap.offsetHeight + 'px'
            },
            onEnter(el) {
              const wrap = wrapRef.value
              if (!wrap) return
              // Force layout so the explicit height is committed
              void el.offsetHeight
              wrap.style.height = el.offsetHeight + 'px'
            },
            onAfterEnter() {
              const wrap = wrapRef.value
              if (wrap) wrap.style.height = ''
            },
          }, () =>
            h('div', { class: 'ads-workflow-card', key: activeIdx.value }, [
              h('div', { class: 'ads-workflow-step ads-workflow-slide', style: { animationDelay: '0ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Input'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].input),
              ]),
              h('div', { class: 'ads-workflow-arrow ads-workflow-slide', style: { animationDelay: '80ms' } }, '→'),
              h('div', { class: 'ads-workflow-step ads-workflow-slide', style: { animationDelay: '160ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Finding'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].output),
              ]),
              h('div', { class: 'ads-workflow-arrow ads-workflow-slide', style: { animationDelay: '240ms' } }, '→'),
              h('div', { class: 'ads-workflow-step ads-workflow-step--outcome ads-workflow-slide', style: { animationDelay: '320ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Outcome'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].outcome),
              ]),
            ])
          ),
        ]),
      ])
  },
})


/* ─────────────────────────────────────────────────────────────
   Main case study component
   ───────────────────────────────────────────────────────────── */
export default defineComponent({
  name: 'AgenticDSCard',
  setup() {
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardClass: 'agentic-ds-card',
        imageSrc: HERO_SRC,
        imageClass: 'ads-hero-img',
        heroWrapClass: 'ads-hero-wrap',
        tooltip: 'Building a design system\nthat AI can operate within',
        heroSize: 448,
      }, {
        // ── Collapsed card face: canvas bg + logos + pixel title ──
        default: () => [
          h(MagneticTokensBg),
          h('div', { class: 'ads-card-face' }, [
            h('div', { class: 'ads-card-logos' }, [
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_FIGMA, alt: 'Figma', class: 'ads-card-logo' }),
              ]),
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_CLAUDE, alt: 'Claude', class: 'ads-card-logo ads-card-logo--claude' }),
              ]),
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_STORYBOOK, alt: 'Storybook', class: 'ads-card-logo' }),
              ]),
            ]),
            h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
          ]),
        ],

        // ── Hero overlay: live canvas + logos on top of the orange placeholder ──
        heroOverlay: () => h('div', { class: 'ads-hero-overlay' }, [
          h(MagneticTokensBg),
          h('div', { class: 'ads-card-face' }, [
            h('div', { class: 'ads-card-logos' }, [
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_FIGMA, alt: 'Figma', class: 'ads-card-logo' }),
              ]),
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_CLAUDE, alt: 'Claude', class: 'ads-card-logo ads-card-logo--claude' }),
              ]),
              h('div', { class: 'ads-card-logo-wrap' }, [
                h('img', { src: LOGO_STORYBOOK, alt: 'Storybook', class: 'ads-card-logo' }),
              ]),
            ]),
            h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
          ]),
        ]),

        // ── Fly content: logos + text ride the flying element during transition ──
        flyContent: () => h('div', { class: 'ads-fly-overlay' }, [
          h('div', { class: 'ads-card-logos' }, [
            h('div', { class: 'ads-card-logo-wrap' }, [
              h('img', { src: LOGO_FIGMA, alt: 'Figma', class: 'ads-card-logo' }),
            ]),
            h('div', { class: 'ads-card-logo-wrap' }, [
              h('img', { src: LOGO_CLAUDE, alt: 'Claude', class: 'ads-card-logo ads-card-logo--claude' }),
            ]),
            h('div', { class: 'ads-card-logo-wrap' }, [
              h('img', { src: LOGO_STORYBOOK, alt: 'Storybook', class: 'ads-card-logo' }),
            ]),
          ]),
          h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
        ]),

        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          h('div', { class: 'cs-body' }, [

            // ═══════════════════════════════════════════
            // TITLE + INTRO
            // ═══════════════════════════════════════════
            h('h1', { class: 'cs-title' }, 'I didn\u2019t use AI to build a design system. I built a design system that AI can use.'),

            full(
              h('p', { class: 'cs-body-text' }, 'Most AI-assisted design system work follows the same pattern: a designer prompts an AI to scaffold components, generate tokens, or write documentation. The AI builds things for you. But the output is static \u2014 once generated, the system can\u2019t maintain itself.'),

              h('p', { class: 'cs-body-text' }, 'This experiment asks a different question: what if the design system was structured so an AI agent could operate within it autonomously \u2014 auditing tokens, catching drift between Figma and code, consolidating redundancy, and keeping both sides in sync?'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'As Design System Champion at Bauer Media Group, I\u2019m always looking for ways to make our system more maintainable. Rather than experimenting directly in a production codebase, I used my portfolio\u2019s design system as a proving ground - a real system with real complexity, where I could validate the approach before bringing it into my workflow at work.'),

            h('h2', { class: 'cs-section-title' }, 'Stack'),
            h('p', { class: 'cs-body-text' }, 'Vue 3, CSS Custom Properties, Figma, Storybook 10, Figma MCP'),


            // ═══════════════════════════════════════════
            // THE HYPOTHESIS
            // ═══════════════════════════════════════════
            full(
              h('h2', { class: 'cs-section-title' }, 'The hypothesis'),

              h('p', { class: 'cs-body-text' }, 'Vallaure\u2019s framework for agentic design systems identifies six structural requirements: a variables architecture, property alignment, complete state design, slots, auto-layout with semantic naming, and Code Connect. The core insight is that a design system is no longer documentation for developers \u2014 it\u2019s instructions for a machine.'),

              h('p', { class: 'cs-body-text' }, 'I wanted to test this with a real system. Not a demo with two buttons and a colour palette, but the actual design system powering this portfolio \u2014 with 468 tokens, 23 components, dark mode theming, and two canonical Figma files that needed to stay in sync with the codebase.'),

              h('p', { class: 'cs-body-text' }, 'The hypothesis: if the token architecture is semantically layered, the component descriptions are machine-readable, and the Figma structure mirrors the code structure, then an agent should be able to perform design system maintenance tasks that currently require a human designer.'),
            ),


            // ═══════════════════════════════════════════
            // ARCHITECTURE
            // ═══════════════════════════════════════════
            h('h2', { class: 'cs-section-title' }, 'Token architecture'),

            full(
              h('p', { class: 'cs-body-text' }, 'The foundation is a three-layer token system. Primitive tokens hold raw values \u2014 hex colours, pixel sizes, font stacks. Semantic tokens alias primitives by intent: --color-text-primary, --color-surface-card. Component tokens scope to specific UI patterns like the Figma-style widget chrome or Storybook panel.'),

              h('p', { class: 'cs-body-text' }, 'This layering is what makes the system machine-readable. When an agent encounters --color-text-primary, it doesn\u2019t need to understand colour theory \u2014 it just needs to follow the chain: semantic \u2192 primitive \u2192 raw value. Dark mode works the same way: the semantic layer swaps which primitives it points to, and every component updates automatically.'),
            ),

            h(TokenLayerDemo),
            h(InteractiveTag, { hint: 'Explore the three token layers', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, 'Every token in code has a corresponding entry in the Figma Design Tokens file. The primitives are documented as raw swatches. The semantic aliases show which primitive they reference with an arrow notation (\u2192 Neutral/750). This means an agent reading the Figma file via MCP gets the same information as an agent reading tokens.css \u2014 the mapping is explicit, not implicit.'),
            ),
          ]),

          // ── Image: token architecture (outside cs-body, like other case studies) ──
          h('img', { class: 'cs-cover-img', src: IMG_TOKEN_ARCH, alt: 'Three-layer token architecture diagram' }),

          // ═══════════════════════════════════════════
          // DARK MODE AS PROOF
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Dark mode as proof'),

            full(
              h('p', { class: 'cs-body-text' }, 'Dark mode isn\u2019t just a feature \u2014 it\u2019s the simplest proof that the token architecture works. If every component references semantic tokens, and the semantic layer swaps its primitive bindings under [data-theme="dark"], then dark mode is automatic. No component needs to know it\u2019s in dark mode.'),

              h('p', { class: 'cs-body-text' }, 'This was validated in Storybook 10, where a background toggle sets the data-theme attribute and every component responds through CSS custom properties. The agent was able to identify components that weren\u2019t responding (BentoCard labels and Icon names had hardcoded text colours) and fix them by adding var(--color-text-primary) references.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_STORYBOOK_DARK, alt: 'Storybook showing light and dark mode toggle' }),

          // ═══════════════════════════════════════════
          // COMPONENT DESCRIPTIONS
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Component descriptions'),

            full(
              h('p', { class: 'cs-body-text' }, 'The Figma MCP reads component descriptions and passes them to the agent as context. This is the bridge between design and code. Each of the 23 components has a description that documents: what it renders, which tokens it uses, what props it accepts, what states it has, and how it behaves on interaction.'),

              h('p', { class: 'cs-body-text' }, 'These descriptions aren\u2019t written for humans browsing Figma \u2014 they\u2019re written for an agent that needs to decide which component to use, what tokens to reference, and how the component will behave. It\u2019s the difference between \u201cA card component\u201d and \u201cBase card wrapper. Uses --color-surface-card background, --color-border-card border, --color-shadow-card-* elevation. Click spawns a ripple at --color-card-ripple. Accepts dark boolean prop for --color-surface-card-dark variant.\u201d'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_DESCRIPTIONS, alt: 'Component descriptions in Figma' }),

          // ═══════════════════════════════════════════
          // AGENT WORKFLOWS
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Agent workflows'),

            full(
              h('p', { class: 'cs-body-text' }, 'With the system structured, I tested four autonomous agent workflows \u2014 tasks a human designer would normally do manually. Each one succeeded because the agent could read the token architecture, cross-reference Figma and code, and make decisions based on semantic naming.'),
            ),

            h(AgentWorkflowDemo),
            h(InteractiveTag, { hint: 'Click each workflow to see the full loop', centered: true }),

            full(
              h('p', { class: 'cs-body-text' }, 'The critical insight from these workflows: the agent wasn\u2019t following a script. For the drift audit, it decided to grep every token against every component, identified which ones were unused, cross-referenced the Figma file, and produced a Figma cleanup checklist \u2014 all from a single prompt asking it to \u201ccheck if code and Figma are in sync.\u201d The system\u2019s structure gave the agent enough context to make judgment calls.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_DRIFT_AUDIT, alt: 'Agent drift audit output showing code vs Figma comparison' }),

          // ═══════════════════════════════════════════
          // FIGMA STRUCTURE
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Figma as source of truth'),

            full(
              h('p', { class: 'cs-body-text' }, 'The system uses two canonical Figma files. The Design Tokens file holds every variable, text style, and colour swatch \u2014 organised into Primitive and Semantic sections that mirror the CSS custom property structure. The Design System file holds all 23 components organised in Figma sections, each with descriptions the MCP can read.'),

              h('p', { class: 'cs-body-text' }, 'This separation matters for agents. When the agent needs to audit token coverage, it reads the Tokens file. When it needs to understand a component\u2019s API, it reads the Design System file. The agent knows which file to query because the architecture is explicit \u2014 not a single monolithic file where everything is mixed together.'),
            ),
          ]),

          h('img', { class: 'cs-cover-img', src: IMG_SECTIONS_FIGMA, alt: 'Figma sections layout showing organised components' }),


          // ═══════════════════════════════════════════
          // RESULTS + REFLECTION
          // ═══════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [
            h('h2', { class: 'cs-section-title' }, 'Results'),

            h('div', { class: 'ads-results' }, [
              h('div', { class: 'ads-result-card' }, [
                h('span', { class: 'ads-result-number' }, '468'),
                h('span', { class: 'ads-result-label' }, 'Tokens synced between code and Figma'),
              ]),
              h('div', { class: 'ads-result-card' }, [
                h('span', { class: 'ads-result-number' }, '23'),
                h('span', { class: 'ads-result-label' }, 'Components with machine-readable descriptions'),
              ]),
              h('div', { class: 'ads-result-card' }, [
                h('span', { class: 'ads-result-number' }, '9'),
                h('span', { class: 'ads-result-label' }, 'Unused tokens found and removed by agent'),
              ]),
              h('div', { class: 'ads-result-card' }, [
                h('span', { class: 'ads-result-number' }, '4'),
                h('span', { class: 'ads-result-label' }, 'Autonomous agent workflows validated'),
              ]),
            ]),


            h('h2', { class: 'cs-section-title' }, 'What I learned'),

            h('p', { class: 'cs-body-text' }, [
              'The biggest lesson: ', h('strong', null, 'quality becomes measurable'), '. When every token has a semantic name, every component has a description, and every Figma variable maps to a CSS custom property, an agent can audit the entire system and tell you exactly where the gaps are. \u201cDesign system health\u201d stops being a feeling and starts being a number.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              'The limitation I hit was Code Connect \u2014 Figma\u2019s official mapping between components and code files requires an Organisation plan. But the ', h('strong', null, 'component descriptions'), ' effectively serve the same purpose for an agent: they document the file path, props, tokens, and behaviour. The system works without the enterprise tooling.',
            ]),

            full(
              h('p', { class: 'cs-body-text' }, [
                'The risk Vallaure warns about is real: fast generic systems produce forgettable output. An agent assembling from a poorly crafted design system will produce bland interfaces. But an agent operating within a system that has visual intentionality \u2014 deliberate colour choices, considered typography scales, opinionated spacing \u2014 produces output that looks designed. The craft isn\u2019t in the assembly. It\u2019s in the ', h('strong', null, 'vocabulary the agent assembles from'), '.',
              ]),

              h('p', { class: 'cs-closing' }, 'The design system is no longer just documentation for developers. It\u2019s instructions for a machine. And the designer\u2019s job is to make those instructions worth following.'),
            ),
          ]),

          // ── Storybook browser window ──
          h('a', {
            class: 'ads-browser-window cs-cover-img cs-cover-img--full',
            href: STORYBOOK_URL,
            target: '_blank',
            rel: 'noopener noreferrer',
          }, [
            // Title bar
            h('div', { class: 'ads-browser-bar' }, [
              h('div', { class: 'ads-browser-dots' }, [
                h('span', { class: 'ads-browser-dot ads-browser-dot--red' }),
                h('span', { class: 'ads-browser-dot ads-browser-dot--yellow' }),
                h('span', { class: 'ads-browser-dot ads-browser-dot--green' }),
              ]),
              h('div', { class: 'ads-browser-address' }, 'chromatic.com'),
            ]),
            // Screenshot
            h('div', { class: 'ads-browser-viewport' }, [
              h('img', { src: IMG_STORYBOOK_SHOT, alt: 'Storybook design tokens page', class: 'ads-browser-img' }),
              // Hover overlay
              h('div', { class: 'ads-browser-overlay' }, [
                h('span', { class: 'ads-browser-cta' }, [
                  'View in Storybook',
                  h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'ads-browser-icon' }, [
                    h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                    h('polyline', { points: '15 3 21 3 21 9' }),
                    h('line', { x1: '10', y1: '14', x2: '21', y2: '3' }),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ],
      })
  },
})
