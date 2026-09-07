# AI Prototyping System — case study draft 2

_Rewritten after the second round of answers. Spine changed: the origin is now the Storybook problem,
and the story is a progression — mirror → contracts → prototypes → new design → the team.
Visuals lead with the system, not the product (downloads is unannounced until ~end of year)._

_Superseded draft kept as `DRAFT-v1-superseded.md`._

_Updated again after the repo moved: renamed to **Rayo Design Lab**, token count now 99/165,
gradient tokens added, and the site restructured into two portals with a route table. New section
added: "It stopped being a repo and became a place"._

---

## Title — see chat for the longer list

Placeholder until you pick. Current front-runner:

> **The tool was the easy part. Getting the team to design in it was the point.**

---

## Introduction

You cannot build a Storybook for iOS. Not practically — a SwiftUI component library has no browsable,
every-state, click-through reference that a designer can open in a tab and interrogate. So the Rayo
design system existed in two incomplete halves: Figma, which shows intent but not behaviour, and the
Swift source, which holds the behaviour but only renders inside an Xcode build.

I set out to fix exactly that and nothing more — mirror the iOS design system in React so every
component, every state, both themes, lives somewhere you can look at it. What I ended up with was a
place the design team designs.

---

## My role

Design and development. I built the system and its documentation with Claude Code, ran the sessions
that got the rest of the design team set up in it, and the team now owns the repo.

---

## Impact

### 📚 A design system you can finally look at

Eleven components in every state and both themes, 99 tokens in DTCG format generating 165 CSS
variables, and a 79-symbol icon set — all in a browser, all mirroring the iOS source. The Storybook
that iOS can't have.

### 📄 The documentation became the deliverable

Every component ships an `.md` beside its `.tsx` — not an API reference, a contract. **Use when /
Don't use when**, content rules, anti-patterns. And a test that can fail it: a fresh agent session,
no history, one prompt, then audit the output. Every failure is a documentation bug, not a model
failure.

### 💡 The states we'd have got to last

Working in it surfaced states before anyone reached them — the listener who taps download on cellular
with cellular downloads off and gets nothing, and the storage question a list of episodes can't
answer. Both changed the direction of an exploration rather than decorating it.

### 👥 Not a playground

The point was never a tool I use alone. The repo is written for designers rather than engineers,
pull requests are reviewed by another designer, and I ran the sessions that got the team set up in it.

---

## Cover image

`[IMAGE: the component gallery, light and dark]`
_Caption: Every component, every state, both themes_

---

## Problem

Rayo's design system lives in Swift, in the iOS app, in an engineering repo. That is the correct home
for it and it is also unreachable. There is no equivalent of Storybook for a SwiftUI library — nowhere
a designer can open every component, flip it through its variants and states, switch the theme and see
what the system actually does. Figma holds the intent; the Swift holds the behaviour; neither is
browsable, and the gap between them is where drift lives.

The same gap made prototyping expensive. Anything beyond a static mockup meant either booking
engineering time or faking the behaviour in Figma — which is fine for a happy path and useless for the
states that actually break: loading, empty, error, locked, offline. Those are the ones worth
prototyping and the ones nobody prototypes.

---

## Mirroring the system

I extracted the system from the iOS codebase with Claude Code — every colour from the asset catalogue,
every spacing and radius constant, every type size and weight, and each component's variants, states
and animation timings from its Swift file. That produced tokens in DTCG format, CSS custom
properties, eleven components and 79 generated icons — 99 tokens and 165 variables as it stands.

The interesting part was the layer that had to be invented. Rayo names colours by ramp position with
the light and dark pair baked into the name — `Neutral750>150` is position 750 in light, 150 in dark.
Clear, symmetrical, and it encodes *position*, not *role*. Nothing reading `Neutral750>150` can tell
it's a border. So I derived a semantic layer — `text-primary`, `bg-canvas`, `border-default` — from how
components actually consume the primitives, and had the design team sign it off. Components now
reference roles; roles reference the ramp.

`[IMAGE: primitives → semantic diagram, or the DTCG token file]`
_Caption: Position-named primitives, role-named semantics_

---

## The `.md` is the component

A mirror is only worth having if it can be trusted, and the thing that makes a component trustworthy
isn't its props. It's knowing when it's the wrong choice.

So each component ships a contract beside it. `Button.md` doesn't just list six variants — it says the
pressed state drops to 0.1 opacity, that this is unusually aggressive, and that it's the intended Rayo
feel so don't "fix" it. It says not to add a `disabled` boolean, because iOS models disabled as a
*style* and duplicating it as a prop lets the two disagree. `CheckmarkRow.md` says the component can
only ever express "included", never "not included", so it must not be used for tier comparison — that's
a different, unbuilt component. `EmptyState.md` says using it on a failed request tells the user their
library is empty when the network is down.

None of that is derivable from the code, and none of it was written down anywhere. It lived in
designers' heads and in review comments. The template makes **Use when / Don't use when** and
**Anti-patterns** mandatory, because they carry everything the source can't say — and they're what
lets someone who didn't build the component, human or otherwise, use it correctly.

`[IMAGE: a component .md open beside its .tsx]`
_Caption: The API, and the part the API can't tell you_

---

## The cold-start test

Documentation nobody can fail is documentation nobody maintains. So the system has a test.

Open a fresh agent session in the repo — no history, no hints — and give it one prompt: *build the
episode list screen for a locked show*. Then audit what comes back. Right components? Tokens
throughout? Locked state handled the way the pattern doc describes? Both themes?

The rule that makes it useful is how you read the result: **every failure is a documentation bug, not a
model failure.** Don't rewrite the prompt and don't add context in the chat — find the rule that was
missing, put it in the relevant `.md`, run it again. A wrong output stops being a complaint about AI and
becomes a reproducible bug with a location. That loop is the actual maintenance work of the repo.

`[IMAGE or VIDEO: one prompt in, a screen out]`
_Caption: Fresh session, no conversation history_

---

## What the mirroring surfaced

Mirroring Swift honestly means reading it closely, and reading it closely turned up things that had
gone unnoticed. The audit file records them, separated into what was read straight from the code, what
was inferred and needed sign-off, and what looked wrong in the source.

That third list is the one with teeth. `Neutral750>150` is identical in light and dark — the only token
in the ramp that doesn't invert, so anything using it goes muddy in dark mode. Two colour tokens are
byte-identical duplicates of others under pre-convention names. Two components each build their own
capsule button rather than using the shared one, and one of those hardcodes a white background and a
black label, so it ignores dark mode entirely. The checkbox's tap target is 25×25 with no expanded hit
area, under the 44pt minimum.

Each is a deliberate divergence in the mirror and a recommended fix for the app. Alongside them sit the
ones left open on purpose: a fallback illustration whose viewBox is 1.86:1 being drawn into square
tiles, an off-palette teal in one icon, a gold crown that marks premium on every reference screen and
exists neither as a token nor in the icon set. The file's first instruction is *read this before
"fixing" anything that looks wrong* — several of the oddities are decisions.

> **ALEX — VERIFY BEFORE PUBLISHING.** Spot-check the dark-mode token and the checkbox target. If
> they're real, they're worth raising with engineering regardless of this case study. If they don't
> hold up, this section comes out.

`[IMAGE: the audit's inconsistency table]`
_Caption: Found while mirroring, recorded with a fix_

---

## Then: a component library is a prototyping kit

The mirror was the whole plan. But once eleven real components exist, in a browser, with their states
already built, the next thing is obvious — stop looking at the system and start building screens with
it.

So the repo grew a prototype harness, and the harness is built around the argument rather than the
screen. Every exploration separates two axes that mockups usually blur: **which design** you're looking
at, and **what condition** it's in. Different controls, deliberately, because they aren't the same kind
of choice — pick an approach, then run it through offline, error, loading, locked.

Every option carries a **bet**: what it wagers and what it costs, in prose, in the frame, next to the
thing it describes. Not a description of the layout. One option's bet reads *"the footer grows from 140
to 229pt, 29% of the screen against 18%"*. Another was built specifically so its rejection would be
visible — *"'too loud' is an opinion until you see it"*. A third is flagged as the one to actively
avoid, because progress drawn in the playback lane will be read as buffering.

And under every prototype are two lists that are the deliverable rather than an appendix. **Needs a
system decision**: gaps the exploration hit — no gradient tokens exist, `Button` has no gradient
variant, there's no segmented control in the library. **Still unverified**: invented content, guessed
values, placeholder copy. One prototype states plainly that its annual price is made up and must be
replaced before anyone sees it, because price is what a paywall test measures. A prototype that hides
what it guessed is worse than one that stops and asks.

Those lists turned out to be a channel rather than a complaint box. *No gradient tokens exist* was on
the paywall's list — on a product whose signature device is a full-bleed gradient hero. The system now
has them. And because iOS has no gradient in its design system at all, they had to be sampled pixel-wise
off the Figma exports, which the audit says out loud: these are the *rendered* colours and might be a
composite, the same wash is hotter in the dark screens and I've collapsed three near-identical pinks
into one token, and two of the four gradient families aren't there because they wouldn't separate into
clean stops. The right fix is to take the values from the Figma fill styles instead. **The exploration
found the gap, the system grew, and the new tokens arrived with their own uncertainty attached.**

`[IMAGE: the harness chrome — switchers, bet panel, notes lists. Crop out the phone.]`
_Caption: Approach, condition, and the argument for each_

---

## The states we'd have got to last

Working this way surfaced states before anyone had reached them, and that turned out to be the part
that changed what we designed.

Downloading a podcast has a state most download UIs skip: the listener taps download on cellular with
cellular downloads turned off, and nothing happens. It isn't an error and it isn't progress — it's
**waiting**, and it's the one that generates the support ticket, because no screen says why. The
download control ended up with six states rather than the obvious four, and *Waiting for Wi-Fi* became
a live axis in the exploration: switch the connection and everything that was waiting starts on its
own, with no second tap.

The other was storage — how much room downloads are taking and how much is left, at the top of the
screen. Obvious once it's there, and a list of episodes cannot answer the question everyone actually
has before a flight.

Neither is decoration, and the second one carried weight in where the feature landed. **The design
direction moved because of a state nobody had drawn yet.**

I don't read that as the model being clever. The house rules in the repo say build the unhappy states,
and the design doc says a screen isn't finished until loading, empty, error and locked all exist. What
happened is that a rule I'd written got applied further than I'd applied it myself — because state
exploration is tedious, so humans do it last and under time pressure, which is exactly why unhappy
states ship broken. **Write the intent down properly and it holds you to it too.**

`[IMAGE: the six-state machine as a diagram — idle → queued → downloading → downloaded, with waiting
and failed branching off. Non-confidential, and it's the clearest thing to look at in this section.]`
_Caption: Six states, not four_

---

## It stopped being a repo and became a place

Five prototypes in a flat list is a folder. Making it something the team would actually open meant
designing the thing itself.

It now has two portals rather than one mixed index: **Prototypes** is the front door, because that's
what the repo gets opened for, and **Components** is a link away in the top bar. The top bar moves you
*between* portals, the sidebar moves you *within* one. The shell never unmounts, so you move sideways
from one prototype to the next instead of returning to an index each time, and the theme switch applies
to everything and survives navigation.

Prototypes are grouped by epic rather than listed, because the grouping is itself a design instruction:
the three downloads explorations are three views of one feature — what the listener acts on, where the
result lives, how a transfer reads in the player — and designing one without the others is exactly the
mistake the grouping exists to prevent. The index says so on the group: *three views of one feature —
design them together.*

Underneath, every route's hash, name, blurb and component live in one list that the router, the sidebar
and the index all read. They used to live in three places, and adding a prototype meant remembering all
three. That's the same anti-drift argument the design system makes about components, applied to its own
plumbing.

And one decision I made and then took back. The index carried a full-bleed gradient hero for a while,
on the reasoning that a front door is an acquisition surface. It isn't — nobody needs selling on a list
they opened the repo to reach, and the hero pushed the actual index below the fold to say nothing the
sidebar wasn't already saying. It's gone. **The gradient tokens it introduced stayed**, because they
belonged in the system regardless of what prompted them.

`[IMAGE: the two-portal site — top bar, sidebar, prototypes index grouped by epic]`
_Caption: Two portals: prototypes is the front door, components is a link away_

---

## Getting the team into it

A prototyping system one designer uses is a hobby. The work that made it a team tool was the
unglamorous half.

The repo is written for designers, not engineers: install Node, use GitHub Desktop, and let Claude Code
run the git commands — you describe what you want in plain language and it commits, branches and
pushes. I ran the sessions that walked the team through setting it up and working in it. Pull requests
are reviewed by **another designer**, not by engineering, against four questions that take five minutes:
are the tokens used or has a hex crept in, does it work in both themes, does a new component have an
`.md`, and does that `.md` say when *not* to use it. Engineering owns the iOS app; the design team owns
this.

And it deploys itself. Pushing to main publishes the lab to an internal GitHub Pages URL, which means
an exploration is a link you send in Slack rather than an export, a Figma prototype link, or a meeting
— and the link is never out of date, because it *is* the repo.

`[IMAGE: the contributing guide, or the review checklist]`
_Caption: Written for designers, reviewed by designers_

---

## Outcome

The team works in it, and it has changed what exploration looks like rather than just how fast it
happens. **The value isn't that we get to an answer quicker — it's that we can see many ways of doing
the same thing, side by side, each with its argument and its cost attached, before anyone commits.**
It's an ideation tool more than a decision tool, and that's the honest description: the downloads work
ran through three destinations for where downloaded episodes should live, and the one we took forward
won on grounds the exploration made visible — separating managing *saved* content from managing
*downloaded* content, and being the only place that could show storage.

It isn't finished. The UI is close to the app but not pixel-perfect, and **the production-fidelity pass
and the handoff annotations are the next piece of work** — until those exist this is a system for
exploring and validating, not for handing over. The team also isn't yet at the point where designers
push pull requests for UI changes, which is a question about how design and engineering work together
rather than a question about the repo.

What I'd take from it is narrower than "AI makes design faster", and more useful. **The constraint was
never the tooling or the models — it was that most of what a design system knows was never written down
in a form anything else could read.** Not for agents, and not for humans either: the rules that stop a
component being misused lived in people's heads. Making the system legible enough for a machine to
build with meant writing those down properly, and the same document is what lets a designer who didn't
build the component use it correctly. The agent was just the first reader strict enough to prove they
were missing.

---

# Production notes

## Visual approach — confirmed

Lead with the system, not the product. Downloads isn't announced until ~end of year and the portfolio is
public, so: gallery, component docs, harness chrome, token architecture and the state-machine diagram
carry the case study. No downloads product screens. The downloads story is told in words, which it
survives well.

_Open: is the OTB paywall or the premium show page shipped? If either is, some product UI becomes
available and the visual mix can improve._

## Card configuration

| Prop | Suggestion |
|---|---|
| Card name | AI Prototyping System — but see naming question below |
| `cardClass` | `proto-card` |
| Hero | TBC — discuss after the copy settles |
| `tooltip` | TBC |
| `heroSize` | `448` |

Grid: 2×2, top of the thesis cluster.

## Still to decide (deferred by you — ask again later)

- Interactive component (bet switcher vs contract reveal)
- Hero media, video or static
- Final impact-block count

## Remaining open questions

1. **Title** — see chat.
1b. **Name, reopened.** The repo is now called **Rayo Design Lab**. "Design Lab" on its own drops Rayo,
   matches what the thing is actually called, and avoids a third card with "AI" in the name sitting
   beside the Agentic Design System. Worth considering against "AI Prototyping System".
2. **Verify the audit findings** before publishing (flagged inline above).
3. **Is OTB paywall / premium show page shipped?** Affects the visual mix.
3b. **`CONTRIBUTING.md` is wrong about deployment** — it promises a Vercel preview URL per branch. It's
   GitHub Pages, and the workflow only deploys on push to `main`, so there are no per-branch previews
   at all. Two things to fix in the repo, and I've written the case study to the accurate version
   (main deploys, one live link) rather than the better-sounding one. Say the word and I'll fix the
   file.
4. **CV wording.** Your CV says "Rayo Prototype System"; the portfolio will say "AI Prototyping
   System". Change one so they match — I'd change the CV, since the portfolio name is the one a reader
   lands on.
5. **The workshops.** How many sessions, and roughly how many designers attended? Not essential, but
   "I ran the sessions" is stronger with a shape to it.
