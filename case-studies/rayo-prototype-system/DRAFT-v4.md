# The Platform That Lets Our Whole Design Team Prototype with AI

_Case study draft 4 - Rayo Design Lab. Spine: I built a platform so the whole team can use AI to
explore more ideas, as working prototypes, inside the real product. The Storybook-for-iOS origin,
the contracts and Pages are compressed into one "foundation" run; the Guide, the skills, the
guardrails and the team using it are the story. Draft 3 kept alongside as `DRAFT.md`.
Not in this draft, by decision: the web track (not shown yet), user testing (none yet). Speed claim
is scoped to making prototypes (replaces days of drawing and linking Figma screens), never to design
or delivery in general. Other regions are fine to show._

_Title alternatives, same claim: "Building the Platform That Lets Our Design Team Prototype with
AI" · "A Prototyping Platform That Puts AI in Every Designer's Hands" · "Rayo Design Lab: a Platform
for the Whole Team to Design with AI" (repeats the card name)._

---

## Introduction

Exploring a design properly is expensive, so a feature gets one direction drawn at its happy path,
and the states that actually decide it never get drawn at all. AI looked like the fix, and at first
it made things worse: nearly right, which is the worst kind of wrong. And even once I'd got it
working, it only worked for me.

So I built the Rayo Design Lab: a platform where AI builds inside our own design system, with the
rules for using it written down where it can read them, and where any designer on the team - with
no Terminal, no git and no code - can brief it, see several directions side by side in every state,
and put the result in front of the rest of us. The team works in it now. A prototype that took days
to draw and link in Figma is a brief and a conversation, and the time that frees goes on the thing
we never had time for: looking at more ideas before we choose.

---

## My role

Design and development. I built the lab, designed the workflow and the Guide that get the team into
it, and set up how work is checked and reviewed. I own the foundations every prototype sits on; the
explorations are the team's.

---

## Impact

### ⛹️‍♂️ The whole team can build with AI, not just the person who set it up
Every designer on the team has set up from the Guide alone, without a session with me. The whole
workflow is four commands, each with a button that opens Claude with the prompt already typed, and
a button that messages me on Teams if it goes wrong.

### ⚡ Days of linking screens in Figma become a brief
A clickable prototype with its states used to mean days of drawing and linking screens, and
re-linking them after every change. Now it's a sentence or a pasted brief, a couple of questions,
and a working prototype in the real components, in code where a state is a prop rather than another
screen.

### 🗺️ A feature arrives as competing directions, not one frame
Every exploration starts as three directions sketched side by side - one close to today's app, two
bold - before anything is built out. Each option states what it's betting and what it costs, in the
frame, next to the thing it describes.

### 💡 New ideas land inside the product, not beside it
The lab keeps the app's own screens as they actually are, so a new idea gets designed into the real
screen rather than generated as a fresh page of invented parts. That's the difference between
reviewing a change to the product and reviewing something that merely resembles it.

### ⚠️ States we'd have got to last
Building this way surfaces the states nobody has got to yet, the ones that are neither an error nor
progress. More than once they've changed the direction we took rather than just how quickly we got
there.

_[Diagram: the anatomy of one exploration - keep as is.]_

---

## Problem

Three things were true at once, and each made the others worse.

**Exploration was expensive, so it stayed narrow.** Producing screens in Figma was never the
problem; prototyping them is. A Figma prototype is a graph of screens, and every state is another
screen - loading, empty, error, offline, locked - each one drawn, linked and kept in step by hand.
Three directions across five states is fifteen screens to maintain, and a change to one is a change
to all of them. So a feature got one direction, and the argument happened over a frame that couldn't
answer the question being asked of it.

**AI, on its own, made it worse.** Designing with it felt like gambling: write a prompt, spin,
mostly miss. The output was always nearly right - a colour close to ours, a component we don't have,
a locked state invented from scratch - and you can't decide anything from a screen that is
approximately the product. It wasn't the tool; it happened across every AI design tool I tried.
Give a capable model nothing of ours to work from and you get something plausible and generic,
because that is all the information it has.

**And when I did get it working, it worked for one person.** Getting AI to build inside our system
took a repo, a terminal, git and a working knowledge of how an agent reads a codebase. None of that
is a designer's job. AI that makes one designer faster while the other six wait for them, or queue
to have their idea built, isn't a gain for a team. It's a bottleneck with a demo.

The first two problems are about what the AI has to work with. The third is about who gets to use
it. The lab had to solve all three, and the third turned out to be most of the work.

---

## The foundation: something true for the AI to build with

The first job was giving the agent our system instead of its guesses. Rayo ships on iOS and
Android, and iOS has no browsable component gallery: SwiftUI previews live in Xcode, which is not a
place a designer goes. So I mirrored the iOS design system in React, extracting it from the Swift
source with Claude Code - colours from the asset catalogue, spacing and radius constants, type,
and each component's variants, states and animation timings from its own file.

A library tells an agent which components exist. It doesn't tell it which one is the wrong choice
for the screen in front of it, so each component ships a contract beside it: a Markdown file next to
the code - use when, don't use when, content rules, anti-patterns - and where the two disagree, the
Markdown wins. None of that was written down anywhere before. It lived in designers' heads and in
review comments, and it's exactly what an agent needs, because an agent doesn't hedge and doesn't
ask.

_[Figure: Button.md excerpt - keep.]_

The system has a test. Open a fresh agent session with no history, give it one prompt - build a
list screen for a piece of locked content - and audit what comes back. Right components? Tokens
throughout? Locked state as the pattern describes? Both themes? Every failure is a documentation
bug, not a model failure: find the missing rule, write it into the contract, run it again. That
rule turned out to apply to people as much as agents, and it comes back later.

The last piece of the foundation was Pages. Once the team was exploring, the ideas were good but the
screens they sat on drifted: every prototype that touched an existing screen rebuilt it first, and
every rebuild lost something. Five prototypes ended up with a nav bar 20 points taller than the
app's because there was no correct version anywhere to copy. So the lab grew a second portal,
Production: every screen in the app rebuilt as it is, from the reference designs and the iOS
source, on iPhone, iPad and Android, with its states and its source named, and not allowed to
improve the screen even where the screen is wrong. A prototype now starts from a Page rather than
redrawing it, so what differs between directions is the idea, not the screen underneath.

_[Figure: the For you tab as a Page - keep.]_

---

## Then it became a place to explore

In code a state is a prop, not another screen, and that single difference is what makes exploring
several directions across all their states affordable at all. So the lab grew a prototype harness,
built around the argument rather than the screen.

Each exploration has two sets of controls. One switches between the design options; the other
switches the state: offline, error, loading, locked. They look different on purpose, because they
aren't the same kind of choice, and any option can be seen in any state, which is the thing a
static mockup can't do. Compare puts every option on screen at once, as a table of options against
states.

_[Figure: the harness - new shot, Bauer chrome, options bar.]_

Each option carries a bet: what it's good for and what it costs, written next to it. Not a
description of the layout - an argument, with the trade-off named and measured where it can be.
Options that lost keep their place with the reason written beside them, because it's much easier to
agree that something is too loud once you can see it, and easier still not to have the same
argument again in three months.

Every prototype also carries two lists. **Needs a system decision** collects the gaps the
exploration ran into; **Still unverified** lists everything in the screen we made up. Both are part
of the work rather than an appendix to it. A prototype that hides what it guessed is worse than one
that stops and asks.

### The states we'd have got to last

This is where it stopped being only a faster way to do the same work. Downloading a podcast has a state
most download UIs skip: the listener taps download on mobile data, with mobile-data downloads
switched off, and nothing happens. The control ended up with six states rather than the obvious
four, and the waiting state is the one that generates the support ticket, because no screen says
why nothing happened. The other was storage - how much room downloads are taking and how much is
left - which a list of episodes cannot answer, and which carried weight in where the feature
landed.

_[Figure: download control states - keep.]_

I don't read that as the model being clever. The house rules in the repo say build the unhappy
states, and the design doc says a screen isn't finished until loading, empty, error and locked all
exist. A rule I'd written got applied further than I'd applied it myself, because state exploration
is tedious, so humans do it last and under time pressure. Write the intent down properly and it
holds you to it too.

---

## Making it usable by someone who has never written code

Everything above worked, for me. The people it was for are designers who have never opened
Terminal, don't know what a branch is, and shouldn't have to. Most of the work since has been
re-designing the process for them, and the test was simple: could someone set up and build their
first prototype without me in the room?

### The whole workflow is four commands

I cut the process down to what a designer actually does, and made each step one command Claude
knows how to run: **/start** opens the lab, gets everyone's latest work and puts you on your own
branch, naming it for you; **/new-prototype** takes the brief; **/save** commits and pushes;
**/submit** checks the build and opens the pull request, with the description written from the
prototype itself. Git still happens. The designer never types it. Each command is a skill in the
repo - a written playbook Claude follows - so the process is the same for everyone, and when a step
tripped someone, the fix goes in the playbook and nobody hits it again.

### Briefing it like a designer, not prompting it like an engineer

The command that matters most is the one that builds. Getting a good result out of an agent used to
mean knowing what to ask for, which is its own expertise and the one I least wanted the team to
need. So **/new-prototype** asks instead. Type an idea in a sentence - or paste the whole brief, and
it takes every answer the brief already gives - and it comes back with at most two rounds of
multiple-choice questions: three readings of the idea, from one close to your words to two that take
it somewhere you didn't say, with "suggest bolder ones" as a fourth; where in the app someone would
meet it; which screen it starts from. Then it sketches each direction as one key screen, side by
side in Compare, and stops. Only the direction you pick gets built out, in every state, with what
was dropped written into the notes. "Just build it" skips the questions and takes the recommended
answers, and you still see the sketches and choose.

That order is the point. Building three directions across five states when two get dropped on
first sight is where the time and the tokens went. Sketch first, react, then build.

### A Guide that does the typing

The lab carries its own Guide, written for someone who has never opened Terminal. It started as a
manual: eleven chapters, read top to bottom, that told you what to type. It's now a workflow: a one-time setup, then the four steps drawn as a stepper across the top
of every page, so you always know which one you're on.

What changed most is that it stopped asking people to type. Every step has a **Copy** button for
the exact command, because retyping a command is where a branch name gets mistyped, and an **Open in
Claude** button that opens the Claude app with the prompt already in the box and the lab folder
already chosen. Setup is two downloads and one button: click it, and Claude installs what's missing,
clones the lab and opens it, and tells you in a sentence if anything stops. When something goes
wrong, a **Message Alex on Teams** button opens a chat with the message already drafted - which step
you were on, and a space to paste what Claude said - so asking for help costs one click rather than
working out how to describe the problem.

_[Figure: the Guide's Build step - stepper, the /new-prototype prompt with Copy and Open in Claude.]_

The details are where people actually get stuck, so that's where most of the writing went. It
works on a Windows laptop as well as a Mac and needs no administrator password, because not
everyone has one. There's a chapter for the words you'll hear, in plain English, one for looking at
someone else's work, and one for when something goes wrong. The Guide ends with a rule for itself:
if a step tripped you, it will trip the next person, and the fix belongs on the page. It's the
cold-start test again, pointed at people instead of an agent.

### You can't break it, and that's enforced

The line in the Guide that does the most work is near the top: you can't break it. For someone who
has never used git, knowing that matters more than any instruction. So it isn't a promise, it's
built in. Everyone works on their own branch, and nothing reaches the published lab until it's been
reviewed. Claude itself is fenced: a hook in the repo stops it from touching anything platform-owned
- tokens, components, Production screens, the rules it reads - without asking first, and refuses to
hand-edit generated files at all. The build fails on a literal colour or font, so a prototype can't
quietly drift off-system. And the agent's instructions were cut down to only what a prototype author
needs; everything about maintaining the platform moved out of its way.

Approval was the other bottleneck. Every pull request needs one approval and a passing build, and
the rule is that any designer's approval merges an exploration; only the foundations every prototype
sits on need mine, because a change there quietly moves everyone else's screens. In practice the
reviews have all been mine so far - the team is building, and reviewing each other is the next
habit to form. Merging publishes the lab internally, so an exploration is a link you send, never an
export, and never out of date because it is the repo.

_[Diagram: from a blank Mac to the whole team - keep, update step 5 wording.]_

---

## Designing the lab itself

A lab is somewhere you try things, not somewhere you file them, and I wanted it to feel like that
rather than like a documentation site. Prototypes is the front door; Production, Components, Icons
and the Guide are one click away; moving between prototypes never sends you back to an index; and
⌘K searches everything at once, locally, with no model behind it, and says so.

The lab's own look is no longer mine. Bauer's AI team built a design system for the tools Bauer's
teams are vibe-coding - BauerMedia Sans, their glass and aurora, a light and a dark theme, a full
component set and a usage guide written for agents - and the lab now wears it, like every other tool
in that family. I had no part in building it, and adopting it was the right call for the same reason
the lab exists: a tool that looks like one of the family is one people already know how to read, and
a system someone else maintains is one I don't have to. The chrome was rebuilt on their navigation,
badges, buttons, menus and tooltips, layout for layout, and checked across all 147 routes in both
themes.

The one rule the whole thing is built on survived the change, reworded: **the chrome is Bauer's,
the screen under review is Rayo's.** Their system stops dead at the edge of the phone frame. Their
reset and their utility classes are scoped so they can't reach a Rayo surface, because a screen
reviewed through someone else's styles is not the screen that ships. Light and dark for the lab is a
switch in the header; light and dark for the Rayo screen is a switch above the frame, and the two
are independent.

The layout changed around the frame too. The options used to live in a 420-pixel column beside
it, which was fine for a phone and wrong for everything wider: on a 14-inch laptop the widest frame
got 22% of the screen, with half the stage empty under the column. Now the options are one bar over
the frame - the title, the prototype's own switchers as menus, the view controls at the end - and
the frame takes the width back: the same frame goes from under a third of a laptop window to three
quarters, an iPad in landscape from 55% to 90% of its real size. A phone pays about 8% of its
height for it, which is the right trade: the switchers are on screen whatever you're working on,
and the thing you're looking at is as big as the window allows.

_[Figure: before/after of the options panel - column beside the frame vs bar over it. Draw it as a
wireframe diagram with the numbers rather than screenshots, since the before shots all carry web
pages.]_ And the chrome moves the way the product does: the
options bar glides to its new place as you change screen, with any control the new screen adds
growing in where it lands; the view controls merge into one when the window narrows and split back
out when it widens; the theme switch previews the other theme in a small circle on hover, then
spreads from the button when you click. None of it is decoration for its own sake. A tool for
judging motion and state should feel like something that was designed, not generated.

_[Figure: ⌘K / the options bar in Bauer's chrome - new shot.]_

---

## Where the team is with it

Everyone on the team has set up from the Guide, without a session with me, and the buttons get
used: the setup that opens Claude with the message typed, and the Teams one when something stops.
The team is building in it. The first prototype through the sketch-first flow is an
offline-listening exploration: four directions sketched, three built out across the whole journey,
with the fourth and the reason it was dropped written into the notes.

It's also finding what the design system is missing faster than one person reading it could. The
gap lists became a channel: an exploration hits a gap, names it in the frame, and the system grows.
Gradient tokens exist because a paywall prototype asked for them. The audit file now runs to twelve
sections, and the later ones are all things found by using the system - no motion, elevation or
blur primitives; a secondary text colour that doesn't survive a tint; a button with no nav-bar size.

_[Diagram: a gap list is a feedback channel - keep.]_

---

## What's next

**Reviewing each other.** The rule is live; the habit isn't yet. The next thing I'm watching for is
an exploration merged on another designer's approval, not mine.

**Designing together.** Designing with AI is still a solo activity. Sharing the result is solved - a
prototype is a link - but the session where the options get generated happens between one designer
and one agent, and the feedback happens somewhere else, detached from the thing it's about. There's
nowhere to pin a comment to the exact state you disagree with, and no way to pick up a colleague's
direction and take it somewhere new. The bets and gap lists were a first step towards the argument
living inside the work. The next is making room for other people's arguments there too.

**Beyond the design team.** Anyone who can describe a screen can now get a real one built from the
real system: an engineer sketching a feature, a product manager putting an idea in front of people
instead of describing it. The platform is open to them; whether they take it up is the interesting
question.

**Real listeners.** Everything so far has been for internal decisions. A prototype made of the real
system with its states already built is most of the way to being testable; the form that takes
isn't decided yet.

---

## Outcome

The team works in it. Making a prototype is faster - the days spent drawing and linking screens in
Figma are gone - and that's the speed that matters here, because it's the cost that used to keep
exploration narrow. We can now see many ways of doing the same thing side by side, each with its
argument and its cost attached, before anyone commits. The downloads work ran through three
destinations for where downloaded episodes should live, and the one we took forward won on grounds
the exploration made visible.

What I'd take from it is more specific than "AI makes design faster". The models were never the
constraint. The constraint was that they had nothing of ours to build with, and then that only one
of us could use them. Give an agent the actual system and the rules that go with it, and the work
it produces is something you can decide from. Then take yourself out of the loop - the Guide, the
commands, the guardrails, the baseline everyone builds on - and it's something the whole team can
decide from.

Faster to prototype, so more of us explore more of the options before we choose.
