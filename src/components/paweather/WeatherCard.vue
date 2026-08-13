<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import PaIcon from '@/components/paweather/PaIcon.vue'

const configStore = useConfigStore()

const props = defineProps({
  weather: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  weatherIcon: { type: String, default: 'weather' },
  weatherStatus: { type: String, default: '' },
  heatBadge: { type: Object, required: true },
  humidityLevel: { type: String, default: '' },
  walk: { type: Object, required: true },
  labels: { type: Object, required: true }
})

const emit = defineEmits(['select', 'detail'])
const selectCard = () => emit('select', props.weather)
const openDetail = () => emit('detail', props.weather)

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') return Math.round((temp * 9) / 5 + 32)
  return temp
}

const displayTemp = computed(() => convertTemp(props.weather.temp))
const displayFeelsLike = computed(() => convertTemp(props.weather.feelsLike))
const aqiLabel = computed(() => {
  const labels = configStore.language === 'en'
    ? { 1:'Good', 2:'Fair', 3:'Caution', 4:'Poor', 5:'Very poor' }
    : { 1:'좋음', 2:'보통', 3:'주의', 4:'나쁨', 5:'매우 나쁨' }
  return labels[props.weather.aqi] || '-'
})
</script>

<template>
  <article class="weather-card" :class="{ selected }" @click="selectCard">
    <div class="weather-card-top">
      <div class="city-area">
        <div class="weather-big-icon"><PaIcon :name="weatherIcon" /></div>
        <div>
          <h3>{{ weather.name }}</h3>
          <p>{{ weatherStatus }}</p>
          <small class="location-country">{{ weather.admin1 || weather.state || weather.country }}</small>
        </div>
      </div>
      <span v-if="selected" class="selected-check">✓</span>
    </div>

    <div class="temperature-area">
      <strong class="main-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      <span class="feels-like">{{ labels.feelsLike }} {{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
      <span class="temp-badge" :class="heatBadge.className">{{ heatBadge.label }}</span>
    </div>

    <div class="card-detail">
      <div><span><PaIcon name="humidity" /> {{ labels.humidity }}</span><strong>{{ weather.humidity }}%</strong></div>
      <div><span><PaIcon name="rain" /> {{ labels.rainChance }}</span><strong>{{ weather.rain }}%</strong></div>
      <div><span><PaIcon name="wind" /> {{ labels.wind }}</span><strong>{{ weather.wind }}m/s</strong></div>
      <div><span><PaIcon name="air" /> AQI</span><small class="blue-tag">{{ weather.aqi || '-' }} · {{ aqiLabel }}</small></div>
    </div>

    <div class="card-walk-index" :class="walk.className">
      <div><small>{{ labels.defaultWalk }}</small><strong>{{ walk.shortLabel }}</strong></div>
      <PaIcon :name="walk.icon || 'paw'" />
    </div>

    <div class="card-action-row">
      <button class="detail-btn" @click.stop="openDetail">{{ labels.details }} →</button>
    </div>
  </article>
</template>

<style scoped>
.weather-card { position: relative; min-width: 0; min-height: 310px; padding: 20px; border: 1px solid #e7e6e0; border-radius: 22px; background: #fff; cursor: pointer; transition: transform .18s ease,border-color .18s ease,box-shadow .18s ease; }
.weather-card:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(79,70,54,.08); }
.weather-card.selected { border-color: #4da080; box-shadow: 0 0 0 2px rgba(77,160,128,.1); }
.weather-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.city-area { display: flex; align-items: center; gap: 10px; min-width: 0; }
.weather-big-icon { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 39px; }
.city-area h3 { margin: 0 0 4px; color: #32352f; font-size: 20px; }
.city-area p { margin: 0; color: #90938e; font-size: 12px; }
.location-country { display: block; margin-top: 4px; color: #aaa; font-size: 9px; }
.selected-check { width: 25px; height: 25px; display: grid; place-items: center; border-radius: 50%; background: #4d9f7f; color: #fff; font-size: 11px; font-weight: 900; }
.temperature-area { padding: 22px 0 18px; display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; }
.main-temp { color: #242823; font-size: 40px; line-height: 1; }
.feels-like { color: #80847d; font-size: 12px; }
.temp-badge { margin-left: auto; padding: 6px 10px; border-radius: 999px; color: white; font-size: 10px; font-weight: 900; }
.danger { background: #ea5c52; }
.warning { background: #f1a846; }
.cool { background: #64ad8d; }
.card-detail { padding: 15px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 11px 16px; border-top: 1px solid #efeee9; border-bottom: 1px solid #efeee9; }
.card-detail div { min-width: 0; display: flex; justify-content: space-between; align-items: center; gap: 6px; color: #6e736c; font-size: 11px; }
.card-detail strong { color: #373c36; font-size: 12px; }
.blue-tag { padding: 3px 6px; border-radius: 999px; background: #eef6f2; color: #4e8d72; font-size: 9px; }
.card-walk-index { margin-top: 14px; padding: 12px 13px; display: flex; justify-content: space-between; align-items: center; gap: 8px; border-radius: 14px; }
.card-walk-index div { display: flex; flex-direction: column; gap: 3px; }
.card-walk-index small { color: inherit; font-size: 9px; opacity: .7; }
.card-walk-index strong { font-size: 13px; }
.card-walk-index span { font-size: 20px; }
.walk-safe { color: #43825f; background: linear-gradient(180deg,#eef8f1,#f8fcf9); }
.walk-light { color: #b67a20; background: linear-gradient(180deg,#fff7e8,#fffaf2); }
.walk-caution,.walk-danger { color: #d66b48; background: linear-gradient(180deg,#fff0ea,#fff8f5); }
.walk-ban { color: #d6524d; background: linear-gradient(180deg,#ffeded,#fff8f7); }
.card-action-row { margin-top: 12px; }
.detail-btn { width: 100%; height: 38px; border: 1px solid #deded8; border-radius: 10px; background: #fff; color: #4d7564; font-size: 10px; font-weight: 900; cursor: pointer; }
.detail-btn:hover { border-color: #70ad93; background: #f5faf7; }
@media (max-width:720px) {
  .weather-card { min-height: auto; }
}
</style>
