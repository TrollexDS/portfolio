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
 *   summary       short paragraph (1–3 sentences); fallback body only if a
 *                 card has no `card` set
 *   datePublished ISO 8601 date string. Used for schema.org Article.datePublished.
 *                 Derived from the first git commit of the case study's card
 *                 component — run `git log --diff-filter=A --follow --format=%aI
 *                 -- src/components/cards/<CardName>.js | tail -1` to refresh.
 *   dateModified  ISO 8601. Last meaningful update to the case study content.
 *                 Update manually when content changes (the git last-touched
 *                 date is unreliable — triggered by unrelated refactors).
 *   ogImage       absolute URL to social share image (falls back to site-wide
 *                 og-image.png if omitted)
 *   card          component file name in src/components/cards/ (no .js). The
 *                 noscript fallback body is server-rendered from this card at
 *                 build time (scripts/lib/render-card.mjs), so case study
 *                 prose lives in exactly one place: the card.
 */

const ORIGIN = 'https://mchiu.co.uk'

const caseStudies = [
  {
    slug: 'agentic-design-system',
    cardKey: 'agenticds',
    card: 'AgenticDSCard',
    title: "I didn't use AI to build a design system. I built a design system that AI can use.",
    description:
      'A design system restructured so AI agents can consume it — 468 tokens, four autonomous workflows, and Figma MCP integration.',
    about:
      'A design system structured for AI agents — 468 tokens, four autonomous workflows, and Figma MCP integration.',
    datePublished: '2026-04-14',
    dateModified:  '2026-04-17',
    summary:
      'Most "AI + design system" work plugs an LLM onto an existing library. This case study goes the other way: it restructures the system itself — tokens, component APIs, naming — so agents can read it, assemble from it, and ship without a human in the loop. Four autonomous workflows, 468 tokens, Figma MCP integration.',
  },
  {
    slug: 'rayo-design-system',
    cardKey: 'ds',
    card: 'RayoDSCard',
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
    card: 'SimplestreamDSCard',
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
    card: 'PluginCard',
    title: 'Streamlining the Design Process & Improving Efficiency at Scale',
    description:
      'Custom Figma plugins that streamlined design workflows and eliminated repetitive work at scale.',
    about:
      'Custom Figma plugins that streamlined design workflows and improved team efficiency at scale.',
    datePublished: '2026-04-01',
    dateModified:  '2026-10-26',
    summary:
      'When a design team repeats the same manual step dozens of times a week, the fix is not a better spec — it is a plugin. This case study covers the Figma plugins built to automate Rayo thumbnail generation and related repetitive flows, and the efficiency gains that followed.',
  },
  {
    slug: 'rayo-in-alexa',
    cardKey: 'alexa',
    card: 'AlexaCard',
    title: 'Bringing Design to a Team That Had Never Had a Designer',
    description:
      'Bringing design practice to Bauer’s Alexa skill - the diagnosis, seven linking routes made one, and an honest read of two years of support data.',
    about:
      'Introducing design practice to a team that had never had a designer, on Bauer’s Alexa skill.',
    datePublished: '2026-04-01',
    dateModified:  '2026-09-27',
    summary:
      "The Alexa skill at Bauer had shipped for years without a designer. This case study is the diagnosis - five reported problems that turned out to be two causes - the seven linking routes consolidated into one, and an honest read of two years of support data, including the theme that deliberately did not move.",
  },
  {
    slug: 'rayo-schedule',
    cardKey: 'schedule',
    card: 'ScheduleCard',
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
    card: 'LayerLintCard',
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
  {
    slug: 'rayo-design-lab',
    cardKey: 'designlab',
    card: 'RayoDesignLabCard',
    title: 'The Platform That Lets Our Whole Design Team Prototype with AI',
    description:
      'The Rayo Design Lab - a platform where the whole design team briefs AI to build working prototypes inside the real Rayo components, tokens and rules, with no code required.',
    about:
      'A prototyping platform built on a React mirror of Rayo’s iOS design system, where any designer can brief AI to build working prototypes inside the real components and tokens.',
    datePublished: '2026-09-07',
    dateModified:  '2026-10-21',
    summary:
      'Designing with AI on its own was a gamble, and even once it worked it only worked for me. The Rayo Design Lab is a platform where AI builds inside the real Rayo components and tokens, and where any designer on the team - no Terminal, no git, no code - can brief it, see several directions side by side in every state, and share the result. Faster to prototype, so more of us explore more of the options before we choose.',
  },
]

module.exports = {
  ORIGIN,
  caseStudies,
}
