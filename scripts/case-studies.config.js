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
    content: `
<p>A comprehensive overhaul of the Rayo Design System, restructuring components, tokens, and documentation to support rapid multi-brand scaling while maintaining visual consistency across all products.</p>

<h2>My role</h2>
<p>Design system lead</p>

<h2>Impact</h2>

<h3>Simplified Component Architecture</h3>
<p>Reduced the overall complexity of the system by minimising the number of variants and introducing nested components. This created a more modular and flexible structure, making components easier to maintain, scale, and reuse without duplication.</p>

<h3>Improved Design–Engineering Alignment</h3>
<p>Streamlined the handoff process by introducing clear documentation, structured usage notes, and leveraging Figma's Dev Mode. This ensured design intent was communicated more effectively, reducing back-and-forth and increasing implementation accuracy.</p>

<h3>Reliable Theming with Colour Variables</h3>
<p>Eliminated light and dark mode inconsistencies by implementing Figma colour variables. This removed manual overrides and significantly reduced the risk of human error, ensuring themes remain consistent and scalable across the system.</p>

<h3>Accessible & Easy to Adopt</h3>
<p>Lowered the barrier to entry for new designers by simplifying the system and improving guidance. Even new joiners can quickly understand and use the design system with confidence, without feeling overwhelmed by complexity.</p>

<h2>Problem</h2>
<p>Designers often felt overwhelmed navigating the design system due to the high volume of components and lack of clear structure. Nested instances were frequently overlooked when not visible within master components, leading to duplicated components and inconsistencies.</p>
<p>In addition, an outdated colour token system required manual switching between light and dark modes. This increased the number of unnecessary variants and introduced a higher risk of human error in production-ready designs.</p>

<h2>Colour variables</h2>
<p>Following Figma's variable framework, I collaborated with another designer to establish a scalable colour system. We defined primitive variables based on the brand style guide, and mapped them into semantic tokens for both light and dark modes. This removed the need for manual theme switching and created a more consistent and maintainable foundation for theming.</p>

<h2>Spacing & Responsiveness</h2>
<p>Working closely with the team, we standardised spacing and radius values to improve visual consistency across components. I also introduced breakpoints as variables, enabling responsive behaviour within components and automating layout adjustments across different screen sizes.</p>

<h2>Components refactor</h2>
<p>The collection card component was a key focus of the refactor. Previously, it contained 48 variants that largely duplicated the same structure, differing only in background styles and spacing adjustments for tablet layouts.</p>
<p>Instead of encoding these differences as variants, I extracted background styles into a separate, reusable background component. This allowed backgrounds to be applied as nested instances, exposed through a simple dropdown selection, making them easier to manage and update.</p>
<p>As a result, the number of variants was reduced from 48 to just 4, while maintaining the same level of flexibility. This approach also scaled across other components with similar background requirements, significantly reducing duplication and improving overall system efficiency.</p>

<h2>One Component, Multiple Contexts</h2>
<p>As part of the design system optimisation, we leveraged auto layout wherever possible. Since most components share the same structure across mobile and tablet (differing primarily in width), this approach allowed us to use a single variant across breakpoints. By simply adjusting width within designs, components can responsively adapt without the need for separate variants, reducing duplication and improving consistency.</p>

<h2>Intuitive System Architecture</h2>
<p>The existing file structure could no longer support the growing complexity of the design system. Components were spread across multiple pages with unclear grouping logic, making them difficult to locate and navigate.</p>
<p>To address this, I redesigned the system architecture with clarity and usability in mind. This ensures even new or less experienced designers can navigate it with ease. Each component now has its own dedicated page, structured into three clear sections:</p>
<ul>
  <li>Overview for context and usage guidance</li>
  <li>Component for the master variants</li>
  <li>Examples to showcase real use cases and expose nested configurations</li>
</ul>
<p>The example section also allows designers to quickly copy and paste production-ready instances directly into their work, streamlining adoption and reducing setup time.</p>

<h2>Outcome</h2>
<p>The refactoring of the Rayo Design System transformed it into a scalable, intuitive, and production-ready foundation for the team. Component variants were reduced by over 90% in key areas, <strong>significantly lowering complexity</strong> while maintaining full flexibility through modular and nested approaches.</p>
<p>By introducing colour variables and responsive foundations, manual theming and layout adjustments were largely eliminated, <strong>reducing errors and ensuring consistency</strong> across light and dark modes. Designers can now build responsive layouts using a single component across breakpoints, instead of managing multiple variants.</p>
<p>The redesigned system architecture and improved documentation also reduced onboarding friction, <strong>enabling new designers to confidently adopt the system faster</strong>. In parallel, clearer specifications and Dev Mode usage improved design–engineering alignment, resulting in smoother handoffs and more accurate implementation.</p>
<p>Overall, the system reduced duplication, minimised human error, and accelerated design workflows, allowing the team to deliver high-quality, consistent designs more efficiently at scale.</p>
`.trim(),
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
    content: `
<p>Simplestream is a B2B OTT service provider - we design and build streaming apps across mobile, tablet, web, and TV for clients around the world. As one of two designers, I was responsible for maintaining a white-label design system that powered 50+ client brands, each with their own look and feel across 100+ screens.</p>
<p>The challenge wasn't just designing at scale - it was making it possible for a tiny team to move fast without breaking things.</p>

<h2>My role</h2>
<p>Product Designer</p>

<h2>Impact</h2>

<h3>From Minutes to Seconds</h3>
<p>Reduced brand-switching time from 5-10 minutes down to seconds by replacing a third-party plugin with Figma's native Swap Library feature - eliminating freezes, glitches, and manual error-checking entirely.</p>

<h3>Zero Glitches, Zero Manual Fixes</h3>
<p>The old plugin frequently caused Figma to freeze or produce errors on large files, requiring time-consuming manual checks. The new approach is completely reliable - no crashes, no broken tokens, no cleanup.</p>

<h3>Restructured Design Files</h3>
<p>Defined a new token naming structure and renamed every colour token, font style, and layer across the entire system to make it compatible with Figma's Swap Library feature.</p>

<h2>Problem</h2>
<p>We relied on a third-party Figma plugin to swap brand themes across our design files. On paper, it solved the right problem. In practice, it took 5–10 minutes to process 100+ screens — frequently freezing Figma, producing broken tokens, and requiring manual checks to fix what it missed.</p>
<p>For a two-person team managing 50+ clients, every failed swap meant lost time we couldn't afford. It slowed onboarding, ate into design time, and eroded trust in the system itself.</p>

<h2>Turning Point</h2>
<p>When Figma released the Swap Library feature, I saw an opportunity to solve this properly - not with another workaround, but by rethinking how our system was structured.</p>
<p>Swap Library allows you to swap an entire linked library for another in one action - natively, without plugins. But it wasn't a drop-in fix. For it to work, every token and layer in the system needed to follow a specific naming structure. The existing system wasn't set up for this. Rather than patching the old workflow, I committed to restructuring the entire design system from the ground up.</p>

<h2>Defining a New Token Structure</h2>
<p>I defined a new naming structure and went through every token in the system - renaming each one so that libraries could be swapped cleanly. This wasn't just a find-and-replace job; it meant rethinking how our tokens were organised to be compatible with Figma's Swap Library feature.</p>

<h2>Colour Tokens</h2>
<p>Our colour token template contains a wide range of component-specific colour tokens, giving clients greater flexibility to customise the look and feel of their apps. In order for these tokens to be compatible with the Swap Library feature, I defined a new structure and renamed every token to follow a consistent convention that Figma could map between libraries.</p>

<h2>Typography</h2>
<p>Font styles are fixed in size and weight to ensure text remains visible and the app stays accessible. However, we give clients the flexibility to choose a single typeface to be used consistently across all their apps. This maps cleanly to the library swap - the typeface changes, but the scale stays locked.</p>

<h2>The New Onboarding Workflow</h2>
<p>Every time we onboard a new client, we duplicate our templates and set up a custom theme. By swapping the design library, we can instantly apply the client's unique look and feel. What used to take minutes of anxious waiting and manual fixing now happens in seconds.</p>

<h2>Outcome</h2>
<p>The refactored design system <strong>eliminated freezes, glitches, and errors entirely</strong>. Brand switching went from 5-10 minutes of anxious waiting and manual cleanup to seconds. The swap just works, every time.</p>
<p>A team of 2 designers can now confidently <strong>manage 50+ client brands</strong> across 100+ screens each - a workload that would typically demand a much larger team. The design system became something we could trust, not work around.</p>
<p>This wasn't a flashy redesign - it was the kind of foundational work that makes everything else possible. By investing the time to restructure our system properly, we gave ourselves the <strong>ability to scale</strong> without scaling the team.</p>
`.trim(),
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
    content: `
<p>Rayo Thumbnails is a Figma plugin that connects directly to Bauer's Listen API, instantly applying live assets and metadata to selected layers. It empowers designers to move faster. From early concepts to production-ready designs—without manual asset handling.</p>

<h2>My role</h2>
<p>Design and development</p>

<h2>Impact</h2>

<h3>Faster Design Execution</h3>
<p>Reduced hours of manual work into seconds. Designers can instantly populate and update thumbnails, logos, and metadata. Freeing up time to focus on higher-value design decisions.</p>

<h3>Always Up-to-Date by Default</h3>
<p>Eliminated outdated assets in design files. By pulling directly from the API, designs automatically reflect the latest content, therefore removing the need for constant library maintenance.</p>

<h3>Scaled Design Across Regions</h3>
<p>Unlocked the ability to design for multiple markets with ease. Region-specific APIs enable rapid creation of localised concepts, supporting global product teams without added complexity.</p>

<h2>Problem</h2>
<p>Bauer Media operates 150+ radio brands across 9 European markets, with content that is constantly evolving across regions and languages. As a UK-based design team of seven, maintaining a scalable and up-to-date asset library was not sustainable. Manual asset sourcing significantly slowed down the creation of prototypes and production-ready designs, creating inefficiencies across the design workflow.</p>

<h2>Solution</h2>
<p>I designed and developed a Figma plugin that integrates directly with Bauer's Listen API, enabling designers to access live content within their workflow. The plugin allows users to search and filter by content type, region, and brand, and instantly apply up-to-date assets and metadata to selected layers. This ensures consistency, reduces manual effort, and streamlines the transition from concept to developer handoff.</p>

<h2>Continuous Iteration</h2>
<p>I actively identify pain points in the team's workflow by observing how my team work in Figma in general, and how they use the plugin to gather regular feedback. This iterative approach allows me to continuously refine and expand its capabilities.</p>
<p>The plugin evolved from a simple tool for pulling radio show thumbnails into a more comprehensive system. Features were progressively introduced, including podcast support, multi-region coverage, genre-based filtering, and individual episode-level assets. Most recently, I added an in-app guidance panel to streamline layer naming and improve usability.</p>

<h2>User Guidance & Error Handling</h2>
<p>A key focus was ensuring the plugin remains intuitive and supportive, even when errors occur. Many issues stemmed from incorrect layer naming, preventing assets from being applied correctly.</p>
<p>To address this, I designed a guidance overlay and clear, actionable error messages that help users quickly identify and resolve issues. This not only reduces friction but also builds confidence in using the tool as part of the design workflow.</p>

<h2>Result</h2>
<p>Rayo Thumbnails has become an integral part of our design workflow, enabling the team to work faster, stay aligned with live content, and scale design output across multiple regions with confidence. By removing repetitive tasks and reducing errors, it allows designers to focus on what matters most - crafting better user experiences.</p>
`.trim(),
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
    content: `
<p>The Alexa team had shipped without a designer for years. I came in to make sense of what existed, remap the user journeys in Voiceflow, and design a cohesive experience across voice and screen.</p>

<h2>My role</h2>
<p>Sole designer</p>

<h2>Impact</h2>

<h3>Fewer support tickets, clearer experience</h3>
<p>By consolidating account linking into a single reliable path, support tickets related to linking dropped. The six separate help articles were replaced with streamlined guidance that matched the actual user experience, reducing both user frustration and the maintenance burden on the team.</p>

<h3>A design foundation the team kept using</h3>
<p>The Voiceflow production file became the team's ongoing source of truth - the first time the Alexa skill's logic was fully documented and visible in one place. More importantly, the way the team worked changed. Design became part of the process: the team started involving design earlier in decision-making, and became open to running user research as a regular practice rather than shipping based on assumptions alone.</p>

<h3>Design beyond the skill</h3>
<p>The work extended beyond the product itself. I collaborated with the customer service team to overhaul the Alexa help centre, rewriting the key support articles on account linking, ads, and premium station access to match the new simplified flows. By aligning the support content with the redesigned experience, users who did need help found guidance that actually reflected what they'd see on screen - closing the gap between the product and the resources meant to support it.</p>

<h2>Challenges</h2>

<h3>First designer in a team that never had one</h3>
<p>No documented flows, no mapped journeys. Everything about how the skill worked lived inside the PO and lead developer's heads.</p>

<h3>Account linking was the core problem</h3>
<p>Premium users heard ads and lost access to paid stations despite paying. The business had no way to attribute listening data to individual users.</p>

<h3>A broken experience built on patches</h3>
<p>4+ different linking paths with no consistent logic between them. Silent failures, dead ends, and a trail of negative Alexa store reviews.</p>

<h3>No one had ever stepped back to see the full picture</h3>
<p>Fixes had been stacked on fixes with no one stepping back to map the full picture. That was my starting point.</p>

<h2>The Audit</h2>

<h3>Mapping every journey from scratch</h3>
<p>My first step was to experience the product exactly as a new user would. I unboxed both an Echo Dot and an Echo Show, set them up from scratch, and documented every step from first power-on through account linking. Without any briefing from the team, I tested how far a first-time user could get by speaking naturally to the device.</p>

<p>What became clear very quickly was that the Rayo skill, like most custom Alexa skills, wasn't conversational at all. It was built with a binary, chatbot-like logic: say the exact right words or nothing happens. There were only two command structures that actually worked, and users had to know them word for word: "Open [skill name]" followed by a separate action, or the one-shot "Ask [skill name] to [do something]." Anything outside these patterns failed silently.</p>

<p>I pulled apart the skill's interaction model - a JSON file containing every intent, utterance, and synonym the skill could recognise. I catalogued all available content and mapped which synonyms had been added for requesting specific shows, revealing gaps and inconsistencies in how the skill interpreted user requests.</p>

<h2>Restructured Journeys</h2>

<h3>Building a single source of truth in Voiceflow</h3>
<p>With no documentation and no design files, my first goal was to create one. I rebuilt every existing intent in Voiceflow - think of intents as the voice equivalent of features in a mobile app. Each one was built to closely mirror the actual Alexa skill, accounting for different conditions, synonym variations, and error states. This production file became the team's single source of truth: the first time anyone could see the entire skill's logic in one place.</p>

<h3>Unifying account linking into one reliable path</h3>
<p>The original skill had so many linking methods that the support page alone contained six separate articles explaining them - a maintenance burden for developers and a source of confusion for users. In reality, only one method was bug-free: linking via the Alexa app. I designed every journey to converge on this single path. No matter where the user starts - iOS or Android, legacy brand apps or the new Rayo app, scanning a QR code or initiating the link through voice - they're all deeplinked into the Alexa app to complete account linking. One consistent, reliable flow instead of six fragmented ones.</p>

<h3>Introducing in-situ help</h3>
<p>Many users were still struggling with account linking even when the flow worked correctly. I introduced an in-situ help feature: contextual guidance delivered through both on-screen support content on the Echo Show and voice prompts from Alexa. Rather than sending users away to a support page, help now meets them where they are, at the moment they need it.</p>

<h3>Improving the help centre</h3>
<p>I also worked with the customer service team to overhaul the Alexa help centre articles. The existing support pages reflected the old fragmented experience - six separate articles for account linking alone. I helped consolidate and rewrite the key articles covering account linking, ads on Alexa, and premium station access, making sure the guidance matched the simplified flows and gave users a clear path to resolution.</p>

<h3>Continue listening as a reason to link</h3>
<p>We reframed account linking as something worth doing by tying it to a tangible benefit. The new "Continue Listening" feature lets users resume content from where they left off - when they play something they've previously started, Alexa prompts them to pick up where they stopped. In the next phase, we plan to take this further: Alexa will proactively suggest unfinished content when you launch the Rayo skill or arrive home, creating a more personalised, anticipatory experience.</p>

<h2>What's next</h2>
<p>Development on the Rayo Alexa skill is currently paused while the team waits for the release of Alexa+, Amazon's next-generation AI-powered assistant. The groundwork I laid - the mapped journeys, the Voiceflow prototypes, the simplified account linking architecture - gives the team a design foundation to build on when development resumes, whether that's adapting to Alexa+'s new conversational capabilities or picking up the personalised Continue Listening experience we'd planned.</p>

<h2>Experience it yourself</h2>
<p>Everything you've just read about is live. If you have an Alexa, just say "Alexa, open Rayo" and try it for yourself.</p>
`.trim(),
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
    content: `
<p>How user research redirected a major feature toward what listeners actually needed - a schedule-first approach to catchup radio.</p>

<h2>My role</h2>
<p>Product Design</p>

<h2>Impact</h2>

<h3>Redirected the project scope</h3>
<p>User testing evidence led the team to pivot from a station page to a schedule-first catchup experience, avoiding development of a feature users wouldn't navigate to.</p>

<h3>Designed and shipped the schedule feature</h3>
<p>The schedule shipped across the Rayo app, giving listeners a direct path to find catchup shows - the core need that research uncovered.</p>

<h3>Uncovered a fundamental listening insight</h3>
<p>Users navigate radio by date and time, not by episode. This insight reshaped product strategy and informed how catchup content is structured across the app.</p>

<h2>Problem</h2>
<p>The product team wanted to build dedicated station pages in the Rayo app - a hub for each radio brand with schedules, presenter info, social links, and featured content. On paper, it made sense. But no one had asked whether users actually wanted a station page, or whether it would solve their real problem: finding something to listen to when their favourite show has already aired.</p>

<h2>The starting point</h2>
<p>The brief was ambitious. Station pages, presenter pages, hero content, social links, contact forms - a feature set that would touch every corner of the app. The goal was to improve engagement and increase average time spent listening by giving each radio station a proper home in the app.</p>
<p>Our lead UX researcher had already been raising questions about whether this was the right direction. A co-creation workshop the previous year had surfaced an important stat: live radio accounted for 97.9% of all listening on the platform. If almost all listening was live, what problem was a content-heavy station page actually solving?</p>
<p>Rather than diving into wireframes, we decided to build understanding first.</p>

<h2>Building the evidence</h2>
<p>Over several weeks, the design team worked through a series of research and discovery activities, each adding a layer of understanding.</p>
<p>We ran a design workshop to define what a station page could be. We mapped out user personas - from devoted station fans to casual rainbow listeners - and created content tiers (Gold, Silver, Bronze) based on how much content each station could realistically support. But even here, the team raised concerns: if V1 was too far from the vision, we'd set a poor direction that would be expensive to correct.</p>
<p>We dug into the information architecture, running tree tests to see how users expected to navigate station content. We mapped user journeys for three core scenarios - finding a specific show, checking an upcoming schedule, and discovering new content. The third journey, discovery, was flagged as too ambiguous to even map properly. That was a signal.</p>
<p>We also uncovered technical and structural constraints - schedule data only went 30 days back and 7 days forward, brand-station hierarchies were complex, and content teams hadn't been consulted on editorial needs. These weren't blockers, but they shaped what was realistic for a V1.</p>
<p>Throughout all of this, a question kept surfacing in our discussions: what value does a full station page provide versus just building the schedule?</p>

<h2>What users actually told us</h2>
<p>I built prototypes of the station page and schedule, and ran testing sessions with real listeners. This is where everything clicked.</p>
<p>The schedule page was the standout. Multiple participants described it as "perfect" - easy to navigate, clear information, exactly what they needed. When I asked how they'd find a show they'd missed, they went straight to the schedule. They thought in terms of "I missed the breakfast show this morning" - a specific day and time - not "I want to listen to episode 47."</p>
<p>The station page itself didn't land. Users found the navigation between a Radio Page and a Station Page confusing and suggested combining them. The For You Page was too long, with entry points to schedules buried under irrelevant content. Terminology was another friction point - "on-demand" and "episodes" didn't match how people thought about radio. They called it "catch-up."</p>
<p>One phrase from testing stuck with me. A participant said what they really wanted was to "pick the phone up, hit play, and put the phone down." That was it. Minimal friction to live radio, and a clear path to catch-up when they'd missed something. A station page with social links, presenter bios, and featured content was solving a problem they didn't have.</p>

<h2>Changing direction</h2>
<p>Together with our UX research team, we presented the findings to the product team, and I supported the case with the prototypes and testing evidence. The recommendation was clear: don't build a standalone station page. Instead, take the components that tested well - primarily schedule, and integrate them into the journeys users were already on.</p>
<p>This wasn't about saying no to the brief. It was about solving the right problem. Users didn't need a destination page for a radio station. They needed:</p>
<ul>
  <li>Quick access to live radio</li>
  <li>A schedule-based path to catchup content</li>
  <li>Consistent language and interaction patterns - "catchup" not "episodes."</li>
</ul>
<p>The new direction was to distribute station page components - schedule access, presenter information, now-playing context - into the maxi player and the For You Page, rather than isolating them behind a dedicated page users would never navigate to.</p>

<h2>What we shipped</h2>
<p>The schedule feature shipped as part of the Rayo app. Instead of a station page you'd have to find, schedule access lives where listeners already are - surfaced in context, within the flows they naturally use.</p>
<p>Listeners can see what's on now, browse upcoming shows, and tap into catchup content from the schedule directly. The experience uses language that matches how people actually talk about radio - "catch-up" instead of "on-demand," shows identified by time and date rather than episode numbers. It's a small shift that removes a real point of confusion.</p>

<h2>What I took away</h2>
<p>The biggest lesson from this project was about <strong>the value of pausing</strong> before you build. The original brief was well-intentioned and logically sound - but it was based on an assumption about what users wanted, not evidence. By investing in research upfront, we avoided shipping a feature that would have been technically correct but practically unused.</p>
<p>I also learned something specific about radio listeners that I hadn't expected: they don't think about radio the way they think about podcasts or streaming. There's no concept of "episodes" or "browsing." Radio is live, and when it's not live, it's catch-up - anchored to a time they missed. Designing for that <strong>mental model</strong>, rather than imposing a content-library pattern, was the difference between a feature that tested as "perfect" and one that confused people.</p>
<p>The schedule is now live, and we're tracking engagement and average time spent listening to measure its impact. But regardless of the numbers, the outcome I'm most proud of is the process - a design team that used research to ask the right questions, <strong>challenge assumptions constructively</strong>, and ship something that genuinely matches how people listen to radio.</p>
`.trim(),
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
    content: `
<p>Every time an AI coding agent reads a Figma file, it encounters your layer names. "Rectangle 47" tells it nothing. "product-card" gives it meaningful context. The gap between those two names is the gap between an agent that guesses and one that builds closer to what you designed.</p>
<p>Layer Lint is a Figma plugin I built to close that gap between design files and AI agents. It scans your files for hidden and empty layers cluttering the panel, then uses Claude to batch-rename auto-generated names into semantic, developer-friendly ones - optimised for both AI agents and the humans who review their output.</p>
<p>It has already been published and currently waiting for Figma's approval.</p>

<h2>My role</h2>
<p>Side project - design & development</p>

<h2>Impact</h2>

<h3>One-Click Layer Cleanup</h3>
<p>Scans the current page and flags every hidden subtree and invisible shape - the forgotten artifacts that accumulate in any working Figma file. Select all or pick individually, then remove them in a single action.</p>

<h3>AI-Powered Semantic Renaming</h3>
<p>Claude reads each layer's type, text content, layout direction, children, and - for visually complex nodes - an exported PNG. It proposes kebab-case names that describe purpose, not appearance. Every suggestion is reviewable: edit, accept, or skip individually before applying.</p>

<h3>Instance-Safe by Design</h3>
<p>The plugin never walks into or modifies content inside component instances. Instance contents belong to their main component - renaming them locally would create overrides that break on the next component update. Layer Lint respects that boundary automatically.</p>

<h2>Problem</h2>
<p>Figma auto-generates layer names like "Rectangle 47", "Frame 3", and "Group 12". For a designer working visually, these names are harmless - you can see what each layer is on the canvas. But for anything reading the file programmatically - an AI coding agent, a design-to-code tool, a developer in Dev Mode - those names are noise. They carry zero semantic information.</p>
<p>On top of that, working Figma files accumulate hidden layers, empty shapes, and forgotten artifacts. These don't affect the visual output, but they bloat the layer panel, slow down file loading, and confuse any tool or agent trying to parse the file's structure. The problem compounds at scale: the more complex the file, the harder it is to maintain manually.</p>

<h2>Cleanup: finding what's invisible</h2>
<p>The cleanup scan walks the page tree and flags two types of node: hidden subtrees (where only the root needs removing) and leaf shapes with no visible fill, stroke, or effect - visually indistinguishable from hidden layers but technically still "visible" in Figma's model. Mixed fills are treated as intentional. The scan never enters component instances.</p>
<p>Results appear as a checklist with each layer's name, type, and reason (hidden or empty). Clicking a row zooms to the node on the canvas. Select all or cherry-pick, then remove.</p>

<h2>Rename: giving layers meaning</h2>
<p>The rename flow collects context for each candidate layer: its type, dimensions, parent path, up to 10 children, layout direction, fill classification, and for text nodes (the first 200 characters of content.) For visually complex nodes (vectors, images) above a minimum size, it also exports a 1x PNG so Claude can see what the layer actually looks like.</p>
<p>Candidates are batched to stay within API limits - 50 text-only layers per request, 10 visual layers. Claude is instructed via a constrained tool-use pattern: it must call a <code>submit_names</code> tool with exactly one kebab-case name per layer ID. The plugin deduplicates sibling names automatically (appending -2, -3 if needed) and sanitises every response to enforce the naming convention.</p>
<p>Two scope modes let the designer choose: rename only default-named layers (the "Rectangle 47" pattern) or all layers including manually named ones. The results appear in a side-by-side list where every proposal is editable before applying.</p>

<h2>Model selection and cost transparency</h2>
<p>The settings panel lets designers choose between Haiku (fast and cheap - the default), Sonnet (balanced), or Opus (highest quality). Haiku handles most files well. Sonnet or Opus are worth switching to for dense layouts or when Haiku is overloaded. The plugin tracks input and output token usage per session and displays it after each rename run, so designers always know what a batch cost.</p>
<p>Transient errors (rate limits, overload, server errors) are retried automatically with exponential backoff - up to three attempts with clear status messages between each retry so the designer knows the plugin isn't stuck.</p>

<h2>The other side of the agentic equation</h2>
<p>In the <a href="/case-studies/agentic-design-system/">Agentic Design System case study</a>, I structured a design system so AI agents could operate within it - auditing tokens, catching drift, keeping Figma and code in sync. That work assumed the Figma files were already well-structured. Layer Lint tackles the prerequisite: making sure the raw design files are readable by machines in the first place.</p>
<p>Together they form two halves of the same thesis. A semantically named layer tree means an AI agent reading the file via Figma MCP gets meaningful context instead of "Frame 3 contains Rectangle 47". And a well-structured design system means the agent knows what those layers should be called, what tokens they should reference, and how they relate to code. Layer Lint is the cleanup. The agentic DS is the vocabulary.</p>

<h2>What I took away</h2>
<p>The biggest insight was that <strong>layer names are an interface</strong>. Not only for humans to navigate visually. But for every machine that reads the file: AI coding agents, design-to-code tools, accessibility audits, automated testing. A layer called "user-avatar" is a contract. A layer called "Ellipse 9" is a guessing game.</p>
<p>Layer Lint came out of preparing our production Figma files at work for an agentic design system. As I started cleaning up, I discovered just how many dead layers and default names had accumulated. Hidden groups, unnamed rectangles, orphaned vectors everywhere. Renaming them one by one was <strong>time-consuming and mentally draining</strong>. I needed a way to semi-automate the process, so I built one. What started as solving my own frustration became something broader: as AI agents become a bigger part of the design-to-code pipeline, the quality of what they build depends on the quality of what they read. Clean layers aren't housekeeping - they're infrastructure.</p>
`.trim(),
  },
]

module.exports = {
  ORIGIN,
  caseStudies,
}
