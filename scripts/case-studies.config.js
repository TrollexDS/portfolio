/**
 * Case study metadata — the single source of truth for:
 *   - scripts/build-case-study-pages.js (generates /case-studies/<slug>/index.html)
 *   - Root index.html JSON-LD @graph updates
 *   - sitemap.xml and llms.txt regeneration
 *
 * Each entry describes one case study:
 *   slug          URL path fragment (used as directory under /case-studies/)
 *   cardKey       must match a key in CARD_ENTRIES in src/App.js — used by the
 *                 client-side router to open the corresponding overlay card on
 *                 direct landing, and to sync the URL when a user opens a card
 *                 from the bento grid
 *   title         case study title (becomes <h1> in the noscript fallback and
 *                 schema.org CreativeWork.name)
 *   description   meta description (≤160 chars ideal) — also used as Open
 *                 Graph and Twitter description
 *   about         schema.org CreativeWork.about — the elevator summary
 *   summary       short paragraph for the noscript fallback body (1–3 sentences)
 *   datePublished ISO 8601 date string. Used for schema.org Article.datePublished.
 *                 Derived from the first git commit of the case study's card
 *                 component — run `git log --diff-filter=A --follow --format=%aI
 *                 -- src/components/cards/<CardName>.js | tail -1` to refresh.
 *   dateModified  ISO 8601. Last meaningful update to the case study content.
 *                 Update manually when content changes (the git last-touched
 *                 date is unreliable — triggered by unrelated refactors).
 *   ogImage       absolute URL to social share image (falls back to site-wide
 *                 og-image.png if omitted)
 *   content       (optional) full HTML body for the noscript fallback. Mirror
 *                 of the Vue component's prose — crawlers and LLMs see the
 *                 same content JS users see. When absent, the generator falls
 *                 back to \`summary\`.
 */

const ORIGIN = 'https://mchiu.co.uk'

const caseStudies = [
  {
    slug: 'agentic-design-system',
    cardKey: 'agenticds',
    title: "I didn't use AI to build a design system. I built a design system that AI can use.",
    description:
      'A design system restructured so AI agents can consume it — 468 tokens, four autonomous workflows, and Figma MCP integration.',
    about:
      'A design system structured for AI agents — 468 tokens, four autonomous workflows, and Figma MCP integration.',
    datePublished: '2026-04-14',
    dateModified:  '2026-04-17',
    summary:
      'Most "AI + design system" work plugs an LLM onto an existing library. This case study goes the other way: it restructures the system itself — tokens, component APIs, naming — so agents can read it, assemble from it, and ship without a human in the loop. Four autonomous workflows, 468 tokens, Figma MCP integration.',
    // Full prose content — pulled verbatim from
    // src/components/cards/AgenticDSCard.js so crawlers and LLMs see the same
    // text that human visitors see (no cloaking risk). The generator wraps
    // this in the noscript fallback; JS users never see it (Vue replaces it
    // on mount).
    content: `
<p><em>Stack: Vue 3, CSS Custom Properties, Figma, Storybook 10, Figma MCP.</em></p>

<p>Most AI-assisted design system work follows the same pattern: a designer prompts an AI to scaffold components, generate tokens, or write documentation. The AI builds things for you. But the output is static — once generated, the system can't maintain itself.</p>

<p>This experiment asks a different question: what if the design system was structured so an AI agent could operate within it autonomously — auditing tokens, catching drift between Figma and code, consolidating redundancy, and keeping both sides in sync?</p>

<h2>My role</h2>
<p>As Design System Champion at Bauer Media Group, I'm always looking for ways to make our system more maintainable. Rather than experimenting directly in a production codebase, I used my portfolio's design system as a proving ground — a real system with real complexity, where I could validate the approach before bringing it into my workflow at work.</p>

<h2>The hypothesis</h2>
<p>Vallaure's framework for agentic design systems identifies six structural requirements: a variables architecture, property alignment, complete state design, slots, auto-layout with semantic naming, and Code Connect. The core insight is that a design system is no longer documentation for developers — it's instructions for a machine.</p>
<p>I wanted to test this with a real system. Not a demo with two buttons and a colour palette, but the actual design system powering this portfolio — with 468 tokens, 23 components, dark mode theming, and two canonical Figma files that needed to stay in sync with the codebase.</p>
<p>The hypothesis: if the token architecture is semantically layered, the component descriptions are machine-readable, and the Figma structure mirrors the code structure, then an agent should be able to perform design system maintenance tasks that currently require a human designer.</p>

<h2>Token architecture</h2>
<p>The foundation is a three-layer token system. Primitive tokens hold raw values — hex colours, pixel sizes, font stacks. Semantic tokens alias primitives by intent: <code>--color-text-primary</code>, <code>--color-surface-card</code>. Component tokens scope to specific UI patterns like the Figma-style widget chrome or Storybook panel.</p>
<p>This layering is what makes the system machine-readable. When an agent encounters <code>--color-text-primary</code>, it doesn't need to understand colour theory — it just needs to follow the chain: semantic → primitive → raw value. Dark mode works the same way: the semantic layer swaps which primitives it points to, and every component updates automatically.</p>

<dl>
  <dt><strong>Primitive</strong></dt>
  <dd>Raw values named by hue + scale. Never used directly in components. Example tokens: <code>--color-primitive-teal-500</code>, <code>--color-primitive-purple-600</code>, <code>--color-primitive-neutral-750</code>, <code>--color-primitive-neutral-50</code>, <code>--color-primitive-indigo-100</code>, <code>--color-primitive-indigo-800</code>.</dd>
  <dt><strong>Semantic</strong></dt>
  <dd>Intent-based aliases. Components reference these — they swap in dark mode. Example tokens: <code>--color-text-primary</code> (→ Neutral/750 light, → Indigo/100 dark), <code>--color-surface-card</code> (→ Neutral/50 light, → Indigo/800 dark), <code>--color-primary</code> (→ Teal/500), <code>--gradient-brand</code> (Teal/500 → Purple/600).</dd>
  <dt><strong>Component</strong></dt>
  <dd>Scoped to specific UI patterns like widgets and panels. Example tokens: <code>--color-widget-bg</code>, <code>--color-widget-accent</code>, <code>--color-panel-bg</code>, <code>--color-panel-focus</code>.</dd>
</dl>

<p>Every token in code has a corresponding entry in the Figma Design Tokens file. The primitives are documented as raw swatches. The semantic aliases show which primitive they reference with an arrow notation (→ Neutral/750). This means an agent reading the Figma file via MCP gets the same information as an agent reading <code>tokens.css</code> — the mapping is explicit, not implicit.</p>

<h2>Dark mode as proof</h2>
<p>Dark mode isn't just a feature — it's the simplest proof that the token architecture works. If every component references semantic tokens, and the semantic layer swaps its primitive bindings under <code>[data-theme="dark"]</code>, then dark mode is automatic. No component needs to know it's in dark mode.</p>
<p>This was validated in Storybook 10, where a background toggle sets the data-theme attribute and every component responds through CSS custom properties. The agent was able to identify components that weren't responding (BentoCard labels and Icon names had hardcoded text colours) and fix them by adding <code>var(--color-text-primary)</code> references.</p>

<h2>Component descriptions</h2>
<p>The Figma MCP reads component descriptions and passes them to the agent as context. This is the bridge between design and code. Each of the 23 components has a description that documents: what it renders, which tokens it uses, what props it accepts, what states it has, and how it behaves on interaction.</p>
<p>These descriptions aren't written for humans browsing Figma — they're written for an agent that needs to decide which component to use, what tokens to reference, and how the component will behave. It's the difference between "A card component" and "Base card wrapper. Uses <code>--color-surface-card</code> background, <code>--color-border-card</code> border, <code>--color-shadow-card-*</code> elevation. Click spawns a ripple at <code>--color-card-ripple</code>. Accepts dark boolean prop for <code>--color-surface-card-dark</code> variant."</p>

<h2>Agent workflows</h2>
<p>With the system structured, I tested four autonomous agent workflows — tasks a human designer would normally do manually. Each one succeeded because the agent could read the token architecture, cross-reference Figma and code, and make decisions based on semantic naming.</p>

<dl>
  <dt><strong>Drift audit</strong></dt>
  <dd><em>Input:</em> Agent scans every CSS token against Figma variables. <em>Finding:</em> Found 35 semantic tokens in code missing from Figma. <em>Outcome:</em> Synced — all tokens now in both files.</dd>
  <dt><strong>Token consolidation</strong></dt>
  <dd><em>Input:</em> Text/Primary (#2c2c2c) vs Text/Body (#181818) — two near-black text tokens. <em>Finding:</em> Agent identified they served the same purpose. <em>Outcome:</em> Text/Body aliased to Text/Primary in both code and Figma.</dd>
  <dt><strong>Unused token cleanup</strong></dt>
  <dd><em>Input:</em> Agent grepped all 468 tokens against every component file. <em>Finding:</em> Found 9 dead tokens: Surface/Bulb On, Surface/Ceiling Mount, Gradient Start/Mid/End, plus 4 overlay tokens. <em>Outcome:</em> Removed from <code>tokens.css</code> — Figma checklist generated.</dd>
  <dt><strong>Font mismatch</strong></dt>
  <dd><em>Input:</em> Agent inspected Data/Streak text style via Figma MCP. <em>Finding:</em> Flagged — using Inter instead of Fredoka for streak counter. <em>Outcome:</em> Corrected in Figma to match code's <code>--font-family-display</code>.</dd>
</dl>

<p>The critical insight from these workflows: the agent wasn't following a script. For the drift audit, it decided to grep every token against every component, identified which ones were unused, cross-referenced the Figma file, and produced a Figma cleanup checklist — all from a single prompt asking it to "check if code and Figma are in sync." The system's structure gave the agent enough context to make judgment calls.</p>

<h2>Figma as source of truth</h2>
<p>The system uses two canonical Figma files. The Design Tokens file holds every variable, text style, and colour swatch — organised into Primitive and Semantic sections that mirror the CSS custom property structure. The Design System file holds all 23 components organised in Figma sections, each with descriptions the MCP can read.</p>
<p>This separation matters for agents. When the agent needs to audit token coverage, it reads the Tokens file. When it needs to understand a component's API, it reads the Design System file. The agent knows which file to query because the architecture is explicit — not a single monolithic file where everything is mixed together.</p>

<h2>Results</h2>
<ul>
  <li><strong>468</strong> — tokens synced between code and Figma</li>
  <li><strong>23</strong> — components with machine-readable descriptions</li>
  <li><strong>9</strong> — unused tokens found and removed by agent</li>
  <li><strong>4</strong> — autonomous agent workflows validated</li>
</ul>

<h2>What I learned</h2>
<p>The biggest lesson: <strong>quality becomes measurable</strong>. When every token has a semantic name, every component has a description, and every Figma variable maps to a CSS custom property, an agent can audit the entire system and tell you exactly where the gaps are. "Design system health" stops being a feeling and starts being a number.</p>
<p>The limitation I hit was Code Connect — Figma's official mapping between components and code files requires an Organisation plan. But the <strong>component descriptions</strong> effectively serve the same purpose for an agent: they document the file path, props, tokens, and behaviour. The system works without the enterprise tooling.</p>
<p>The risk Vallaure warns about is real: fast generic systems produce forgettable output. An agent assembling from a poorly crafted design system will produce bland interfaces. But an agent operating within a system that has visual intentionality — deliberate colour choices, considered typography scales, opinionated spacing — produces output that looks designed. The craft isn't in the assembly. It's in the <strong>vocabulary the agent assembles from</strong>.</p>
<p>The design system is no longer just documentation for developers. It's instructions for a machine. And the designer's job is to make those instructions worth following.</p>
`.trim(),
  },
  {
    slug: 'rayo-design-system',
    cardKey: 'ds',
    title: 'Refactoring the Rayo Design System for Scalability & Consistency',
    description:
      "Restructuring Rayo's design system to scale across brands with consistent tokens, components, and patterns.",
    about:
      'Restructuring the Rayo design system to scale across brands with consistent tokens, components, and patterns.',
    datePublished: '2026-04-01',
    dateModified:  '2026-04-17',
    summary:
      "Rayo covers multiple radio brands under one app. The original design system buckled under brand-level variation. This case study walks through the refactor: token architecture, component reuse across brands, and the governance model that keeps contributors aligned without slowing them down.",
  },
  {
    slug: 'simplestream-design-system',
    cardKey: 'ssds',
    title: 'Brand Switching in Seconds: Scaling a White-Label Design System',
    description:
      'Building a white-label design system at Simplestream that enables brand switching in seconds across many clients.',
    about:
      'Building a white-label design system at Simplestream that enables brand switching in seconds.',
    datePublished: '2026-04-06',
    dateModified:  '2026-04-17',
    summary:
      'Simplestream ships streaming apps for dozens of media brands. The design system had to let a single codebase re-skin itself — typography, colour, motion, tone — in seconds. This case study covers the token model, the theming pipeline, and the design-to-engineering handoff that made brand switching genuinely instant.',
  },
  {
    slug: 'figma-plugin-rayo-thumbnails',
    cardKey: 'plugin',
    title: 'Streamlining the Design Process & Improving Efficiency at Scale',
    description:
      'Custom Figma plugins that streamlined design workflows and eliminated repetitive work at scale.',
    about:
      'Custom Figma plugins that streamlined design workflows and improved team efficiency at scale.',
    datePublished: '2026-04-01',
    dateModified:  '2026-04-17',
    summary:
      'When a design team repeats the same manual step dozens of times a week, the fix is not a better spec — it is a plugin. This case study covers the Figma plugins built to automate Rayo thumbnail generation and related repetitive flows, and the efficiency gains that followed.',
  },
  {
    slug: 'rayo-in-alexa',
    cardKey: 'alexa',
    title: 'Bringing Design to a Team That Had Never Had a Designer',
    description:
      'Introducing design practice to the Alexa team at Bauer — a product that had shipped without a dedicated designer.',
    about:
      'Introducing design practice to Alexa — a team that had shipped without a dedicated designer.',
    datePublished: '2026-04-01',
    dateModified:  '2026-04-17',
    summary:
      "The Alexa team at Bauer had shipped features for years without a dedicated designer. This case study is about the first six months: earning trust, introducing design practice without creating bureaucracy, and the product improvements that came from treating voice as a first-class surface.",
  },
  {
    slug: 'rayo-schedule',
    cardKey: 'schedule',
    title: 'Challenging the Brief: From Station Pages to Schedule',
    description:
      'Pushing back on the original brief for standalone station pages in favour of schedule-led discovery, grounded in user research.',
    about:
      'Pushing back on the original brief for standalone station pages in favour of schedule-led discovery, grounded in user research.',
    datePublished: '2026-04-01',
    dateModified:  '2026-04-17',
    summary:
      'The brief asked for standalone station pages. User research said something else: listeners wanted the next thing on, not a profile page. This case study walks through the workshop, tree testing, and final pivot — from dedicated station pages to a schedule-led discovery model embedded in existing journeys.',
  },
  {
    slug: 'figma-plugin-layer-lint',
    cardKey: 'layerlint',
    title: "Your layers are the prompt. Make sure they're worth reading.",
    description:
      'Layer Lint — a Figma plugin that lints layer naming so AI design tools receive cleaner prompts.',
    about:
      'Layer Lint — a Figma plugin that lints layer naming so AI design tools receive cleaner prompts.',
    datePublished: '2026-04-17',
    dateModified:  '2026-04-17',
    summary:
      "AI design tools read your layer names as prompt. Messy layers give messy output. Layer Lint is a Figma plugin that flags unnamed frames, default names (Rectangle 42), and inconsistent casing — so the prompt your AI sees is actually worth reading.",
  },
]

module.exports = {
  ORIGIN,
  caseStudies,
}
