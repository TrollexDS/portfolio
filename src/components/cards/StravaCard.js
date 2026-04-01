import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const STRAVA_PROFILE = 'https://www.strava.com/athletes/101156627'

const CLIENT_ID      = '211462'
const CLIENT_SECRET  = '9edb117e27e74ae910a07088505543030dd3bd67'
const REFRESH_TOKEN  = 'a7f4b1e5543922af3246227aa105b3deacf491d4'
// Cached access token — avoids the refresh round-trip while still valid
const CACHED_TOKEN   = 'e8ba6caab8db04c43ff04fa74e5b955af0fbe3f1'
const APP_ICON       = 'src/assets/logos/strava.svg'

// ── Strava API helpers ────────────────────────────────────────────────────────

async function refreshAccessToken() {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

async function fetchActivity() {
  // 1. Try the cached token; if expired (401) fall back to a fresh refresh
  let token = CACHED_TOKEN
  let res = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=1',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (res.status === 401) {
    token = await refreshAccessToken()
    res = await fetch(
      'https://www.strava.com/api/v3/athlete/activities?per_page=1',
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }
  if (!res.ok) throw new Error(`Activities fetch failed: ${res.status}`)

  const [latest] = await res.json()
  if (!latest) throw new Error('No activities found')

  // 2. Fetch full detail for the high-res polyline
  const detailRes = await fetch(
    `https://www.strava.com/api/v3/activities/${latest.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (detailRes.ok) return detailRes.json()

  // Fallback: summary activity has summary_polyline
  return latest
}

// ── Google encoded-polyline decoder ──────────────────────────────────────────

function decodePolyline(str) {
  const coords = []
  let index = 0, lat = 0, lng = 0
  while (index < str.length) {
    let b, shift = 0, result = 0
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0; result = 0
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    coords.push([lat / 1e5, lng / 1e5])
  }
  return coords
}

// ── Leaflet loader (CDN, one-time) ────────────────────────────────────────────

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L)

    if (!document.getElementById('leaflet-css')) {
      const link = Object.assign(document.createElement('link'), {
        id: 'leaflet-css', rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
      })
      document.head.appendChild(link)
    }

    const script = Object.assign(document.createElement('script'), {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
      onload:  () => resolve(window.L),
      onerror: reject,
    })
    document.head.appendChild(script)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default defineComponent({
  name: 'StravaCard',

  setup() {
    const mapEl    = ref(null)
    const status   = ref('loading')   // 'loading' | 'ready' | 'error'
    const rideInfo = ref(null)        // { name, distance, elevation }
    const errMsg   = ref('')          // visible error for debugging
    let   leafletMap = null

    onMounted(async () => {
      try {
        const [L, activity] = await Promise.all([
          loadLeaflet(),
          fetchActivity(),
        ])

        if (!activity) throw new Error('No rides found')

        rideInfo.value = {
          name:      activity.name,
          distance:  (activity.distance / 1000).toFixed(1) + ' km',
          elevation: Math.round(activity.total_elevation_gain) + ' m ↑',
        }

        const encoded = activity.map?.polyline || activity.map?.summary_polyline
        if (!encoded) throw new Error('No route data')

        const coords = decodePolyline(encoded)

        // Small delay so the DOM el has its final dimensions
        await new Promise(r => setTimeout(r, 50))
        if (!mapEl.value) return

        leafletMap = L.map(mapEl.value, {
          zoomControl:        false,
          attributionControl: false,
          dragging:           false,
          scrollWheelZoom:    false,
          doubleClickZoom:    false,
          touchZoom:          false,
          keyboard:           false,
        })

        // Clean light-grey tiles, no labels — lets the route stand out
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
          { subdomains: 'abcd', maxZoom: 19 }
        ).addTo(leafletMap)

        const route = L.polyline(coords, {
          color:   '#FC4C02',   // Strava orange
          weight:  3,
          opacity: 1,
        }).addTo(leafletMap)

        leafletMap.fitBounds(route.getBounds(), { padding: [20, 20] })
        leafletMap.invalidateSize()

        status.value = 'ready'

      } catch (e) {
        console.error('StravaCard error:', e)
        errMsg.value = String(e)
        status.value = 'error'
      }
    })

    onUnmounted(() => {
      if (leafletMap) { leafletMap.remove(); leafletMap = null }
    })

    return () => h(BentoCard, { classes: 'strava-card', href: STRAVA_PROFILE, actionIconSrc: ICON_EXTERNAL_LINK, tooltip: 'My last riding route 🚴\nConnect with me on Strava' }, {
      default: () => [

        // ── Map canvas ──────────────────────────────────────
        h('div', { ref: mapEl, class: 'strava-map' }),

        // ── Loading skeleton ────────────────────────────────
        status.value === 'loading' && h('div', { class: 'strava-skeleton' }),

        // ── Error — hidden in production; map will appear once deployed ──

        // ── Stats overlay (bottom of card) ──────────────────
        status.value === 'ready' && rideInfo.value && h('div', { class: 'strava-overlay' }, [
          h('span', { class: 'strava-distance' }, rideInfo.value.distance),
          h('span', { class: 'strava-elevation' }, rideInfo.value.elevation),
        ]),

        // ── Strava logo badge ───────────────────────────────
        h('div', { class: 'strava-badge' }, [
          h('img', { src: APP_ICON, alt: 'Strava', width: 28, height: 28 }),
        ]),
      ],
    })
  },
})
