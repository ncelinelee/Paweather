<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { fetchWeatherAndAir } from '@/services/weatherApi'
import { toEnglishLocation } from '@/utils/locationEnglish'
import PaIcon from '@/components/paweather/PaIcon.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const city = ref(null)
const airQuality = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const getWeatherIcon = (status) => ({ 맑음:'sun', 흐림:'weather', 비:'rain', 폭우:'rain', 뇌우:'storm', 눈:'snow', 바람:'wind' })[status] || 'weather'
const convertTemp = (temp) => configStore.unit === 'fahrenheit' ? Math.round((temp * 9) / 5 + 32) : temp
const displayTemp = computed(() => city.value ? convertTemp(city.value.temp) : '-')
const displayFeelsLike = computed(() => city.value ? convertTemp(city.value.feelsLike) : '-')
const englishCityName = computed(() => toEnglishLocation(city.value?.name))
const englishStateName = computed(() => toEnglishLocation(city.value?.state))
const aqiLabel = computed(() => {
  const values = configStore.language === 'en'
    ? {1:'Good',2:'Fair',3:'Caution',4:'Poor',5:'Very poor'}
    : {1:'좋음',2:'보통',3:'주의',4:'나쁨',5:'매우 나쁨'}
  return values[airQuality.value?.aqi] || '-'
})

const labels = computed(() => configStore.language === 'en' ? {
  back:'← Back', currentUnit:'Unit', feelsLike:'Feels like', humidity:'Humidity', rain:'Rain chance', wind:'Wind', air:'Air quality', notFound:'Weather information was not found.', home:'Home',
  loading:'Loading weather...', country:'South Korea', apiKey:'Check the OpenWeather API key in .env.',
  learningTitle:'Router + Pinia + Axios integration', learningText:'The coordinates from the main search are passed through Router query parameters. This detail page requests OpenWeather again and shares the temperature unit and language from the Pinia store.'
} : {
  back:'← 뒤로가기', currentUnit:'현재 단위', feelsLike:'체감온도', humidity:'습도', rain:'강수확률', wind:'풍속', air:'대기질', notFound:'날씨 정보를 찾을 수 없습니다.', home:'홈으로',
  loading:'날씨를 불러오는 중...', country:'대한민국', apiKey:'.env의 OpenWeather API 키를 확인해주세요.',
  learningTitle:'Router + Pinia + Axios 연결', learningText:'메인 검색 결과의 위도·경도를 Router query로 전달하고, 상세 페이지에서도 OpenWeather API를 다시 호출합니다. 온도 단위와 언어는 기존 Pinia Store 설정을 그대로 공유합니다.'
})

const displayStatus = computed(() => {
  if (!city.value || configStore.language === 'ko') return city.value?.status || ''
  return ({맑음:'Clear',흐림:'Cloudy',비:'Rain',폭우:'Heavy rain',뇌우:'Thunderstorm',눈:'Snow',바람:'Windy'})[city.value.status] || city.value.status
})

onMounted(async () => {
  const latitude = Number(route.query.lat)
  const longitude = Number(route.query.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    loading.value = false
    errorMessage.value = labels.value.notFound
    return
  }

  try {
    const result = await fetchWeatherAndAir({
      latitude,
      longitude,
      name: String(route.query.name || route.params.cityId || (configStore.language === 'en' ? 'Selected area' : '선택 지역')),
      state: String(route.query.state || '')
    })
    city.value = result.weather
    airQuality.value = result.airQuality
  } catch (error) {
    console.error('[상세 날씨 오류]', error)
    errorMessage.value = error?.response?.status === 401
      ? labels.value.apiKey
      : labels.value.notFound
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="detail-page">
    <section v-if="loading" class="detail-card empty"><h1>{{ labels.loading }}</h1></section>

    <section v-else-if="city" class="detail-card">
      <button class="back-button" @click="router.go(-1)">{{ labels.back }}</button>
      <div class="detail-title-row">
        <div><span class="eyebrow">LIVE WEATHER DETAIL · AXIOS</span><h1>{{ city.name }}</h1><p v-if="configStore.language === 'en'" class="english-location">{{ englishCityName }}</p><p class="country">{{ city.state || labels.country }}</p><p v-if="configStore.language === 'en' && city.state" class="english-location">{{ englishStateName }}</p></div>
        <span class="unit-chip">{{ labels.currentUnit }} {{ configStore.unitSymbol }}</span>
      </div>

      <div class="main-weather"><PaIcon :name="getWeatherIcon(city.status)" /><div><strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong><p>{{ displayStatus }}</p></div></div>

      <div class="metrics">
        <div><small>{{ labels.feelsLike }}</small><strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong></div>
        <div><small>{{ labels.humidity }}</small><strong>{{ city.humidity }}%</strong></div>
        <div><small>{{ labels.rain }}</small><strong>{{ city.rain }}%</strong></div>
        <div><small>{{ labels.wind }}</small><strong>{{ city.wind }}m/s</strong></div>
        <div class="air-metric"><small>{{ labels.air }}</small><strong>AQI {{ airQuality?.aqi || '-' }} · {{ aqiLabel }}</strong><span>PM2.5 {{ airQuality?.pm25 ?? '-' }} / PM10 {{ airQuality?.pm10 ?? '-' }}</span></div>
      </div>

      <div class="learning-note"><strong>{{ labels.learningTitle }}</strong><p>{{ labels.learningText }}</p></div>
    </section>

    <section v-else class="detail-card empty"><h1>{{ errorMessage || labels.notFound }}</h1><button class="back-button" @click="router.push('/')">{{ labels.home }}</button></section>
  </main>
</template>

<style scoped>
.detail-page { min-height: 100vh; padding: 80px 20px 40px; background: linear-gradient(180deg,#fffdfa,#f3f8f5); color: #303630; font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; }
.detail-card { width: min(820px,100%); margin: 0 auto; padding: 32px; border: 1px solid #e4e7e1; border-radius: 26px; background: #fff; box-shadow: 0 16px 40px rgba(60,75,66,.08); }
.back-button { border: 1px solid #dce1dc; border-radius: 10px; background: #fff; color: #48755f; padding: 9px 12px; font-weight: 800; cursor: pointer; }
.detail-title-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.eyebrow { display: block; margin-top: 26px; color: #6d9d87; font-size: 9px; font-weight: 900; letter-spacing: 1.4px; }
h1 { margin: 7px 0 2px; font-size: 38px; }
.country { margin: 0; color: #8c918c; }
.english-location { margin: 2px 0; color: #4d806a; font-size: 11px; font-weight: 800; }
.unit-chip { padding: 7px 10px; border-radius: 999px; background: #eef7f2; color: #4b7f69; font-size: 10px; font-weight: 900; }
.main-weather { margin: 26px 0; padding: 22px; display: flex; align-items: center; gap: 18px; border-radius: 18px; background: #f5faf7; }
.main-weather>.pa-icon { color: #4d9d7d; font-size: 56px; }
.main-weather strong { font-size: 48px; }
.main-weather p { margin: 5px 0 0; color: #727872; }
.metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
.metrics>div { padding: 15px; border: 1px solid #e8eae5; border-radius: 13px; }
.metrics small,.metrics strong,.metrics span { display: block; }
.metrics small { color: #929791; font-size: 10px; }
.metrics strong { margin-top: 5px; font-size: 14px; }
.metrics span { margin-top: 5px; color: #788078; font-size: 9px; }
.air-metric { grid-column: 1/-1; background: #f7fbf8; }
.learning-note { margin-top: 24px; padding: 17px; border-radius: 15px; background: #eef8f1; color: #52675b; }
.learning-note p { margin: 7px 0 0; font-size: 11px; line-height: 1.7; }
.empty { text-align: center; }
@media (max-width:650px) {
  .detail-card { padding: 22px; }
  .metrics { grid-template-columns: 1fr 1fr; }
  .main-weather strong { font-size: 38px; }
  .detail-title-row { align-items: flex-start; flex-direction: column; }
}
</style>
