import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import BentoCard from '../BentoCard.js'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'

const STRAVA_PROFILE = 'https://www.strava.com/athletes/101156627'
const ACTIVITY_JSON  = '/src/assets/strava-activity.json'
const APP_ICON       = '/src/assets/logos/strava.svg'

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
        const [L, activityRes] = await Promise.all([
          loadLeaflet(),
          fetch(ACTIVITY_JSON),
        ])

        if (!activityRes.ok) throw new Error('Could not load activity data — run: node scripts/fetch-strava.js')
        const activity = await activityRes.json()

        if (!activity) throw new Error('No rides found')

        rideInfo.value = {
          name:      activity.name,
          distance:  (activity.distance / 1000).toFixed(1) + ' km',
          elevation: Math.round(activity.total_elevation_gain) + ' m ↑',
        }

        const encoded = activity.polyline
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

        const stravaColor = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-strava').trim() || '#fc4c02'
        const route = L.polyline(coords, {
          color:   stravaColor,   // Strava orange — read from design token
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
