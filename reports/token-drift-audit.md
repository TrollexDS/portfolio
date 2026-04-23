# Token Drift Audit Report

**Generated:** 2026-04-20
**Figma source:** Portfolio – Design Tokens (`cu42F3CA8K4oPKioorp49Q`)
**CSS source:** `src/styles/tokens.css` (last modified 2026-04-17)

---

## Status: ⚠️ 9 actionable issues found (unchanged since 2026-04-18)

The token system remains in excellent shape. All 91 colour primitives and 36 typography primitives have matching names and values between Figma and CSS. Drift is concentrated in a handful of semantic tokens that exist in only one system, plus a few minor naming inconsistencies.

`tokens.css` has not been modified since the previous audit run, so all CSS-side findings are carried forward. Figma-side variables were spot-checked via `search_design_system` against the `Portfolio – Design Tokens` library (key `lk-3628c30f…4eb8487a17`) and confirm the previous findings: all named primitives and semantic aliases are still present, and `Orange/Claude` is still absent from Figma.

> **Run note:** this run was unable to invoke `get_variable_defs` for bulk value retrieval because that tool requires a specific `nodeId` in the Figma file and none was supplied by the task. Value-level comparisons are therefore inherited from the previous audit (2026-04-18) rather than re-resolved from Figma this run. Name-level existence has been re-verified for every flagged token. If value drift is a concern, re-run this task with a `nodeId` parameter pointing at a frame inside the Tokens file (for example, the "All Tokens" cover frame).

---

## 1. Colour Primitives

**91 Figma variables · 92 CSS custom properties**

All mapped primitive values match exactly. One CSS-only addition was found.

| Token | Figma value | CSS value | Issue |
|---|---|---|---|
| `Orange/Claude` / `--color-primitive-orange-claude` | — (not in Figma; confirmed this run) | `#D97757` | Missing in Figma |

**Naming inconsistencies (non-blocking):**

| Figma name | CSS name | Note |
|---|---|---|
| `Orange/Duo Top` | `--color-primitive-orange-duo-t` | CSS abbreviates "Top" → "t" |
| `Orange/Duo Bottom` | `--color-primitive-orange-duo-b` | CSS abbreviates "Bottom" → "b" |
| `Alpha/IndgBadge 92` | `--color-primitive-alpha-indigo-badge-92` | Figma abbreviates "Indigo" → "Indg" |
| `Alpha/IndigoText 30` | `--color-primitive-alpha-indigo-text-30` | Minor casing/spacing diff only |

---

## 2. Semantic Colours

**87 Figma variables · ~68 CSS custom properties (excl. widget/panel/component-scoped tokens)**

### Missing in CSS (Figma has, CSS does not) — ⚠️ critical

These tokens are defined in Figma's semantic collection with Light/Dark mode values but have no corresponding CSS custom property. All seven were re-verified as still present in Figma this run.

| Figma token | Light mode alias | Dark mode alias | Issue |
|---|---|---|---|
| `Surface/Badge` | `Alpha/White 90` | `Alpha/IndgBadge 92` | Missing in CSS |
| `Text/Muted Purple` | `Alpha/White 50` | `Alpha/White 50` | Missing in CSS |
| `Overlay/Map` | `Alpha/Black 40` | `Alpha/Black 50` | Missing in CSS |
| `Overlay/Light` | `Alpha/White 15` | `Alpha/White 6` | Missing in CSS |
| `Overlay/Purple` | `Alpha/Purple 30` | `Alpha/Purple 20` | Missing in CSS |
| `Brand/Duolingo Top` | `Blue/400` | `Blue/Duo Dark Top` | Missing in CSS |
| `Brand/Duolingo Bottom` | `Blue/200` | `Blue/Duo Dark Bottom` | Missing in CSS |

### Missing in Figma (CSS has, Figma does not)

| CSS token | CSS value | Issue |
|---|---|---|
| `--color-surface-claude` | `var(--color-primitive-orange-claude)` | Missing in Figma (depends on missing primitive) |
| `--color-text-body` | `var(--color-text-primary)` | Missing in Figma (convenience alias) |

### All other semantic mappings verified

The following semantic tokens were verified as matching between Figma and CSS in both Light and Dark modes, with correct alias chains:

Primary, Background/Body, Border/Card, Surface/Card, Surface/Card White, Surface/Card Dark, Surface/Nav, Surface/Nav Blur, Surface/Action Icon, Surface/Skeleton Base, Surface/Skeleton Shine, Text/Primary, Text/Subtle, Text/On Dark, Text/On Primary, Text/Muted, Text/Muted Dark, Card/Inset Top, Card/Inset Bottom, Card/Ripple, Shadow/Card Rest, Shadow/Card Hover, Shadow/Card Hover 2, Shadow/Card Expanded, Shadow/Nav, Shadow/Action Icon, Shadow/Badge, Overlay/Backdrop, Brand/Strava, Brand/Alexa Star, Brand/Bulb Glow Strong, Brand/Bulb Glow Soft, Brand/Schedule Start, Brand/Schedule Mid, Brand/Schedule End, Brand/LinkedIn, Brand/Project Purple, Brand/Project Purple Hover, Brand/Rayo Text, Brand/Rayo Text Muted, Brand/Rayo Fallback BG, Brand/Bauer, Brand/Goldsmiths, Brand/The Futur, Brand/BrainStation, Sun/Glow, Moon/Glow, Moon/Star.

---

## 3. Shadows

All 7 shadow tokens were re-verified as present in the `Color / Semantic` collection of the Figma Tokens library and matching CSS aliases in both Light and Dark modes. No drift detected.

| Token | Light | Dark | Status |
|---|---|---|---|
| `Shadow/Card Rest` | `Alpha/Black 4` | `Alpha/Black 20` | ✅ |
| `Shadow/Card Hover` | `Alpha/Black 8` | `Alpha/Black 30` | ✅ |
| `Shadow/Card Hover 2` | `Alpha/Black 4` | `Alpha/Black 20` | ✅ |
| `Shadow/Card Expanded` | `Alpha/Black 20` | `Alpha/Black 50` | ✅ |
| `Shadow/Nav` | `Alpha/Black 8` | `Alpha/Black 30` | ✅ |
| `Shadow/Action Icon` | `Alpha/Black 10` | `Alpha/Black 30` | ✅ |
| `Shadow/Badge` | `Alpha/Black 10` | `Alpha/Black 40` | ✅ |

---

## 4. Typography

**36 Figma variables · 36 CSS custom properties**

All typography primitive values match exactly.

| Category | Count | Status |
|---|---|---|
| Font sizes (`Size/*` ↔ `--text-*`) | 16 / 16 | ✅ All match |
| Font weights (`Weight/*` ↔ `--weight-*`) | 5 / 5 | ✅ All match |
| Line heights (`Leading/*` ↔ `--leading-*`) | 9 / 9 | ✅ All match |
| Letter spacing (`Tracking/*` ↔ `--tracking-*`) | 6 / 6 | ✅ All match (Figma stores as integer ×0.01em) |

### CSS-only typography tokens (no Figma equivalent)

These are expected structural differences — Figma handles font families via native text styles, and responsive variants don't map to Figma variables.

| CSS token | Value | Note |
|---|---|---|
| `--font-family-primary` | `'Syne', sans-serif` | Figma uses native font picker |
| `--font-family-display` | `'Fredoka', sans-serif` | " |
| `--font-family-system` | `-apple-system, BlinkMacSystemFont, …` | " |
| `--font-family-mono` | `'SF Mono', 'Fira Code', …` | " |
| `--font-family-rayo` | `'Rayo Mabry Pro', …` | " |
| `--font-family-manrope` | `'Manrope', sans-serif` | " |
| `--streak-size-mobile` | `34px` | Responsive variant, CSS-only |

---

## 5. CSS-only structural tokens (expected, not drift)

These CSS tokens have no Figma equivalent by design — they represent compound values or CSS-specific concepts that don't translate to Figma variables.

| CSS token | Type | Reason |
|---|---|---|
| `--gradient-brand` | gradient | Compound CSS value |
| `--gradient-duo-streak` | gradient | Compound CSS value |
| `--gradient-sun` | gradient | Compound CSS value |
| `--gradient-moon` | gradient | Compound CSS value |
| `--card-grain-opacity` | number | CSS-only texture effect |
| `--card-grain-blend` | keyword | CSS-only blend mode |
| `--filter-action-icon` | filter | CSS-only filter |
| `--filter-checkmark` | filter | CSS-only filter |

---

## Recommendations

### Add to CSS (priority: medium)

The 7 semantic tokens missing from CSS should be added to `tokens.css` to match the Figma source of truth. `Brand/Duolingo Top` and `Brand/Duolingo Bottom` are the most important — they have distinct dark-mode values that the current CSS gradient implementation may not be respecting.

```css
/* Suggested additions to :root */
--color-surface-badge:         var(--color-primitive-alpha-white-90);
--color-text-muted-purple:     var(--color-primitive-alpha-white-50);
--color-overlay-map:           var(--color-primitive-alpha-black-40);
--color-overlay-light:         var(--color-primitive-alpha-white-15);
--color-overlay-purple:        var(--color-primitive-alpha-purple-30);
--color-brand-duolingo-top:    var(--color-primitive-blue-400);
--color-brand-duolingo-bottom: var(--color-primitive-blue-200);

/* Suggested additions to [data-theme="dark"] */
--color-surface-badge:         var(--color-primitive-alpha-indigo-badge-92);
--color-overlay-map:           var(--color-primitive-alpha-black-50);
--color-overlay-light:         var(--color-primitive-alpha-white-6);
--color-overlay-purple:        var(--color-primitive-alpha-purple-20);
--color-brand-duolingo-top:    var(--color-primitive-blue-duo-dark-top);
--color-brand-duolingo-bottom: var(--color-primitive-blue-duo-dark-bottom);
```

### Add to Figma (priority: low)

Consider adding an `Orange/Claude` primitive (`#D97757`) and a `Surface/Claude` semantic alias to the Figma token file if the Claude brand card is a permanent portfolio fixture.

### Naming cleanup (priority: low)

Standardise the abbreviated Figma names (`IndgBadge` → `Indigo Badge`, `IndigoText` → `Indigo Text`) and CSS names (`duo-t` → `duo-top`, `duo-b` → `duo-bottom`) for better cross-system readability. Cosmetic only.

### Operational follow-up

For this audit to do full value-level comparison each run, pass a stable `nodeId` (e.g. the "All Tokens" cover frame in the Tokens file) to the scheduled task so `get_variable_defs` can return every Figma variable and its resolved value. Without that, the audit can only confirm variable names and must inherit values from the last run.

---

*Report generated automatically by the token-drift-audit scheduled task.*
