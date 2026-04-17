import { defineComponent, h, ref } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'

const VIDEO_SRC = 'src/assets/videos/rayo-alexa.mp4'

// ── Image assets ──
const IMG_SKILL           = 'src/assets/images/rayo/alexa/rayo-alexa-skill.png'
const IMG_JOURNEY_MAP     = 'src/assets/images/rayo/alexa/user-journey-mapping.png'
const IMG_INTERACTION     = 'src/assets/images/rayo/alexa/interaction-model-documentation.png'
const IMG_VOICEFLOW       = 'src/assets/images/rayo/alexa/voiceflow-open-rayo.png'
const IMG_ACCOUNT_LINKING = 'src/assets/images/rayo/alexa/account-linking-screen.png'
const IMG_ACCOUNT_LINK_1  = 'src/assets/images/rayo/alexa/rayo-account-link-1.png'
const IMG_ACCOUNT_LINK_2  = 'src/assets/images/rayo/alexa/rayo-account-link-2.png'
const IMG_ACCOUNT_LINK_3  = 'src/assets/images/rayo/alexa/rayo-account-link-3.png'
const IMG_SUPPORT         = 'src/assets/images/rayo/alexa/support-page.png'
const IMG_CONTINUE        = 'src/assets/images/rayo/alexa/alexa-rayo-continue-listening.png'

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

          // ── Title, intro, role, impact ──
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Bringing Design to a Team That Had Never Had a Designer'),

            full(
              h('p', { class: 'cs-body-text' },
                'The Alexa team had shipped without a designer for years. I came in to make sense of what existed, remap the user journeys in Voiceflow, and design a cohesive experience across voice and screen.'),
            ),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Sole designer'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '🎧 Fewer support tickets, clearer experience'),
            full(
              h('p', { class: 'cs-body-text' },
                'By consolidating account linking into a single reliable path, support tickets related to linking dropped. The six separate help articles were replaced with streamlined guidance that matched the actual user experience, reducing both user frustration and the maintenance burden on the team.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🔀 A design foundation the team kept using'),
            full(
              h('p', { class: 'cs-body-text' },
                'The Voiceflow production file became the team\u2019s ongoing source of truth - the first time the Alexa skill\u2019s logic was fully documented and visible in one place. More importantly, the way the team worked changed. Design became part of the process: the team started involving design earlier in decision-making, and became open to running user research as a regular practice rather than shipping based on assumptions alone.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '🤝 Design beyond the skill'),
            full(
              h('p', { class: 'cs-body-text' },
                'The work extended beyond the product itself. I collaborated with the customer service team to overhaul the Alexa help centre, rewriting the key support articles on account linking, ads, and premium station access to match the new simplified flows. By aligning the support content with the redesigned experience, users who did need help found guidance that actually reflected what they\u2019d see on screen - closing the gap between the product and the resources meant to support it.'),
            ),
          ]),

          // ── Skill image ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_SKILL,
            alt: 'Rayo skill homepage on an Alexa device with a screen',
          }),
          h('p', { class: 'cs-hint' }, 'Rayo skill homepage on an Alexa device with a screen'),

          // ══════════════════════════════════════════════
          // ── Challenges ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Challenges'),

            h('h3', { class: 'cs-subsection-title' }, 'First designer in a team that never had one'),
            h('p', { class: 'cs-body-text' },
              'No documented flows, no mapped journeys. Everything about how the skill worked lived inside the PO and lead developer\u2019s heads.'),

            h('h3', { class: 'cs-subsection-title' }, 'Account linking was the core problem'),
            h('p', { class: 'cs-body-text' },
              'Premium users heard ads and lost access to paid stations despite paying. The business had no way to attribute listening data to individual users.'),

            h('h3', { class: 'cs-subsection-title' }, 'A broken experience built on patches'),
            h('p', { class: 'cs-body-text' },
              '4+ different linking paths with no consistent logic between them. Silent failures, dead ends, and a trail of negative Alexa store reviews.'),

            h('h3', { class: 'cs-subsection-title' }, 'No one had ever stepped back to see the full picture'),
            h('p', { class: 'cs-body-text' },
              'Fixes had been stacked on fixes with no one stepping back to map the full picture. That was my starting point.'),
          ]),

          // ── Review cards marquee ──
          h(ReviewMarquee),
          h('p', { class: 'cs-hint' }, '1 star reviews regarding account linking issues'),

          // ══════════════════════════════════════════════
          // ── The Audit ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'The Audit'),

            h('h3', { class: 'cs-subsection-title' }, 'Mapping every journey from scratch'),
            full(
              h('p', { class: 'cs-body-text' },
                'My first step was to experience the product exactly as a new user would. I unboxed both an Echo Dot and an Echo Show, set them up from scratch, and documented every step from first power-on through account linking. Without any briefing from the team, I tested how far a first-time user could get by speaking naturally to the device.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_JOURNEY_MAP,
            alt: 'Journey mapping on a Miro board',
          }),
          h('p', { class: 'cs-hint' }, 'Journey mapping on a Miro board'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'What became clear very quickly was that the Rayo skill, like most custom Alexa skills, wasn\u2019t conversational at all. It was built with a binary, chatbot-like logic: say the exact right words or nothing happens. There were only two command structures that actually worked, and users had to know them word for word: \u201COpen [skill name]\u201D followed by a separate action, or the one-shot \u201CAsk [skill name] to [do something].\u201D Anything outside these patterns failed silently.'),

              h('p', { class: 'cs-body-text' },
                'I pulled apart the skill\u2019s interaction model - a JSON file containing every intent, utterance, and synonym the skill could recognise. I catalogued all available content and mapped which synonyms had been added for requesting specific shows, revealing gaps and inconsistencies in how the skill interpreted user requests.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_INTERACTION,
            alt: 'Interaction model documentation',
          }),
          h('p', { class: 'cs-hint' }, 'Interaction model documentation'),

          // ══════════════════════════════════════════════
          // ── Restructured Journeys ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Restructured Journeys'),

            h('h3', { class: 'cs-subsection-title' }, 'Building a single source of truth in Voiceflow'),
            full(
              h('p', { class: 'cs-body-text' },
                'With no documentation and no design files, my first goal was to create one. I rebuilt every existing intent in Voiceflow - think of intents as the voice equivalent of features in a mobile app. Each one was built to closely mirror the actual Alexa skill, accounting for different conditions, synonym variations, and error states. This production file became the team\u2019s single source of truth: the first time anyone could see the entire skill\u2019s logic in one place.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_VOICEFLOW,
            alt: 'Open Rayo user flow mapped in Voiceflow',
          }),
          h('p', { class: 'cs-hint' }, 'Open Rayo user flow mapped in Voiceflow'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Unifying account linking into one reliable path'),
            full(
              h('p', { class: 'cs-body-text' },
                'The original skill had so many linking methods that the support page alone contained six separate articles explaining them - a maintenance burden for developers and a source of confusion for users. In reality, only one method was bug-free: linking via the Alexa app. I designed every journey to converge on this single path. No matter where the user starts - iOS or Android, legacy brand apps or the new Rayo app, scanning a QR code or initiating the link through voice - they\u2019re all deeplinked into the Alexa app to complete account linking. One consistent, reliable flow instead of six fragmented ones.'),
            ),
          ]),

          // ── Account linking steps ──
          h('div', { class: 'cs-account-link-steps' }, [
            h('img', { class: 'cs-account-link-img cs-account-link-img--1', src: IMG_ACCOUNT_LINK_1, alt: 'Sign in to your Rayo account' }),
            h('img', { class: 'cs-account-link-img cs-account-link-img--2', src: IMG_ACCOUNT_LINK_2, alt: 'Confirm access to your account' }),
            h('img', { class: 'cs-account-link-img cs-account-link-img--3', src: IMG_ACCOUNT_LINK_3, alt: 'Rayo has been successfully linked' }),
          ]),
          h('p', { class: 'cs-hint' }, 'Account linking flow: sign in, confirm, success'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Introducing in-situ help'),
            full(
              h('p', { class: 'cs-body-text' },
                'Many users were still struggling with account linking even when the flow worked correctly. I introduced an in-situ help feature: contextual guidance delivered through both on-screen support content on the Echo Show and voice prompts from Alexa. Rather than sending users away to a support page, help now meets them where they are, at the moment they need it.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_ACCOUNT_LINKING,
            alt: 'Account linking screen on Echo Show',
          }),
          h('p', { class: 'cs-hint' }, 'Account linking screen on Echo Show'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Improving the help centre'),
            full(
              h('p', { class: 'cs-body-text' },
                'I also worked with the customer service team to overhaul the Alexa help centre articles. The existing support pages reflected the old fragmented experience - six separate articles for account linking alone. I helped consolidate and rewrite the key articles covering account linking, ads on Alexa, and premium station access, making sure the guidance matched the simplified flows and gave users a clear path to resolution.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_SUPPORT,
            alt: 'Rayo Alexa help centre support page',
          }),
          h('p', { class: 'cs-hint' }, 'Rayo Alexa help centre support page'),

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h3', { class: 'cs-subsection-title' }, 'Continue listening as a reason to link'),
            full(
              h('p', { class: 'cs-body-text' },
                'We reframed account linking as something worth doing by tying it to a tangible benefit. The new \u201CContinue Listening\u201D feature lets users resume content from where they left off - when they play something they\u2019ve previously started, Alexa prompts them to pick up where they stopped. In the next phase, we plan to take this further: Alexa will proactively suggest unfinished content when you launch the Rayo skill or arrive home, creating a more personalised, anticipatory experience.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: IMG_CONTINUE,
            alt: 'Continue listening feature on Alexa Echo Show',
          }),
          h('p', { class: 'cs-hint' }, 'Continue listening feature on Alexa Echo Show'),

          // ══════════════════════════════════════════════
          // ── What's next ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What\u2019s next'),
            h('p', { class: 'cs-body-text' },
              'Development on the Rayo Alexa skill is currently paused while the team waits for the release of Alexa+, Amazon\u2019s next-generation AI-powered assistant. The groundwork I laid - the mapped journeys, the Voiceflow prototypes, the simplified account linking architecture - gives the team a design foundation to build on when development resumes, whether that\u2019s adapting to Alexa+\u2019s new conversational capabilities or picking up the personalised Continue Listening experience we\u2019d planned.'),
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
