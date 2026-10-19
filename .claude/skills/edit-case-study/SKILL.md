---
name: edit-case-study
description: "Change the content of a portfolio case study: rewrite or add sections, fix copy, add images, stats or captions, update dates. Use whenever the user wants to edit, tighten, restructure or add to a case study on mchiu.co.uk (Alexa, Design Lab, Agentic DS, Layer Lint, Rayo DS, Schedule, Plugin, Simplestream)."
---

# Edit a case study

Prose lives only in the card (`src/components/cards/<Card>.js`). The SEO fallback is generated from it, so never hand-write HTML anywhere else.

## Steps
1. **Find the card.** Use the map in `CLAUDE.md`. Outline it without reading it all:
   `grep -n "cs-section-title\|cs-subsection-title" src/components/cards/<Card>.js`
   Then read only the line range you're changing.
2. **Edit the card.** Vue `h()` calls. Wrap detail that should hide in TL;DR mode in `full(...)`. Reuse the existing classes: `cs-section-title` (h2), `cs-subsection-title` (h3), `cs-body-text`, `cs-body-list`, `cs-stat-row`/`cs-stat-item`/`cs-stat-num`/`cs-stat-lbl`, `cs-cover-img` (+`--full`), `cs-hint` (caption), `cs-chart-figure` (light SVG chart panel). New styles go in the card's partial (`grep -ln "\.<prefix>-" src/styles/partials/*.css`).
3. **Update metadata** in `scripts/case-studies.config.js`: always `dateModified`. Update `summary`/`description` only if the framing changed.
4. **Proofread the render:** `node scripts/render-card.mjs <Card> --text`. Check for dropped text, and that a new interactive demo's facts still appear. If they don't, add an `sr-only` summary built from the demo's data.
5. **Regenerate pages:**
   `BUILD_VERSION=$(grep -o 'main.js?v=[a-z0-9]*' index.html | cut -d= -f2) node scripts/build-case-study-pages.js`
   `git diff --stat` should show only the card, the config and that one page.
6. **Visual check** only if layout or CSS changed. Otherwise step 4 is enough.

## Writing rules
- Use a spaced hyphen ( - ), never an em dash. To reduce dash density, recast to a colon, comma or full stop. Never swap the character.
- Alex is a Senior Product Designer *on* Rayo, not its design lead. Write "I design for / contribute to Rayo". Ownership claims only for things he owns (the plugins, research he led, his design-system work).
- Repo docs, comments and data describe intent, not what happened. Don't turn them into claims about process, adoption or outcomes without asking Alex. Be especially wary of past-tense justifications in code ("rejected", "built so that").
- Prefer phrasing that won't go stale over counts that will.
- A consistent pattern across a file is probably deliberate. Ask before "fixing" it.
- Case-study structure and voice: `case-study-structure.md` (read the section you need, not the whole file).
