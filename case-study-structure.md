# Portfolio Case Study Structure Reference

This document captures the content structure, writing patterns, and conventions used across the case studies on mchiu.co.uk. Use it as a blueprint when writing new case study content.

---

## Technical Context

Case studies are Vue 3 components using `h()` render functions (no templates). Each is wrapped in `CaseStudyOverlay`, which provides the expand/collapse card animation, fullscreen overlay, TL;DR toggle, lazy-loading images, and scroll management.

All content is inline in `.js` files — there are no external markdown or JSON content files.

---

## Consistent Section Order

Every case study follows this sequence:

1. **TL;DR Toggle** — always first
2. **Title** (`h1`, class `cs-title`)
3. **Introduction paragraph(s)** — wrapped in `full()` (collapses in TL;DR mode)
4. **My role** — `h2` section title + single line of text
5. **Impact** — `h2` section title, then 3–4 subsections each with:
   - `h3` with an emoji prefix and a short punchy title
   - A paragraph explaining the impact (wrapped in `full()`)
6. **Cover image** — full-width image after the impact section
7. **Problem** — `h2` section, 1–2 paragraphs describing the situation before the work
8. **Solution / Process sections** — variable number of `h2` sections, each followed by images, videos, or interactive components
9. **Outcome / Result / What I took away** — closing `h2` section with 2–4 paragraphs, often using `<strong>` tags to emphasise key phrases

---

## Section-by-Section Patterns

### Title
- Written as a statement, not a question
- Focuses on the *what* or the *shift*, not a generic label
- Examples:
  - "Refactoring the Rayo Design System for Scalability & Consistency"
  - "Brand Switching in Seconds: Scaling a White-Label Design System"
  - "Streamlining the Design Process & Improving Efficiency at Scale"
  - "Bringing Design to a Team That Had Never Had a Designer"
  - "Challenging the Brief: From Station Pages to Schedule"
  - "I didn't use AI to build a design system. I built a design system that AI can use."

### Introduction
- 1–2 paragraphs max
- Sets the scene: what the product/team is, what Alex's position was, and the core challenge
- Written in first person ("I") or first-person plural ("we") when referring to team work
- Collapsible in TL;DR mode

### My Role
- Always a single short phrase, not a paragraph
- Examples: "Design system lead", "Product Designer", "Design and development", "Sole designer", "Product Design"
- For the Agentic DS, this was expanded to a short paragraph explaining the context (using portfolio as a proving ground for work practices)

### Impact
- Always 3 subsections (occasionally 4)
- Each subsection title starts with an emoji followed by a concise benefit statement
- Emoji choices are contextual to the benefit (not decorative): ⚡️ speed, 🧩 architecture, 🤝 collaboration, 🎨 theming, 🚀 adoption, ⌛️ time savings, 🛠️ reliability, 🏗️ restructuring, 🆕 freshness, 🌍 scale, 🎧 support, 🔀 process, 📊 scope, 📻 shipping, 💡 insight
- Description text is 1–2 sentences, specific and measurable where possible
- All description text is wrapped in `full()` for TL;DR collapse

### Problem
- 1–2 paragraphs
- Describes the pain points, constraints, or flawed status quo
- NOT collapsible — always visible (even in TL;DR mode) since it provides essential context
- Tone is factual, not dramatic. States what was broken and why it mattered.

### Solution / Process Sections
- These vary the most between case studies — this is where each story is unique
- Typical section titles: "Colour variables", "Spacing & Responsiveness", "Components refactor", "Turning Point", "Token Structure", "Continuous Iteration", "The Audit", "Building the evidence", "What users actually told us", "Changing direction"
- Each section is 1–2 paragraphs followed by a visual (image, video, or interactive component)
- Links to external references (Figma docs, features) use `cs-link` class and open in new tabs
- Paragraphs within solution sections are usually wrapped in `full()` for TL;DR

### Images
- Full-width images use class `cs-cover-img`, placed *outside* `cs-body` divs
- Images are followed by a `cs-hint` paragraph acting as a caption
- Caption text is short (under 10 words typically), descriptive not interpretive
- Examples: "Automated responsive and light and dark mode", "[BEFORE] On-demand card component", "Journey mapping on a Miro board", "Account linking flow: sign in, confirm, success"

### Videos
- Inline demo videos use class `cs-demo-video`
- Always autoplay, loop, muted, playsinline
- Sometimes followed by a `cs-hint` caption

### Interactive Components
- Used to make case studies more engaging (not decorative)
- Always paired with an `InteractiveTag` hint explaining the interaction
- Examples: `BeforeAfterToggle` (old/new comparison), `AntonymSection` (hover cards with screenshot), `VersionSection` (scroll-triggered timeline), `ReviewMarquee` (scrolling user reviews), `TokenLayerDemo` (expandable token tiers), `AgentWorkflowDemo` (tabbed workflow cards)

### Outcome / Closing
- Section title varies: "Outcome", "Result", "What we shipped", "What I took away", "What I learned", "What's next"
- 2–4 paragraphs
- Uses `<strong>` tags sparingly to emphasise key takeaway phrases (1 bold phrase per paragraph max)
- NOT collapsible in some case studies (the key conclusion stays visible)
- Tone is reflective — connects the work back to the broader lesson or team impact
- Never uses metrics that weren't mentioned earlier; outcome section reinforces, doesn't introduce new claims

---

## Writing Style

### Voice
- First person singular ("I") for individual work; first person plural ("we") for team efforts
- Past tense for completed work; present tense for describing the system as it exists now
- Professional but conversational — reads like a senior designer explaining their work to a peer, not a formal report

### Sentence Structure
- Paragraphs are 2–4 sentences
- Opens with the action or insight, not filler ("I designed..." / "The system..." / "What became clear...")
- Avoids starting consecutive paragraphs with the same word
- Dashes used frequently for asides and clarifications — em dashes, not parentheses

### Specificity
- Names specific tools (Figma, Voiceflow, Miro, Storybook, Chromatic)
- References specific numbers (48 variants reduced to 4, 50+ clients, 150+ radio brands, 468 tokens)
- Names actual features (Figma's Swap Library, Dev Mode, colour variables, auto layout)
- Describes real constraints (schedule data only goes 30 days back, team of 2 designers, 7 designers in UK team)

### What the writing avoids
- Buzzwords without substance ("leveraging synergies", "best-in-class")
- Passive voice where active is clearer
- Listing skills or technologies unless contextually relevant
- Hedging language ("I think", "maybe", "sort of")
- Excessive self-congratulation — lets the work speak

---

## Card Configuration (CaseStudyOverlay props)

Each case study passes these props to `CaseStudyOverlay`:

| Prop | Description |
|------|-------------|
| `cardClass` | Unique class for the card (e.g. `'ds-card'`, `'plugin-card'`) |
| `videoSrc` / `imageSrc` | Hero media on the collapsed card — either a looping video or a static image |
| `videoClass` / `imageClass` | Class for the hero media element |
| `tooltip` | Two-line tooltip text shown on hover (uses `\n` for line break, ends with an emoji) |
| `heroSize` | Always `448` |
| `heroWrapClass` | Optional — used when the hero needs a custom wrapper (e.g. Simplestream, Agentic DS) |

### Tooltip pattern
- Line 1: What the project does (verb phrase)
- Line 2: The benefit or domain + emoji
- Examples:
  - "Maximise efficiency and consistency\nby refactoring the Rayo Design System :art:"
  - "Streamline the design process\nwith a Figma plugin :arrows_counterclockwise:"
  - "Improve the voice UX of\nthe Rayo skill in Alexa :speaking_head:"

---

## CSS Class Conventions

| Class | Usage |
|-------|-------|
| `cs-body` | Text content wrapper (max-width constrained, padded) |
| `cs-body cs-body--continued` | Continuation body section (no top padding) |
| `cs-title` | Main h1 title |
| `cs-section-title` | h2 section heading |
| `cs-subsection-title` | h3 subsection heading (used in Impact) |
| `cs-body-text` | Standard paragraph text |
| `cs-body-list` | Bulleted list (rare — only used when listing distinct items) |
| `cs-cover-img` | Full-width image |
| `cs-cover-img--full` | Edge-to-edge variant |
| `cs-demo-video` | Inline demo video |
| `cs-hint` | Image/video caption |
| `cs-link` | Inline hyperlink |
| `cs-closing` | Final reflective sentence (used in Agentic DS) |
| `tldr-collapsible` | Wrapper for content that hides in TL;DR mode |

---

## Summary of All 6 Case Studies

| # | File | Title | Type | Hero |
|---|------|-------|------|------|
| 1 | `RayoDSCard.js` | Refactoring the Rayo Design System | Design System | Video |
| 2 | `SimplestreamDSCard.js` | Brand Switching in Seconds | Design System | Image + logo banner |
| 3 | `PluginCard.js` | Streamlining the Design Process | Tool (Figma Plugin) | Video |
| 4 | `AlexaCard.js` | Bringing Design to a Team That Had Never Had a Designer | Product Design (Voice UX) | Video |
| 5 | `ScheduleCard.js` | Challenging the Brief: From Station Pages to Schedule | Product Design (Research-led) | Video |
| 6 | `AgenticDSCard.js` | I didn't use AI to build a design system... | Design System + AI | Image + animated bg |
