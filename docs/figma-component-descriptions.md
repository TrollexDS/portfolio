# Figma Component Descriptions

Paste each description into the corresponding component's description field in the **Design System** file (`z8dToxFCYzuNWAEZ3BIIqH`).

In Figma: select the main component → right panel → under the component name → "Add description."

---

## Foundation

### Icon
**Component name:** `Icon`
**Variants:** Type — Expand, External Link, Copy, Shrink, Full Screen, Arrow Up, Arrow Right, Search, Quote, duolingo-fire

> 24×24 SVG icon set. Used inside Action Icon buttons, card action slots, and case study navigation. Each variant maps to a single interaction verb. In code, icons are imported from `src/assets/icons/icons.js` and rendered as inline `<img>` elements. Colour is controlled by the parent's CSS `filter` property — in dark mode, `--filter-action-icon: brightness(0) invert(1)` flips icons to white.

---

### Action Icon
**Component name:** `Action Icon`

> 40×40 circular icon button used in the top-right corner of BentoCard. Wraps a single Icon variant inside a `--color-surface-action-icon` background with `--color-shadow-action-icon` elevation. Click opens the card's `href` in a new tab. In code, the `actionIconSrc` prop on BentoCard controls which icon appears. Dark mode inverts the icon via `--filter-action-icon`.

---

### main-logo

> Site wordmark rendered in `--font-family-primary` (Syne). Appears in the NavBar on desktop viewports. Not interactive — purely decorative branding.

---

### Company Logo
**Variants:** Property 1 — gmail, linkedin

> 88×88 brand logos used as visual anchors inside GmailCard and LinkedInCard. Each variant contains an animated SVG that replays on hover (mouseenter increments the Vue key, forcing a re-render). Gmail uses staggered path-drawing animations; LinkedIn uses stroke-drawing with custom `--len`, `--draw-dur`, `--draw-delay` CSS variables.

---

### app-icon
**Variants:** Property 1 — Duolingo, Strava

> 48×48 app icons used as corner badges on DuolingoCard and StravaCard. Presentational only — no interaction. Placed absolutely in the card's top-left corner.

---

## Navigation

### Nav Pill
**Variants:** State — Default, Active, Hover

> Individual navigation filter button inside NavBar. Text uses `--nav-pill-size` (16px) at `--nav-pill-weight` (500) in `--font-family-primary` (Syne). Active state is visually indicated by the liquid-glass indicator behind it, not by the pill itself. Hover state shows a ghost pill at reduced opacity. In code, clicking a pill emits a `filterChange` event that triggers the bento grid FLIP re-layout.

---

### NavBar

> Sticky top navigation bar containing the site logo and Nav Pill filter buttons (All, About, Work, Side Quests). Uses `--color-surface-nav` background with `--color-surface-nav-blur` backdrop-filter. Includes a liquid-glass animated indicator that stretches (scaleX + scaleY) between pills on selection. Hides on scroll down on desktop (80px threshold), always visible on mobile. Fixed to bottom on mobile viewports (<768px). Shadow uses `--color-shadow-nav`.

---

## Cards — Simple

### BentoCard
**Variants:** State — Rest, Hover, Pressed

> Base card wrapper used by all bento grid items. Provides `--color-surface-card` background, `--color-border-card` border, `--color-shadow-card-*` elevation (rest/hover), grain texture overlay at `--card-grain-opacity`, and inset glow (`--color-card-inset-top`, `--color-card-inset-bottom`). Click spawns a ripple at `--color-card-ripple`. Accepts `dark` boolean prop for dark surface variant using `--color-surface-card-dark`. The `href` prop adds an Action Icon to the top-right corner. All tokens swap automatically in dark mode via `[data-theme="dark"]`.

---

### QuoteCard

> Single-span card displaying a design principle as styled text segments. Uses `--quote-size` (20px) / `--quote-weight` (500) / `--quote-leading` (1.55). Bold segments render with `--gradient-brand` as a background-clip text fill. No interaction — static content card. In code, the `segments` array prop controls which words appear bold/gradient vs plain.

---

### IconCard

> Centred icon display card wrapping BentoCard. Shows a single image at a configurable `size` (default 88px) with optional CSS `rotate` transform. Used for tool logos and decorative icons in the bento grid. Passes `href`, `actionIconSrc`, and `tooltip` through to BentoCard.

---

## Cards — Data

### DuolingoCard

> Dark-variant BentoCard showing a live Duolingo streak counter. The streak number uses `--font-family-display` (Fredoka) at `--streak-size` (48px) / `--streak-weight` (600), animated from 0 with an easeOutQuint curve over 1800ms. Fetches the real streak count from an API on mount; falls back to the `streak` prop (default 820). Hero shows a WebM video with alpha (PNG fallback on unsupported browsers). Fire icon uses the duolingo-fire Icon variant.

---

### StravaCard

> BentoCard displaying a recent Strava run on a Leaflet map. Route polyline renders in `--color-brand-strava` (#fc4c02). Stats overlay shows distance and elevation in `--font-family-system`. Map is non-interactive (no drag, zoom, or scroll). Fetches `strava-activity.json` on mount; shows a skeleton loader during fetch and an error state on failure. In code, uses Google polyline decoding and Leaflet CDN lazy-loading.

---

### ProjectCard

> Dark-variant BentoCard for case study project entries. Features a background image (`imgSrc` prop), infinite-scrolling logo marquee at the bottom, and an Action Icon linking to the full case study. The marquee duplicates its content with `aria-hidden` for seamless looping. Used for Rayo, Simplestream, and other project showcases.

---

### ClawInvestCard

> Dark-variant BentoCard promoting the OpenClaw AI market brief Telegram bot. Minimal content: background gradient image and a Telegram badge. Click opens the Telegram channel link. No complex interactions or data fetching.

---

## Cards — Interactive

### BulbCard
**Variants:** Mode — Light, Dark

> Theme toggle card. Click switches between light and dark mode by setting `data-theme="dark"` on the document root. Sun icon (light mode) and moon icon (dark mode) swap with rotation + fade transitions. 12 animated rays radiate outward with trigonometric stagger delays. Lottie animation plays forward for dark, reverse for light. Background uses `--color-surface-card` in light, swaps via theme tokens in dark. Tooltip reads "Light mode" / "Dark mode" based on current state.

---

### GmailCard
**Variants:** State — Default, Copied

> Email contact card. Default state shows animated Gmail SVG logo (path-drawing animation replays on hover). Click copies `alex@mchiu.co.uk` to clipboard via the Clipboard API, transitioning to Copied state: icon swaps to a Lottie checkmark (trim-path drawing, 30fps, 45 frames), label shows "Copied" for 2 seconds, then reverts. Spawns a ripple on copy action.

---

### LinkedInCard

> LinkedIn connect card. Shows an animated SVG "in" lettermark with stroke-drawing animation that replays on hover (mouseenter). Click opens LinkedIn profile in a new tab. Animation timing controlled by CSS custom properties (`--len`, `--draw-dur`, `--draw-delay`).

---

### AboutCard
**Variants:** State — Collapsed, Expanded

> Primary bio card. Collapsed state shows avatar, name, title, and brand links (Bauer, Goldsmiths, Futur, BrainStation — each styled with its `--color-brand-*` token). Click triggers a FLIP animation (700ms, cubic-bezier ease) expanding the card to a fullscreen overlay with scrollable bio paragraphs. The avatar flies from its collapsed position to the expanded header. Expanded text uses `--about-expanded-size` (18px) / `--about-expanded-leading` (1.6). Name renders with `--gradient-brand` text fill. Escape key or backdrop click closes with a reverse fly animation. Body scroll is locked while expanded.

---

### CaseStudyCard
**Variants:** State — Default, Hover

> Expandable case study card built on CaseStudyOverlay. Default state shows a preview thumbnail; Hover state elevates the card. Click expands to a fullscreen overlay with video/image hero (FLIP fly animation), scrollable case study body, TldrToggle for Detailed / TL;DR reading modes, and a back-to-top button. Escape or backdrop click closes. In code, each case study (AlexaCard, ScheduleCard) implements this pattern with different content — the Figma component represents the shared structural spec, not a single project.

---

## Cards — Case Study Widgets

### ColourVariables

> Interactive Figma-style design token browser. Two tabs: Primitives (raw values with hex swatches) and Tokens (semantic aliases with light/dark columns showing token relationships via alias pills). Left sidebar filters by token group. Search field matches token names and values. Renders inside a case study overlay at a fixed widget aspect ratio. Data structure mirrors the actual `tokens.css` three-layer architecture.

---

### CollectionCard

> Interactive Figma-style component property demo. Control panel with dropdowns for: device size (small/medium), gradient background (aqua/yellow/orange/red/primary), card position (75%/85%/100%), and image (Default/Fallback). Canvas scales responsively via `useResponsiveScale` composable. Demonstrates how component variants are configured in the design system. Resets dependent properties when parent selections change.

---

### BeforeAfterToggle

> Side-by-side or toggle comparison widget showing before/after states of a design change. Used inside case study overlays to demonstrate iteration and design decisions.

---

## Utilities

### CursorTooltip

> Global cursor-following tooltip with typewriter text effect. Attaches to any element with a `data-tooltip` attribute. Text types in at 18ms per character. Position smoothed with lerp (0.18 factor) via requestAnimationFrame. Clamped to viewport edges with 8px margin. Automatically disabled on touch devices, mobile viewports, and when `prefers-reduced-motion` is set.

---

### InteractiveTag

> Small pill badge labelled "Interactive" with optional hint text. Used as a visual cue on case study sections that have hover/click interactions. Presentational only — no click handler. Hint text uses `--color-text-primary`.

---

### BackToTop

> Floating scroll-to-top button that appears after one viewport-height of scrolling. Click triggers a smooth 500ms ease-out-cubic scroll animation via requestAnimationFrame. Button hides during animation to prevent re-triggering. Used inside CaseStudyOverlay expanded views.

---

### TldrToggle

> Split-button pill toggle between "Detailed" and "TL;DR" reading modes. Emits `update:modelValue` for v-model binding. Active pill indicated by a sliding background using `calc()` positioning. Used in CaseStudyCard instances (AlexaCard, ScheduleCard) and other long-form case studies to let readers skip secondary content.

---

### CaseStudyOverlay

> Shared fullscreen overlay wrapper for expandable case study cards. Orchestrates: card-to-fullscreen FLIP fly animation (video or image hero), scroll-locked expanded view with inner scrolling, back-to-top button, backdrop-click and Escape-key dismiss. Props control hero content (`videoSrc`/`imageSrc`), hero size, and card styling. Three named slots: `default` (collapsed card content), `content` (expanded body), `heroOverlay` (layered on hero). Crossfade transition (250ms) between flying and static hero. Auto-plays all videos after 1s safety net for mobile.

---

### ReviewMarquee

> Infinite-scrolling horizontal carousel of user review cards. Used inside AlexaCard case study to display Alexa skill ratings and review excerpts. Two-copy duplication pattern with `aria-hidden` on the second set for accessibility. Scroll speed is CSS-animation driven.
