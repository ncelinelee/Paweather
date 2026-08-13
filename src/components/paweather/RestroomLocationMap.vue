<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  currentLocation: { type: Object, required: true },
  restroom: { type: Object, required: true },
  direction: { type: String, default: '' },
  distance: { type: String, default: '' },
  walkTime: { type: String, default: '' },
  startLabel: { type: String, default: '내 위치' }
})

const mapElement = ref(null)
let map = null
let resizeObserver = null
let startMarker = null
let destinationMarker = null
let guideLine = null

const coordinates = computed(() => {
  const start = [Number(props.currentLocation?.latitude), Number(props.currentLocation?.longitude)]
  const destination = [Number(props.restroom?.latitude), Number(props.restroom?.longitude)]
  return [...start, ...destination].every(Number.isFinite) ? { start, destination } : null
})

const ui = computed(() => configStore.language === 'en' ? {
  direction: 'direction', restroom: 'public restroom', destination: 'Destination',
  caption: 'Real map · dotted line is straight-line direction'
} : {
  direction: '방향', restroom: '공중화장실', destination: '도착',
  caption: '실제 주변 지도 · 점선은 직선 방향'
})

const mapLabel = computed(() => {
  const details = [props.direction && `${props.direction} ${ui.value.direction}`, props.distance].filter(Boolean).join(' · ')
  return `${props.startLabel} → ${props.restroom?.name || ui.value.restroom}${details ? `, ${details}` : ''}`
})

const removeLayers = () => {
  if (!map) return
  ;[startMarker, destinationMarker, guideLine].forEach((layer) => layer && map.removeLayer(layer))
  startMarker = null
  destinationMarker = null
  guideLine = null
}

const destroyMap = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (map) map.remove()
  map = null
  startMarker = null
  destinationMarker = null
  guideLine = null
}

const renderMap = async () => {
  if (!coordinates.value) {
    destroyMap()
    return
  }

  await nextTick()
  if (!mapElement.value) return

  if (map && map.getContainer() !== mapElement.value) destroyMap()

  if (!map) {
    map = L.map(mapElement.value, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    resizeObserver = new ResizeObserver(() => map?.invalidateSize())
    resizeObserver.observe(mapElement.value)
  } else {
    removeLayers()
  }

  const { start, destination } = coordinates.value
  startMarker = L.circleMarker(start, {
    radius: 7,
    color: '#426b58',
    weight: 4,
    fillColor: '#ffffff',
    fillOpacity: 1
  }).addTo(map).bindTooltip(props.startLabel, {
    permanent: true,
    direction: 'bottom',
    offset: [0, 9],
    className: 'location-map-tooltip'
  })

  destinationMarker = L.circleMarker(destination, {
    radius: 9,
    color: '#ffffff',
    weight: 3,
    fillColor: '#48a17d',
    fillOpacity: 1
  }).addTo(map).bindTooltip(props.restroom?.name || ui.value.destination, {
    permanent: true,
    direction: 'top',
    offset: [0, -10],
    className: 'location-map-tooltip destination'
  })

  guideLine = L.polyline([start, destination], {
    color: '#48a17d',
    weight: 4,
    opacity: 0.85,
    dashArray: '8 7'
  }).addTo(map)

  map.fitBounds(L.latLngBounds(start, destination), {
    padding: [42, 42],
    maxZoom: 17
  })
  window.setTimeout(() => map?.invalidateSize(), 0)
}

watch(
  () => [
    props.currentLocation?.latitude,
    props.currentLocation?.longitude,
    props.restroom?.latitude,
    props.restroom?.longitude,
    props.restroom?.name,
    props.startLabel,
    configStore.language
  ],
  renderMap,
  { immediate: true }
)

onBeforeUnmount(destroyMap)
</script>

<template>
  <div class="real-location-map">
    <div ref="mapElement" class="map-canvas" role="img" :aria-label="mapLabel"></div>
    <div class="map-caption">
      <span>{{ ui.caption }}</span>
      <strong>{{ direction }}<template v-if="direction && distance"> · </template>{{ distance }}<template v-if="walkTime"> · {{ walkTime }}</template></strong>
    </div>
  </div>
</template>

<style scoped>
.real-location-map { width: 100%; height: 100%; max-width: 100%; min-width: 0; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #dce7df; border-radius: 13px; background: #eef4ef; }
.map-canvas { width: 100%; max-width: 100%; min-height: 174px; flex: 1 1 174px; background: #eef4ef; }
.map-caption { position: relative; z-index: 500; min-width: 0; display: flex; align-items: center; justify-content: space-between; flex: 0 0 auto; gap: 8px; padding: 8px 10px; border-top: 1px solid #dce7df; background: #fff; }
.map-caption span { min-width: 0; overflow: hidden; color: #7f8881; font-size: 7px; text-overflow: ellipsis; white-space: nowrap; }
.map-caption strong { flex: 0 0 auto; color: #36755a; font-size: 8px; white-space: nowrap; }
:deep(.leaflet-control-zoom a) { color: #426b58; }
:deep(.leaflet-control-attribution) { font-size: 6px; }
:deep(.location-map-tooltip) { padding: 4px 7px; border: 0; border-radius: 7px; background: #fff; box-shadow: 0 2px 9px rgba(47,69,57,.2); color: #405048; font-size: 8px; font-weight: 900; }
:deep(.location-map-tooltip.destination) { color: #287252; }
:deep(.leaflet-tooltip-bottom::before),:deep(.leaflet-tooltip-top::before) { display: none; }
@media (max-width:720px) {
  .map-canvas { min-height: 210px; flex-basis: 210px; }
}
</style>
