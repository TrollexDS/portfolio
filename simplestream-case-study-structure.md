# Simplestream Case Study — Narrative Structure

## Overview

This document outlines the story structure for your Simplestream case study, matching the tone and format of your existing portfolio pieces (conversational, first-person, evidence-based).

---

## Title

**Scaling a White-Label Design System for 50+ Clients**

---

## Intro (1–2 paragraphs)

Set the scene. Who is Simplestream, what do they do, and why does the design challenge matter?

> Simplestream is a B2B OTT service provider — we design and build streaming apps across mobile, tablet, web, and TV for clients around the world. As one of two designers, I was responsible for maintaining a white-label design system that powered 50+ client brands, each with their own look and feel across 100+ screens.

> The challenge wasn't just designing at scale — it was making it possible for a tiny team to move fast without breaking things.

---

## My role

Product Designer

---

## Impact (3–4 headline statements)

These sit at the top as scannable takeaways, each with a short explanation underneath (hidden in TL;DR mode, matching your existing pattern):

### ⚡ From Minutes to Seconds
Reduced brand-switching time from 5–10 minutes down to seconds by replacing a third-party plugin with Figma's native Swap Library feature — eliminating freezes, glitches, and manual error-checking entirely.

### 🛡️ Zero Glitches, Zero Manual Fixes
The old plugin frequently caused Figma to freeze or produce errors on large files, requiring time-consuming manual checks. The new approach is completely reliable — no crashes, no broken tokens, no cleanup.

### 🏗️ Restructured 50+ Design Files
Defined a new token naming structure and renamed every colour token, font style, and layer across the entire system to make it compatible with Figma's Swap Library feature.

### 👥 2-Person Team, 50+ Clients
Built a workflow that lets a team of two efficiently manage and deliver a large library of client designs — something that would typically require a much larger team.

---

## Cover Image

A hero visual here — ideally showing the design system in action, or a before/after of the swap working.

---

## Problem

This is where you tell the story of what wasn't working. Write it conversationally, like you're explaining it to another designer.

**Key beats to hit:**

1. **The context** — Simplestream serves 50+ clients, each needing unique branding applied to the same app framework. Every new client means duplicating templates and applying their colours, fonts, and assets across 100+ screens.

2. **The old workflow** — You relied on a third-party Figma plugin that saved colours, fonts, and images as reusable themes. In theory, you could select your designs and swap in a client's saved assets.

3. **The pain** — With 100+ screens per project, the plugin took 5–10 minutes to process. During that time, Figma would freeze or glitch. When it finally finished, there were almost always errors — broken tokens, missed swaps, visual inconsistencies — that required manual checking and fixing.

4. **The real cost** — This wasn't just an annoyance. For a two-person team juggling 50+ clients, every failed swap meant lost time you couldn't afford. It also made onboarding new clients slower than it needed to be, and it eroded confidence in the design system itself.

**Suggested tone:** Something like:

> "On paper, the plugin solved the right problem. But in practice, every time we ran it on a full project, we'd hold our breath. Five minutes of Figma freezing. Then the inevitable scroll through 100+ screens to spot what broke."

---

## Turning Point

This is the "aha moment" — keep it brief but clear. Figma released the native Swap Library feature, and you recognised it could solve the problem properly.

**Key beats:**

1. **The opportunity** — Figma introduced the Swap Library feature, which allows you to swap an entire linked library for another in one action — natively, without plugins.

2. **The catch** — It wasn't a drop-in fix. For Swap Library to work, every token and layer in the system needed to follow a specific naming structure. The existing system wasn't set up for this.

3. **The decision** — Rather than patching the old workflow, you committed to restructuring the entire design system from the ground up.

**Suggested tone:**

> "When Figma released the Swap Library feature, I saw an opportunity to solve this properly — not with another workaround, but by rethinking how our system was structured."

---

## Solution / What I Did

This is the meat of the case study. Walk through the work you actually did, structured into clear sub-sections:

### Defining a New Token Structure

Explain the restructuring work. The colour token template contained a wide range of component-specific tokens — giving clients flexibility to customise the look and feel of their apps. But for Swap Library compatibility, every token needed to follow a consistent naming convention.

> "I defined a new naming structure and went through every token in the system — renaming each one so that libraries could be swapped cleanly. This wasn't just a find-and-replace job; it meant rethinking how our tokens were organised."

### Colour Tokens

Your colour system gives clients granular control over their app's appearance. Describe how you restructured these to be Swap Library-compatible while preserving that flexibility.

### Typography

Font styles are fixed in size and weight (for accessibility and readability), but clients choose a single typeface applied consistently across all apps. Explain how this maps to the library swap — the typeface changes, but the scale stays locked.

### The New Onboarding Workflow

Walk through what happens now when a new client comes on board: duplicate the template, set up their theme library, swap — done. Contrast this with the old workflow.

> "Every time we onboard a new client, we duplicate our templates and set up a custom theme. By swapping the design library, we can instantly apply the client's unique look and feel. What used to take minutes of anxious waiting and manual fixing now happens in seconds."

---

## Outcome / Result

Bring it home. Summarise the impact and what this enabled.

**Key beats:**

1. **Reliability** — Eliminated freezes, glitches, and the errors that came with the plugin. The swap just works, every time.

2. **Speed** — Brand switching went from 5–10 minutes (plus manual cleanup) to seconds. No more holding your breath.

3. **Scale** — A team of 2 designers can confidently manage 50+ client brands across 100+ screens each — a workload that would typically demand a much larger team.

4. **Confidence** — The design system became something the team could trust, not work around.

**Suggested closing tone:**

> "This wasn't a flashy redesign — it was the kind of foundational work that makes everything else possible. By investing the time to restructure our system properly, we gave ourselves the ability to scale without scaling the team."

---

## Visual Assets to Consider

To match the richness of your other case studies, think about including:

- **Before/after toggle** — Old plugin workflow vs. new Swap Library (you already have this pattern in RayoDSCard)
- **Token naming structure** — A visual showing the old vs. new naming convention
- **Speed comparison** — A simple visual or animation showing 5–10 min → seconds
- **Client grid / marquee** — Showing the variety of branded apps powered by the system (similar to your PluginCard marquee)
- **Swap in action** — A screen recording or video of the library swap happening instantly

---

## Narrative Arc Summary

```
Context     →  Small team, big responsibility (2 designers, 50+ clients)
Problem     →  Plugin-based theming was slow, fragile, and error-prone
Catalyst    →  Figma releases Swap Library
Action      →  Full restructure of tokens, layers, and naming conventions
Result      →  Seconds instead of minutes, zero errors, scalable confidence
```
