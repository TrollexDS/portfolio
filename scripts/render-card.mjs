#!/usr/bin/env node
/**
 * Render a case study card's body to HTML, without a browser.
 *
 *   node scripts/render-card.mjs AlexaCard            # cleaned fallback HTML
 *   node scripts/render-card.mjs AlexaCard --raw      # raw Vue SSR output
 *   node scripts/render-card.mjs AlexaCard --text     # plain text, for proofreading
 *
 * Use it to check a content edit renders (and reads) correctly before
 * opening a browser. build-case-study-pages.js uses the same renderer to
 * generate each page's no-JS fallback.
 */
import { renderCardRaw, cleanForFallback } from './lib/render-card.mjs'

const [card, flag] = process.argv.slice(2)
if (!card) {
  console.error('Usage: node scripts/render-card.mjs <CardName> [--raw|--text]')
  process.exit(1)
}
const raw = await renderCardRaw(card)
if (flag === '--raw') console.log(raw)
else if (flag === '--text') {
  console.log(cleanForFallback(raw)
    .replace(/<h2>/g, '\n## ').replace(/<h3>/g, '\n### ').replace(/<li>/g, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
}
else console.log(cleanForFallback(raw))
process.exit(0) // cards may start timers during setup
