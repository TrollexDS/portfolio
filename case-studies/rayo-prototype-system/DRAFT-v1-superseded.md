# Rayo Prototype System — case study draft

_Draft 1. Written from the repo at `Documents/GitHub/rayo-design-system-ios`.
Spine: the documentation is the product. Prototypes are the proof, the iOS audit is the credibility.
Anything I inferred rather than read is flagged in **OPEN QUESTIONS** at the bottom._

---

## Title — pick a direction

**A.** The components weren't the hard part. Writing down when *not* to use them was.

**B.** A design system that can tell an agent it's wrong

**C.** Every failure is a documentation bug, not a model failure

_A is closest to the house style (a statement about the shift, not a label) and it sets up the
whole case study in one sentence. C is the sharpest line in the repo but it needs the setup to
land — it works better as the closing line than the title. B is the shortest and the least
specific._

---

## Introduction

Rayo is Bauer Media's radio and podcast platform, and its design system lives in Swift — inside
the iOS app, in an engineering repo, expressed as code that only builds on a Mac with Xcode. That
is the correct home for it. It also means that when I asked an AI agent to build a Rayo screen, it
had nothing to read. It would produce something plausible, on-brand-ish, and confidently wrong.

So I built a mirror: the Rayo design system rebuilt in React, owned by the design team, with the
part that was missing written down. Not the components — those were the easy half. The rules about
when each one is the wrong choice.

---

## My role

Design and development. I built the system and its documentation with Claude Code; the design team
owns the repo.

---

## Impact

### 📄 The documentation became the deliverable

Every component ships a `.md` beside its `.tsx` — not an API reference, a contract. **Use when /
Don't use when**, content rules, and anti-patterns. `CheckmarkRow.md` says it is never interactive
despite the tick. `EmptyState.md` says that using it on a failed request tells the user their
library is empty when the network is down. Those were the things only the design team knew.

### 🧪 Documentation you can actually fail

The cold-start test: a fresh agent session, no conversation history, one prompt — *"build the
episode list screen for a locked Off The Ball show"* — then audit what comes back. Right
components? Tokens throughout? Both themes? Every failure is a documentation bug, not a model
failure. It turns a wiki nobody reads into something with a pass/fail state.

### 🔎 Seven findings in the shipping app

Mirroring Swift honestly means reading it closely, and reading it closely surfaced things nobody
had noticed: a neutral token that doesn't invert in dark mode, two components each rebuilding
their own capsule button instead of using the shared one — with one of those ignoring dark mode
entirely — and a 25pt checkbox sitting under the 44pt minimum tap target with no expanded hit area.
All recorded, with a recommended fix for the app.

### 💡 States I hadn't got to yet

On the downloads work it started proposing things I hadn't reached — the waiting state when a
listener taps download on cellular with cellular downloads off, and a storage meter at the top of
the Downloads screen. I'd have found both eventually. It found them first, and both changed the
direction of the exploration rather than decorating it.

_[This replaces the "a repo designers can work in without engineering" block, which repeated in the
Outcome. Say if you'd rather have that one back and cut something else.]_

---

## Cover image

`[IMAGE: the component gallery in light and dark, or a prototype in the harness with its
switchers and bet visible]`
_Caption: The component gallery, both themes_

---

## Problem

Agents can write React. That was never the bottleneck. The bottleneck is that a component library
tells an agent what exists and never tells it what's wrong. Given a list of eleven components, an
agent asked for a locked episode screen will pick something reasonable-looking and be confidently
incorrect — an `EmptyState` on a network failure, a `CheckmarkRow` wired up as a selection control,
a hardcoded hex because it couldn't find the token. It doesn't hedge, and it doesn't ask.

The knowledge that prevents all three existed. It just lived in designers' heads and in review
comments. Figma held the visuals but not the rules; the Swift source held the behaviour but not the
intent; and neither was reachable by an agent or by a designer who wanted to prototype something
real without booking engineering time.

---

## Mirroring the system

I extracted the system from the iOS codebase — every colour from the asset catalogue, every
spacing and radius constant, every type size and weight, and each component's variants, states and
animation timings from its Swift file. That produced 92 tokens in DTCG format, generating 158 CSS
custom properties, and eleven components with a 79-symbol icon set.

The interesting part was the layer that had to be invented. Rayo names colours by ramp position
with the light and dark pair baked into the name — `Neutral750>150` is position 750 in light,
position 150 in dark. It's a clear, symmetrical convention, and it encodes *position*, not *role*.
An agent reading `Neutral750>150` has no way to know it's a border. So I derived a semantic layer —
`text-primary`, `bg-canvas`, `border-default` — from how components actually consume the
primitives, and had the design team sign it off. Components reference roles; roles reference the
ramp.

`[IMAGE: the DTCG token file or the token architecture, primitives → semantic]`
_Caption: Position-named primitives, role-named semantics_

---

## The `.md` is the component

The `.tsx` tells an agent the API. The `.md` tells it when the component is the wrong choice, and
where they disagree, the `.md` wins.

`Button.md` doesn't just list six variants. It says the pressed state drops to 0.1 opacity, that
this is unusually aggressive, and that it's the intended Rayo feel so don't "fix" it. It says not
to add a `disabled` boolean, because iOS models disabled as a *style* and duplicating it as a prop
lets the two disagree. `CheckmarkRow.md` says the component can only ever express "included", never
"not included", so it must not be used for tier comparison — that's a different, unbuilt component.

Those are the sentences that stop an agent being wrong, and none of them are derivable from the
code. The template makes **Use when / Don't use when** and **Anti-patterns** mandatory, because
they're the two sections carrying everything the source can't say.

`[IMAGE: a component .md open beside its .tsx]`
_Caption: The API, and the part the API can't tell you_

---

## The cold-start test

A doc that nobody can fail is a doc nobody maintains. So the system has a test.

Open a fresh agent session in the repo — no history, no hints — and give it one prompt: *build the
episode list screen for a locked Off The Ball show*. Then audit the output. Did it choose the right
components? Use tokens throughout? Handle the locked state the way the pattern doc describes? Work
in both themes?

The rule that makes it useful is the one about how you read the result: **every failure is a
documentation bug, not a model failure.** Don't rewrite the prompt, don't add context in chat —
find the rule that was missing, put it in the relevant `.md`, and run it again. That loop is the
actual maintenance work of the repo, and it's why the documentation stays true. A wrong output is
now a reproducible bug with a location.

`[IMAGE or VIDEO: cold-start run — one prompt in, a screen out]`
_Caption: One prompt, no conversation history_

---

## Writing down what I wasn't sure of

An audit file records how the system was built and, more usefully, where it needs a human. It
separates what was read directly from the code, what I inferred and needed signed off, and what I
found wrong in the iOS source.

That third list is the one with teeth. `Neutral750>150` was identical in light and dark — the only
token in the ramp that doesn't invert, so anything using it goes muddy in dark mode. Two colour
tokens were byte-identical duplicates of others under pre-convention names. Two components each
built their own capsule button rather than using the shared one, and one of those hardcodes a white
background and a black label, so it ignores dark mode entirely. The checkbox's tap target is 25×25
with no expanded hit area.

Each of those is a deliberate divergence in the mirror and a recommended fix for the app. Alongside
them sit the ones I couldn't resolve, left open on purpose: a fallback illustration whose viewBox is
1.86:1 being drawn into square tiles, which letterboxes; an off-palette teal in one icon that's
close to but not equal to the brand aqua; a gold crown that marks premium on every reference screen
and exists neither as a token nor in the icon set.

The file's first instruction is *read this before "fixing" anything that looks wrong*. Several of
the oddities are decisions.

`[IMAGE: the audit's inconsistency table, or a before/after of the dark-mode token]`
_Caption: Found while mirroring, raised against the app_

---

## What it produces: prototypes that argue

Once an agent can build a Rayo screen in an afternoon, the screen stops being the scarce thing. The
argument for it becomes the scarce thing. So the prototype harness is built around the argument.

Every exploration separates two axes that mockups usually blur: **which design** you're looking at,
and **what condition** it's in. They get different controls, deliberately, because they're not the
same kind of choice — pick option C, then run it through offline, error, loading and locked.

And every option carries a **bet** — what it's wagering and what it costs, in prose, in the frame.
Not a description of the layout. On the paywall: *"the footer grows from 140 to 229pt, 29% of the
screen against 18%"*. In the player: an option built specifically so its rejection is visible —
*"'too loud' is an opinion until you see it"* — and another flagged as the one to actively avoid,
because download progress drawn in the playback lane will be read as buffering.

Under every prototype are two lists that are the deliverable rather than an appendix. **Needs a
system decision**: no gradient tokens exist, `Button` has no gradient variant, there's no segmented
control in the library. **Still unverified**: the annual price is invented, only €8.99/month is
confirmed, replace it before anyone sees this — price is what a paywall test measures.

Five prototypes so far — the Off The Ball paywall, a premium show page, and three covering
downloads across the library, the show page and the player. The two downloads prototypes share one
download control, so a state can't mean two different things across them.

`[IMAGE: the harness — phone frame, approach and state switchers, bet text]`
_Caption: Four options, three states, one bet visible at a time_

`[IMAGE or VIDEO: switching between paywall options and states]`
_Caption: Every option and every state, in both themes_

---

## The states I hadn't got to yet

The most useful thing that happened wasn't speed. On the downloads exploration the system started
returning states I hadn't asked for and hadn't yet thought about.

Downloading a podcast has a state most download UIs skip: the listener taps download while on
cellular with cellular downloads turned off, and nothing happens. It isn't an error and it isn't
progress — it's **waiting**, and it's the one that generates the support ticket, because no screen
says why. The download control ended up with six states rather than the obvious four, and *Waiting
for Wi-Fi* became a live axis in the prototype: switch the connection to Wi-Fi and everything that
was waiting starts on its own, no second tap.

The other was a storage meter at the top of the Downloads screen — how much room this is taking, and
how much is left. Obvious once it's there. A list of episodes cannot answer the question everyone
actually has before a flight.

Neither is a small addition, and the second one settled an argument. Three approaches were on the
table for where downloads should live, and storage is the thing a filter chip physically cannot
carry while a dedicated destination can — which is what made that approach the one to ship for the
list. **The design direction moved because of a state I hadn't drawn yet.**

I don't think this was the model being clever. The house rules in the repo say build the unhappy
states, and `DESIGN.md` says a screen isn't finished until loading, empty, error and locked all
exist. The agent applied a rule I'd written further than I'd applied it myself. That's the same
argument as the rest of this case study, pointed the other way: **write the intent down properly and
it holds you to it too.**

`[IMAGE: the download control's six states, or the Waiting for Wi-Fi row + snackbar]`
_Caption: Six states, not four — waiting is the one that generates the ticket_

`[IMAGE: the Downloads screen with the storage meter]`
_Caption: The question a list of episodes can't answer_

---

## Outcome

Other designers on the team now work in it — Node, GitHub Desktop, and Claude Code running the git
commands, with pull requests reviewed by another designer rather than by engineering — and
prototypes from it have fed real product decisions rather than sitting in a folder. **The thing that changed isn't that we prototype faster — it's
that a prototype now arrives with its unhappy states built, its guesses labelled, and a list of what
the design system is missing.** The paywall exploration didn't just produce four options; it
produced the finding that Rayo has no gradient tokens at all, on a product whose signature device is
a gradient hero.

It isn't finished, and the honest version of where it sits matters. The UI is close to the app but
not pixel-perfect — **the production-fidelity pass and the handoff annotations are the next piece of
work**, and until those exist this is a system for exploring and validating, not for handing over.
The team isn't yet at the point where designers push pull requests for UI changes, which is a
question about how design and engineering work together rather than a question about the repo.

What I'd take from it is narrower than "AI makes design faster", and more useful. **The models
aren't the constraint. The constraint is that design work isn't written down in a form anything
else can read** — and most of what stops a component being misused was never written down for
humans either. Making the system legible to a machine meant writing down decisions the design team
had been carrying in its head for years. The agent was just the first reader strict enough to prove
they were missing.

---

# Production notes

## Card configuration

| Prop | Suggestion |
|---|---|
| `cardClass` | `proto-card` |
| Hero | Video — the harness with option/state switching, or the paywall cycling states. A static shot undersells it. |
| `tooltip` | `"Make a design system readable\nby the agents building with it :hammer_and_wrench:"` |
| `heroSize` | `448` |

Grid: 2×2, top of the thesis cluster (rows 3–4, cols 1–2 in the proposed layout).

## Interactive component idea

Every other case study has one. The strongest option here is a **bet switcher** — the harness's own
mechanic, rebuilt small: two or three paywall options as pills, and selecting one swaps a screenshot
and the bet prose beneath it. It demonstrates the argument-carrying idea by making the reader do it,
and it reuses a pattern the portfolio already has (`AntonymSection` is close).

Second option: a **contract reveal** — a component rendered plainly, and clicking it reveals the
three "don't use when" rules attached to it. Cheaper to build, makes the abstract point concrete.

## Assets to capture

1. Component gallery, light and dark
2. A `.md` open beside its `.tsx`
3. The harness with switchers and a bet visible
4. Screen recording: switching options, then switching states
5. The audit's inconsistency table
6. Token file or primitive → semantic diagram

## OPEN QUESTIONS — everything I need from you

### Naming and how it sits beside the other case studies

**1. What is this called?** The repo is "Rayo Design System"; your CV calls it the "Rayo Prototype
System". You already have a *Refactoring the Rayo Design System* case study on the site. Two cards
called near-identical things is a real problem for a reader scanning the grid. My preference is
**Rayo Prototype System** for the portfolio — it's accurate (the deliverable is prototypes), it
doesn't collide, and it's what the CV already says.

**2. How does this differ from the Agentic Design System case study?** Both are "design system built
for AI agents", and they'll sit near each other in the thesis cluster. My read: Agentic DS is the
*experiment* on your own portfolio DS, this is the *real one* inside a company on a shipping product
— and the differentiator is that this one had to mirror something that already existed and be used
by other people. Do you agree, and should this case study say so explicitly or leave the reader to
work it out?

**3. Which title?**
  - A. *The components weren't the hard part. Writing down when not to use them was.*
  - B. *A design system that can tell an agent it's wrong*
  - C. *Every failure is a documentation bug, not a model failure*

### Facts I can't get from the repo

**4. Which real product decision did a prototype feed?** "Prototypes have fed real product decisions"
is the vaguest sentence in the Outcome. One named example fixes it. The downloads epic looks like the
strongest candidate from the outside — what actually happened, and with whom?

**5. Is the storage-meter story accurate as I've told it?** I've written that storage was the argument
that settled which approach should own the Downloads list, because a filter chip can't carry storage
and a dedicated destination can. I inferred that from the prototype's own notes. True, or am I
overstating it?

**6. Attribution on the waiting state and the storage meter.** I've written it as: the agent proposed
them, you evaluated and kept them, and the reason it proposed them is that your own house rules say
build the unhappy states. Is that the honest account? If the storage bar was your idea and the
waiting state was the agent's (or vice versa), say which — the story is better precise than tidy.

**7. Were the audit findings raised with engineering?** You didn't tick that option. Right now the
draft says "recorded, with a recommended fix for the app", which is safe. If they were actually
raised, the Impact block gets meaningfully stronger and I'll say so.

**8. How many designers have used it?** "Other designers on the team" is what I've written. A number
is better if it flatters — two of six is worth stating, one of six isn't.

**9. Timeline.** Git history runs 31 July to 20 August 2026, but that's when it was pushed, not when
it started. Is there a real span worth naming, or leave dates out?

**10. Vercel or GitHub Pages?** `CONTRIBUTING.md` promises every branch a Vercel preview URL; the
actual workflow deploys to GitHub Pages on push to main. One is stale — worth fixing in the repo
regardless. It matters here because "a prototype is a link you paste in Slack, not an export" is a
strong point I've left out until you confirm which is true.

### Publishing and confidentiality

**11. Can this show real Rayo UI?** Your other Rayo case studies do, so I've assumed yes — but this
one shows unreleased explorations rather than shipped screens.

**12. Is downloads announced or shipped?** If the feature is unreleased, publishing five explorations
of it is a different question from publishing a design system. Same for the premium show page.

**13. Off The Ball pricing.** €8.99/month is in the repo docs so I've used it. Confirm it's fine
externally. (The €89.99 annual is invented — it's flagged as a placeholder in the prototype and I've
kept that framing, which is actually a good look.)

**14. Naming Claude Code.** The draft says you built it with Claude Code. Happy to name the tool, or
keep it to "an AI agent"?

### Build choices for when I make the card

**15. Interactive component.** A **bet switcher** — two or three paywall options as pills, selecting
one swaps a screenshot and the bet prose — demonstrates the argument-carrying idea by making the
reader do it. Or a **contract reveal**: a component rendered plainly, click it and the three "don't
use when" rules appear. First is better, second is cheaper.

**16. Hero media.** Video or static? A static shot undersells the harness. A short loop switching
options and states would carry it, but it's work to record.

**17. Impact blocks — four or three?** Currently: documentation-as-deliverable, the cold-start test,
seven findings in the app, states I hadn't got to yet. I dropped "a repo designers can work in
without engineering" into the Outcome to make room. Right call?

**18. Anything in the draft that's wrong.** You catch overstatement and I'd rather you flag it now
than after it's a Vue component. In particular: the Problem section asserts what an agent *would* do
with an undocumented library. If you've actually seen it pick `EmptyState` for a network failure,
that's an observation and I'll say so. If not, I should soften it to a claim about the class of
error.
