---
name: ds-audit
description: "Run a design system health audit on the portfolio codebase. Use this skill when the user asks to audit the design system, check for hardcoded values, find unused tokens, check naming consistency, find missing Storybook coverage, or says things like 'audit my tokens', 'check design system health', 'find hardcoded colours', 'what's missing from Storybook'. Also use when the user wants a quality report on their design system."
---

# Design System Audit

You are a design system auditor. Scan the portfolio codebase and produce a health report covering token usage, naming consistency, Storybook coverage, and code quality.

## What to audit

### 1. Hardcoded values

Search all `.js` and `.css` files in `src/` for hardcoded colour values that should be using design tokens instead. Look for:

- Hex codes: `#fff`, `#2c2c2c`, `#f0ede8`, etc.
- RGB/RGBA: `rgb(...)`, `rgba(...)`
- HSL values

**Exclude from flagging:**
- Values inside `tokens.css` (that's where primitives are defined)
- Values inside `storybook/*.css` and `*.stories.js` files used as CSS variable fallbacks (e.g., `var(--color-bg-body, #f0ede8)` — the fallback is fine)
- Values in SVG data URLs
- Values in comments
- Third-party / vendor files in `node_modules/`

**Flag as issues:**
- Hardcoded colours in component `.js` files that aren't using `var(--token-name)`
- Hardcoded colours in `main.css` that should reference a token
- Inline styles in components with colour values instead of token references

For each hardcoded value found, suggest which existing token it should map to (by comparing the value against primitives in `tokens.css`).

### 2. Unused tokens

Cross-reference tokens defined in `tokens.css` against their usage in `main.css` and component files:

- Parse all `--color-*`, `--font-*`, `--text-*`, `--weight-*`, `--tracking-*`, `--leading-*` custom properties from `:root` in `tokens.css`
- Search for each token name across all `.css` and `.js` files in `src/` (excluding `tokens.css` itself)
- Any token with zero references outside its definition is flagged as potentially unused

Note: some tokens may only be used in dark mode overrides (`[data-theme="dark"]`) — these are not unused, they're theme variants. Check both the property name and its dark mode counterpart.

### 3. Naming consistency

Check that token names follow the established convention:
- Primitives: `--color-primitive-{hue}-{scale}` or `--color-primitive-alpha-{color}-{opacity}`
- Semantic: `--color-{role}` where role is `primary`, `surface-*`, `text-*`, `border-*`, `shadow-*`
- Typography: `--font-family-*`, `--text-{size}`, `--weight-{name}`, `--tracking-{name}`, `--leading-{name}`

Flag any tokens that don't follow the pattern or use inconsistent naming (e.g., mixed kebab-case and camelCase, inconsistent depth).

### 4. Storybook coverage

List all component files in `src/components/` and `src/components/cards/`. For each, check whether a corresponding `.stories.js` file exists in `src/storybook/`. Report:
- Components WITH stories (covered)
- Components WITHOUT stories (missing)
- Coverage percentage

### 5. Token completeness

Check if all semantic token categories have both light and dark mode definitions:
- For each semantic token in `:root`, verify it also appears in `[data-theme="dark"]`
- Flag any tokens that exist in only one theme

## Output format

Generate a Markdown report saved to `reports/ds-audit.md` with this structure:

```markdown
# Design System Health Report
_Generated: {date}_

## Summary
- Overall health: {score}/100
- Hardcoded values: {count} found
- Unused tokens: {count} found
- Naming issues: {count} found
- Storybook coverage: {covered}/{total} components ({percentage}%)
- Theme completeness: {complete}/{total} tokens

## Hardcoded Values
| File | Line | Value | Suggested Token |
|------|------|-------|-----------------|

## Unused Tokens
| Token | Defined In | Notes |
|-------|-----------|-------|

## Naming Issues
| Token | Issue | Suggestion |
|-------|-------|-----------|

## Storybook Coverage
### Covered
- ComponentName ✅

### Missing
- ComponentName ❌

## Theme Completeness
| Token | Light | Dark | Status |
|-------|-------|------|--------|

## Recommendations
1. Priority fixes...
2. Nice-to-haves...
```

## Scoring

Calculate the health score out of 100:
- Start at 100
- Subtract 2 points per hardcoded colour value (max -30)
- Subtract 3 points per unused token (max -15)
- Subtract 2 points per naming inconsistency (max -10)
- Subtract points for Storybook coverage: `(1 - coverage%) * 30` (max -30)
- Subtract 1 point per token missing a theme variant (max -15)

## Constraints

- Do NOT modify any source files — this is a read-only audit
- Save the report to `reports/ds-audit.md`
- Be specific in recommendations — name the file, line, and exact change needed
- When suggesting token replacements for hardcoded values, verify the token actually exists in `tokens.css`
