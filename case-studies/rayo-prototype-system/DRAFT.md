# From Hit-and-Miss to Ideas We Took Forward

_Case study draft 3 — Rayo Design Lab. Spine: building a tool that harnesses AI to explore designs
and make prototypes. The Storybook-for-iOS origin is one beat near the top, not the story.
Visuals lead with the system, never the unannounced downloads product screens.
Drafts 1 and 2 kept alongside as `DRAFT-v1-superseded.md` / `DRAFT-v2-superseded.md`._

---

## Introduction

Exploring a design properly is expensive. A static mockup can't carry the states that actually
decide a design — offline, loading, error, locked, waiting — and a real prototype costs engineering
time nobody has. So a feature gets one direction, drawn at its happy path, and the argument happens
in a review over a frame that can't answer the question being asked of it.

AI looked like it should fix that, and at first it made things worse. Designing with it felt like
gambling — write a prompt, spin, mostly miss. The output was always nearly right, which is the worst
kind of wrong, and you can’t decide anything from a screen that is approximately the product. So I
built the Rayo Design Lab, where the AI builds inside our own design system: the same tokens, the
same components, and the rules for using them written down where it can read them. What comes out of
it now is worth arguing over — and some of it we’ve taken forward.

---

## My role

Design and development. I built the lab with Claude Code and ran the sessions that onboarded the
design team. I own the repo — designers raise pull requests, and I review and merge them.

---

## Impact

### 🧩 New ideas land inside the product, not beside it

The lab knows how a screen is already built — which components it uses, what the page is already
doing — so a new idea gets designed into that screen rather than generated as a fresh page of
invented parts. That's the difference between reviewing a change to the product and reviewing
something that merely resembles it.

### 🔭 A feature arrives as competing directions, not one frame

Every exploration puts several working options side by side rather than one frame — each option
stating what it’s betting and what it costs, measured, in the frame, next to the thing it describes.

### 💡 States we'd have got to last

Building this way surfaces the states nobody has got to yet — the ones that are neither an error nor
progress, and so get drawn last or not at all. More than once they’ve changed the direction we took
rather than just how quickly we got there.

### 👥 A playground designers can actually work in

It's meant to be somewhere you try things, and the designers do the trying. I ran the sessions that
got the team cloning the repo, running it locally and building their own ideas in it. When something
is worth sharing they raise a pull request, and once it's merged everyone has it — the exploration
lives in the shared lab rather than on one laptop.

---

## Cover image

`[DIAGRAM: harness anatomy — a labelled schematic of one exploration. Approach switcher, condition
switcher, the bet panel, the two notes lists, and the phone frame drawn as an empty outline. Shows
the structure of the argument without showing a single pixel of product.]`
_Caption: The anatomy of one exploration_

---

## Problem

Two things were true at once, and each made the other worse.

**Exploration was expensive, so it stayed narrow.** We design in Figma and we have a design system
there, so producing screens was never the problem. Prototyping them is. A Figma prototype is a graph
of screens, and every state is another screen — loading, empty, error, offline, locked — each one
drawn, linked and kept in step by hand. Explore three directions across five states and you are
maintaining fifteen screens. So in practice you explore one direction, at its happy path. And when
something changes, it changes in every screen it appears in.

That cost lands hardest on user testing, which is exactly where a prototype earns its keep. Building
one takes days, and changing it after the first session takes hours nobody has — so the version you
test is often the version you drew first, whether or not the first session told you it was wrong.

**And AI, on its own, made it worse rather than better.** My first attempts at designing with AI
felt like gambling. Write a prompt, spin, see what comes back. Occasionally something useful; mostly
not, and never predictably, so whatever I saved on a good spin went straight back into the next
three. The output was always *nearly* right, which is the worst kind of wrong — a colour close to
ours, a component we don't have, a locked state invented from scratch. You can't decide anything
from a screen that is approximately the product.

It wasn't a tool problem, and I checked. It happened across every AI design tool I tried, and it
kept happening with Claude, which I now use for everything else. Give a capable model nothing of
ours to work from and it produces something plausible and generic, because plausible and generic is
all the information it has.

What was missing was never the model. It was context — how the thing is built, what each component
is for, what the brand is meant to feel like, what we'd already decided and why. Once the AI had
that, the output stopped being a gamble. Not production-ready, but close enough to review, and close
enough that the ideas inside it were worth keeping.

---

## It started as the Storybook iOS can't have

Rayo ships on iOS and Android, and the two platforms aren't equally stuck. Android has workable
routes to a browsable component gallery. iOS doesn't — SwiftUI previews live inside Xcode, which is
not a place a designer goes. So the design system existed as a Figma library we design with, and as
code we couldn't open.

I started from the iOS side, which is the half with no answer, and mirrored it in React: I extracted
it from the iOS source with Claude Code — colours from the asset catalogue, spacing and radius
constants, type sizes and weights, and each component's variants, states and animation timings from
its Swift file.

That alone would have been useful. It's also the least interesting thing here, because a component
library tells you what exists and never tells you what's wrong.

`[INTERACTIVE — BeforeAfterToggle: the POC component gallery (bare column on white, a Dark pill in
the corner) against the current components page (glass chrome, sidebar, ⌘K). Same artefact, months
apart — tells the "started as a Storybook, became the Design Lab" arc in one control.]`
_Caption: The first build, and the same page now_

---

## The part that made the AI useful

Each component ships a contract beside it — a `.md` next to the `.tsx`, and where they disagree the
`.md` wins. Not an API reference. **Use when / Don't use when**, content rules, anti-patterns.

`Button.md` says the pressed state drops to 0.1 opacity, that this is unusually aggressive, and that
it's the intended Rayo feel so don't "fix" it. It says not to add a `disabled` boolean, because iOS
models disabled as a *style* and duplicating it as a prop lets the two disagree. `CheckmarkRow.md`
says the component can only ever express "included", never "not included", so it must not be used
for tier comparison. `EmptyState.md` says using it on a failed request tells the user their library
is empty when the network is down.

None of that is in the code, and none of it was written down anywhere — it lived in designers' heads
and in review comments. It's also exactly what an agent needs, because an agent doesn't hedge and
doesn't ask: given a list of components and no rules, it picks something reasonable-looking and is
confidently wrong.

And there's a test that can fail it. Open a fresh agent session in the repo — no history, no hints —
and give it one prompt: *build a list screen for a piece of locked content*. Then audit what comes
back. Right components? Tokens throughout? Locked state handled the way the pattern doc describes?
Both themes? The rule that makes it useful is how you read the result: **every failure is a
documentation bug, not a model failure.** Don't rewrite the prompt and don't add context in the
chat — find the missing rule, put it in the `.md`, run it again.

`[EXCERPT: a styled block quoting a component contract — the Use when / Don't use when and
Anti-patterns lines. Typeset as a document, not screenshotted. Text only, no UI.]`
_Caption: The part the API can't tell you_

---

## Then it became a place to explore

Once real components existed with rules attached, building a screen stopped being the expensive part
— and in code a state is a prop, not another screen. That single difference is what makes exploring
several directions across all their states affordable at all. So the lab grew a prototype harness,
and the harness is built around the argument rather than the screen.

Each exploration has two sets of controls. One switches between the design options; the other
switches the state — offline, error, loading, locked. They look different on purpose, because they
aren't the same kind of choice. Any option can be seen in any state, which is the thing a static
mockup can't do.

Each option carries a **bet**: what it's good for, and what it costs, written next to it. Not a
description of the layout — an argument, with the trade-off named and measured where it can be. Some
options are only there to be rejected. It is much easier to agree that something is too loud once you
can see it.

Which is, I notice, the opposite of where I started. Designing with AI began as a bet I couldn't see
the odds on. In the lab, every option has to state its own.

Under every prototype are two lists that are the deliverable rather than an appendix. **Needs a
system decision** — the gaps this exploration hit. **Still unverified** — invented content, guessed
values, placeholder copy. One states plainly that a number in it is invented and has to be replaced
before anyone sees it, because that number is exactly what a test of that screen would measure. A prototype that
hides what it guessed is worse than one that stops and asks.

Explorations are grouped by feature rather than listed, because the grouping is itself a design
instruction: when several are different views of one feature, designing any of them without the
others is the mistake the grouping exists to prevent.

`[IMAGE: the harness in full — approach and condition switchers, the bet panel, and one downloads
direction in the phone frame. A direction that was NOT taken forward. This is the money shot: it
proves the apparatus and supplies the one product visual at the same time.]`
_Caption: One option, one state, and the argument for it_

`[INTERACTIVE: the bet switcher — options as pills; selecting one swaps its bet prose and a grey
schematic of where that option puts the control. Prose and schematics only, no further screenshots.]`

---

## The states we'd have got to last

This is where it stopped being a faster way to do the same work.

Downloading a podcast has a state most download UIs skip: the listener taps download on cellular
with cellular downloads turned off, and nothing happens. It isn't an error and it isn't progress —
it's **waiting**, and it's the one that generates the support ticket, because no screen says why.
The download control ended up with six states rather than the obvious four, and *Waiting for Wi-Fi*
became a live axis in the exploration: switch the connection and everything that was waiting starts
on its own, with no second tap.

The other was storage — how much room downloads are taking and how much is left, at the top of the
screen. Obvious once it's there, and a list of episodes cannot answer the question everyone actually
has before a flight.

Neither is decoration, and the second one carried weight in where the feature landed. **The design
direction moved because of a state nobody had drawn yet.**

I don't read that as the model being clever. The house rules in the repo say build the unhappy
states, and the design doc says a screen isn't finished until loading, empty, error and locked all
exist. What happened is that a rule I'd written got applied further than I'd applied it myself —
because state exploration is tedious, so humans do it last and under time pressure, which is exactly
why unhappy states ship broken. **Write the intent down properly and it holds you to it too.**

`[INTERACTIVE: the six-state walk — the state machine stepped through, each state naming what it
means and why most apps skip it. Built from scratch.]`

---

## It finds what the system is missing

Building real things in a design system is the fastest way to discover what it doesn't have, and the
gap lists turned out to be a channel rather than a complaint box.

*No gradient tokens exist* was on one exploration's list — on a product whose signature device is a
full-bleed gradient hero. The system has them now. And because iOS has no gradient in its design
system at all, they had to be sampled off the Figma exports, which the audit says out loud: these
are the *rendered* colours and may be composites, the same wash is hotter in the dark screens so
three near-identical pinks were collapsed into one token, and two of the four gradient families
aren't there because they wouldn't separate into clean stops.

The audit file that started as a record of what was inferred from the Swift now runs to twelve
sections, and the later ones are all things found by using the system rather than reading it: no
motion, elevation or blur primitives; a secondary text colour that doesn't survive being placed on
anything tinted; a button with no nav-bar size; a selected state that is a colour and nothing else,
still open. **Each one is a question the design system now has to answer, raised by something real
rather than in the abstract.**

`[DIAGRAM: the loop — a gap named in an exploration's notes, becoming a token in the system,
becoming available to the next exploration. Three nodes, one cycle.]`
_Caption: A gap list is a feedback channel_

---

## Designing the lab itself

I should admit a bias here. I like the way Apple's software feels — Liquid Glass, the spatial UI
direction, that sense of something modern and slightly ahead of itself — and I wanted this to feel
like that rather than like a documentation site. It's where the name came from: a lab is somewhere
you try things, not somewhere you file them. A tool the team is meant to live in has to be designed,
not just assembled. The lab has two portals
— **Prototypes** is the front door, because that's what it gets opened for, and **Components** is a
link away. The shell never unmounts, so you move sideways from one exploration to the next instead
of returning to an index. ⌘K jumps to any prototype or component across both portals, matching on
subsequence rather than substring, locally — no model, no network, and the panel says so, because a
prompt-shaped box that only ran a string match would be a lie about what the tool does.

The one rule the whole thing is built on: **the shell is transparent, the frame is not.** The lab's
own chrome is deliberately unlike Rayo — glass over a slow wash of light, permanently dark — and it
stops dead at the edge of the phone frame. Inside, the screen under test sits on a real Rayo surface
and is judged against it, never through a veil. Light and dark belong to the screen being reviewed,
not to the tool, so the appearance switch sits above the frame rather than in the header.

That rule is what stops a nicely-designed tool contaminating the thing it's supposed to help you
judge.

`[IMAGE — the one screenshot worth taking: the lab's own chrome with the phone frame empty. Glass
panes, sidebar, top bar, and nothing under review inside the frame. It shows the tool and none of
the product, which is the section's own rule made literal.]`
_Caption: The shell is transparent. The frame is not._

---

## Getting the team into it

A prototyping tool one designer uses is a hobby. The work that made it a team tool was the
unglamorous half.

The repo is written for designers, not engineers: install Node, clone it with GitHub Desktop, run it
locally, and let Claude Code handle the git commands. I ran the sessions that walked the team
through all of it, so they build their own ideas rather than asking me to. The pull request is the
publishing step, not the request — when something is worth the rest of the team seeing, it goes up,
I review and merge it, and everyone's copy has it, checked against four questions that take five
minutes: are the tokens used or has a hex crept in, does it work in both themes, does a new
component have a contract, and does that contract say when *not* to use it.

And it deploys itself — merging to main publishes the lab internally, so an exploration is a link
you send in Slack rather than an export, and the link is never out of date because it *is* the repo.
Access is locked to Bauer accounts, which is why there's no public link in this case study.

It doesn't have to stay a design-team tool, and that's the next thing I want to test. Anyone who can
describe a screen can now get a real one built from the real system — an engineer sketching a
feature they've been thinking about, a product manager putting an idea in front of people instead of
describing it. The platform is open to them; whether they take it up is the interesting question.

`[EXCERPT: the four review questions, typeset as a list. Text, not a screenshot.]`
_Caption: A five-minute review, four questions_

---

## What's next

**Production fidelity and handoff annotations.** The UI is close to the app but not pixel-perfect.
Until that pass is done and the annotations exist, this is a system for exploring and deciding
internally, not for handing over.

**Android.** Everything in the lab mirrors the iOS Swift components, which is half the product.
Feeding it the Android side would make it the whole of it.

**Prototypes built for real user testing.** Everything so far has been for internal decisions —
arguing a direction out among ourselves. The next step is somewhere in the lab built for putting a
prototype in front of actual listeners. The form isn't decided yet, but a prototype made of the real
system, with its states already built, is most of the way to being testable already.

---

## Outcome

The team works in it, and what changed isn't the speed. **We can see many ways of doing the same
thing side by side, each with its argument and its cost attached, before anyone commits.** It's an
ideation tool more than a decision tool, and that's the honest description: the downloads work ran
through three destinations for where downloaded episodes should live, and the one we took forward
won on grounds the exploration made visible — separating managing *saved* content from managing
*downloaded* content, and being the only place that could show storage.

It isn't finished, and the list above is honest about that. The team also isn't yet at the point
where designers push pull requests for UI changes, which is a question about how design and
engineering work together rather than about the repo.

What I'd take from it is narrower than "AI makes design faster", and more useful. **The models were
never the constraint. The constraint was that they had nothing of ours to build with** — no tokens
they could reach, no components that were really ours, and no written rules about when each one is
the wrong choice. Give an agent the actual system and the rules that go with it, and the work it
produces is something you can decide from. **It didn't make us faster. It let us explore more of the
options before we chose.**

---

# Production notes

## Settled

- **Title:** From Hit-and-Miss to Ideas We Took Forward
- **Card name:** Rayo Design Lab
- **Interactive:** both — the bet switcher in the harness section, the six-state walk in the states
  section
- **Spine:** building a tool that harnesses AI to explore and prototype; the Storybook origin is one
  beat near the top

## Visual approach — no product UI at all

The explorations are live, unpublished work, so nothing from inside the phone frame appears in this
case study, and the number of prototypes is deliberately not stated (it's growing, and it isn't
anyone else's business). Everything visual is therefore either drawn from scratch or shows the tool
rather than the product:

| Where | What | Sensitive? |
|---|---|---|
| Cover | Harness anatomy — labelled schematic, empty phone outline | No — drawn |
| Mirror section | **POC gallery → current components page**, before/after toggle | No — public atoms |
| Harness section | **The harness in full**, one un-taken downloads direction in frame | Cleared — one shot |
| Contracts section | A component contract, typeset as a document | Low — design-system prose |
| Harness section | **Bet switcher** (interactive), grey schematics only | No — drawn |
| States section | **Six-state walk** (interactive) | No — drawn |
| Gaps section | The gap → token loop, three nodes | No — drawn |
| Lab chrome section | The lab's chrome, **phone frame empty** | No — tool, not product |
| Team section | The four review questions, typeset | No |

**The one screenshot** is the lab's own chrome with nothing loaded in the frame — which is the
section's own rule made literal, and the strongest possible argument that the tool is styled so it
can't be mistaken for the product.

**Three real screenshots, everything else drawn:** the POC gallery, the current components page, and
one full-harness shot. On the POC one: the original component
gallery, which shows design-system atoms that already exist in the shipped app. Two small things
before it goes in — crop it tighter (it's currently a tall column with dead space and a cut-off
component at the bottom, and the point is the *inventory*), and decide whether to relabel the
"Delete download" button, which faintly hints at an unannounced feature.

**Card face:** a bespoke animated background in the spirit of the lab's own chrome — glass panes
drifting over a slow wash — matching how `LayerLintCard` and `AgenticDSCard` already build their
card faces by hand rather than from screenshots. No hero video, since a video would have to show
something.

## Open — needs your call

1. **Do we keep naming downloads?** The waiting state and the storage meter are the best material in
   the case study, and telling that story means saying Rayo is building downloads — an unannounced
   feature. My read: downloads on a podcast app is the least surprising roadmap item imaginable, and
   the confidential part is the *design*, which we're not showing. But it's a disclosure, and now
   that you're being more conservative it should be a decision rather than a leftover. Alternative
   is to anonymise it to "a feature we were exploring", which costs the story most of its force.
2. **The component contract excerpt** — quoting `Button.md`'s anti-patterns means publishing a small
   piece of Rayo's design-system documentation. Low risk, but say if you'd rather I paraphrase it
   into a generic example instead of quoting the real one.
3. **`README.md` says the lab is "used for exploration, validation and user testing."** User testing
   hasn't happened. One-word fix in the repo whenever you want it.
