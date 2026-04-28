#!/usr/bin/env node
/**
 * Fetches your latest Strava activity and saves the route data
 * as a static JSON file for the portfolio site.
 *
 * Usage:  node scripts/fetch-strava.js
 * Run this whenever you want to update the displayed route.
 */

const fs = require('fs')
const path = require('path')

// Credentials are read from env vars so they don't sit in the repo.
// Locally:  export STRAVA_CLIENT_ID=… STRAVA_CLIENT_SECRET=… STRAVA_REFRESH_TOKEN=…
// CI:       set as repository secrets (see .github/workflows/strava.yml)
const CLIENT_ID     = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error(
    'Missing Strava credentials. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, '
    + 'and STRAVA_REFRESH_TOKEN in your environment (or as GitHub repo secrets).'
  )
  process.exit(1)
}

async function main() {
  // 1. Get a fresh access token
  console.log('Refreshing access token...')
  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenRes.ok) {
    console.error('Token refresh response:', JSON.stringify(tokenData, null, 2))
    throw new Error(`Token refresh failed: ${tokenRes.status}`)
  }
  const { access_token } = tokenData
  console.log('Got access token:', access_token ? 'yes' : 'EMPTY')

  // 2. Fetch latest activity
  console.log('Fetching latest activity...')
  const listRes = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=1',
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  if (!listRes.ok) {
    const errBody = await listRes.text()
    console.error('Activities response:', errBody)
    throw new Error(`Activities fetch failed: ${listRes.status}`)
  }
  const [latest] = await listRes.json()
  if (!latest) throw new Error('No activities found')

  // 3. Fetch full detail for high-res polyline
  console.log(`Found: "${latest.name}" — fetching details...`)
  const detailRes = await fetch(
    `https://www.strava.com/api/v3/activities/${latest.id}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  const activity = detailRes.ok ? await detailRes.json() : latest

  // 4. Save just the data the card needs
  const data = {
    name: activity.name,
    distance: activity.distance,
    total_elevation_gain: activity.total_elevation_gain,
    polyline: activity.map?.polyline || activity.map?.summary_polyline,
    start_date_local: activity.start_date_local,
    fetched_at: new Date().toISOString(),
  }

  const outPath = path.join(__dirname, '..', 'src', 'assets', 'strava-activity.json')
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`Saved to ${outPath}`)
  console.log(`  Route: ${data.name}`)
  console.log(`  Distance: ${(data.distance / 1000).toFixed(1)} km`)
  console.log(`  Elevation: ${Math.round(data.total_elevation_gain)} m`)
}

main().catch(e => { console.error(e); process.exit(1) })
