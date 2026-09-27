import { defineComponent, h, ref } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'

const VIDEO_SRC = '/src/assets/videos/rayo-alexa.mp4'

// ── Image assets ──
const IMG_SKILL           = '/src/assets/images/rayo/alexa/rayo-alexa-skill.png'
const IMG_JOURNEY_MAP     = '/src/assets/images/rayo/alexa/user-journey-mapping.png'
const IMG_INTERACTION     = '/src/assets/images/rayo/alexa/interaction-model-documentation.png'
const IMG_VOICEFLOW       = '/src/assets/images/rayo/alexa/voiceflow-open-rayo.png'
const IMG_ACCOUNT_LINKING = '/src/assets/images/rayo/alexa/account-linking-screen.png'
const IMG_ACCOUNT_LINK_1  = '/src/assets/images/rayo/alexa/rayo-account-link-1.png'
const IMG_ACCOUNT_LINK_2  = '/src/assets/images/rayo/alexa/rayo-account-link-2.png'
const IMG_ACCOUNT_LINK_3  = '/src/assets/images/rayo/alexa/rayo-account-link-3.png'
const IMG_SUPPORT         = '/src/assets/images/rayo/alexa/support-page.png'
const IMG_CONTINUE        = '/src/assets/images/rayo/alexa/alexa-rayo-continue-listening.png'

// ── Rayo app smart speaker settings, the four states ──
// Each state ships a light and a dark screenshot; CSS swaps them with the theme.
const SHOT = name => `/src/assets/images/rayo/alexa/${name}.png`

const APP_STATES = [
  { name: 'rayo-settings-mockup',                   cap: 'Settings'     },
  { name: 'rayo-settings-smartspeaker-notlinked',   cap: 'Not linked'   },
  { name: 'rayo-settings-smartspeaker-linkpending', cap: 'Link pending' },
  { name: 'rayo-settings-smartspeaker-linked',      cap: 'Linked'       },
]

// ── Review card data ──
const REVIEWS = [
  {
    title: 'DON\u2019T BOTHER',
    body: 'Doesn\u2019t work you still get adverts, just connect to the speaker via bluetooth and play from phone',
  },
  {
    title: 'Will not link',
    body: 'Get fed up asking to link account. When inked it still asks to be linked or are you having issues ask Rayo to link account again',
  },
  {
    title: 'Link to Rayo doesn\u2019t work',
    body: 'I have my alarm set to a Rayo station and EVERY morning I wake to instructions on how to link Rayo to my account which DOES NOT WORK. Sort it out! No idea if this is an Alexa or a Rayo problem \u2014 both say it\u2019s the other and neither can fix it.',
  },
  {
    title: 'Link account',
    body: 'I can\u2019t link my Planet Rock account. All i get is Alexa saying its not sure how to do this. Im paying for a service i can\u2019t get',
  },
  {
    title: 'It doesn\u2019t work',
    body: 'I have Rayo premium but am still getting adverts on my Alexa and cannot listen to amy premium stations despite linking the account',
  },
  {
    title: 'I am paying for premium but still getting adverts',
    body: 'Every time I log in to a Rayo station I get an extensive advert even though I\u2019m paying for premium. Rayo don\u2019t do anything but ask me questions, seem uninterested in fixing the problem',
  },
]

const STAR_FILLED = '\u2605'
const STAR_EMPTY  = '\u2606'

function renderReviewCard(review) {
  return h('div', { class: 'cs-review-card' }, [
    h('div', { class: 'cs-review-stars' }, STAR_FILLED + STAR_EMPTY.repeat(4)),
    h('p', { class: 'cs-review-title' }, review.title),
    h('p', { class: 'cs-review-body' }, review.body),
  ])
}

const ReviewMarquee = defineComponent({
  name: 'ReviewMarquee',
  setup() {
    return () =>
      h('div', { class: 'cs-review-marquee' }, [
        h('div', { class: 'cs-review-track' }, [
          // Two copies for seamless loop
          ...[0, 1].map(copy =>
            h('div', { key: copy, class: 'cs-review-set', 'aria-hidden': copy === 1 ? 'true' : undefined },
              REVIEWS.map((review, i) => renderReviewCard(review, i))
            )
          ),
        ]),
      ])
  },
})

// ══════════════════════════════════════════════════════════════════
// ── Drawn figures ──
// Rebuilt from the interview deck in the site's own type and tokens,
// so they stay crisp, responsive and readable in both themes.
// ══════════════════════════════════════════════════════════════════

// ── Five problems, two causes ──
const REPORTED = [
  { label: 'Premium users hearing adverts' },
  { label: 'Account linking fails' },
  { label: 'Premium features not working' },
  { label: 'Access to premium stations' },
  { label: 'Playback and streaming drops', control: true },
]

function renderDiagnosis() {
  return h('div', { class: 'alx-fig' }, [
    h('div', { class: 'alx-diag' }, [
      h('div', { class: 'alx-diag-col' }, [
        h('p', { class: 'alx-label' }, 'What customer success reported'),
        h('div', { class: 'alx-chip-list' },
          REPORTED.map(r =>
            h('div', { class: ['alx-chip', r.control ? 'alx-chip--control' : ''].filter(Boolean).join(' ') }, r.label))
        ),
      ]),
      h('div', { class: 'alx-diag-col' }, [
        h('p', { class: 'alx-label' }, 'What was actually happening'),
        h('div', { class: 'alx-cause' }, [
          h('span', { class: 'alx-cause-count' }, '4 of the 5'),
          h('p', { class: 'alx-card-title' }, 'Account linking was not holding'),
          h('p', { class: 'alx-note' },
            'Permission, OAuth tokens and Amazon\u2019s own record could all disagree. Nothing owned the truth, so the product reported \u201Clinked\u201D when it was not, and every benefit that depends on the link failed with it.'),
        ]),
        h('div', { class: 'alx-cause alx-cause--control' }, [
          h('span', { class: 'alx-cause-count' }, 'The fifth'),
          h('p', { class: 'alx-card-title' }, 'A separate streaming fault'),
          h('p', { class: 'alx-note' },
            'Nothing to do with linking, and the one theme I predicted would not move.'),
        ]),
      ]),
    ]),
  ])
}

// ── Seven paths into one ──
const ROUTES_BEFORE = [
  { label: 'Alexa app', end: 'the only reliable one', ok: true },
  { label: 'Alexa voice' },
  { label: 'Alexa QR code' },
  { label: 'iOS legacy brand apps' },
  { label: 'Android legacy brand apps' },
  { label: 'Amazon web' },
  { label: 'Rayo web' },
]

const LINK_STEPS = ['Sign in', 'Link', 'Agree', 'Done']

function renderPaths() {
  return h('div', { class: 'alx-fig' }, [
    h('div', { class: 'alx-paths' }, [
      h('div', { class: 'alx-paths-col' }, [
        h('p', { class: 'alx-label' }, 'Before · seven routes'),
        h('div', null,
          ROUTES_BEFORE.map(r =>
            h('div', { class: ['alx-route', r.ok ? 'alx-route--ok' : ''].filter(Boolean).join(' ') }, [
              h('span', null, r.label),
              r.end ? h('span', { class: 'alx-route-end' }, r.end) : null,
            ]))
        ),
      ]),
      h('div', { class: 'alx-paths-col' }, [
        h('p', { class: 'alx-label' }, 'After · one route'),
        h('div', { class: 'alx-route alx-route--ok' }, [
          h('span', null, 'Deep link into the Alexa app'),
          h('span', { class: 'alx-route-end' }, 'all seven'),
        ]),
        h('div', { class: 'alx-steps' },
          LINK_STEPS.map(s => h('div', { class: 'alx-step' }, s))
        ),
        h('p', { class: 'alx-note', style: 'margin-top:14px' },
          'Rayo owns two screens inside this flow. The rest of it is Amazon\u2019s, and so is the last step of every other route - which is why adding routes only adds places to fail.'),
      ]),
    ]),
  ])
}

// ── Four decisions ──
const DECISIONS = [
  {
    fork: 'Where linking happens',
    options: 'Fix the buggy in-app routes / keep several routes and improve them all / hand off to the Alexa app',
    chose: 'Hand off to the Alexa app',
    cost: 'Cost: a branded handoff Rayo does not control',
  },
  {
    fork: 'The old invocation',
    options: '\u201CAlexa, open Planet Radio\u201D: retire at launch / keep temporarily / keep indefinitely',
    chose: 'Kept indefinitely',
    cost: 'Cost: two invocation names to maintain. Listeners with a decade-old habit should not have to relearn it',
  },
  {
    fork: 'The rebrand message',
    options: '\u201CThis is Rayo, the new name for Planet Radio\u201D: none / permanent / time-boxed',
    chose: 'Time-boxed to three months',
    cost: 'Cost: every session slowed for three months, on a surface whose whole value is speed to audio',
  },
  {
    fork: 'Making linking worth doing',
    options: 'No incentive / premium discount / gate a feature people already have / build a new feature and gate it',
    chose: 'Continue Listening, new and only for linked accounts',
    cost: 'Cost: engineering time on a feature whose only job was to justify a different feature',
  },
]

function renderDecisions() {
  return h('div', { class: 'alx-fig' }, [
    h('table', { class: 'alx-table' }, [
      h('thead', null, [
        h('tr', null, [
          h('th', null, 'The fork'),
          h('th', null, 'Options considered'),
          h('th', null, 'What I chose, and gave up'),
        ]),
      ]),
      h('tbody', null,
        DECISIONS.map(d =>
          h('tr', null, [
            h('td', { class: 'alx-fork' }, d.fork),
            h('td', { class: 'alx-options' }, d.options),
            h('td', null, [
              h('span', { class: 'alx-chose' }, d.chose),
              h('span', { class: 'alx-cost' }, d.cost),
            ]),
          ]))
      ),
    ]),
  ])
}

// ── Three surfaces ──
const STAGES = [
  { owner: 'Rayo', surface: 'Voice', title: 'Ask', quote: '\u201CAlexa, ask Rayo to link my accounts\u201D' },
  { owner: 'Rayo', surface: 'Voice', title: 'Three checks',
    note: 'Is the Alexa app installed? One profile or a household? Notifications on, off, or never set?' },
  { owner: 'Amazon', surface: 'System', title: 'Send the link',
    note: 'The wording changes with a notification permission Rayo does not control.' },
  { owner: 'Amazon', surface: 'Phone', title: 'Link in the Alexa app',
    note: 'Sign in with a Rayo account, agree, done.' },
  { owner: 'Rayo', surface: 'Voice', title: 'Every exit', quote: '\u201CAlexa, ask Rayo if I am account linked\u201D' },
]

function renderSurfaces() {
  return h('div', { class: 'alx-fig' }, [
    h('p', { class: 'alx-label' }, 'Who owns each step'),
    h('div', { class: 'alx-surfaces' },
      STAGES.map(s =>
        h('div', { class: 'alx-stage' }, [
          h('span', {
            class: ['alx-stage-owner', s.owner === 'Amazon' ? 'alx-stage-owner--theirs' : ''].filter(Boolean).join(' '),
          }, s.owner),
          h('p', { class: 'alx-card-title' }, s.title),
          h('p', { class: 'alx-note' }, s.surface),
          s.quote ? h('p', { class: 'alx-stage-quote' }, s.quote) : null,
          s.note ? h('p', { class: 'alx-note' }, s.note) : null,
        ]))
    ),
  ])
}

// ── Change in monthly tickets, 2024 to 2025 ──
const TICKETS = [
  { name: 'Account linking',     sub: '14 → 4 a month',   pct: -71 },
  { name: 'Hearing adverts',     sub: '185 → 56 a month', pct: -70 },
  { name: 'Billing',             sub: '75 → 26 a month',  pct: -66 },
  { name: 'Voucher',             sub: '9 → 4 a month',    pct: -58 },
  { name: 'General',             sub: '41 → 21 a month',  pct: -49 },
  { name: 'Account',             sub: '20 → 10 a month',  pct: -49 },
  { name: 'Cancel subscription', sub: '76 → 42 a month',  pct: -45 },
  { name: 'Streaming',           sub: '22 → 22 a month',  pct: 2, control: true },
]

function renderTicketChart() {
  return h('div', { class: 'alx-fig' }, [
    h('p', { class: 'alx-label' },
      'Change in monthly tickets, 2024 to 2025'),
    h('div', { class: 'alx-chart' },
      TICKETS.map(t =>
        h('div', { class: 'alx-bar-row' }, [
          h('div', { class: 'alx-bar-name' }, [
            t.name,
            h('span', { class: 'alx-bar-sub' }, t.sub),
          ]),
          h('div', { class: 'alx-bar-track' }, [
            h('div', {
              class: ['alx-bar', t.control ? 'alx-bar--control' : ''].filter(Boolean).join(' '),
              style: `width: ${Math.max(Math.abs(t.pct) / 75 * 100, 1.2)}%`,
            }),
          ]),
          h('div', {
            class: ['alx-bar-val', t.control ? 'alx-bar-val--control' : ''].filter(Boolean).join(' '),
          }, `${t.pct > 0 ? '+' : '−'}${Math.abs(t.pct)}%`),
        ]))
    ),
  ])
}

export default defineComponent({
  name: 'AlexaCard',
  setup() {
    const tldr = ref(false)

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'alexa',
        cardClass: 'alexa-card',
        videoSrc: VIDEO_SRC,
        videoClass: 'alexa-video',
        tooltip: 'Improve the voice UX of\nthe Rayo skill in Alexa 🗣️',
        heroSize: 448,
      }, {
        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          // ══════════════════════════════════════════════
          // ── Title, intro, role, impact ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Bringing Design to a Team That Had Never Had a Designer'),

            full(
              h('p', { class: 'cs-body-text' },
                'Rayo is Bauer Media\u2019s audio app - live radio across the station brands, plus catch-up and podcasts, on mobile, web, car and smart speaker. Its Alexa skill had been shipping for years with no designer: no documented flows, no design files, and everything about how it worked living in the PO\u2019s and the lead developer\u2019s heads.'),

              h('p', { class: 'cs-body-text' },
                'After helping take the Rayo app from beta to launch, I volunteered to move to the Voice and Connected Device team as its first designer, alongside a developer and a QA who joined at the same time. What follows is the evidence I started from, the diagnosis that set the team\u2019s priority, the decisions I made and what they cost, and what two years of support data can and cannot tell you about the result.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Sole designer'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '🎧 The biggest complaint theme fell and stayed down'),
            full(
              h('p', { class: 'cs-body-text' },
                'Premium listeners hearing adverts was the largest ticket theme and the one most directly downstream of broken linking: 753 tickets in January 2024, 54 in January 2025, and a monthly average that went from 185 to 56 and held there for two years. Other teams were improving the premium experience over the same period, so I do not claim that fall as mine alone - what the data does and does not support is set out below.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🔀 Seven ways to link became one'),
            full(
              h('p', { class: 'cs-body-text' },
                'Seven linking routes, each with its own bugs and no consistent logic between them, converged on a single path through the Alexa app using Amazon\u2019s app-to-app pattern. Six help centre articles were rebuilt around the three themes the diagnosis had identified.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🧩 A source of truth the team could run'),
            full(
              h('p', { class: 'cs-body-text' },
                'I rebuilt the skill in Voiceflow: every intent, its conditions, synonym variations and error states. Developers built new features from it and QA tested against it, so it stopped being my documentation and became the team\u2019s spec. And because the journeys were mapped in full, it runs - you can talk to it and it answers, close to the live skill.'),
            ),

            h('div', { class: 'cs-stat-row' }, [
              h('div', { class: 'cs-stat-item' }, [
                h('p', { class: 'cs-stat-num' }, '753 → 54'),
                h('p', { class: 'cs-stat-lbl' }, 'Hearing-adverts tickets, January 2024 against January 2025'),
              ]),
              h('div', { class: 'cs-stat-item' }, [
                h('p', { class: 'cs-stat-num' }, '185 → 56'),
                h('p', { class: 'cs-stat-lbl' }, 'Monthly average on that theme, and it held for two years'),
              ]),
              h('div', { class: 'cs-stat-item' }, [
                h('p', { class: 'cs-stat-num' }, '+2%'),
                h('p', { class: 'cs-stat-lbl' }, 'Streaming - the one theme I said was unrelated, and the only one that did not fall'),
              ]),
            ]),
          ]),

          // ── Skill image ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_SKILL,
            alt: 'Rayo skill homepage on an Alexa device with a screen',
          }),
          h('p', { class: 'cs-hint' }, 'Rayo skill homepage on an Alexa device with a screen'),

          // ══════════════════════════════════════════════
          // ── What I inherited ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What I inherited'),

            h('p', { class: 'cs-body-text' },
              'Seven different ways to link a Rayo account to Alexa. Six help centre articles explaining them. Zero documented flows, and no shared source of truth for how any of it worked.'),

            h('h3', { class: 'cs-subsection-title' }, 'A product that reported success it had not achieved'),
            full(
              h('p', { class: 'cs-body-text' },
                'The app says you are linked. Alexa confirms you are a premium member. You still hear adverts. You unlink, and nothing actually unlinks - permission is revoked but the OAuth tokens stay alive, so the state is wrong in a new way. You re-link to fix it, and it happens again.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'Silent failures throughout'),
            full(
              h('p', { class: 'cs-body-text' },
                'Nothing ever told anyone that something had gone wrong. On a screenless device there is nowhere to look and nothing to read, so a listener could not tell a broken link from a broken app from a broken subscription. Neither could customer service.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'And a public record of it'),
            full(
              h('p', { class: 'cs-body-text' },
                'Most of the reviews on the skill store were one star, and most of them were about the same thing.'),
            ),
          ]),

          // ── Review cards marquee ──
          h(ReviewMarquee),
          h('p', { class: 'cs-hint' }, 'One star reviews from the Alexa skill store'),

          // ══════════════════════════════════════════════
          // ── The audit ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'The audit'),

            h('h3', { class: 'cs-subsection-title' }, 'I started by failing the way a new user fails'),
            full(
              h('p', { class: 'cs-body-text' },
                'I had never used an Alexa device. I bought an Echo Dot and an Echo Show, set them both up with no help from the team, and documented every step from first power-on through finding the skill, exploring content and playing a specific show. Before I could judge the experience I had to be able to describe it.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_JOURNEY_MAP,
            alt: 'Journey mapping on a Miro board',
          }),
          h('p', { class: 'cs-hint' }, 'Journey mapping on a Miro board'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'What the skill could actually hear'),
            full(
              h('p', { class: 'cs-body-text' },
                'Alexa skills were not conversational at this point - this predates Alexa+. The skill only responded to word-perfect utterances built for each intent. Anything else failed, silently, on a device with nowhere to show you why.'),

              h('p', { class: 'cs-body-text' },
                'I asked the lead developer for the interaction model JSON and went through it with him to understand how it was structured, then pulled it apart and documented every intent, utterance and synonym in Confluence. It stopped being something only one person could answer.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_INTERACTION,
            alt: 'Interaction model documentation',
          }),
          h('p', { class: 'cs-hint' }, 'Interaction model documentation'),

          // ══════════════════════════════════════════════
          // ── The diagnosis ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Five problems, two causes'),

            full(
              h('p', { class: 'cs-body-text' },
                'There was no research platform at Bauer yet - UserTesting and UserZoom only arrived after this shipped - so I went to customer service and asked what people were actually contacting us about. They pulled three months of contacts, the skill store reviews and the premium cancellation survey. Smart speaker problems were a recurring theme in support, the store listing was dominated by one star reviews, and a meaningful share of people cancelling premium said they could not use it on their device.'),
            ),

            h('p', { class: 'cs-body-text' },
              'Four of the five most-reported issues were the same failure wearing different clothes. If the link state is wrong server-side the premium catalogue is not returned, so hearing adverts, losing premium features and losing premium stations are not three problems sitting next to a linking problem. They are the linking problem, described by the listener in the terms they experienced it.'),
          ]),

          renderDiagnosis(),
          h('p', { class: 'cs-hint' }, 'The five reported themes, and the two causes underneath them'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'I spotted the pattern in the ticket themes; the lead developer supplied the mechanism, which was that unlinking revoked permission without ever clearing the tokens. Joint diagnosis, not a solo one.'),

              h('p', { class: 'cs-body-text' },
                'I took the customer service report to our PO and made the case that account linking should be the team\u2019s first priority: four of the five biggest complaint themes traced to one cause, and it was hitting paying customers. It became the priority. That was the first time design had set the agenda on that team.'),
            ),
          ]),

          // ══════════════════════════════════════════════
          // ── Restructured journeys ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Restructured journeys'),

            h('h3', { class: 'cs-subsection-title' }, 'A source of truth that runs'),
            full(
              h('p', { class: 'cs-body-text' },
                'With no documentation and no design files, my first job was to make one. I rebuilt every intent in Voiceflow - intents are the voice equivalent of features - mirroring the real skill including its conditions, synonym variations and error states. Developers built new features from it and QA tested against it. Because the journeys were mapped in full it also runs: you can talk to it and it responds, close to the live skill, which is how I have used it for testing features designed since.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_VOICEFLOW,
            alt: 'Open Rayo user flow mapped in Voiceflow',
          }),
          h('p', { class: 'cs-hint' }, 'Open Rayo user flow mapped in Voiceflow'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Seven paths into one'),
            full(
              h('p', { class: 'cs-body-text' },
                'The root cause sat in the backend: Shepherd, our own system, could not communicate reliably with Amazon. I took the diagnosis to the backend team and asked whether the underlying problem could be fixed. They agreed with it and had no capacity - fair enough, they had just launched Rayo and were carrying the tech debt from it. So the question became what could be fixed inside my own team\u2019s control.'),

              h('p', { class: 'cs-body-text' },
                'That is what led to consolidating the routes rather than repairing them. The legacy brand apps had Amazon app-to-app linking built in, technically the most direct route and also the buggiest, and fixing it needed the backend work we did not have. Linking inside the Alexa app was the most stable and the simplest to explain: tap link, sign in with your Rayo account, agree, done.'),
            ),
          ]),

          renderPaths(),
          h('p', { class: 'cs-hint' }, 'Seven entry points, one reliable route'),

          // ── Account linking steps ──
          h('div', { class: 'cs-account-link-steps' }, [
            h('img', { class: 'cs-account-link-img cs-account-link-img--1', src: IMG_ACCOUNT_LINK_1, alt: 'Sign in to your Rayo account' }),
            h('img', { class: 'cs-account-link-img cs-account-link-img--2', src: IMG_ACCOUNT_LINK_2, alt: 'Confirm access to your account' }),
            h('img', { class: 'cs-account-link-img cs-account-link-img--3', src: IMG_ACCOUNT_LINK_3, alt: 'Rayo has been successfully linked' }),
          ]),
          h('p', { class: 'cs-hint' }, 'Account linking flow: sign in, confirm, success'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Four decisions, and what each one cost'),
            full(
              h('p', { class: 'cs-body-text' },
                'Linking was the priority, but the rebrand raised three more questions that had no obvious right answer. Each of these is a trade, and I would rather show what I gave up than pretend there was a free choice.'),
            ),
          ]),

          renderDecisions(),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'On the last one: gating something people already have is a takeaway. It would have generated exactly the support contacts this project existed to remove, and it punishes the unlinked rather than rewarding the linked. Building something new and putting it behind the link means nobody loses anything.'),

              h('p', { class: 'cs-body-text' },
                'On the three months: long enough that an occasional listener heard it a few times, short enough not to slow every session indefinitely. It was a judgement call discussed with the team, not a calculation. Looking back I would let the data end it rather than the calendar - watch the split between people saying \u201CRayo\u201D and people still saying \u201CPlanet Radio\u201D, and retire the message when that curve flattens.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'The flow runs across three surfaces'),
            full(
              h('p', { class: 'cs-body-text' },
                'What makes this different from designing a screen is that it does not live on one surface. It starts in voice, passes through Amazon\u2019s system layer, and finishes on the phone. Rayo owns neither the middle nor the end.'),
            ),
          ]),

          renderSurfaces(),
          h('p', { class: 'cs-hint' }, 'The linking journey, and which side of the partner boundary each step sits on'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'Three checks have to pass before anyone can be sent anywhere, and none of them are visible to the listener. If the device belongs to a household with several profiles the link can only go to the primary user, so there is an extra step to confirm that is what they want. And if notifications are on, Alexa says \u201CI\u2019ll send you a link\u201D; if they are off, it says you will find it in the Alexa app. Same flow, different words - honest about a permission Rayo does not control rather than promising something that will not arrive.'),

              h('p', { class: 'cs-body-text' },
                'Most of the estate has no display, so the Echo Dot path was designed as the complete journey. The Echo Show adds one option, the QR code. The screen is additive, never load-bearing.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'Every exit teaches the way out'),
            full(
              h('p', { class: 'cs-body-text' },
                'Good design lets someone feel in control, and on a phone that is easy: if you want to know whether you are linked, you open settings and look. On a voice device there is nothing to glance at. The only way to check is to ask, and that only works if you already know the exact words. So every exit in the flow, successful or failed, ends by teaching the utterance that checks it. If someone is stuck, the dead end should at least leave them with something they can use next time.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'Help where the problem is'),
            full(
              h('p', { class: 'cs-body-text' },
                'On the Echo Show, a Get help button opens the Rayo support page in Alexa\u2019s own browser, in situ rather than sending anyone away. The three articles surfaced there - linking, hearing adverts, premium stations - are the three themes from the diagnosis. I took those themes back to customer service and we rebuilt the help centre around them, so the guidance was prioritised by the same evidence as the design.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_ACCOUNT_LINKING,
            alt: 'Account linking screen on Echo Show',
          }),
          h('p', { class: 'cs-hint' }, 'Account linking screen on Echo Show'),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_SUPPORT,
            alt: 'Rayo Alexa help centre support page',
          }),
          h('p', { class: 'cs-hint' }, 'Rayo Alexa help centre support page'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Continue Listening, and the half I did not ship'),
            full(
              h('p', { class: 'cs-body-text' },
                'Everything above makes linking work. None of it makes linking worth doing. You scan a code, sign in, agree to a permission screen and land back in exactly the same experience. If you are premium there is a payoff. If you are not, it is pure cost, and the business wanted everyone linked.'),
            ),

            full(
              h('p', { class: 'cs-body-text' },
                'Continue Listening was my answer: ask Rayo to continue and it picks up whatever you had already started, with your listening history on the Echo Show home screen for linked users. What I originally designed was cross-device - you listen on the way home, you walk in, you ask Alexa to carry on. That is the version that makes linking worth doing, it needed backend work the team did not have, and it was scaled back to Alexa-only. What you start on the Echo, you continue on the Echo. That is what shipped.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_CONTINUE,
            alt: 'Continue listening feature on Alexa Echo Show',
          }),
          h('p', { class: 'cs-hint' }, 'Continue listening feature on Alexa Echo Show'),

          // ══════════════════════════════════════════════
          // ── Results ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Everything fell. Except the one thing I said was unrelated.'),

            full(
              h('p', { class: 'cs-body-text' },
                'The new linking flow shipped in Q2 2024. I do not have the analytics I would want - GA4 was not implemented on the skill until October 2024, months after this shipped - so there is no clean before and after in product data. What I have is two years of customer service tickets.'),
            ),

            h('p', { class: 'cs-body-text' },
              'Hearing adverts as a premium user went from 753 tickets in January 2024 to 54 in January 2025, and from a monthly average of 185 to 56. It held at that level for two years with no drift back.'),
          ]),

          renderTicketChart(),
          h('p', { class: 'cs-hint' }, 'All eight support categories, monthly averages. 2024 excludes June and July, when a backend refactor logged everyone out'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            full(
              h('h3', { class: 'cs-subsection-title' }, 'Why I cannot hand you a clean number'),
              h('p', { class: 'cs-body-text' },
                'Billing fell 66% and I had nothing to do with billing. 2025 was a better year across the whole premium experience and other teams were fixing things at the same time, so the fall in the linking-related categories cannot be attributed to this work alone, and I am not going to claim it.'),
            ),

            full(
              h('h3', { class: 'cs-subsection-title' }, 'What does hold'),
              h('p', { class: 'cs-body-text' },
                'Streaming is the one theme I had diagnosed as a separate technical fault, and it is the only category that did not move. If this were simply lower ticket volume overall - fewer subscribers, a channel change, people giving up on contacting support - streaming would have fallen with everything else. It did not. So these are real category-level changes, and the prediction I made before doing the work is the one that held.'),
            ),

            full(
              h('h3', { class: 'cs-subsection-title' }, 'What this data does not say'),
              h('ul', { class: 'cs-body-list' }, [
                h('li', null, 'Account linking tickets themselves were never the big number: 14 a month down to 4. It has the largest percentage fall on the chart and the smallest raw one. The impact shows up downstream, in the themes people actually complained about.'),
                h('li', null, 'June and July 2024 are excluded. A backend refactor logged everyone out and produced over a thousand account-linking tickets in two months. Leaving it in would make every fall look bigger than it was.'),
                h('li', null, 'These are support contacts, not behaviour. Fewer complaints is not the same as more successful links.'),
                h('li', null, 'A large spike in linking events in late 2025 was a marketing campaign, not this work.'),
                h('li', null, 'April 2025 shows a joint spike in hearing adverts and streaming, which looks like one technical incident hitting both rather than anything to do with linking.'),
                h('li', null, 'Nobody watched a real listener attempt the redesigned flow before it shipped. The evidence was behavioural and at scale, plus one first-run walkthrough by me, and by then I knew too much to be a useful test.'),
              ]),
            ),
          ]),

          // ══════════════════════════════════════════════
          // ── Two years on ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Two years on, the phone becomes the control surface'),

            full(
              h('p', { class: 'cs-body-text' },
                'Back on the mobile team, I led the Rayo app side of app-to-app linking, and it has now shipped. Smart speaker settings sit with the other account-level settings: a primary link CTA, and sample utterances shown before you link - the device with a screen teaching the device without one.'),
            ),
          ]),

          h('div', { class: 'alx-phone-row' },
            APP_STATES.map(s =>
              h('div', { class: 'alx-phone' }, [
                h('img', {
                  class: 'alx-shot alx-shot--light',
                  src: SHOT(s.name),
                  alt: `Rayo app smart speaker settings: ${s.cap}`,
                  loading: 'lazy',
                }),
                h('img', {
                  class: 'alx-shot alx-shot--dark',
                  src: SHOT(`${s.name}-dark`),
                  alt: '',
                  'aria-hidden': 'true',
                  loading: 'lazy',
                }),
                h('p', { class: 'alx-phone-cap' }, s.cap),
              ]))
          ),
          h('p', { class: 'cs-hint' }, 'Smart speaker settings in the Rayo app, and its three link states'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'Link pending exists because the status is eventually consistent. Shepherd queries Amazon for live status, usually instantly and occasionally a few minutes behind, so rather than assert something it cannot know, the screen says so and offers a route into the Alexa app, which always shows the accurate status. Unlinking routes there too. Rayo can never own linking - whichever direction you go there is always a step under Amazon\u2019s control, and the honest design is the one that admits it.'),
            ),
          ]),

          // ══════════════════════════════════════════════
          // ── Hindsight ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What I would do differently'),

            h('h3', { class: 'cs-subsection-title' }, 'Agree the feedback loop before the build, not after'),
            full(
              h('p', { class: 'cs-body-text' },
                'I shipped this without a loop at either end. Nothing was watched before it went live, and nothing could be measured after it, so I had strong evidence about the problem and almost none about the solution. The fix is one thing rather than two: agree up front how the design will be validated and how it will be measured, and make the case to analytics for tracking to land as part of the build. On this project that means link completion rate, time to link, and linked versus unlinked listening hours.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, 'Ship the whole incentive, or none of it'),
            full(
              h('p', { class: 'cs-body-text' },
                'In-skill resume shipped. Phone-to-speaker resume, the part that gives a non-premium listener a reason to link at all, did not. When the cross-device version turned out to need backend work we did not have, I accepted the smaller one, and the smaller one does not do the job it was built for.'),
            ),

            full(
              h('p', { class: 'cs-body-text' },
                'The deeper version of that: \u201Ccan we build all of this\u201D and \u201Cis the half we can build still worth building\u201D are two different questions with two different owners. Taking the answer to the first as the answer to the second is the actual mistake.'),

              h('h3', { class: 'cs-subsection-title' }, 'Smaller things I would carry forward'),
              h('ul', { class: 'cs-body-list' }, [
                h('li', null, 'Documentation needs a named owner. The Voiceflow file was the team\u2019s source of truth, and the team was later disbanded.'),
                h('li', null, 'A written state model - what linked means and who owns it, agreed across product, backend and customer service and checked against Amazon\u2019s docs - would have surfaced the five-problems-one-cause insight on day one.'),
                h('li', null, 'The customer service report was a one-off ask. A standing monthly read would have made it a feedback loop rather than archaeology.'),
                h('li', null, 'Logging the actual fallback utterances would turn every misheard request into a synonym to add.'),
              ]),
            ),
          ]),

          // ══════════════════════════════════════════════
          // ── What I took away ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What I took away'),

            h('p', { class: 'cs-body-text' },
              'Most of what made this work was not screen design. It was getting a team that had never had a designer to agree on what the flow actually was, and then keeping that agreement somewhere everyone could use it.'),

            full(
              h('p', { class: 'cs-body-text' },
                'The other half is the partner surface itself. You are always designing around somebody else\u2019s last step, so the real job is deciding where to spend the control you do have. Work on the skill is paused while the team waits on Alexa+, and one constraint is still open: \u201CRayo\u201D is acoustically close to \u201Cradio\u201D, and Alexa cannot reliably tell them apart. That one is a conversation with Amazon, and the kind of problem you only find by reading what the system misheard.'),
            ),
          ]),

          // ══════════════════════════════════════════════
          // ── Experience it yourself ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Experience it yourself'),
            h('p', { class: 'cs-body-text' },
              'Everything you\u2019ve just read about is live. If you have an Alexa, just say \u201CAlexa, open Rayo\u201D and try it for yourself.'),
          ]),
        ],
      })
  },
})
