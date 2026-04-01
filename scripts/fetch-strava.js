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

const CLIENT_ID     = '211462'
const CLIENT_SECRET = '9edb117e27e74ae910a07088505543030dd3bd67'
const REFRESH_TOKEN = '62b8228854ea4573297b0404008d9dfae93ee002'

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
