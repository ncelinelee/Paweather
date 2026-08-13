<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { buildKakaoWalkUrl } from '@/services/kakaoLocalApi'
import RestroomLocationMap from '@/components/paweather/RestroomLocationMap.vue'
import PaIcon from '@/components/paweather/PaIcon.vue'
import { toEnglishLocation } from '@/utils/locationEnglish'

const configStore = useConfigStore()

const ui = computed(() => configStore.language === 'en' ? {
  aqi: { 1:'Good', 2:'Fair', 3:'Caution', 4:'Poor', 5:'Very poor' },
  currentLocation: 'My current location', searchedArea: 'Searched walk area', basisTime: 'Updated',
  loading: 'Loading location and walk information...', allowLocation: 'Please allow browser location access.',
  liveLocationNote: (accuracy) => `GPS accuracy approx. ${accuracy || '-'}m · updates as you move`,
  searchedLocationNote: 'Weather, air quality and restrooms use the exact selected place or address',
  currentWeather: 'Current weather', searchedWeather: 'Searched area weather', feelsLike: 'Feels', humidity: 'Humidity', rain: 'Rain',
  goodWalkTimes: 'Best times to walk today', forecastInterval: '1-hour estimates', noForecast: 'No upcoming forecast is available.', now: 'Now',
  recommendation: { recommended:'Best', possible:'Okay', caution:'Caution', avoid:'Avoid' },
  airQuality: 'Walk air quality', airLoading: 'Loading air-quality data...', nearestRestroom: 'Nearest public restroom',
  fromCurrent: 'From current location', fromSelected: 'From selected location', publicData: 'Verified public data',
  walkingDirections: 'Walking directions →', placeInfo: 'Place details', noRestroom: 'No public restroom was found within 3km.',
  dataNote: 'Restrooms are ranked by distance using Kakao Local and municipal public data. Availability and opening hours may differ on site.',
  expectedWalk: (minutes) => `Approx. ${minutes} min walk`,
  directions: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'],
  currentPin: 'My location', searchedPin: 'Searched location'
} : {
  aqi: { 1:'좋음', 2:'보통', 3:'주의', 4:'나쁨', 5:'매우 나쁨' },
  currentLocation: '내 현재 위치', searchedArea: '검색한 산책 지역', basisTime: '기준시간',
  loading: '현재 위치와 산책 정보를 불러오는 중...', allowLocation: '브라우저의 위치 권한을 허용해주세요.',
  liveLocationNote: (accuracy) => `GPS 오차 약 ${accuracy || '-'}m · 이동하면 자동 갱신`,
  searchedLocationNote: '선택한 장소·주소의 정확한 좌표 기준 날씨 · 대기질 · 공중화장실',
  currentWeather: '현재 날씨', searchedWeather: '검색 지역 날씨', feelsLike: '체감', humidity: '습도', rain: '강수',
  goodWalkTimes: '오늘 산책하기 좋은 시간', forecastInterval: '1시간 간격 예상', noForecast: '앞으로의 시간대 예보가 없어요.', now: '지금',
  recommendation: { recommended:'추천', possible:'가능', caution:'주의', avoid:'피하기' },
  airQuality: '산책 대기질', airLoading: '대기질 정보를 불러오는 중...', nearestRestroom: '가장 가까운 공중화장실',
  fromCurrent: '현재 위치에서', fromSelected: '선택 위치에서', publicData: '공공데이터 확인',
  walkingDirections: '도보 길찾기 →', placeInfo: '장소 정보', noRestroom: '주변 3km 내 공중화장실을 찾지 못했어요.',
  dataNote: '공중화장실은 Kakao Local과 지자체 공공데이터를 거리순으로 비교합니다. 실제 개방 여부·운영시간은 현장에서 달라질 수 있습니다.',
  expectedWalk: (minutes) => `예상 도보 ${minutes}분`,
  directions: ['북쪽', '북동쪽', '동쪽', '남동쪽', '남쪽', '남서쪽', '서쪽', '북서쪽'],
  currentPin: '내 위치', searchedPin: '검색 위치'
})

const props = defineProps({
  currentLocation: { type: Object, default: null },
  weather: { type: Object, default: null },
  airQuality: { type: Object, default: null },
  nearestRestroom: { type: Object, default: null },
  locationMessage: { type: String, default: '' },
  restroomMessage: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  isCurrentLocation: { type: Boolean, default: true },
  basisTime: { type: String, default: '' },
  dog: { type: Object, default: null },
  walk: { type: Object, default: null },
  dogFeelsLike: { type: Number, default: null },
  dogWalks: { type: Array, default: () => [] },
  evaluateDogWalk: { type: Function, default: null }
})

const aqiLabel = computed(() => ui.value.aqi[props.airQuality?.aqi] || '-')
const aqiClass = computed(() => {
  const aqi = Number(props.airQuality?.aqi || 0)
  if (aqi <= 1) return 'aqi-good'
  if (aqi === 2) return 'aqi-fair'
  if (aqi === 3) return 'aqi-caution'
  return 'aqi-bad'
})

const displayTemperature = (temperature) => {
  const value = Number(temperature)
  if (!Number.isFinite(value)) return '-'
  if (configStore.unit === 'fahrenheit') return Math.round(((value * 9) / 5 + 32) * 10) / 10
  return value
}

const dashboardDogWalks = computed(() => {
  if (props.dogWalks.length) return props.dogWalks
  if (!props.dog || !props.walk) return []
  return [{
    id: props.dog.id || props.dog.name,
    name: props.dog.name,
    dogFeelsLike: props.dogFeelsLike,
    walkClass: props.walk.className,
    walkDisplayLevel: props.walk.shortLabel
  }]
})

const locationDisplay = computed(() => {
  if (!props.currentLocation) return ''
  if (props.currentLocation.addressName) return props.currentLocation.addressName
  const parts = [props.currentLocation.province, props.currentLocation.district, props.currentLocation.neighborhood].filter(Boolean)
  const name = props.currentLocation.name === '현재 위치' ? ui.value.currentLocation : props.currentLocation.name
  return parts.length ? parts.join(' ') : (name || ui.value.currentLocation)
})
const englishLocationDisplay = computed(() => toEnglishLocation(locationDisplay.value))

const weatherDescription = computed(() => {
  const status = props.weather?.status || ''
  if (configStore.language !== 'en') return props.weather?.description || status
  return ({ 맑음:'Clear', 흐림:'Cloudy', 비:'Rain', 폭우:'Heavy rain', 뇌우:'Thunderstorm', 눈:'Snow', 바람:'Windy' })[status] || status
})

const localizedLocationMessage = computed(() => {
  if (!props.locationMessage) return ''
  if (configStore.language === 'en' && /[가-힣]/.test(props.locationMessage)) return 'Unable to load location data. Please try again.'
  return props.locationMessage
})

const localizedRestroomMessage = computed(() => {
  if (!props.restroomMessage) return ''
  if (configStore.language === 'en' && /[가-힣]/.test(props.restroomMessage)) return ui.value.noRestroom
  return props.restroomMessage
})

const formattedDistance = computed(() => {
  const meters = Number(props.nearestRestroom?.distanceMeters)
  if (!Number.isFinite(meters)) return ''
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`
})

const estimatedWalkMinutes = computed(() => {
  const meters = Number(props.nearestRestroom?.distanceMeters)
  if (!Number.isFinite(meters) || meters <= 0) return ''
  // 장소 검색 거리는 직선거리이므로 도로 우회분 25%와 일반 보행속도 75m/분을 적용함.
  const minutes = (meters * 1.25) / 75
  const rounded = minutes <= 10 ? Math.max(1, Math.ceil(minutes)) : Math.ceil(minutes / 5) * 5
  return ui.value.expectedWalk(rounded)
})

const restroomAddress = computed(() => {
  if (!props.nearestRestroom) return ''
  return props.nearestRestroom.roadAddress || props.nearestRestroom.address || props.nearestRestroom.category || ''
})
const englishRestroomName = computed(() => toEnglishLocation(props.nearestRestroom?.name))
const englishRestroomAddress = computed(() => toEnglishLocation(restroomAddress.value))

const restroomDirection = computed(() => {
  const startLat = Number(props.currentLocation?.latitude)
  const startLon = Number(props.currentLocation?.longitude)
  const endLat = Number(props.nearestRestroom?.latitude)
  const endLon = Number(props.nearestRestroom?.longitude)
  if (![startLat, startLon, endLat, endLon].every(Number.isFinite)) return ''

  const toRad = (degree) => degree * Math.PI / 180
  const toDeg = (radian) => radian * 180 / Math.PI
  const deltaLon = toRad(endLon - startLon)
  const y = Math.sin(deltaLon) * Math.cos(toRad(endLat))
  const x = Math.cos(toRad(startLat)) * Math.sin(toRad(endLat)) -
    Math.sin(toRad(startLat)) * Math.cos(toRad(endLat)) * Math.cos(deltaLon)
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360
  return ui.value.directions[Math.round(bearing / 45) % ui.value.directions.length]
})

const getWalkTimeScore = (forecast) => {
  const temp = Number(forecast.temp)
  const rain = Number(forecast.rain || 0)
  const humidity = Number(forecast.humidity || 0)
  const aqi = Number(props.airQuality?.aqi || 0)
  let score = 100 - Math.abs(temp - 18) * 3 - rain * 0.65
  if (humidity >= 80) score -= 10
  if (aqi >= 3) score -= (aqi - 2) * 18
  if (temp >= 30 || temp <= 0) score -= 24
  if (['뇌우', '폭우', '눈'].includes(forecast.status)) score -= 45
  return Math.max(0, Math.round(score))
}

const getPersonalizedSlotRecommendation = (forecast) => {
  if (!props.evaluateDogWalk || !props.dogWalks.length) return null

  const levelRank = { 안전: 0, '가벼운 산책 가능': 1, 주의: 2, 위험: 3 }
  const slotWeather = { ...forecast, aqi: Number(props.airQuality?.aqi || 0) }
  const worstResult = props.dogWalks
    .map((dog) => props.evaluateDogWalk(slotWeather, dog))
    .filter(Boolean)
    .reduce((worst, result) => {
      if (!worst) return result
      return levelRank[result.level] > levelRank[worst.level] ? result : worst
    }, null)

  if (!worstResult) return null
  if (worstResult.level === '위험') return { label: ui.value.recommendation.avoid, className: 'avoid' }
  if (worstResult.level === '주의') return { label: ui.value.recommendation.caution, className: 'caution' }
  if (worstResult.level === '가벼운 산책 가능') return { label: ui.value.recommendation.possible, className: 'possible' }
  return { label: ui.value.recommendation.recommended, className: 'recommended' }
}

const interpolateForecast = (points, targetTimestamp) => {
  const lower = [...points].reverse().find((item) => item.timestamp <= targetTimestamp) || points[0]
  const upper = points.find((item) => item.timestamp >= targetTimestamp) || points[points.length - 1]
  if (!lower || !upper) return null
  if (lower.timestamp === upper.timestamp) return { ...lower, timestamp: targetTimestamp }

  const ratio = Math.min(1, Math.max(0, (targetTimestamp - lower.timestamp) / (upper.timestamp - lower.timestamp)))
  const interpolate = (from, to, digits = 0) => {
    const value = Number(from) + (Number(to) - Number(from)) * ratio
    const factor = 10 ** digits
    return Math.round(value * factor) / factor
  }
  return {
    timestamp: targetTimestamp,
    temp: interpolate(lower.temp, upper.temp, 1),
    feelsLike: interpolate(lower.feelsLike, upper.feelsLike, 1),
    humidity: interpolate(lower.humidity, upper.humidity),
    rain: interpolate(lower.rain, upper.rain),
    wind: interpolate(lower.wind, upper.wind, 1),
    status: ratio < 0.5 ? lower.status : upper.status
  }
}

const walkTimeSlots = computed(() => {
  // basisTime이 매분 갱신될 때 현재 시각 기준 슬롯도 함께 갱신함.
  void props.basisTime
  const forecasts = Array.isArray(props.weather?.hourlyForecast) ? props.weather.hourlyForecast : []
  if (!forecasts.length) return []
  const now = Date.now()
  const currentPoint = {
    timestamp: now,
    temp: Number(props.weather?.temp),
    feelsLike: Number(props.weather?.feelsLike),
    humidity: Number(props.weather?.humidity),
    rain: Number(props.weather?.rain || 0),
    wind: Number(props.weather?.wind || 0),
    status: props.weather?.status || ''
  }
  const points = [currentPoint, ...forecasts]
    .filter((item) => Number.isFinite(item.timestamp) && item.timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp)
  const nextHour = new Date(now)
  nextHour.setMinutes(0, 0, 0)
  nextHour.setHours(nextHour.getHours() + 1)
  const targets = [now, ...Array.from({ length: 6 }, (_, index) => nextHour.getTime() + index * 60 * 60 * 1000)]

  return targets
    .map((timestamp, index) => {
      const item = interpolateForecast(points, timestamp)
      if (!item) return null
      const score = getWalkTimeScore(item)
      const personalizedRecommendation = getPersonalizedSlotRecommendation(item)
      const isEnglish = configStore.language === 'en'
      const hourParts = new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'ko-KR', {
        timeZone: 'Asia/Seoul', hour: 'numeric', hour12: isEnglish
      }).formatToParts(new Date(item.timestamp))
      const hour = hourParts.find((part) => part.type === 'hour')?.value || ''
      const dayPeriod = hourParts.find((part) => part.type === 'dayPeriod')?.value || ''
      return {
        ...item,
        score,
        hour: index === 0 ? ui.value.now : (isEnglish ? `${hour} ${dayPeriod}`.trim() : `${hour}시`),
        label: personalizedRecommendation?.label || (score >= 75 ? ui.value.recommendation.recommended : score >= 55 ? ui.value.recommendation.possible : score >= 35 ? ui.value.recommendation.caution : ui.value.recommendation.avoid),
        className: personalizedRecommendation?.className || (score >= 75 ? 'recommended' : score >= 55 ? 'possible' : score >= 35 ? 'caution' : 'avoid')
      }
    })
    .filter(Boolean)
})

const kakaoWalkUrl = computed(() => buildKakaoWalkUrl(props.currentLocation, props.nearestRestroom))
</script>

<template>
  <section class="location-dashboard">
    <div class="dashboard-heading">
      <div>
        <span class="eyebrow">MY WALK AREA</span>
        <h2><PaIcon name="location" /> {{ isCurrentLocation ? ui.currentLocation : ui.searchedArea }}</h2>
      </div>
      <div class="heading-status">
        <span v-if="basisTime" class="basis-time">{{ ui.basisTime }}: {{ basisTime }}</span>
        <span class="live-badge" :class="{ searched: !isCurrentLocation }">
          {{ isCurrentLocation ? 'LIVE' : 'SEARCH' }}
        </span>
      </div>
    </div>

    <el-skeleton v-if="isLoading && !currentLocation" class="dashboard-skeleton" :rows="4" animated />
    <el-empty v-else-if="!currentLocation" class="dashboard-empty" :image-size="64" :description="localizedLocationMessage || ui.allowLocation" />

    <template v-else>
      <div class="location-title-row">
        <div>
          <strong>{{ locationDisplay }}</strong>
          <span v-if="configStore.language === 'en' && englishLocationDisplay" class="location-english">{{ englishLocationDisplay }}</span>
          <small v-if="isCurrentLocation">{{ ui.liveLocationNote(currentLocation.accuracy) }}</small>
          <small v-else>{{ ui.searchedLocationNote }}</small>
        </div>
      </div>

      <div class="live-grid">
        <article class="info-card" v-if="weather">
          <span class="card-label">{{ isCurrentLocation ? ui.currentWeather : ui.searchedWeather }}</span>
          <div class="main-value">{{ displayTemperature(weather.temp) }}{{ configStore.unitSymbol }}</div>
          <p>{{ weatherDescription }}</p>
          <div class="sub-values">
            <span>{{ ui.feelsLike }} {{ displayTemperature(weather.feelsLike) }}{{ configStore.unitSymbol }}</span><span>{{ ui.humidity }} {{ weather.humidity }}%</span><span>{{ ui.rain }} {{ weather.rain }}%</span>
          </div>
          <div v-if="dashboardDogWalks.length" class="dog-current-walk-list">
            <div v-for="dogResult in dashboardDogWalks" :key="dogResult.id || dogResult.name" class="dog-current-walk" :class="dogResult.walkClass">
              <small><PaIcon name="paw" /> {{ dogResult.name }} · {{ ui.feelsLike }} {{ displayTemperature(dogResult.dogFeelsLike) }}{{ configStore.unitSymbol }}</small>
              <strong>{{ dogResult.walkDisplayLevel }}</strong>
            </div>
          </div>
          <div class="walk-time-recommendation">
            <div class="walk-time-heading">
              <strong>{{ ui.goodWalkTimes }}</strong>
              <small>{{ ui.forecastInterval }}</small>
            </div>
            <div v-if="walkTimeSlots.length" class="walk-time-list">
              <div v-for="slot in walkTimeSlots" :key="slot.timestamp" class="walk-time-slot" :class="slot.className">
                <strong>{{ slot.hour }}</strong>
                <span>{{ displayTemperature(slot.temp) }}{{ configStore.unitSymbol }} · {{ ui.rain }} {{ slot.rain }}%</span>
                <small>{{ slot.label }}</small>
              </div>
            </div>
            <p v-else>{{ ui.noForecast }}</p>
          </div>
        </article>

        <article class="info-card air-card">
          <span class="card-label">{{ ui.airQuality }}</span>
          <template v-if="airQuality">
            <div class="aqi-row"><div class="main-value">AQI {{ airQuality.aqi }}</div><span class="aqi-badge" :class="aqiClass">{{ aqiLabel }}</span></div>
            <div class="sub-values"><span>PM2.5 {{ airQuality.pm25 }}</span><span>PM10 {{ airQuality.pm10 }}</span></div>
          </template>
          <p v-else>{{ localizedLocationMessage || ui.airLoading }}</p>
        </article>

        <article class="info-card restroom-card">
          <div class="restroom-title"><PaIcon name="restroom" class="restroom-icon" /><span class="card-label">{{ ui.nearestRestroom }}</span></div>
          <template v-if="nearestRestroom">
            <div class="restroom-content">
              <div class="restroom-details">
                <h3>{{ nearestRestroom.name }}</h3>
                <small v-if="configStore.language === 'en' && englishRestroomName" class="restroom-english">{{ englishRestroomName }}</small>
                <p>{{ restroomAddress }}</p>
                <small v-if="configStore.language === 'en' && englishRestroomAddress" class="restroom-address-english">{{ englishRestroomAddress }}</small>
                <div class="restroom-meta">
                  <strong>{{ isCurrentLocation ? ui.fromCurrent : ui.fromSelected }} {{ formattedDistance }}</strong>
                  <span v-if="estimatedWalkMinutes" class="walk-time-badge"><PaIcon name="walk" /> {{ estimatedWalkMinutes }}</span>
                  <span v-if="nearestRestroom.phone"><PaIcon name="phone" /> {{ nearestRestroom.phone }}</span>
                  <span v-if="nearestRestroom.source && nearestRestroom.source !== 'Kakao Local'">{{ ui.publicData }}</span>
                </div>
                <div class="restroom-actions">
                  <a v-if="kakaoWalkUrl" :href="kakaoWalkUrl" class="direction-button" target="_blank" rel="noopener noreferrer"><PaIcon name="walk" /> {{ ui.walkingDirections }}</a>
                  <a v-if="nearestRestroom.placeUrl" :href="nearestRestroom.placeUrl" class="place-button" target="_blank" rel="noopener noreferrer">{{ ui.placeInfo }}</a>
                </div>
              </div>

              <RestroomLocationMap
                :current-location="currentLocation"
                :restroom="nearestRestroom"
                :direction="restroomDirection"
                :distance="formattedDistance"
                :walk-time="estimatedWalkMinutes"
                :start-label="isCurrentLocation ? ui.currentPin : ui.searchedPin"
              />
            </div>
          </template>
          <p v-else class="empty-restroom">{{ localizedRestroomMessage || ui.noRestroom }}</p>
        </article>
      </div>

      <p class="data-note">{{ ui.dataNote }}</p>
    </template>
  </section>
</template>

<style scoped>
.location-dashboard{background:#fff;border:1px solid #e3e8e2;border-radius:22px;padding:22px;box-shadow:0 10px 26px rgba(88,78,60,.045)}
.dashboard-heading,.location-title-row,.aqi-row,.restroom-meta{display:flex;align-items:center;justify-content:space-between;gap:12px}
.heading-status{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}.basis-time{color:#8a918b;font-size:9px;font-weight:700;white-space:nowrap}
.eyebrow,.card-label{display:block;color:#799084;font-size:9px;font-weight:900;letter-spacing:1.1px}.dashboard-heading h2{margin:5px 0 0;color:#343a35;font-size:20px}
.live-badge{display:inline-flex;align-items:center;gap:5px;color:#3f8468;background:#edf7f1;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:900}.live-badge::before{width:6px;height:6px;border-radius:50%;background:currentColor;content:""}.live-badge.searched{color:#526f91;background:#eef4fb}.status-box{margin-top:18px;padding:18px;border-radius:15px;background:#f7f9f7;color:#68736b;font-size:11px}
.dashboard-skeleton{margin-top:20px;padding:18px;border-radius:15px;background:#f8faf8}.dashboard-empty{margin-top:14px;padding:18px 0}:deep(.dashboard-empty .el-empty__description p){color:#68736b;font-size:11px}
.location-title-row{margin-top:18px}.location-title-row strong{display:block;color:#374039;font-size:16px}.location-title-row small{display:block;margin-top:4px;color:#8a918b;font-size:9px}.location-title-row .location-english{display:block;margin-top:3px;color:#4d806a;font-size:10px;font-weight:800}
.live-grid{display:grid;grid-template-columns:minmax(210px,.9fr) minmax(150px,.55fr) minmax(340px,1.55fr);gap:12px;margin-top:15px}.info-card{min-width:0;padding:16px;border:1px solid #e8e7e1;border-radius:16px;background:#fff}.main-value{margin-top:8px;color:#2f3631;font-size:27px;font-weight:900}.info-card p{margin:6px 0 0;color:#777f78;font-size:9px;line-height:1.55}
.sub-values{display:flex;flex-wrap:wrap;gap:6px;margin-top:11px}.sub-values span,.restroom-meta span{padding:5px 7px;border-radius:999px;background:#f3f6f3;color:#5f6c64;font-size:8px}.aqi-badge{border-radius:999px;padding:5px 8px;font-size:9px;font-weight:900}.aqi-good{background:#eaf8f0;color:#177245}.aqi-fair{background:#edf5ff;color:#2563a9}.aqi-caution{background:#fff6dc;color:#986a00}.aqi-bad{background:#fff0f0;color:#b33a3a}
.air-card{padding:14px}.air-card .main-value{font-size:21px}.air-card .aqi-row{align-items:flex-end}.air-card .sub-values{gap:4px;margin-top:9px}.air-card .sub-values span{padding:4px 6px}
.dog-current-walk-list{max-height:118px;margin-top:11px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;scrollbar-color:#cedbd3 transparent;scrollbar-width:thin}.dog-current-walk{padding:9px 10px;display:flex;justify-content:space-between;flex:0 0 auto;gap:8px;border-radius:11px}.dog-current-walk small{min-width:0;overflow:hidden;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.dog-current-walk strong{flex:0 0 auto;font-size:10px}.walk-safe{color:#43825f;background:#eef8f1}.walk-light{color:#9b6b21;background:#fff4d8}.walk-caution{color:#bc653f;background:#fff0e8}.walk-ban{color:#c64f4b;background:#ffeded}
.walk-time-recommendation{min-width:0;margin-top:13px;padding-top:12px;border-top:1px solid #edf0ec}.walk-time-heading{display:flex;align-items:center;justify-content:space-between;gap:6px}.walk-time-heading>strong{color:#465149;font-size:9px}.walk-time-heading>small{color:#99a099;font-size:7px}.walk-time-list{display:flex;gap:6px;margin-top:8px;padding:0 0 5px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-color:#cddbd3 transparent;scrollbar-width:thin}.walk-time-list::-webkit-scrollbar{height:4px}.walk-time-list::-webkit-scrollbar-thumb{border-radius:999px;background:#cddbd3}.walk-time-slot{min-width:78px;flex:0 0 78px;padding:8px 5px;border-radius:9px;background:#f4f6f3;text-align:center;scroll-snap-align:start}.walk-time-slot>strong,.walk-time-slot>span,.walk-time-slot>small{display:block}.walk-time-slot>strong{color:#3f4b43;font-size:8px}.walk-time-slot>span{overflow:hidden;margin-top:3px;color:#778079;font-size:6px;white-space:nowrap}.walk-time-slot>small{margin-top:4px;font-size:7px;font-weight:900}.walk-time-slot.recommended{background:#eaf7ef}.walk-time-slot.recommended>small{color:#24734f}.walk-time-slot.possible{background:#eef4fb}.walk-time-slot.possible>small{color:#3972a1}.walk-time-slot.caution{background:#fff6df}.walk-time-slot.caution>small{color:#9c6d16}.walk-time-slot.avoid{background:#ffeded}.walk-time-slot.avoid>small{color:#b24c4c}.walk-time-recommendation>p{margin-top:8px}
.restroom-title{display:flex;align-items:center;gap:7px}.restroom-icon{font-size:20px}.restroom-card{overflow:hidden}.restroom-content{width:100%;max-width:100%;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:14px;align-items:stretch;margin-top:9px}.restroom-content>*{min-width:0;max-width:100%}.restroom-details{min-width:0}.restroom-card h3{max-width:100%;margin:0;overflow:hidden;color:#394039;font-size:clamp(10px,.8vw,13px);line-height:1.35;letter-spacing:-.45px;text-overflow:ellipsis;white-space:nowrap}.restroom-english,.restroom-address-english{display:block;margin-top:4px;color:#4d806a;font-size:8px;font-weight:800;line-height:1.35}.restroom-address-english{color:#7d8b82;font-weight:700}.restroom-meta{justify-content:flex-start;flex-wrap:wrap;margin-top:10px}.restroom-meta strong{color:#3f755c;font-size:9px}.restroom-meta .walk-time-badge{background:#eaf6ef;color:#2f7859;font-weight:900}.restroom-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:12px}.direction-button,.place-button{display:inline-block;padding:9px 11px;border-radius:10px;font-size:9px;font-weight:900;text-decoration:none}.direction-button{background:#56a486;color:#fff}.place-button{background:#f3f6f3;color:#5f6c64}.empty-restroom{padding-top:8px}.data-note{margin:10px 0 0;color:#949a95;font-size:8px}
@media(max-width:1100px){.live-grid{grid-template-columns:minmax(210px,1.2fr) minmax(150px,.8fr)}.restroom-card{grid-column:1/-1}.restroom-content{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}}@media(max-width:720px){.location-dashboard{padding:16px}.dashboard-heading{align-items:flex-start}.heading-status{gap:6px}.basis-time{width:100%;text-align:right}.live-grid{grid-template-columns:1fr}.restroom-card{grid-column:auto}.restroom-content{grid-template-columns:1fr}.restroom-card h3{font-size:13px}.air-card .aqi-row{justify-content:flex-start}}
</style>
