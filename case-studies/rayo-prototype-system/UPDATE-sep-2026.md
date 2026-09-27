# Rayo Design Lab - September update

Changes against the live page (published 7 Sep). Everything not listed here stays as it is.
All checks from the first pass are resolved.

---

## 1. Impact - rewrite the first item

The live version already claims this, but on 7 Sep it wasn't really true yet. Pages is what makes it true.

### 💡 New ideas land inside the product, not beside it

The lab keeps the app’s own screens as they actually are, so a new idea gets designed into the real screen rather than generated as a fresh page of invented parts. That’s the difference between reviewing a change to the product and reviewing something that merely resembles it.

---

## 2. "It started as the Storybook iOS can’t have" - add after the second paragraph

The icons are in there too: the full set, browsable and grouped by what each one is for, including the handful the app only ships as images and so have no component at all.

---

## 3. NEW SECTION - place after "The states we’d have got to last", before "It finds what the system is missing"

## Ideas need something true to start from

Once the team was exploring in it, a different problem showed up. The ideas were good, but the screens they sat on drifted. Every prototype that touched an existing screen rebuilt it first, from memory or from another prototype, and every rebuild lost something. The podcast show page was rebuilt three separate times, and five prototypes ended up with a nav bar 20 points taller than the app’s, because there was no correct version anywhere to copy. An idea shown on a screen that isn’t quite the app has the same problem as AI with nothing of ours to work from: you end up arguing about the difference rather than the idea.

So the lab grew a second portal, Pages: the production screens rebuilt as they are, from the reference designs and the iOS source. It now covers close to every screen in the app, tab by tab, plus settings, the premium flow and login.

A Page plays by different rules from a prototype. It answers no question, so it has states but no options. It has to name its source, so anyone can check it against the thing it claims to be. And it isn’t allowed to improve the screen, even where the screen is wrong, because a baseline that quietly fixes things can’t tell you which parts are the product.

The Pages link up the way the app does. You can tap from the Podcasts tab into a show, into an episode and back, or from a Go Premium prompt through sign-up to the congrats screen and back to where you started. The content is Rayo’s real catalogue, so a show has the same publisher on every screen you find it on.

A prototype now starts from the Pages rather than redrawing them. The first one built this way explores five ways to hand Hits Radio app listeners over to Rayo, and it doesn’t copy the screens it touches: it uses the Pages themselves, so a fix to a Page reaches every prototype built on it. What differs between the directions is the idea, not the screen underneath it.

A Page is also the strictest audit the design system gets, because it’s the only thing in the lab that isn’t allowed to design around a gap. Every missing token or component turns up in its notes.

---

## 4. "Designing the lab itself" - replace the second paragraph

Prototypes is what people open the lab for, so it’s the front door, with Pages, Components and Icons one click away in the top bar. Moving between prototypes doesn’t send you back to an index either. You go straight from one to the next, which is what makes comparing them quick. And ⌘K searches everything at once. It runs locally, with no model behind it, and the panel says so, because a search box shaped like a prompt that could only match text would be lying about what the tool does.

**Then add, straight after it:**

Prototypes and Pages each open on a feed of what’s changed, because a lab that changes most days is only useful if people can tell what’s new. Half of it writes itself: when the site builds, it reads its own git history and works out which prototype, page or component each change touched, so the feed says what moved rather than repeating a commit message. The other half is a written note, for the changes that deserve a headline, saying what to go and look at. Anything new since your last visit is marked.

---

## 5. What’s next - new lead item, above the others

**Designing with AI is a solo activity, and it shouldn’t be.** It’s a question design leaders raised at an AI conference I went to recently, and I agree with them. Sharing the result is solved: a prototype is a link you can send to anyone. Working on it together isn’t. The session where the options get generated happens between one designer and one agent, and the feedback happens somewhere else, in a message thread, detached from the thing it’s about. There’s nowhere to pin a comment to the exact state you disagree with, the way you would in Figma, and no way to pick up another designer’s direction and take it somewhere new. The bets and the gap lists were a first step towards the argument living inside the work. The next is making room for other people’s arguments there too, designers first, then engineering and product. That’s what I’m exploring next.

**Then revise the fidelity item, since Pages changes it:**

**Handoff annotations.** Pages closed the fidelity gap for screens that already exist. What’s still missing is annotations, so for now this is a system for exploring and deciding internally, not for handing over.

Android is removed; user testing stays as it is.

---

## 6. Images (all 1512x860, in src/assets/images/rayo-design-lab/)

- `rayo-design-lab-current-v2.png` replaces `IMG_NOW` in the before/after toggle.
- `rayo-design-lab-search-v2.png` replaces `IMG_SEARCH` in "Designing the lab itself".
- `rayo-design-lab-pages.png` - new, in "Ideas need something true to start from", after the paragraph on what a Page is.
- `rayo-design-lab-handover.png` - new, same section, after the paragraph on the first prototype built from Pages. Option E, Signed in step: the Welcome Page's presenter carousel with the new sign-in on top.

## 7. Housekeeping

- `scripts/case-studies.config.js`: bump `dateModified`, regenerate `content` from the card, and consider adding to `summary`: "...and starts from faithful rebuilds of the app’s own screens."
- Rebuild with `BUILD_VERSION=<committed sha> node scripts/build-case-study-pages.js`.
- A Pages screenshot would help the new section. Pages are existing production screens, so they don’t carry the confidentiality problem the downloads prototypes do - but avoid any Page whose content is unreleased.
