---
name: generate-story
description: "Auto-generate a Storybook story from a Vue component file. Use this skill whenever the user asks to create a story, add a component to Storybook, generate story files, or says things like 'add this to Storybook', 'create a story for X', 'document this component'. Also trigger when the user mentions Storybook in the context of a component they're working on."
---

# Auto-Generate Storybook Story

You are a Storybook story generator for a Vue 3 portfolio project. Given a component file, you produce a complete `.stories.js` file that matches the project's conventions.

## Project conventions

This portfolio uses Vue 3 with `h()` render functions — not Single File Components. All stories must follow the same pattern:

```js
import { h } from 'vue'
import ComponentName from '../components/ComponentName.js'

export default {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/z8dToxFCYzuNWAEZ3BIIqH/Portfolio---Design-System?node-id=...',
    },
  },
}
```

### Key rules

1. **Import style**: Always `import { h } from 'vue'` and use `h()` render functions in stories
2. **CSS tokens**: Use CSS custom properties from `tokens.css` with fallback values: `var(--color-bg-body, #f0ede8)`
3. **Scoped CSS**: If the component needs styles from `main.css`, check if a scoped CSS file exists in `src/storybook/`. If not, create one extracting only the relevant rules — never import `main.css` directly (it pulls cursor:none, grid constraints, and page-level rules that break Storybook)
4. **Font references**: Use `'Syne', sans-serif` for UI labels in stories
5. **Static assets**: SVGs referenced as string paths (`src/assets/icons/...`) are served via `staticDirs` in `.storybook/main.mjs`. For story-only icons, use inline data URLs
6. **Story location**: All stories go in `src/storybook/`
7. **Figma link**: Include the design parameter if the Figma node ID is known. If not, omit and note it can be added later

## Steps

### 1. Read the component

Read the component file the user specifies. Identify:
- Component name (from `defineComponent({ name: '...' })`)
- Props (from `props: { ... }`)
- Emits
- Slots (look for `slots.default?.()` in the render function)
- CSS classes used (determines which styles are needed)
- Asset imports (SVGs, images)

### 2. Check for existing scoped CSS

Look in `src/storybook/` for existing `storybook-*.css` files. If the component uses classes not covered, either extend an existing file or create a new one by extracting rules from `src/styles/main.css`.

When extracting CSS:
- Include all visual styles for the component's classes
- Include hover, active, and variant states
- Exclude: `cursor: none`, grid layout rules, page-level styles
- Replace `cursor: none` with `cursor: pointer`
- Add CSS variable fallback values where possible

### 3. Determine story structure

Every component gets a **Default** story at minimum. Also consider:
- **Variant stories** for meaningful prop variations (dark mode, sizes, types)
- **States story** for components with hover/active/pressed — make these static with `pointerEvents: 'none'` and baked-in inline styles so each state is visually distinct and non-interactive
- **argTypes** for props useful to toggle in the Controls panel

### 4. Write the story

The standard render function pattern:

```js
export const Default = {
  render: () => ({
    components: { ComponentName },
    setup: () => () =>
      h('div', { style: { padding: '48px', background: 'var(--color-bg-body, #f0ede8)' } }, [
        h(ComponentName, { /* props */ }),
      ]),
  }),
}
```

### 5. Verify

After writing the story, tell the user to check Storybook. If new CSS was added, remind them to restart Storybook (`Ctrl+C` then `npx storybook dev -p 6006`).

## Category mapping

Assign the story to the correct Storybook sidebar category:
- **Foundation**: BentoCard, Icon, NavBar, ActionIcon
- **Cards/Simple**: QuoteCard, IconCard, BulbCard, GmailCard, LinkedInCard
- **Cards/Data**: StravaCard, DuolingoCard, ProjectCard, ClawInvestCard
- **Cards/Case Study**: AlexaCard, PluginCard, RayoDSCard, SimplestreamDSCard
- **Widgets**: ColourVariables, CollectionCard, ScheduleCard, TldrToggle, BeforeAfterToggle
- **Utilities**: CursorShape, CursorTooltip, InteractiveTag, BackToTop, ReviewMarquee
- **Design Tokens**: Colours, Typography

## Figma node IDs (known)

Use these when generating the design parameter:
- Icon: 4-33
- Action Icon: 5-27
- BentoCard: 5-45
- Nav Pill: 11-20
- NavBar: 12-15
- QuoteCard: 15-13
- IconCard: 16-13
- BulbCard: 18-35
- GmailCard: 19-29
- LinkedInCard: 20-13
- StravaCard: 22-13
- DuolingoCard: 23-13
- ProjectCard: 24-13
- ClawInvestCard: 25-13
- AboutCard: 26-30
- AlexaCard: 27-16
- PluginCard: 27-19
- RayoDSCard: 27-22
- SimplestreamDSCard: 27-25
- ColourVariables: 28-13
- CollectionCard: 28-19
- ScheduleCard: 28-23
- TldrToggle: 28-26
- BeforeAfterToggle: 28-31
- CaseStudyOverlay: 28-37
- CursorShape: 29-19
- CursorTooltip: 29-20
- InteractiveTag: 29-22
- BackToTop: 29-24
- ReviewMarquee: 29-26
