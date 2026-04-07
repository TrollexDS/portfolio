/**
 * Cloudflare Worker — Duolingo Streak Proxy
 *
 * Returns { "streak": <number> } for a given Duolingo username.
 * Deploy with: npx wrangler deploy
 */

const DUOLINGO_USERNAME = 'TrollexHK'

// Cache streak for 1 hour so we don't hammer Duolingo on every page load
const CACHE_TTL = 3600

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// Try multiple known Duolingo endpoints in order
const STRATEGIES = [
  {
    name: 'profile-page',
    url: `https://www.duolingo.com/profile/${DUOLINGO_USERNAME}`,
    parse(text) {
      // The profile page embeds JSON in a <script> tag or serves JSON when
      // Accept header requests it. Look for streak in the HTML/JSON.
      const match = text.match(/"streak"\s*:\s*(\d+)/)
      return match ? Number(match[1]) : null
    },
  },
  {
    name: 'api-v2-users',
    url: `https://www.duolingo.com/2017-06-30/users?username=${DUOLINGO_USERNAME}`,
    parse(text) {
      const data = JSON.parse(text)
      const user = data.users?.[0] ?? data
      return user?.site_streak ?? user?.streak ?? null
    },
  },
]

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const debug = url.searchParams.has('debug')
    const log = []

    for (const strategy of STRATEGIES) {
      try {
        const res = await fetch(strategy.url, {
          headers: {
            'User-Agent': BROWSER_UA,
            'Accept': 'text/html,application/json',
          },
          cf: { cacheTtl: CACHE_TTL },
          redirect: 'follow',
        })

        const text = await res.text()

        if (debug) {
          log.push({
            strategy: strategy.name,
            status: res.status,
            bodyPreview: text.substring(0, 2000),
          })
        }

        if (!res.ok) continue

        const streak = strategy.parse(text)
        if (streak != null) {
          if (debug) {
            return new Response(
              JSON.stringify({ streak, resolvedBy: strategy.name, log }, null, 2),
              { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
          }
          return new Response(
            JSON.stringify({ streak }),
            {
              headers: {
                'Content-Type':  'application/json',
                'Cache-Control': `public, max-age=${CACHE_TTL}`,
                ...corsHeaders,
              },
            }
          )
        }
      } catch (err) {
        if (debug) log.push({ strategy: strategy.name, error: err.message })
      }
    }

    // No strategy worked
    return new Response(
      JSON.stringify(debug ? { streak: null, log } : { streak: null }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  },
}
