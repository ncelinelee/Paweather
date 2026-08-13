<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { toEnglishLocation } from '@/utils/locationEnglish'
import PaIcon from '@/components/paweather/PaIcon.vue'
import walkLightImage from '@/assets/dog-walk-light.png'
import walkBanImage from '@/assets/dog-walk-ban.png'
import walkSafeImage from '@/assets/dog-walk-safe.png'
import walkDangerImage from '@/assets/dog-walk-danger.png'
import rainyDogImage from '@/assets/rainy-dog.png'

const props = defineProps({
  dogs: { type: Array, default: () => [] },
  locationName: { type: String, default: '-' },
  labels: { type: Object, required: true }
})

const configStore = useConfigStore()
const hasDogs = computed(() => props.dogs.length > 0)
const displayTemperature = (temperature) => {
  const value = Number(temperature)
  if (!Number.isFinite(value)) return '-'
  return configStore.unit === 'fahrenheit' ? Math.round(((value * 9) / 5 + 32) * 10) / 10 : value
}
const getWalkImage = (level, status) => {
  if (status === '비' && level === '가벼운 산책 가능') return rainyDogImage
  if (level === '위험') return walkBanImage
  if (level === '주의') return walkDangerImage
  if (level === '가벼운 산책 가능') return walkLightImage
  return walkSafeImage
}
</script>

<template>
  <aside id="walk" class="walk-section">
    <header class="walk-section-header">
      <span class="section-eyebrow">PAWALK INDEX</span>
      <h2>{{ labels.walkIndex }} <small>{{ labels.basedOn(locationName || '-') }}</small></h2>
    </header>

    <div v-if="hasDogs" class="saved-dog-list">
      <section v-for="dog in dogs" :key="dog.id" class="dog-walk-result">
        <div class="dog-result-header">
          <span class="result-label">PAWALK INDEX</span>
          <h2>{{ labels.dogWalkTitle(dog) }}</h2>
          <p>{{ dog.cityName }}<small v-if="configStore.language === 'en'" class="english-place-name"> · {{ toEnglishLocation(dog.cityName) }}</small> · <strong :class="dog.walkClass">{{ dog.walkDisplayLevel }}</strong> <PaIcon :name="dog.walkIcon" /></p>
        </div>

        <div class="dog-feels-like">
          <PaIcon name="thermometer" />
          <div><strong>{{ labels.dogFeelsLike(dog.name, displayTemperature(dog.dogFeelsLike), configStore.unitSymbol) }}</strong><small>{{ labels.dogFeelsLikeNote }}</small></div>
        </div>

        <div class="walk-main" :class="dog.walkClass">
          <div class="walk-copy">
            <h3>{{ dog.walkDisplayLevel }}</h3>
            <span v-if="dog.walkRecommendedMinutes" class="walk-duration-badge"><PaIcon name="clock" /> {{ labels.recommendedTime(dog.walkRecommendedMinutes) }}</span>
            <strong>{{ dog.walkMessage }}</strong>
          </div>
          <p>{{ dog.walkDescription }}</p>
          <div class="dog-motion-track">
            <div class="motion-ground"></div>
            <img :src="getWalkImage(dog.walkLevel, dog.status)" :alt="`${dog.name} walk guide`" class="dog-motion-image" />
          </div>
        </div>

        <div class="walk-metrics">
          <div><PaIcon name="thermometer" /><small>{{ labels.temperature }}</small><strong>{{ displayTemperature(dog.temp) }}{{ configStore.unitSymbol }}</strong></div>
          <div><PaIcon name="humidity" /><small>{{ labels.humidity }}</small><strong>{{ dog.humidity }}%</strong></div>
          <div><PaIcon name="rain" /><small>{{ labels.rainChance }}</small><strong>{{ dog.rain }}%</strong></div>
          <div><PaIcon name="air" /><small>AQI</small><strong>{{ dog.aqi || '-' }}</strong></div>
        </div>

        <div class="guardian-tip">
          <div class="tip-title-row"><h3>{{ labels.guardianTip }}</h3><span>{{ labels.mustCheck }}</span></div>
          <ul>
            <li v-if="dog.temp >= 25 || dog.dogFeelsLike >= 27">{{ labels.tipAsphalt }}</li>
            <li v-if="dog.status === '비'">{{ labels.tipRain }}</li>
            <li v-if="dog.dogFeelsLike <= 7">{{ labels.tipCold }}</li>
            <li v-if="dog.aqi >= 3">{{ labels.tipAir }}</li>
            <li v-if="dog.walkLevel === '위험'">{{ labels.tipDanger }}</li>
            <li v-else-if="dog.walkLevel === '주의'">{{ labels.tipCaution }}</li>
            <li v-else>{{ labels.tipNormal }}</li>
            <li v-if="dog.temp >= 20">{{ labels.tipWater }}</li>
          </ul>
          <PaIcon name="paw" class="tip-icon" />
        </div>
      </section>
    </div>

    <div v-else class="no-dog-profile">
      <PaIcon name="paw" /><strong>{{ labels.noDogTitle }}</strong><p>{{ labels.noDogDescription }}</p>
    </div>
  </aside>
</template>

<style scoped>
.walk-section{width:100%;height:100%;padding:22px;border:1px solid #e8e5dd;border-radius:24px;background:rgba(255,255,255,.96);box-shadow:0 10px 26px rgba(88,78,60,.055)}
.walk-section-header{margin-bottom:18px;padding:0 2px}.section-eyebrow,.result-label{color:#7e9187;font-size:9px;font-weight:900;letter-spacing:1.1px}.walk-section-header h2{margin:5px 0 0;color:#363833;font-size:19px}.walk-section-header h2 small{color:#7a7f79;font-size:12px;font-weight:700}
.saved-dog-list{display:flex;flex-direction:column;gap:14px}.dog-walk-result{overflow:hidden;border:1px solid #e7e5df;border-radius:20px;background:#fff}.dog-result-header{padding:18px 18px 12px}.dog-result-header h2{margin:5px 0 0;color:#373a35;font-size:15px;line-height:1.45}.dog-result-header p{margin:6px 0 0;color:#777d76;font-size:11px}.dog-result-header p strong{font-size:12px}.english-place-name{color:#4d806a;font-weight:800}
.dog-feels-like{margin:0 14px 12px;padding:12px 14px;display:flex;align-items:center;gap:10px;border:1px solid #e5eee9;border-radius:13px;background:#f4faf6}.dog-feels-like>.pa-icon{color:#4d8b70;font-size:20px}.dog-feels-like div{min-width:0;display:flex;flex-direction:column;gap:2px}.dog-feels-like strong{color:#3f765f;font-size:12px}.dog-feels-like small{color:#89918b;font-size:9px}
.walk-main{margin:0 14px 12px;padding:17px;border-radius:15px}.walk-copy h3{margin:0 0 5px;font-size:23px}.walk-copy>strong{display:block;color:#484d47;font-size:12px;line-height:1.5}.walk-duration-badge{width:fit-content;margin:1px 0 6px;padding:4px 8px;display:inline-flex;align-items:center;gap:3px;border-radius:999px;background:rgba(255,255,255,.72);font-size:9px;font-weight:900}.walk-main>p{margin:10px 0 0;color:#666d65;font-size:11px;line-height:1.6}
.dog-motion-track{position:relative;height:150px;margin-top:12px;overflow:hidden;border:1px dashed rgba(95,112,100,.22);border-radius:13px;background:linear-gradient(180deg,rgba(255,255,255,.78),rgba(250,248,241,.56))}.motion-ground{position:absolute;right:10px;bottom:14px;left:10px;height:2px;border-radius:999px;background:rgba(102,111,103,.12)}.dog-motion-image{position:absolute;bottom:15px;left:50%;z-index:2;width:120px;height:120px;object-fit:contain;object-position:center bottom;transform:translateX(-50%);filter:drop-shadow(0 6px 8px rgba(71,77,71,.1))}
.walk-safe{color:#43825f;background:linear-gradient(180deg,#eef8f1,#f8fcf9)}.walk-light{color:#b67a20;background:linear-gradient(180deg,#fff7e8,#fffaf2)}.walk-caution,.walk-danger{color:#d66b48;background:linear-gradient(180deg,#fff0ea,#fff8f5)}.walk-ban{color:#d6524d;background:linear-gradient(180deg,#ffeded,#fff8f7)}
.walk-metrics{padding:0 14px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.walk-metrics>div{padding:10px 6px;border:1px solid #ebe8e2;border-radius:11px;background:#fff;text-align:center}.walk-metrics .pa-icon{display:block;margin:0 auto;color:#628879;font-size:14px}.walk-metrics small,.walk-metrics strong{display:block}.walk-metrics small{margin:3px 0;color:#92968f;font-size:8px}.walk-metrics strong{color:#3e433d;font-size:10px}
.guardian-tip{position:relative;margin:11px 14px 15px;padding:12px 40px 12px 12px;border:1px solid #e8e7e1;border-radius:12px;background:#fbfcfa}.tip-title-row{margin-bottom:7px;display:flex;align-items:center;gap:7px}.tip-title-row h3{margin:0;color:#4e8b70;font-size:10px}.tip-title-row span{padding:4px 6px;border-radius:999px;background:#eef7f2;color:#6f8c7e;font-size:8px;font-weight:800}.guardian-tip ul{margin:0;padding-left:15px;color:#656b64;font-size:9px;line-height:1.7}.tip-icon{position:absolute;right:13px;bottom:10px;color:#60917b;font-size:22px}
.no-dog-profile{min-height:145px;padding:32px 18px;display:flex;flex-direction:column;justify-content:center;border:1px dashed #d9ded8;border-radius:16px;background:#fbfcfa;color:#80877f;text-align:center}.no-dog-profile>.pa-icon{margin:0 auto 8px;color:#62927d;font-size:27px}.no-dog-profile strong{color:#555d55;font-size:12px}.no-dog-profile p{margin:7px 0 0;font-size:10px;line-height:1.6}
@media(max-width:980px){.walk-section{border-radius:20px}}
@media(max-width:720px){.walk-section{padding:16px}}
@media(max-width:520px){.walk-metrics{grid-template-columns:1fr 1fr}}
</style>
