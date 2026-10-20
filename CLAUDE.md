# Portfolio (mchiu.co.uk)

Vue 3 via CDN, `h()` render functions, no bundler. GitHub Pages serves the committed files as-is, so **everything committed is public** (including .md files under `case-studies/`).

## Read cheaply
Several files are large. Search them, read line ranges, never whole:
- Card components (`src/components/cards/*Card.js`, up to 67 KB). `grep -n "cs-section-title" <card>` gives the section outline.
- CSS lives in `src/styles/partials/` (20 files, cascade order = number prefix). `main.css` is only the `@import` list. Find a class with `grep -ln "\.ll-" src/styles/partials/*.css`.
- Don't open `node_modules/`, `src/assets/videos/`, `Claude outputs/` (screenshots), `docs/briefs/` (private, unless asked), `package-lock.json`.
- Don't read the generated `case-studies/*/index.html` to learn content; read the card.

## Map
| Case study (slug) | Card | CSS prefix |
|---|---|---|
| rayo-in-alexa | AlexaCard | `alx-` (+ `cs-review-`, `cs-antonym-`) |
| rayo-design-lab | RayoDesignLabCard | `rdl-`, `rdlv-`, `gs-` |
| agentic-design-system | AgenticDSCard | `ads-` |
| figma-plugin-layer-lint | LayerLintCard | `ll-` |
| rayo-design-system | RayoDSCard (+ ColourVariables `cv-`, CollectionCard `cc-`) | `ba-` |
| rayo-schedule | ScheduleCard | `cs-` shared |
| figma-plugin-rayo-thumbnails | PluginCard | `cs-` shared |
| simplestream-design-system | SimplestreamDSCard | `ss-` |

Shared case-study body styles (`cs-*`): partials 04–08. Global responsive and reduced-motion rules: 12, 13. Tokens: `src/styles/tokens.css`.
Small bento cards (Gmail, LinkedIn, Strava, quotes, Duolingo): partial 10.

## Content has one source
Case study prose lives **only in the card**. The no-JS/SEO fallback in each generated page is server-rendered from the card (`scripts/lib/render-card.mjs`). Metadata (title, description, dates) is in `scripts/case-studies.config.js`.
- To change a case study, use the `edit-case-study` skill.
- Interactive demos are `aria-hidden`. If one holds facts a reader needs, add an `sr-only` summary built from the same data (see `AgenticDSCard`). Pure-UI widgets take `'data-fallback': 'skip'`.

## Commands
- Check a card renders, as plain text: `node scripts/render-card.mjs AlexaCard --text`
- Regenerate pages: `BUILD_VERSION=$(grep -o 'main.js?v=[a-z0-9]*' index.html | cut -d= -f2) node scripts/build-case-study-pages.js` (keeps the diff to real changes)
- Deploy build (stamps a new version everywhere): `npm run build`
- Storybook: `npm run storybook`

## Gotchas
- Before deleting a component, `grep -rn "<Name>" src/`. A dead `import` in `App.js` blanks the whole site.
- A card's `cardKey` must match `CARD_ENTRIES` in `src/App.js` and the config entry.
- Cards start timers in `setup()`, so the render scripts call `process.exit()` when they finish.
