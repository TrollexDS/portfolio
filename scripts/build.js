#!/usr/bin/env node
/**
 * Build step for the portfolio.
 *
 * There's no bundler here — the site loads Vue via CDN and ships source files
 * directly. That's great for dev speed but means the browser can aggressively
 * cache src/main.js and src/styles/main.css across deploys. When we push a
 * change, returning visitors see the old bundle until their cache expires.
 *
 * Fix: append a version query string (?v=<sha>) to those asset references so
 * every deploy busts the cache. The version is derived from the current git
 * commit SHA (stable across a deploy, unique per deploy). Falls back to a
 * timestamp outside of a git context.
 *
 * This script:
 *   1. Computes the version string
 *   2. Rewrites src="src/main.js" / href="src/styles/main.css" in index.html
 *      to include ?v=<version>
 *   3. Re-runs build-case-study-pages.js with BUILD_VERSION in env so the
 *      generated per-case-study pages share the same version
 *
 * Usage:  node scripts/build.js
 * Run before committing + pushing a deploy. Safe to re-run; idempotent.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const INDEX_HTML = path.join(ROOT, 'index.html')

// ── Version ──────────────────────────────────────────────────────────────
// Prefer the short git SHA: stable, content-tied, unique per commit. If we're
// outside a git checkout (or git isn't available), fall back to a timestamp
// so the script still works in any CI-less environment.
function computeVersion() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim()
  } catch {
    return `t${Date.now()}`
  }
}

// ── Asset references to cache-bust ──────────────────────────────────────
// Paths are relative (resolve against <base href="/"> on generated pages, and
// directly against the site root on index.html). We match the bare path and
// any existing ?v=... so re-running the script just updates the version.
const ASSET_PATTERNS = [
  { name: 'main.js',  regex: /(src="src\/main\.js)(\?v=[^"]*)?(")/g },
  { name: 'main.css', regex: /(href="src\/styles\/main\.css)(\?v=[^"]*)?(")/g },
]

function stampFile(file, version) {
  let html = fs.readFileSync(file, 'utf8')
  let changes = 0
  for (const { regex } of ASSET_PATTERNS) {
    html = html.replace(regex, (_m, prefix, _old, quote) => {
      changes++
      return `${prefix}?v=${version}${quote}`
    })
  }
  fs.writeFileSync(file, html, 'utf8')
  return changes
}

function main() {
  const version = computeVersion()
  console.log(`Building with version: ${version}\n`)

  // 1. Stamp the root index.html
  const rootChanges = stampFile(INDEX_HTML, version)
  console.log(`  ✓ index.html (${rootChanges} asset reference${rootChanges === 1 ? '' : 's'} stamped)`)

  // 2. Regenerate case study pages with BUILD_VERSION so the generator can
  //    embed it into every generated index.html. Using spawn with env instead
  //    of require() to keep build-case-study-pages.js runnable standalone.
  console.log(`\n  Regenerating case-study pages with version…`)
  execSync(`node ${path.join('scripts', 'build-case-study-pages.js')}`, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, BUILD_VERSION: version },
  })

  console.log(`\nBuild complete — version ${version} applied to all pages.`)
}

main()
