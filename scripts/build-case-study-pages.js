#!/usr/bin/env node
/**
 * Generates one real HTML page per case study under /case-studies/<slug>/index.html.
 *
 * Why real files (vs. the 404.html SPA trick):
 *   - GitHub Pages serves them as HTTP 200 (better SEO)
 *   - Each page has its own <title>, meta description, OG tags, canonical URL,
 *     and CreativeWork JSON-LD — crawlers and LLMs get clean per-page context
 *   - No 404-flash on initial load
 *
 * The generated pages are essentially a skinned index.html: same Vue bundle,
 * same bento grid, but with per-page metadata and a noscript fallback that
 * contains just that case study's content. The client-side router (App.js)
 * detects the pathname on mount and auto-opens the corresponding overlay card.
 *
 * `<base href="/">` is added to every generated page so that all relative
 * asset paths in the Vue app (`src/styles/main.css`, `src/main.js`, card
 * component image refs) continue to resolve against the site root rather than
 * the sub-directory the page lives in.
 *
 * Usage:  node scripts/build-case-study-pages.js
 * Re-run whenever case-studies.config.js changes.
 */

const fs = require('fs')
const path = require('path')
const { ORIGIN, caseStudies } = require('./case-studies.config.js')

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'case-studies')

// Version query string for cache-busting src/main.js and src/styles/main.css.
// Normally set by scripts/build.js (to the current git SHA). Falls back to
// 'dev' when the generator is invoked directly — fine for local work, safe
// to commit because build.js will overwrite it on the next deploy.
const VERSION = process.env.BUILD_VERSION || 'dev'
const V = `?v=${VERSION}`

// ── Tiny HTML escaper for user-authored strings that land in attributes/text ──
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Per-page HTML template ──
function pageTemplate(cs) {
  const url = `${ORIGIN}/case-studies/${cs.slug}/`
  const ogImage = cs.ogImage || `${ORIGIN}/og-image.png`

  // Use schema.org Article rather than CreativeWork: Google gives Article
  // better rich-result treatment (headline, date, author carousel). Article
  // requires `headline`, `datePublished`, `image`, and `author` — we supply
  // all four. `mainEntityOfPage` lets Google canonicalise the URL.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': url,
        headline: cs.title,
        name: cs.title,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        about: cs.about,
        description: cs.description,
        image: `${ORIGIN}/og-image.png`,
        genre: 'Case study',
        inLanguage: 'en-GB',
        datePublished: cs.datePublished,
        dateModified: cs.dateModified || cs.datePublished,
        author: {
          '@type': 'Person',
          '@id': `${ORIGIN}/#alex`,
          name: 'Alex Chiu',
          url: `${ORIGIN}/`,
          jobTitle: 'Senior Product Designer',
        },
        publisher: { '@id': `${ORIGIN}/#alex` },
        isPartOf: { '@id': `${ORIGIN}/#site` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${ORIGIN}/#case-studies` },
          { '@type': 'ListItem', position: 3, name: cs.title, item: url },
        ],
      },
    ],
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--
    Resolve every relative asset (src/main.js, src/styles/main.css, images
    referenced by card components) against the site root, not this sub-path.
  -->
  <base href="/">
  <title>${esc(cs.title)} — Alex Chiu</title>

  <!-- Primary meta -->
  <meta name="description" content="${esc(cs.description)}">
  <meta name="author" content="Alex Chiu">
  <meta name="google-site-verification" content="9zQw4UHcwYqwT2q0UXKJDQRxTjX3MGDeeQ41pkwCxrM">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Alex Chiu — Portfolio">
  <meta property="og:title" content="${esc(cs.title)}">
  <meta property="og:description" content="${esc(cs.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(cs.title)}">
  <meta property="og:locale" content="en_GB">

  <!-- Twitter/X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(cs.title)}">
  <meta name="twitter:description" content="${esc(cs.description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">

  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5TGGHPNWL1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5TGGHPNWL1');
  </script>

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png">
  <link rel="shortcut icon" href="/favicon.ico">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Fredoka:wght@600&family=Inter:wght@400&family=Tiny5&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="src/styles/main.css${V}">

  <!-- SEO fallback: hidden by default (JS users never see it), shown via <noscript> when JS is off -->
  <style>.seo-fallback { display: none; }</style>
  <noscript>
    <style>
      .seo-fallback { display: block !important; }
      *, *::before, *::after { cursor: auto !important; }
      a, a *, button, button * { cursor: pointer !important; }
    </style>
  </noscript>

  <!-- Structured data -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body>
  <div id="app" data-case-study="${esc(cs.cardKey)}">
    <!--
      No-JS / pre-hydration fallback. Vue replaces this on mount, so JS users
      never see it. Serves as indexable content for search and LLM crawlers.

      When case-studies.config.js provides a \`content\` field, we drop it in
      verbatim (it's pre-authored HTML). Otherwise we fall back to the short
      summary — used for case studies that haven't been expanded yet.
    -->
    <main class="seo-fallback" style="max-width:720px;margin:0 auto;padding:48px 24px;font-family:'Inter',system-ui,-apple-system,sans-serif;line-height:1.6;color:#1a1a1a;">
      <p style="margin:0 0 16px;"><a href="/">← Back to all work</a></p>
      <article>
        <h1 style="font-family:'Syne',sans-serif;font-size:2rem;margin:0 0 12px;">${esc(cs.title)}</h1>
        ${cs.content
          ? cs.content
          : `<p>${esc(cs.summary)}</p>`}
        <p style="margin-top:24px;">Written by <a href="/">Alex Chiu</a>, Senior Product Designer in London. Contact: <a href="mailto:alex@mchiu.co.uk">alex@mchiu.co.uk</a>.</p>
      </article>
      <noscript>
        <p style="margin-top:32px;padding:12px 16px;background:#f5f0e8;border-radius:8px;"><strong>Note:</strong> this case study is best viewed with JavaScript enabled for the full interactive experience.</p>
      </noscript>
    </main>
  </div>

  <!--
    Vue 3 via CDN (ES module build).
    \`integrity\` on the import map is the newer Import Map Integrity spec
    (Chrome 127+, ignored silently in Safari/Firefox — safe to include).
  -->
  <script type="importmap">
    {
      "imports": {
        "vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.min.js"
      },
      "integrity": {
        "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.esm-browser.prod.min.js": "sha384-WehEzmhr8LLx5jGT+36WEUtwMYcCu/8qIdnEWQgSV4m4N+nwjHqk0nqeDogd8v7V"
      }
    }
  </script>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"
    integrity="sha384-J8C0MvgX4WP58J4N2W99vCKd2J6z99ynOJ5bEfE6jeP7kVTW1drYtv/jzrxM5jbm"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"></script>
  <script type="module" src="src/main.js${V}"></script>

  <!-- Lazy-load videos: loads and autoplays when scrolled into view -->
  <script>
    (function () {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const video = entry.target
          const src = video.dataset.src
          if (!src) return
          video.src = src
          video.removeAttribute('data-src')
          video.play().catch(() => {})
          io.unobserve(video)
        })
      }, { rootMargin: '200px' })

      const mo = new MutationObserver(() => {
        document.querySelectorAll('video[data-src]').forEach(v => io.observe(v))
      })
      mo.observe(document.getElementById('app'), { childList: true, subtree: true })
    })()
  </script>
</body>
</html>
`
}

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  let written = 0
  for (const cs of caseStudies) {
    const dir = path.join(OUT_DIR, cs.slug)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, 'index.html')
    fs.writeFileSync(file, pageTemplate(cs), 'utf8')
    console.log(`  ✓ ${path.relative(ROOT, file)}`)
    written++
  }

  console.log(`\nWrote ${written} case study page(s) under ${path.relative(ROOT, OUT_DIR)}/`)
}

main()
