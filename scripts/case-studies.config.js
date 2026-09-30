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
      'Bringing design practice to Bauer’s Alexa skill - the diagnosis, seven linking routes made one, and an honest read of two years of support data.',
    about:
      'Introducing design practice to a team that had never had a designer, on Bauer’s Alexa skill.',
    datePublished: '2026-04-01',
    dateModified:  '2026-09-27',
    summary:
      "The Alexa skill at Bauer had shipped for years without a designer. This case study is the diagnosis - five reported problems that turned out to be two causes - the seven linking routes consolidated into one, and an honest read of two years of support data, including the theme that deliberately did not move.",
    content: `
<p>Rayo is Bauer Media's audio app - live radio across the station brands, plus catch-up and podcasts, on mobile, web, car and smart speaker. Its Alexa skill had been shipping for years with no designer: no documented flows, no design files, and everything about how it worked living in the PO's and the lead developer's heads.</p>

<p>After helping take the Rayo app from beta to launch, I volunteered to move to the Voice and Connected Device team as its first designer, alongside a developer and a QA who joined at the same time. What follows is the evidence I started from, the diagnosis that set the team's priority, the decisions I made and what they cost, and what two years of support data can and cannot tell you about the result.</p>

<h2>My role</h2>
<p>Sole designer</p>

<h2>Impact</h2>

<h3>The biggest complaint theme fell and stayed down</h3>
<p>Premium listeners hearing adverts was the largest ticket theme and the one most directly downstream of broken linking: 753 tickets in January 2024, 54 in January 2025, and a monthly average that went from 185 to 56 and held there for two years. Other teams were improving the premium experience over the same period, so I do not claim that fall as mine alone - what the data does and does not support is set out below.</p>

<h3>Seven ways to link became one</h3>
<p>Seven linking routes, each with its own bugs and no consistent logic between them, converged on a single path through the Alexa app using Amazon's app-to-app pattern. Six help centre articles were rebuilt around the three themes the diagnosis had identified.</p>

<h3>A source of truth the team could run</h3>
<p>I rebuilt the skill in Voiceflow: every intent, its conditions, synonym variations and error states. Developers built new features from it and QA tested against it, so it stopped being my documentation and became the team's spec. And because the journeys were mapped in full, it runs - you can talk to it and it answers, close to the live skill.</p>

<h2>What I inherited</h2>
<p>Seven different ways to link a Rayo account to Alexa. Six help centre articles explaining them. Zero documented flows, and no shared source of truth for how any of it worked.</p>

<h3>A product that reported success it had not achieved</h3>
<p>The app says you are linked. Alexa confirms you are a premium member. You still hear adverts. You unlink, and nothing actually unlinks - permission is revoked but the OAuth tokens stay alive, so the state is wrong in a new way. You re-link to fix it, and it happens again.</p>

<h3>Silent failures throughout</h3>
<p>Nothing ever told anyone that something had gone wrong. On a screenless device there is nowhere to look and nothing to read, so a listener could not tell a broken link from a broken app from a broken subscription. Neither could customer service.</p>

<h2>The audit</h2>

<h3>I started by failing the way a new user fails</h3>
<p>I had never used an Alexa device. I bought an Echo Dot and an Echo Show, set them both up with no help from the team, and documented every step from first power-on through finding the skill, exploring content and playing a specific show. Before I could judge the experience I had to be able to describe it.</p>

<h3>What the skill could actually hear</h3>
<p>Alexa skills were not conversational at this point - this predates Alexa+. The skill only responded to word-perfect utterances built for each intent. Anything else failed, silently, on a device with nowhere to show you why.</p>

<p>I asked the lead developer for the interaction model JSON and went through it with him to understand how it was structured, then pulled it apart and documented every intent, utterance and synonym in Confluence. It stopped being something only one person could answer.</p>

<h2>Five problems, two causes</h2>
<p>There was no research platform at Bauer yet - UserTesting and UserZoom only arrived after this shipped - so I went to customer service and asked what people were actually contacting us about. They pulled three months of contacts, the skill store reviews and the premium cancellation survey. Smart speaker problems were a recurring theme in support, the store listing was dominated by one star reviews, and a meaningful share of people cancelling premium said they could not use it on their device.</p>

<p>Five issues came up most: premium users hearing adverts, account linking failing, premium features not working, access to premium stations, and playback and streaming drops.</p>

<p><strong>Four of the five were the same failure wearing different clothes: the account link was not holding.</strong> Permission, OAuth tokens and Amazon's own record could all disagree, and nothing owned the truth. If the link state is wrong server-side the premium catalogue is not returned, so hearing adverts, losing premium features and losing premium stations are not three problems sitting next to a linking problem. They are the linking problem, described by the listener in the terms they experienced it.</p>

<p>The fifth, <strong>playback and streaming drops, was a separate technical fault</strong> with nothing to do with linking. I spotted the pattern in the ticket themes; the lead developer supplied the mechanism, which was that unlinking revoked permission without ever clearing the tokens. Joint diagnosis, not a solo one.</p>

<p>I took the customer service report to our PO and made the case that account linking should be the team's first priority: four of the five biggest complaint themes traced to one cause, and it was hitting paying customers. It became the priority. That was the first time design had set the agenda on that team.</p>

<h2>Restructured journeys</h2>

<h3>A source of truth that runs</h3>
<p>With no documentation and no design files, my first job was to make one. I rebuilt every intent in Voiceflow - intents are the voice equivalent of features - mirroring the real skill including its conditions, synonym variations and error states. Developers built new features from it and QA tested against it. Because the journeys were mapped in full it also runs: you can talk to it and it responds, close to the live skill, which is how I have used it for testing features designed since.</p>

<h3>Seven paths into one</h3>
<p>The root cause sat in the backend: Shepherd, our own system, could not communicate reliably with Amazon. I took the diagnosis to the backend team and asked whether the underlying problem could be fixed. They agreed with it and had no capacity - fair enough, they had just launched Rayo and were carrying the tech debt from it. So the question became what could be fixed inside my own team's control.</p>

<p>That is what led to consolidating the routes rather than repairing them. The legacy brand apps had Amazon app-to-app linking built in, technically the most direct route and also the buggiest, and fixing it needed the backend work we did not have. Linking inside the Alexa app was the most stable and the simplest to explain: tap link, sign in with your Rayo account, agree, done. Rayo owns two screens inside that flow. The rest of it is Amazon's, and so is the last step of every other route - which is why adding routes only adds places to fail.</p>

<h3>Four decisions, and what each one cost</h3>
<ul>
<li><strong>Where linking happens.</strong> Fix the buggy in-app routes, keep several routes and improve them all, or hand off to the Alexa app. I handed off. Cost: a branded handoff Rayo does not control.</li>
<li><strong>The old invocation.</strong> "Alexa, open Planet Radio" could be retired at launch, kept temporarily, or kept indefinitely. Kept indefinitely. Cost: two invocation names to maintain. Listeners with a decade-old habit should not have to relearn it.</li>
<li><strong>The rebrand message.</strong> "This is Rayo, the new name for Planet Radio", time-boxed to three months. Cost: every session slowed for three months, on a surface whose whole value is speed to audio.</li>
<li><strong>Making linking worth doing.</strong> No incentive, a premium discount, gating a feature people already have, or building a new feature and gating it. Continue Listening, new and only for linked accounts. Cost: engineering time on a feature whose only job was to justify a different feature.</li>
</ul>

<p>On the last one: gating something people already have is a takeaway. It would have generated exactly the support contacts this project existed to remove, and it punishes the unlinked rather than rewarding the linked. Building something new and putting it behind the link means nobody loses anything.</p>

<p>On the three months: long enough that an occasional listener heard it a few times, short enough not to slow every session indefinitely. It was a judgement call discussed with the team, not a calculation. Looking back I would let the data end it rather than the calendar - watch the split between people saying "Rayo" and people still saying "Planet Radio", and retire the message when that curve flattens.</p>

<h3>The flow runs across three surfaces</h3>
<p>What makes this different from designing a screen is that it does not live on one surface. It starts in voice, passes through Amazon's system layer, and finishes on the phone. Rayo owns neither the middle nor the end.</p>

<p>Three checks have to pass before anyone can be sent anywhere, and none of them are visible to the listener: is the Alexa app installed, is this one profile or a household with several, and are notifications on, off, or never set? If the device belongs to a household the link can only go to the primary user, so there is an extra step to confirm that is what they want. And if notifications are on, Alexa says "I'll send you a link"; if they are off, it says you will find it in the Alexa app. Same flow, different words - honest about a permission Rayo does not control rather than promising something that will not arrive.</p>

<p>Most of the estate has no display, so the Echo Dot path was designed as the complete journey. The Echo Show adds one option, the QR code. The screen is additive, never load-bearing.</p>

<h3>Every exit teaches the way out</h3>
<p>Good design lets someone feel in control, and on a phone that is easy: if you want to know whether you are linked, you open settings and look. On a voice device there is nothing to glance at. The only way to check is to ask, and that only works if you already know the exact words. So every exit in the flow, successful or failed, ends by teaching the utterance that checks it. If someone is stuck, the dead end should at least leave them with something they can use next time.</p>

<h3>Help where the problem is</h3>
<p>On the Echo Show, a Get help button opens the Rayo support page in Alexa's own browser, in situ rather than sending anyone away. The three articles surfaced there - linking, hearing adverts, premium stations - are the three themes from the diagnosis. I took those themes back to customer service and we rebuilt the help centre around them, so the guidance was prioritised by the same evidence as the design.</p>

<h3>Continue Listening, and the half I did not ship</h3>
<p>Everything above makes linking work. None of it makes linking worth doing. You scan a code, sign in, agree to a permission screen and land back in exactly the same experience. If you are premium there is a payoff. If you are not, it is pure cost, and the business wanted everyone linked.</p>

<p>Continue Listening was my answer: ask Rayo to continue and it picks up whatever you had already started, with your listening history on the Echo Show home screen for linked users. What I originally designed was cross-device - you listen on the way home, you walk in, you ask Alexa to carry on. That is the version that makes linking worth doing, it needed backend work the team did not have, and it was scaled back to Alexa-only. What you start on the Echo, you continue on the Echo. That is what shipped.</p>

<h2>Everything fell. Except the one thing I said was unrelated.</h2>
<p>The new linking flow shipped in Q2 2024. I do not have the analytics I would want - GA4 was not implemented on the skill until October 2024, months after this shipped - so there is no clean before and after in product data. What I have is two years of customer service tickets.</p>

<p>Hearing adverts as a premium user went from 753 tickets in January 2024 to 54 in January 2025, and from a monthly average of 185 to 56. It held at that level for two years with no drift back. Across all eight support categories, monthly averages, 2024 (excluding June and July) to 2025: account linking 14 to 4, down 71%; hearing adverts 185 to 56, down 70%; billing 75 to 26, down 66%; voucher 9 to 4, down 58%; general 41 to 21, down 49%; account 20 to 10, down 49%; cancel subscription 76 to 42, down 45%; streaming 22 to 22, up 2%.</p>

<h3>Why I cannot hand you a clean number</h3>
<p>Billing fell 66% and I had nothing to do with billing. 2025 was a better year across the whole premium experience and other teams were fixing things at the same time, so the fall in the linking-related categories cannot be attributed to this work alone, and I am not going to claim it.</p>

<h3>What does hold</h3>
<p>Streaming is the one theme I had diagnosed as a separate technical fault, and it is the only category that did not move. If this were simply lower ticket volume overall - fewer subscribers, a channel change, people giving up on contacting support - streaming would have fallen with everything else. It did not. So these are real category-level changes, and the prediction I made before doing the work is the one that held.</p>

<h3>What this data does not say</h3>
<ul>
<li>Account linking tickets themselves were never the big number: 14 a month down to 4. It has the largest percentage fall on the chart and the smallest raw one. The impact shows up downstream, in the themes people actually complained about.</li>
<li>June and July 2024 are excluded. A backend refactor logged everyone out and produced over a thousand account-linking tickets in two months. Leaving it in would make every fall look bigger than it was.</li>
<li>These are support contacts, not behaviour. Fewer complaints is not the same as more successful links.</li>
<li>A large spike in linking events in late 2025 was a marketing campaign, not this work.</li>
<li>April 2025 shows a joint spike in hearing adverts and streaming, which looks like one technical incident hitting both rather than anything to do with linking.</li>
<li>Nobody watched a real listener attempt the redesigned flow before it shipped. The evidence was behavioural and at scale, plus one first-run walkthrough by me, and by then I knew too much to be a useful test.</li>
</ul>

<h2>Two years on, the phone becomes the control surface</h2>
<p>Back on the mobile team, I led the Rayo app side of app-to-app linking, and it has now shipped. Smart speaker settings sit with the other account-level settings: a primary link CTA, and sample utterances shown before you link - the device with a screen teaching the device without one.</p>

<p>There are three states: not linked, link pending and linked. Link pending exists because the status is eventually consistent. Shepherd queries Amazon for live status, usually instantly and occasionally a few minutes behind, so rather than assert something it cannot know, the screen says so and offers a route into the Alexa app, which always shows the accurate status. Unlinking routes there too. Rayo can never own linking - whichever direction you go there is always a step under Amazon's control, and the honest design is the one that admits it.</p>

<h2>What I would do differently</h2>

<h3>Agree the feedback loop before the build, not after</h3>
<p>I shipped this without a loop at either end. Nothing was watched before it went live, and nothing could be measured after it, so I had strong evidence about the problem and almost none about the solution. The fix is one thing rather than two: agree up front how the design will be validated and how it will be measured, and make the case to analytics for tracking to land as part of the build. On this project that means link completion rate, time to link, and linked versus unlinked listening hours.</p>

<h3>Ship the whole incentive, or none of it</h3>
<p>In-skill resume shipped. Phone-to-speaker resume, the part that gives a non-premium listener a reason to link at all, did not. When the cross-device version turned out to need backend work we did not have, I accepted the smaller one, and the smaller one does not do the job it was built for. The deeper version of that: "can we build all of this" and "is the half we can build still worth building" are two different questions with two different owners. Taking the answer to the first as the answer to the second is the actual mistake.</p>

<h3>Smaller things I would carry forward</h3>
<ul>
<li>Documentation needs a named owner. The Voiceflow file was the team's source of truth, and the team was later disbanded.</li>
<li>A written state model - what linked means and who owns it, agreed across product, backend and customer service and checked against Amazon's docs - would have surfaced the five-problems-one-cause insight on day one.</li>
<li>The customer service report was a one-off ask. A standing monthly read would have made it a feedback loop rather than archaeology.</li>
<li>Logging the actual fallback utterances would turn every misheard request into a synonym to add.</li>
</ul>

<h2>What I took away</h2>
<p>Most of what made this work was not screen design. It was getting a team that had never had a designer to agree on what the flow actually was, and then keeping that agreement somewhere everyone could use it.</p>

<p>The other half is the partner surface itself. You are always designing around somebody else's last step, so the real job is deciding where to spend the control you do have. Work on the skill is paused while the team waits on Alexa+, and one constraint is still open: "Rayo" is acoustically close to "radio", and Alexa cannot reliably tell them apart. That one is a conversation with Amazon, and the kind of problem you only find by reading what the system misheard.</p>

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
  {
    slug: 'rayo-design-lab',
    cardKey: 'designlab',
    title: 'From Hit-and-Miss to Ideas We Took Forward',
    description:
      'The Rayo Design Lab - a React mirror of our iOS design system where AI builds working prototypes inside the real components, tokens and rules.',
    about:
      'A React mirror of Rayo’s iOS design system where AI builds working prototypes inside the real components, tokens and usage rules.',
    datePublished: '2026-09-07',
    dateModified:  '2026-10-01',
    summary:
      'Designing with AI on its own was a gamble - the output was always nearly right, which is the worst kind of wrong. The Rayo Design Lab is a React mirror of our iOS design system where AI builds inside the real components and tokens, with each component’s usage rules written in Markdown beside it. Explorations start from faithful rebuilds of the app’s own screens and arrive as competing options across every state, each carrying the argument for it. A guide and open review rules mean the team doesn’t need the person who built it to use it.',
    // Full prose content - extracted verbatim from the rendered vnode tree of
    // src/components/cards/RayoDesignLabCard.js, so crawlers and LLMs see the
    // same text human visitors see. Regenerate rather than hand-edit.
    content: `
<p>Exploring a design properly is expensive, so a feature gets one direction drawn at its happy path, and the states that actually decide it never get drawn at all. AI looked like the fix, and at first it made things worse. So I built the Rayo Design Lab, where AI builds inside our own design system, with the rules for using it written down where it can read them. What comes out is worth arguing over, and some of it we’ve taken forward. It’s also built so the rest of the team doesn’t need me to use it.</p>
<h2>My role</h2>
<p>Design and development. I built the lab, wrote the guide that gets the team into it, and set up how work gets reviewed. I own the foundations every prototype sits on; any designer can review and merge an exploration.</p>
<h2>Impact</h2>
<h3>💡 New ideas land inside the product, not beside it</h3>
<p>The lab keeps the app’s own screens as they actually are, so a new idea gets designed into the real screen rather than generated as a fresh page of invented parts. That’s the difference between reviewing a change to the product and reviewing something that merely resembles it.</p>
<h3>🗺️ A feature arrives as competing directions, not one frame</h3>
<p>Every exploration puts several working options side by side rather than one frame. Each option stating what it’s betting and what it costs, measured, in the frame, next to the thing it describes.</p>
<h3>⚠️ States we’d have got to last</h3>
<p>Building this way surfaces the states nobody has got to yet. The ones that are neither an error nor progress, and so get drawn last or not at all. More than once they’ve changed the direction we took rather than just how quickly we got there.</p>
<h3>⛹️‍♂️ A playground the whole team can get into</h3>
<p>It’s meant to be somewhere you try things, and the designers do the trying. The lab carries its own guide, written for designers who have never opened Terminal, from a blank Mac to a first prototype. Any designer can approve someone else’s exploration, so an idea never waits on the person who built the tool.</p>
<h2>Problem</h2>
<p>Two things were true at once, and each made the other worse.</p>
<p><strong>Exploration was expensive, so it stayed narrow.</strong> Producing screens in Figma was never the problem; prototyping them is. A Figma prototype is a graph of screens, and every state is another screen (loading, empty, error, offline, locked etc.) each one drawn, linked and kept in step by hand. Three directions across five states is fifteen screens to maintain, and a change to one of them is a change to all of them. That cost lands hardest on user testing, where the version you test stays the version you drew first, whichever way the first session went.</p>
<p><strong>And AI, on its own, made it worse rather than better.</strong> Designing with it felt like gambling: write a prompt, spin, mostly miss. The output was always <em>nearly</em> right, which is the worst kind of wrong: a colour close to ours, a component we don’t have, a locked state invented from scratch. You can’t decide anything from a screen that is approximately the product.</p>
<p>It wasn’t the tool, it happened across every AI design tool I tried. Give a capable model nothing of ours to work from and you get something plausible and generic, because that is all the information it has.</p>
<h2>It started as the Storybook iOS can’t have</h2>
<p>Rayo ships on iOS and Android, and the two platforms aren’t equally stuck. Android has workable routes to a browsable component gallery, iOS doesn’t. SwiftUI previews live inside Xcode, which is not a place a designer goes. I started from the iOS side, which is the half with no answer, and mirrored it in React: I extracted it from the iOS source with Claude Code: colours from the asset catalogue, spacing and radius constants, type sizes and weights, and each component’s variants, states and animation timings from its Swift file.</p>
<p>It is a smaller library than a designer expects, and that is worth explaining. Engineering makes something a component when it gets reused; designers make components of almost everything, including modules assembled out of other modules. So a library mirrored from the app is structurally short - a dozen or so real primitives, and the composing happens in the prototype instead. Which turns out to be the right split: what the app guarantees lives in the library, and everything still being decided stays where it can be argued with.</p>
<p>The icons are in there too: the full set, browsable and grouped by what each one is for, including the handful the app only ships as images and so have no component at all.</p>
<p>That alone would have been useful. It’s also the least interesting thing here: a library is a catalogue, so it tells you which components exist. It doesn’t tell you which of them is the wrong choice for the screen in front of you.</p>
<h2>The part that made the AI useful</h2>
<p>Each component ships a contract beside it - a Markdown file next to the code, and where they disagree the Markdown wins. Not an API reference. Use when, don’t use when, content rules, anti-patterns.</p>
<p>None of that is in the code, and none of it was written down anywhere. It lived in designers’ heads and in review comments. It’s also exactly what an agent needs, because an agent doesn’t hedge and doesn’t ask: given a list of components and no rules, it picks something reasonable-looking and is confidently wrong.</p>
<h2>The cold-start test</h2>
<p>Documentation nobody can fail is documentation nobody maintains. So the system has a test. Open a fresh agent session in the repo - no history, no hints - and give it one prompt: build a list screen for a piece of locked content. Then audit what comes back. Right components? Tokens throughout? Locked state handled the way the pattern doc describes? Both themes?</p>
<p>The rule that makes it useful is how you read the result: <strong>every failure is a documentation bug, not a model failure.</strong> Don’t rewrite the prompt and don’t add context in the chat - find the missing rule, put it in the contract, run it again.</p>
<h2>Then it became a place to explore</h2>
<p>Once real components existed with rules attached, building a screen stopped being the expensive part, and in code a state is a prop, not another screen. That single difference is what makes exploring several directions across all their states affordable at all. So the lab grew a prototype harness, and the harness is built around the argument rather than the screen.</p>
<p>Each exploration has two sets of controls. One switches between the design options; the other switches the state: offline, error, loading, locked. They look different on purpose, because they aren’t the same kind of choice. Any option can be seen in any state, which is the thing a static mockup can’t do.</p>
<p>Each option carries a bet: what it’s good for, and what it costs, written next to it. Not a description of the layout - an argument, with the trade-off named and measured where it can be. Rejected options keep their place, with the reason they lost written next to them. It is much easier to agree that something is too loud once you can see it, and easier still not to have the same argument again in three months.</p>
<p>Every prototype also carries two lists underneath it. The first is called Needs a system decision, and it collects the gaps that exploration ran into. The second is Still unverified, and it lists everything in the screen we made up: invented content, guessed values, placeholder copy. One prototype says outright that a number in it is invented and has to be replaced before anyone sees it, because that number is the whole thing a test of that screen would measure. Both lists are part of the work rather than an appendix to it. A prototype that hides what it guessed is worse than one that stops and asks.</p>
<p>Which is the opposite of where I started. When I began, designing with AI was a bet I couldn’t see the odds on. Now every option has to state its own.</p>
<h2>The states we’d have got to last</h2>
<p>This is where it stopped being a faster way to do the same work. Downloading a podcast has a state most download UIs skip: the listener taps download while on mobile data, with mobile-data downloads switched off, and nothing happens. The control ended up with six states rather than the obvious four.</p>
<p>The other was storage: how much room downloads are taking and how much is left, at the top of the screen. Obvious once it’s there, and a list of episodes cannot answer the question everyone actually has before a flight. Neither is decoration, and the second one carried weight in where the feature landed.</p>
<p>I don’t read that as the model being clever. The house rules in the repo say build the unhappy states, and the design doc says a screen isn’t finished until loading, empty, error and locked all exist. What happened is that a rule I’d written got applied further than I’d applied it myself - because state exploration is tedious, so humans do it last and under time pressure, which is exactly why unhappy states ship broken. <strong>Write the intent down properly and it holds you to it too.</strong></p>
<h2>Ideas need something true to start from</h2>
<p>Once the team was exploring in it, a different problem showed up. The ideas were good, but the screens they sat on drifted. Every prototype that touched an existing screen rebuilt it first, from memory or from another prototype, and every rebuild lost something. The podcast show page was rebuilt three separate times, and five prototypes ended up with a nav bar 20 points taller than the app’s, because there was no correct version anywhere to copy. An idea shown on a screen that isn’t quite the app has the same problem as AI with nothing of ours to work from: you end up arguing about the difference rather than the idea.</p>
<p>So the lab grew a second portal, Pages: the production screens rebuilt as they are, from the reference designs and the iOS source. It now covers close to every screen in the app, tab by tab, plus settings, the premium flow and login.</p>
<p>A Page plays by different rules from a prototype. It answers no question, so it has states but no options. It has to name its source, so anyone can check it against the thing it claims to be. And it isn’t allowed to improve the screen, even where the screen is wrong, because a baseline that quietly fixes things can’t tell you which parts are the product.</p>
<p>The Pages link up the way the app does. You can tap from the Welcome screen through login and land on For you, or from a Go Premium prompt through sign-up to the congrats screen and back to where you started. The content is Rayo’s real catalogue, so a show looks the same on every screen you find it on.</p>
<p>A prototype now starts from the Pages rather than redrawing them. The first one built this way explores five ways to hand Hits Radio app listeners over to Rayo, and it doesn’t copy the screens it touches: it uses the Pages themselves, so a fix to a Page reaches every prototype built on it. What differs between the directions is the idea, not the screen underneath it.</p>
<p>A Page is also the strictest audit the design system gets, because it’s the only thing in the lab that isn’t allowed to design around a gap. Every missing token or component turns up in its notes.</p>
<h2>It finds what the system is missing</h2>
<p>Building real things in a design system is the fastest way to discover what it doesn’t have, and the gap lists turned out to be a channel rather than a complaint box.</p>
<p>The audit file that started as a record of what was inferred from the Swift now runs to twelve sections, and the later ones are all things found by using the system rather than reading it: no motion, elevation or blur primitives; a secondary text colour that doesn’t survive being placed on anything tinted; a button with no nav-bar size; a selected state that is a colour and nothing else, still open. <strong>Each one is a question the design system now has to answer, raised by something real rather than in the abstract.</strong></p>
<h2>Designing the lab itself</h2>
<p>I should admit a bias here. I like the way Apple’s software feels - Liquid Glass, the spatial UI direction, that sense of something modern and slightly ahead of itself - and I wanted this to feel like that rather than like a documentation site. It’s where the name came from: a lab is somewhere you try things, not somewhere you file them.</p>
<p>Prototypes is what people open the lab for, so it’s the front door, with Pages, Components and Icons one click away in the top bar. Moving between prototypes doesn’t send you back to an index either. You go straight from one to the next, which is what makes comparing them quick. And ⌘K searches everything at once. It runs locally, with no model behind it, and the panel says so, because a search box shaped like a prompt that could only match text would be lying about what the tool does.</p>
<p>Prototypes and Pages each open on a feed of what’s changed, because a lab that changes most days is only useful if people can tell what’s new. Half of it writes itself: when the site builds, it reads its own git history and works out which prototype, page or component each change touched, so the feed says what moved rather than repeating a commit message. The other half is a written note, for the changes that deserve a headline, saying what to go and look at. Anything new since your last visit is marked.</p>
<p>The one rule the whole thing is built on: <strong>the shell is transparent, the frame is not.</strong> The lab’s own chrome is deliberately unlike Rayo - glass over a slow wash of light, permanently dark - and it stops dead at the edge of the phone frame. Inside, the screen under test sits on a real Rayo surface and is judged against it, never through a veil. Light and dark belong to the screen being reviewed, not to the tool, so the appearance switch sits above the frame rather than in the header. That rule is what stops a nicely-designed tool contaminating the thing it’s supposed to help you judge.</p>
<h2>It shouldn’t depend on me</h2>
<p>A prototyping tool one designer uses is a hobby, and one that needs its builder in the room is a bottleneck. That was the risk here. I was the only one who could set it up, get someone unstuck and merge their work, and AI that speeds up one designer while everyone else queues behind them isn’t a gain for the team. So a lot of the work since has been getting myself out of everyone’s way.</p>
<p>Onboarding started as sessions I ran: install Node, clone the repo with GitHub Desktop, run it locally, let Claude Code handle git. That got people started, but a session doesn’t scale. Steps heard once are easy to lose, and the next person to join wasn’t in the room.</p>
<p>So the lab now carries its own Guide, written for someone who has never opened Terminal, used git or written a line of code. It goes from a blank Mac to a first prototype: a one-time setup, a file you double-click to open the lab, and then the whole workflow in plain words. Get the latest, start a branch, brief Claude the way you’d brief another designer, save, and share it for review.</p>
<p>The line I think does the most work is near the top: you can’t break it. Nothing on your Mac reaches the published lab until another designer has looked at it and approved it. For someone who has never used Terminal, knowing that matters more than any of the instructions.</p>
<p>The details are where people actually get stuck, so that’s where most of the writing went. The usual Node installer needs an administrator password, which not everyone has, so setup has a second route that doesn’t. The launcher catches the macOS privacy block that otherwise surfaces as a baffling EPERM error, and says exactly which setting to change. There’s a chapter for when things go wrong, and another for the words you’ll hear.</p>
<p>The Guide ends with one rule for itself: if a step tripped you, it will trip the next person, and the fix belongs on the page. It’s the cold-start test again, pointed at people instead of an agent. <strong>A failure is a documentation bug, not the reader’s fault.</strong></p>
<p>Approval was the other bottleneck, because it used to be mine. Every pull request now needs one approval and a passing build, and any designer’s approval is enough to merge an exploration, because explorations should be cheap to merge. Only the foundations every prototype sits on need mine: the tokens, the components, the shared screen furniture and the rules Claude reads, because a change there quietly moves everyone else’s screens. <strong>I hold the parts where a mistake spreads, and nobody waits for me to try an idea.</strong></p>
<p>And it deploys itself - merging to main publishes the lab internally, so an exploration is a link you send in Slack rather than an export, and the link is never out of date because it is the repo.</p>
<p>Where it stands: designers have set up from the Guide, and the first explorations to go through another designer’s review are what I’m watching for next.</p>
<p>It doesn’t have to stay a design-team tool, and that’s the next thing I want to test. Anyone who can describe a screen can now get a real one built from the real system: an engineer sketching a feature they’ve been thinking about, a product manager putting an idea in front of people instead of describing it. The platform is open to them; whether they take it up is the interesting question.</p>
<h2>What’s next</h2>
<p><strong>Designing with AI is a solo activity, and it shouldn’t be.</strong> Setting up and reviewing no longer depend on one person, but the work in between still does. It’s a question design leaders raised at an AI conference I went to recently, and I agree with them. Sharing the result is solved: a prototype is a link you can send to anyone. Working on it together isn’t. The session where the options get generated happens between one designer and one agent, and the feedback happens somewhere else, in a message thread, detached from the thing it’s about. There’s nowhere to pin a comment to the exact state you disagree with, the way you would in Figma, and no way to pick up another designer’s direction and take it somewhere new. The bets and the gap lists were a first step towards the argument living inside the work. The next is making room for other people’s arguments there too, designers first, then engineering and product. That’s what I’m exploring next.</p>
<p><strong>Handoff annotations.</strong> Pages closed the fidelity gap for screens that already exist. What’s still missing is annotations, so for now this is a system for exploring and deciding internally, not for handing over.</p>
<p><strong>Prototypes built for real user testing.</strong> Everything so far has been for internal decisions: arguing a direction out among ourselves. The next step is somewhere in the lab built for putting a prototype in front of actual listeners. The form isn’t decided yet, but a prototype made of the real system, with its states already built, is most of the way to being testable already.</p>
<h2>Outcome</h2>
<p>The team works in it, and what changed isn’t the speed. <strong>We can see many ways of doing the same thing side by side, each with its argument and its cost attached, before anyone commits.</strong> It’s an ideation tool more than a decision tool, and that’s the honest description: the downloads work ran through three destinations for where downloaded episodes should live, and the one we took forward won on grounds the exploration made visible - separating managing saved content from managing downloaded content, and being the only place that could show storage.</p>
<p>It isn’t finished, and the list above is honest about that. The team also isn’t yet at the point where designers push pull requests for UI changes, which is a question about how design and engineering work together rather than about the repo.</p>
<p>What I’d take from it is narrower than “AI makes design faster”, and more useful. <strong>The models were never the constraint. The constraint was that they had nothing of ours to build with</strong> - no tokens they could reach, no components that were really ours, and no written rules about when each one is the wrong choice. Give an agent the actual system and the rules that go with it, and the work it produces is something you can decide from.</p>
<p>The second is about who it’s for. <strong>AI that makes one designer faster while everyone else waits for them isn’t a gain for the team.</strong> Much of the work on the lab since has gone into the parts nobody sees in a demo - the Guide, the review rules, the baseline everyone builds on - so the lab works without me in the room.</p>
`.trim(),
  },
]

module.exports = {
  ORIGIN,
  caseStudies,
}
