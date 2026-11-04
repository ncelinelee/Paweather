<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useOnline, usePreferredReducedMotion } from '@vueuse/core'
import { useConfigStore } from '@/stores/configStore'
import { useProfileStore } from '@/stores/profileStore'

import BaseDashboardCard from '@/components/paweather/BaseDashboardCard.vue'
import SearchBar from '@/components/paweather/SearchBar.vue'
import DogProfileForm from '@/components/paweather/DogProfileForm.vue'
import CurrentLocationDashboard from '@/components/paweather/CurrentLocationDashboard.vue'
import PaIcon from '@/components/paweather/PaIcon.vue'
import PaweatherHeader from '@/components/paweather/PaweatherHeader.vue'
import WalkIndexPanel from '@/components/paweather/WalkIndexPanel.vue'
import ServiceSummarySection from '@/components/paweather/ServiceSummarySection.vue'
import PaweatherFooter from '@/components/paweather/PaweatherFooter.vue'

import { fetchWeatherAndAir } from '@/services/weatherApi'
import {
  reverseKoreanAddress,
  searchKoreanPlaces,
  fetchNearestPublicRestroom
} from '@/services/kakaoLocalApi'

import { getSeniorAge, getAgeInYears, getWalkEnvironmentFeelsLike, getRecommendedWalkMinutes, classifyWalkConditions } from '@/utils/walkConditions'
import { usePlaceSearch, provinceOptions } from '@/composables/usePlaceSearch'
import { useLiveLocation } from '@/composables/useLiveLocation'
import { createMessages } from '@/i18n/messages'
import { createLatestRequest } from '@/utils/latestRequest'

import dogHero from '@/assets/dogs.jpeg'
import paweatherLogo from '@/assets/paweather-logo.png'

const configStore = useConfigStore()
const profileStore = useProfileStore()
const isOnline = useOnline()
const preferredMotion = usePreferredReducedMotion()

// ---------------------------------------------------------
// 1. KOR / ENG
// 과제 5에서 만든 Pinia 언어 설정을 그대로 유지함.
// ---------------------------------------------------------
const messages = createMessages({
  formatDogAge: (...args) => formatDogAge(...args),
  getDogSizeLabel: (...args) => getDogSizeLabel(...args)
})

const t = (key, ...args) => {
  const value = messages[configStore.language][key]
  return typeof value === 'function' ? value(...args) : value
}

// ---------------------------------------------------------
// 2. 대한민국 시·도 → 장소·도로명·지번 검색 (Kakao Local)
// ---------------------------------------------------------
const selectedCityInfo = ref(null)
const currentTime = ref('')
const selectionRequest = createLatestRequest()
const {
  selectedProvince, searchQuery, searchSuggestions, searchLoading, searchMessage,
  suggestionRequest, updateProvince, resetSearch, searchWeather
} = usePlaceSearch({
  language: computed(() => configStore.language), isOnline, selectedCityInfo,
  searchPlaces: searchKoreanPlaces,
  onSelect: (location) => selectSuggestion(location),
  onQueryChanged: () => selectionRequest.invalidate(),
  onClear: () => {
    selectedCityInfo.value = null
    selectedNearestRestroom.value = null
    selectedRestroomMessage.value = ''
  },
  readableError: (...args) => getReadableApiError(...args)
})

const selectSuggestion = async (location) => {
  suggestionRequest.invalidate()
  const request = selectionRequest.start()
  searchLoading.value = true
  searchMessage.value = ''
  try {
    const result = await fetchWeatherAndAir(location)

    let region = null
    try {
      region = await reverseKoreanAddress(location.latitude, location.longitude)
    } catch (error) {
      console.warn('[검색 지역 행정동 조회 오류]', error)
    }

    if (!selectionRequest.isCurrent(request)) return
    const displayRegion = region?.addressName || selectedProvince.value
    const searchName = location.placeName || location.name || location.exactAddress || (configStore.language === 'en' ? 'Searched location' : '검색 위치')
    const exactAddress = location.exactAddress || location.roadAddress || location.addressName || ''
    const weather = {
      ...result.weather,
      aqi: result.airQuality.aqi,
      pm25: result.airQuality.pm25,
      pm10: result.airQuality.pm10,
      nameKo: displayRegion,
      nameEn: displayRegion,
      countryKo: '대한민국',
      countryEn: 'South Korea',
      admin1: region?.province || selectedProvince.value,
      district: region?.district || '',
      neighborhood: region?.neighborhood || '',
      addressName: displayRegion,
      searchName,
      searchAddress: exactAddress,
      routeName: searchName
    }

    selectedCityInfo.value = getDisplayWeather(weather)
    searchQuery.value = searchName
    searchSuggestions.value = []

    await loadSelectedRestroomForLocation({
      latitude: weather.latitude,
      longitude: weather.longitude,
      name: searchName,
      routeName: searchName,
      addressName: exactAddress || displayRegion,
      province: region?.province || selectedProvince.value,
      district: region?.district || '',
      neighborhood: region?.neighborhood || ''
    }, request)
  } catch (error) {
    if (!selectionRequest.isCurrent(request)) return
    console.error('[날씨 조회 오류]', error)
    searchMessage.value = getReadableApiError(error, configStore.language === 'en' ? 'Unable to load weather data.' : '날씨를 불러오지 못했어요.')
  } finally {
    if (selectionRequest.isCurrent(request)) searchLoading.value = false
  }
}

const getDisplayWeather = (weather) => ({
  ...weather,
  name: configStore.language === 'ko' ? (weather.nameKo || weather.name) : (weather.nameEn || weather.name),
  country: configStore.language === 'ko' ? '대한민국' : 'South Korea'
})


// ---------------------------------------------------------
// 3. 현재 위치 + 대기질 + 가까운 공중화장실
// Kakao Local API로 좌표 → 행정동(시/구/동) 변환과 주변 화장실 검색을 처리함.
// ---------------------------------------------------------
const selectedNearestRestroom = ref(null)
const selectedRestroomMessage = ref('')
const {
  currentLocation, currentWeather, currentAirQuality, nearestRestroom,
  locationMessage, restroomMessage, locationLoading
} = useLiveLocation({
  language: computed(() => configStore.language),
  getRestroomResult: (...args) => getRestroomResultForLocation(...args),
  readableError: (...args) => getReadableApiError(...args)
})

const getReadableApiError = (error, fallback) => {
  const status = error?.response?.status
  const message = error?.message || ''
  const isEnglish = configStore.language === 'en'

  if (status === 401 || status === 403) return isEnglish
    ? 'The weather service is temporarily unavailable. Please try again later.'
    : '날씨 서비스를 잠시 이용할 수 없어요. 잠시 후 다시 시도해주세요.'
  if (message.includes('API_KEY') || message.includes('KAKAO')) return isEnglish
    ? 'The location service is temporarily unavailable. Please try again later.'
    : '위치 서비스를 잠시 이용할 수 없어요. 잠시 후 다시 시도해주세요.'
  if (message.includes('Network Error')) return isEnglish
    ? 'Could not connect to the service. Check your connection and try again.'
    : '서비스에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.'
  return fallback
}

const getRestroomResultForLocation = async (location) => {
  try {
    const nearest = await fetchNearestPublicRestroom(location.latitude, location.longitude, 3000)
    return {
      nearest,
      message: nearest ? '' : (configStore.language === 'en'
        ? 'No registered public restroom was found within 3km.'
        : '주변 3km 내 카카오맵에 등록된 공중화장실을 찾지 못했어요.')
    }
  } catch (error) {
    console.error('[공중화장실 API 오류]', error)
    return {
      nearest: null,
      message: getReadableApiError(error, configStore.language === 'en' ? 'Unable to load public-restroom information.' : '공중화장실 정보를 불러오지 못했어요.')
    }
  }
}

const loadSelectedRestroomForLocation = async (location, request) => {
  selectedNearestRestroom.value = null
  selectedRestroomMessage.value = configStore.language === 'en' ? 'Checking nearby public restrooms...' : '검색한 지역의 공중화장실을 확인하는 중...'
  const result = await getRestroomResultForLocation(location)
  if (!selectionRequest.isCurrent(request)) return
  selectedNearestRestroom.value = result.nearest
  selectedRestroomMessage.value = result.message
}

// ---------------------------------------------------------
// 4. 반려견 프로필 + 산책 지수
// ---------------------------------------------------------
const dogProfile = reactive({ name: '', age: '', ageUnit: 'years', size: '대형견' })
const profileMessage = ref('')
const ageNotice = ref('')





const formatDogAge = (dog) => {
  const storedAge = Number(dog.age)
  // 개발 중 HMR로 남은 예전 프로필도 소수 살 대신 개월로 복원해서 보여준다.
  const inferredMonths = !dog.ageUnit && storedAge > 0 && storedAge < 1
  const unit = inferredMonths ? 'months' : (dog.ageUnit || 'years')
  const value = inferredMonths ? Math.max(1, Math.round(storedAge * 12)) : (dog.ageValue ?? dog.age)
  if (configStore.language === 'en') return unit === 'months' ? `${value} mo` : `${value} yr`
  return unit === 'months' ? `${value}개월` : `${value}살`
}

const updateDogAgeUnit = (unit) => {
  if (dogProfile.ageUnit === unit) return
  dogProfile.ageUnit = unit
  dogProfile.age = ''
}

watch(
  [() => dogProfile.age, () => dogProfile.size, () => dogProfile.ageUnit, () => configStore.language],
  ([newAge, newSize, newAgeUnit]) => {
    const age = getAgeInYears(newAge, newAgeUnit)
    const seniorAge = getSeniorAge(newSize)
    if (newAge === '' || Number.isNaN(age)) {
      ageNotice.value = ''
      return
    }
    if (age < 1) {
      ageNotice.value = configStore.language === 'ko'
        ? '1살 미만은 어린 강아지로 보고 더위·추위 산책 기준을 더 보수적으로 적용해요.'
        : 'Dogs under 1 year use more conservative hot/cold thresholds.'
    } else if (age >= seniorAge) {
      ageNotice.value = configStore.language === 'ko'
        ? `${newSize}은 ${seniorAge}살부터 시니어 기준으로 더 보수적으로 판단해요.`
        : `${getDogSizeLabel(newSize)} dogs use senior thresholds from age ${seniorAge}.`
    } else {
      ageNotice.value = ''
    }
  }
)

const saveDogProfile = () => {
  const name = String(dogProfile.name).trim()
  const ageValue = Number(dogProfile.age)
  const age = getAgeInYears(ageValue, dogProfile.ageUnit)
  if (!name) {
    ElMessage.warning(configStore.language === 'ko' ? '반려견 이름을 입력해주세요.' : 'Please enter a dog name.')
    return
  }
  const invalidMonths = dogProfile.ageUnit === 'months' && (!Number.isInteger(ageValue) || ageValue < 1 || ageValue > 11)
  const invalidYears = dogProfile.ageUnit === 'years' && (!Number.isInteger(ageValue) || ageValue < 1 || ageValue > 30)
  if (dogProfile.age === '' || Number.isNaN(ageValue) || invalidMonths || invalidYears) {
    const message = dogProfile.ageUnit === 'months'
      ? (configStore.language === 'ko' ? '반려견 나이를 1~11개월 사이로 입력해주세요.' : 'Please enter an age from 1 to 11 months.')
      : (configStore.language === 'ko' ? '반려견 나이를 1~30살 사이로 입력해주세요.' : 'Please enter an age from 1 to 30 years.')
    ElMessage.warning(message)
    return
  }
  profileStore.addDog({ name, age, ageValue, ageUnit: dogProfile.ageUnit, size: dogProfile.size })
  profileMessage.value = configStore.language === 'ko' ? `${name}의 프로필이 저장되었습니다.` : `${name}'s profile was saved.`
  ElMessage.success(profileMessage.value)
  dogProfile.name = ''
  dogProfile.age = ''
  dogProfile.ageUnit = 'years'
  dogProfile.size = '대형견'
}

const resetDogProfiles = () => {
  profileStore.resetProfiles()
  dogProfile.name = ''
  dogProfile.age = ''
  dogProfile.ageUnit = 'years'
  dogProfile.size = '대형견'
  ageNotice.value = ''
  profileMessage.value = configStore.language === 'ko' ? '저장된 반려견 프로필을 초기화했습니다.' : 'Saved dog profiles were reset.'
  ElMessage.success(profileMessage.value)
}

const getDogSizeLabel = (size) => {
  if (configStore.language === 'ko') return size
  if (size === '소형견') return 'Small'
  if (size === '중형견') return 'Medium'
  return 'Large'
}







const getVulnerabilityNote = (reasons) => {
  if (!reasons.length) return ''
  const labels = configStore.language === 'ko'
    ? { puppy: '어린 강아지', senior: '노령견', largeHeat: '대형견의 더위 부담', smallCold: '소형견의 추위 부담' }
    : { puppy: 'puppy age', senior: 'senior age', largeHeat: 'large-dog heat sensitivity', smallCold: 'small-dog cold sensitivity' }
  const reasonText = reasons.map((reason) => labels[reason]).join(configStore.language === 'ko' ? '·' : ', ')
  return configStore.language === 'ko'
    ? `${reasonText}을 반영해 환경 기준보다 위험도를 한 단계 높였어요.`
    : `Risk was raised one level for ${reasonText}.`
}

const getWalkLevel = (weather, dog) => {
  if (!weather) {
    return { level: '정보없음', className: 'walk-light', icon: 'paw', shortLabel: '-', message: configStore.language === 'en' ? 'Loading weather information...' : '날씨 정보를 불러오는 중이에요.', description: '' }
  }

  const { level, reasons } = classifyWalkConditions(weather, dog)
  const vulnerabilityNote = getVulnerabilityNote(reasons)

  const resultByLevel = {
    위험: {
      className: 'walk-ban', icon: 'paw', shortLabel: configStore.language === 'ko' ? '위험' : 'Danger',
      message: configStore.language === 'ko' ? `${dog.name || '우리 아이'}는 오늘 실외 산책을 피해주세요.` : 'Avoid outdoor walking today.',
      description: configStore.language === 'ko' ? '폭우·뇌우·강한 더위·추위·강풍 또는 매우 나쁜 대기질처럼 부담이 큰 조건이에요.' : 'Severe weather or very poor air quality makes a normal walk unsuitable.'
    },
    주의: {
      className: 'walk-caution', icon: 'paw', shortLabel: configStore.language === 'ko' ? '주의' : 'Caution',
      message: configStore.language === 'ko' ? `${dog.name || '우리 아이'}는 산책 시간을 줄여주세요.` : 'Keep the walk short.',
      description: configStore.language === 'ko' ? '날씨와 대기질 부담을 고려해 짧게 산책하고 상태를 자주 확인해주세요.' : 'Weather and air quality suggest a shorter walk.'
    },
    '가벼운 산책 가능': {
      className: 'walk-light', icon: 'paw', shortLabel: configStore.language === 'ko' ? '가벼운 산책' : 'Light walk',
      message: configStore.language === 'ko' ? `${dog.name || '우리 아이'}는 가볍게 산책 가능해요.` : 'A light walk is okay.',
      description: configStore.language === 'ko' ? '날씨와 대기질을 고려해 무리하지 않고 짧게 산책해주세요.' : 'Keep the walk light based on weather and air quality.'
    },
    안전: {
      className: 'walk-safe', icon: 'paw', shortLabel: configStore.language === 'ko' ? '안전' : 'Safe',
      message: configStore.language === 'ko' ? `${dog.name || '우리 아이'}가 산책하기 비교적 좋은 날씨예요!` : 'Good conditions for a walk!',
      description: configStore.language === 'ko' ? '비교적 부담이 낮지만 산책 중 상태는 계속 확인해주세요.' : 'Conditions are relatively comfortable; keep monitoring your dog.'
    }
  }

  const result = resultByLevel[level]
  return { level, ...result, description: vulnerabilityNote ? `${result.description} ${vulnerabilityNote}` : result.description }
}



const primaryDog = computed(() => profileStore.primaryDog)
const primaryDogDisplay = computed(() => primaryDog.value ? { ...primaryDog.value, sizeLabel: getDogSizeLabel(primaryDog.value.size) } : null)

const currentWeatherForWalk = computed(() => {
  if (!currentWeather.value) return null
  return { ...currentWeather.value, aqi: currentAirQuality.value?.aqi || 0 }
})

const isCurrentLocationMode = computed(() => !selectedCityInfo.value)

const activeDashboardLocation = computed(() => {
  if (selectedCityInfo.value) {
    return {
      latitude: selectedCityInfo.value.latitude,
      longitude: selectedCityInfo.value.longitude,
      name: selectedCityInfo.value.searchName || selectedCityInfo.value.addressName || selectedCityInfo.value.name,
      routeName: selectedCityInfo.value.routeName || selectedCityInfo.value.searchName || '',
      nameEn: selectedCityInfo.value.nameEn || selectedCityInfo.value.name,
      addressName: selectedCityInfo.value.addressName || selectedCityInfo.value.name,
      province: selectedCityInfo.value.admin1 || selectedProvince.value,
      district: selectedCityInfo.value.district || '',
      neighborhood: selectedCityInfo.value.neighborhood || '',
      accuracy: null
    }
  }
  return currentLocation.value
})

const activeDashboardWeather = computed(() => selectedCityInfo.value || currentWeather.value)

const activeDashboardAirQuality = computed(() => {
  if (selectedCityInfo.value) {
    return {
      aqi: selectedCityInfo.value.aqi || 0,
      pm25: selectedCityInfo.value.pm25 || 0,
      pm10: selectedCityInfo.value.pm10 || 0
    }
  }
  return currentAirQuality.value
})

const activeDashboardRestroom = computed(() =>
  selectedCityInfo.value ? selectedNearestRestroom.value : nearestRestroom.value
)

const activeDashboardRestroomMessage = computed(() =>
  selectedCityInfo.value ? selectedRestroomMessage.value : restroomMessage.value
)

const activeDashboardMessage = computed(() =>
  selectedCityInfo.value ? searchMessage.value : locationMessage.value
)

const activeWalkWeather = computed(() => {
  if (selectedCityInfo.value) return selectedCityInfo.value
  if (currentWeatherForWalk.value) {
    return getDisplayWeather({
      ...currentWeatherForWalk.value,
      nameKo: currentLocation.value?.addressName || currentLocation.value?.name || '현재 위치',
      nameEn: currentLocation.value?.nameEn || currentLocation.value?.name || 'Current location'
    })
  }
  return null
})

const activeDashboardWalk = computed(() => {
  if (!primaryDog.value || !activeWalkWeather.value) return null
  return getWalkLevel(activeWalkWeather.value, primaryDog.value)
})

const activeDashboardDogFeelsLike = computed(() => {
  const weather = activeDashboardWeather.value
  if (!primaryDog.value || !weather) return null
  return getWalkEnvironmentFeelsLike(weather.temp, weather.humidity, weather.wind)
})

const contextualWalkTip = computed(() => {
  const weather = activeDashboardWeather.value
  const air = activeDashboardAirQuality.value
  const isEnglish = configStore.language === 'en'
  if (!weather) {
    return {
      icon: 'location',
      title: isEnglish ? 'Location needed' : '위치 확인이 필요해요',
      text: isEnglish ? 'Allow location access to get a tip for current conditions.' : '현재 상황에 맞는 팁을 보려면 위치 권한을 허용해주세요.',
      className: 'tip-neutral'
    }
  }
  if (['뇌우', '폭우', '눈'].includes(weather.status) || Number(weather.rain) >= 70) {
    return { icon: 'home', title: isEnglish ? 'Indoor play today' : '오늘은 실내 놀이', text: isEnglish ? 'Heavy precipitation is expected, so replace the walk with indoor activity.' : '강한 비나 눈이 예상돼 산책 대신 실내 노즈워크를 추천해요.', className: 'tip-danger' }
  }
  if (Number(air?.aqi) >= 4) {
    return { icon: 'air', title: isEnglish ? 'Air quality warning' : '대기질 경고', text: isEnglish ? 'Keep only a short bathroom walk and monitor breathing.' : '배변 산책만 짧게 하고 강아지의 호흡 상태를 확인해주세요.', className: 'tip-danger' }
  }
  if (Number(weather.feelsLike) >= 30 || Number(weather.temp) >= 28) {
    return { icon: 'paw', title: isEnglish ? 'Check the pavement' : '발바닥 온도 확인', text: isEnglish ? 'Walk after sunset and test the pavement with the back of your hand.' : '해가 진 뒤 산책하고, 출발 전 손등으로 바닥 온도를 확인해주세요.', className: 'tip-hot' }
  }
  if (Number(weather.rain) >= 30 || weather.status === '비') {
    return { icon: 'rain', title: isEnglish ? 'Pack a rain kit' : '비 오는 날 준비', text: isEnglish ? 'Bring a raincoat and towel, then dry paws and fur after the walk.' : '우비와 수건을 챙기고 산책 후 발과 털을 충분히 말려주세요.', className: 'tip-rain' }
  }
  if (Number(air?.aqi) >= 3) {
    return { icon: 'air', title: isEnglish ? 'Keep it short' : '짧게 산책하기', text: isEnglish ? 'Air quality is not ideal, so shorten the walk and take breaks.' : '대기질이 좋지 않아 평소보다 짧게 걷고 중간중간 쉬어주세요.', className: 'tip-caution' }
  }
  if (Number(weather.feelsLike) <= 5) {
    return { icon: 'cold', title: isEnglish ? 'Protect from the cold' : '찬 바람 조심', text: isEnglish ? 'Keep the walk short and check paws, ears and the tip of the tail.' : '산책 시간을 줄이고 발바닥·귀·꼬리 끝의 냉기 노출을 확인해주세요.', className: 'tip-cold' }
  }
  return { icon: 'humidity', title: isEnglish ? 'A comfortable walk' : '가볍게 산책하기 좋은 날', text: isEnglish ? 'Bring water and check your dog’s pace during a comfortable walk.' : '물을 챙기고 강아지의 걸음 속도를 살피며 여유롭게 걸어보세요.', className: 'tip-good' }
})

const savedDogWalkList = computed(() => {
  const city = activeWalkWeather.value
  if (!city) return []

  return profileStore.savedDogs.map((dog) => {
    const walk = getWalkLevel(city, dog)
    return {
      ...dog,
      cityName: city.name,
      temp: city.temp,
      feelsLike: city.feelsLike,
      humidity: city.humidity,
      rain: city.rain,
      wind: city.wind,
      status: city.status,
      aqi: city.aqi || 0,
      dogFeelsLike: getWalkEnvironmentFeelsLike(city.temp, city.humidity, city.wind),
      walkLevel: walk.level,
      walkDisplayLevel: walk.shortLabel,
      walkClass: walk.className,
      walkIcon: walk.icon,
      walkMessage: walk.message,
      walkDescription: walk.description,
      walkRecommendedMinutes: getRecommendedWalkMinutes(dog, walk.level)
    }
  })
})

// ---------------------------------------------------------
// 5. 화면 표시용 함수
// ---------------------------------------------------------
const updateCurrentTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${year}.${month}.${day} ${hour}:${minute}`
}

let timerId = null

onMounted(() => {
  updateCurrentTime()
  timerId = setInterval(updateCurrentTime, 60 * 1000)
})

onUnmounted(() => {
  suggestionRequest.invalidate()
  selectionRequest.invalidate()
  clearInterval(timerId)
})
</script>

<template>
  <div class="paweather-page" :class="{ 'reduce-motion': preferredMotion === 'reduce' }">
    <PaweatherHeader :logo="paweatherLogo" :weather-label="t('navWeather')" :donate-label="t('navDonate')" />

    <div v-if="!isOnline" class="offline-alert-shell" role="status" aria-live="polite">
      <el-alert :title="t('offlineTitle')" :description="t('offlineDescription')" type="warning" show-icon :closable="false" />
    </div>

    <main class="page-container">
      <section class="hero-profile-grid">
        <section class="hero">
          <img :src="dogHero" alt="Dogs" class="hero-image" />
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="hero-chip"><PaIcon name="paw" />{{ t('heroChip') }}</div>
            <h1>{{ t('heroLine1') }}<br /><span>{{ t('heroToday') }}</span></h1>
            <p>{{ t('heroDescription1') }}<br />{{ t('heroDescription2') }}</p>
            <a href="#walk" class="hero-button"><PaIcon name="paw" />{{ t('heroButton') }}</a>
          </div>
        </section>

        <DogProfileForm
          :name="dogProfile.name" :age="dogProfile.age" :age-unit="dogProfile.ageUnit" :size="dogProfile.size"
          :saved-count="profileStore.savedCount" :profile-message="profileMessage" :age-notice="ageNotice"
          :labels="{
            profileTitle: t('profileTitle'), savedCount: (count) => t('savedCount', count),
            name: t('name'), age: t('age'), years: t('years'), months: t('months'), ageUnit: t('ageUnit'), size: t('size'),
            dogNamePlaceholder: t('dogNamePlaceholder'), smallDog: t('smallDog'), mediumDog: t('mediumDog'),
            largeDog: t('largeDog'), saveProfile: t('saveProfile'), resetProfile: t('resetProfile'),
            nameRequired: t('nameRequired'), nameLength: t('nameLength'), ageRequired: t('ageRequired'),
            monthRange: t('monthRange'), yearRange: t('yearRange'), sizeRequired: t('sizeRequired'),
            resetConfirmTitle: t('resetConfirmTitle'), resetConfirmText: t('resetConfirmText'),
            confirm: t('confirm'), cancel: t('cancel')
          }"
          @update-name="dogProfile.name = $event" @update-age="dogProfile.age = $event" @update-age-unit="updateDogAgeUnit" @update-size="dogProfile.size = $event"
          @save="saveDogProfile" @reset="resetDogProfiles"
        />
      </section>

      <div class="main-grid">
        <div id="weather" class="weather-column">
          <BaseDashboardCard variant="search">
            <SearchBar
              :query="searchQuery" :selected-province="selectedProvince" :province-options="provinceOptions"
              :suggestions="searchSuggestions" :is-loading="searchLoading" :message="searchMessage"
              :labels="{
                searchTitle: t('searchTitle'), province: t('province'), area: t('area'),
                searchPlaceholder: t('searchPlaceholder'), search: t('search'), reset: t('reset')
              }"
              @update-query="searchQuery = $event" @update-province="updateProvince"
              @search="searchWeather" @reset="resetSearch" @select-suggestion="selectSuggestion"
            />
          </BaseDashboardCard>

          <CurrentLocationDashboard
            :current-location="activeDashboardLocation" :weather="activeDashboardWeather" :air-quality="activeDashboardAirQuality"
            :nearest-restroom="activeDashboardRestroom" :location-message="activeDashboardMessage" :restroom-message="activeDashboardRestroomMessage"
            :is-loading="isCurrentLocationMode ? locationLoading : searchLoading"
            :is-current-location="isCurrentLocationMode"
            :basis-time="currentTime"
            :dog="primaryDogDisplay" :walk="activeDashboardWalk" :dog-feels-like="activeDashboardDogFeelsLike"
            :dog-walks="savedDogWalkList"
            :evaluate-dog-walk="getWalkLevel"
          />
        </div>

        <WalkIndexPanel
          :dogs="savedDogWalkList"
          :location-name="activeWalkWeather?.name || '-'"
          :labels="{
            walkIndex: t('walkIndex'), basedOn: (name) => t('basedOn', name), dogWalkTitle: (dog) => t('dogWalkTitle', dog),
            dogFeelsLike: (name, temp, unit) => t('dogFeelsLike', name, temp, unit), dogFeelsLikeNote: t('dogFeelsLikeNote'),
            recommendedTime: (minutes) => t('recommendedTime', minutes), temperature: t('temperature'), humidity: t('humidity'), rainChance: t('rainChance'),
            guardianTip: t('guardianTip'), mustCheck: t('mustCheck'), tipAsphalt: t('tipAsphalt'), tipRain: t('tipRain'), tipCold: t('tipCold'),
            tipAir: t('tipAir'), tipDanger: t('tipDanger'), tipCaution: t('tipCaution'), tipNormal: t('tipNormal'), tipWater: t('tipWater'),
            noDogTitle: t(profileStore.savedCount ? 'noWeatherTitle' : 'noDogTitle'),
            noDogDescription: t(profileStore.savedCount ? 'noWeatherDescription' : 'noDogDescription')
          }"
        />
      </div>

      <ServiceSummarySection
        :tip="contextualWalkTip"
        :labels="{
          aboutTitle: t('aboutTitle'), aboutDescription1: t('aboutDescription1'), aboutDescription2: t('aboutDescription2'),
          featureWeather: t('featureWeather'), featureWeatherDesc: t('featureWeatherDesc'), featureRefresh: t('featureRefresh'), featureRefreshDesc: t('featureRefreshDesc'),
          featureDog: t('featureDog'), featureDogDesc: t('featureDogDesc'), guideTitle: t('guideTitle'), banner1: t('banner1'), banner2: t('banner2'), info: t('info')
        }"
      />
    </main>

    <PaweatherFooter :links="t('footerLinks')" />
  </div>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
.offline-alert-shell { width: min(1760px,calc(100% - 40px)); margin: 12px auto 0; }
.offline-alert-shell :deep(.el-alert) { border: 1px solid #f0d8a7; border-radius: 14px; }
.reduce-motion * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
:global(html) { scroll-behavior: smooth; scroll-padding-top: 90px; overflow-x: hidden; }
:global(html), :global(body), :global(#app) { width: 100%; max-width: 100%; margin: 0; padding: 0; overflow-x: hidden; }
:global(body) { min-width: 320px; min-height: 100vh; display: block; background: #fbfaf7; color: #2d332f; font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif; }
:global(#app) { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; grid-template-columns: none !important; text-align: left; }
.paweather-page { width: 100%; min-height: 100vh; background: linear-gradient(180deg, #fffdfa 0%, #f8fbf8 48%, #fbfaf7 100%); overflow-x: clip; }
#weather, #walk { scroll-margin-top: 90px; }
/* ------------------------------ Header ------------------------------ */
.top-header { position: sticky; top: 0; z-index: 30; width: 100%; border-bottom: 1px solid #ece9e2; background: rgba(255, 254, 251, 0.96); backdrop-filter: blur(12px); }
.header-inner { width: 100%; height: 86px; padding: 0 clamp(24px, 4vw, 64px); display: flex; align-items: center; gap: 28px; }
.brand { display: flex; align-items: center; flex-shrink: 0; gap: 10px; }
.brand-mark { width: 68px; height: 52px; object-fit: contain; object-position: center; }
.brand-text { display: flex; flex-direction: column; justify-content: center; }
.brand-name { color: #2f2c28; font-size: 30px; font-weight: 900; line-height: 1; letter-spacing: -1px; }
.brand-sub { margin-top: 5px; color: #7a746c; font-size: 11px; font-weight: 600; }
.navigation { flex: 1; min-width: 0; display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: nowrap; }
.navigation a { position: relative; padding: 31px 2px 27px; color: #4d4b47; text-decoration: none; font-size: 15px; font-weight: 800; white-space: nowrap; }
.navigation a::after { content: ''; position: absolute; right: 0; bottom: 16px; left: 0; height: 2px; border-radius: 999px; background: transparent; }
.navigation a:hover, .navigation .active { color: #3f9274; }
.navigation a:hover::after, .navigation .active::after { background: #55a988; }
.header-icons { display: flex; justify-content: flex-end; align-items: center; flex-shrink: 0; margin-right: 56px; gap: 20px; color: #474842; font-size: 25px; }
.language-toggle { height: 36px; padding: 0 11px; display: inline-flex; align-items: center; gap: 5px; border: 1px solid #dfe3dd; border-radius: 999px; background: #fff; color: #9a9d97; font-size: 10px; font-weight: 900; cursor: pointer; }
.language-toggle span.active { color: #3f9274; }
.language-toggle i { color: #c7cac5; font-style: normal; }
/* ------------------------------ 전체 레이아웃 ------------------------------ */
.page-container { width: 100%; padding: 0 clamp(24px, 3vw, 48px) 48px; }
.hero-profile-grid { width: 100%; display: grid; grid-template-columns: minmax(0, 1.95fr) minmax(330px, 0.95fr); gap: 20px; padding-top: 18px; }
/* ------------------------------ Hero ------------------------------ */
.hero { position: relative; height: 360px; overflow: hidden; border: 1px solid #eee9df; border-radius: 28px; background: #f8f5ee; box-shadow: 0 12px 30px rgba(88, 78, 60, 0.07); }
.hero-image { width: 100%; height: 100%; object-fit: cover; object-position: center 47%; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient( 90deg, rgba(255, 253, 247, 0.98) 0%, rgba(255, 253, 247, 0.93) 33%, rgba(255, 253, 247, 0.53) 52%, rgba(255, 253, 247, 0.08) 70%, rgba(255, 253, 247, 0) 100% ); }
.hero-content { position: absolute; top: 50%; left: clamp(32px, 4.5vw, 72px); z-index: 2; width: min(470px, 50%); transform: translateY(-50%); }
.hero-chip { display: inline-flex; align-items: center; margin-bottom: 18px; padding: 8px 12px; border: 1px solid #dfece5; border-radius: 999px; background: rgba(255, 255, 255, 0.88); color: #5f8c79; font-size: 11px; font-weight: 800; gap: 6px; }
.hero-content h1 { margin: 0 0 16px; color: #2c302d; font-size: clamp(34px, 3vw, 50px); line-height: 1.18; letter-spacing: -2px; }
.hero-content h1 span { color: #4d9d7d; }
.hero-content p { margin: 0 0 24px; color: #575c57; font-size: 15px; line-height: 1.7; }
.hero-button { display: inline-flex; align-items: center; padding: 14px 21px; border-radius: 999px; background: linear-gradient(135deg, #58a989, #3f9274); color: #fff; text-decoration: none; font-size: 13px; font-weight: 900; box-shadow: 0 10px 22px rgba(74, 154, 123, 0.2); gap: 7px; }
/* ------------------------------ 아래 2열 ------------------------------ */
.main-grid { width: 100%; min-width: 0; margin-top: 20px; display: grid; grid-template-columns: minmax(0, 1.95fr) minmax(330px, 0.95fr); gap: 20px; align-items: stretch; }
.weather-column, .main-grid > *, .bottom-grid > * { min-width: 0; }
/* ------------------------------ Weather ------------------------------ */
.walk-section, .about-box, .guide-box { border: 1px solid #e8e5dd; border-radius: 24px; background: rgba(255, 255, 255, 0.96); box-shadow: 0 10px 26px rgba(88, 78, 60, 0.055); }
.section-header, .walk-section-header { min-height: 54px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.section-header h2, .walk-section-header h2 { margin: 5px 0 0; color: #363833; font-size: 17px; }
.walk-section-header h2 small { color: #7a7f79; font-size: 12px; font-weight: 700; }
.update-time { color: #898d87; font-size: 10px; white-space: nowrap; }
/* ------------------------------ Walk result ------------------------------ */
.walk-section { width: 100%; height: 100%; padding: 18px; }
.walk-section-header { padding: 0 2px; }
.walk-refresh { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #e1e4df; border-radius: 50%; background: #fff; color: #6b756c; font-size: 19px; cursor: pointer; }
.walk-refresh:hover { background: #f2f8f4; color: #3f9274; }
.saved-dog-list { display: flex; flex-direction: column; gap: 14px; }
.dog-walk-result { overflow: hidden; border: 1px solid #e7e5df; border-radius: 18px; background: #fff; }
.dog-result-header { padding: 16px 16px 10px; }
.dog-result-header h2 { margin: 5px 0 0; color: #373a35; font-size: 14px; line-height: 1.45; }
.dog-result-header p { margin: 6px 0 0; color: #777d76; font-size: 11px; }
.dog-result-header p strong { font-size: 12px; }
.dog-feels-like { margin: 0 14px 12px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; border: 1px solid #e5eee9; border-radius: 13px; background: #f4faf6; }
.dog-feels-like > .pa-icon { color: #4d8b70; font-size: 20px; }
.dog-feels-like div { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.dog-feels-like strong { color: #3f765f; font-size: 12px; }
.dog-feels-like small { color: #89918b; font-size: 9px; }
.walk-main { margin: 0 12px 10px; padding: 15px; border-radius: 15px; }
.walk-status { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.walk-copy { min-width: 0; }
.walk-status h3 { margin: 0 0 5px; font-size: 21px; }
.walk-status strong { color: #484d47; font-size: 11px; line-height: 1.5; }
.walk-main > p { margin: 10px 0 0; color: #666d65; font-size: 10px; line-height: 1.6; }
.dog-motion-track { position: relative; height: 138px; margin-top: 12px; overflow: hidden; border: 1px dashed rgba(95, 112, 100, 0.22); border-radius: 13px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(250, 248, 241, 0.56)); cursor: pointer; }
.motion-ground { position: absolute; right: 10px; bottom: 14px; left: 10px; height: 2px; border-radius: 999px; background: rgba(102, 111, 103, 0.12); }
.dog-motion-image { position: absolute; left: 12px; bottom: 15px; z-index: 2; width: 110px; height: 110px; object-fit: contain; object-position: center bottom; user-select: none; -webkit-user-drag: none; transform-origin: center bottom; filter: drop-shadow(0 6px 8px rgba(71, 77, 71, 0.1)); }
.dog-motion-image.motion-danger { width: 125px; }
.walk-safe { color: #43825f; background: linear-gradient(180deg, #eef8f1, #f8fcf9); }
.walk-light { color: #b67a20; background: linear-gradient(180deg, #fff7e8, #fffaf2); }
.walk-danger { color: #d66b48; background: linear-gradient(180deg, #fff0ea, #fff8f5); }
.walk-ban { color: #d6524d; background: linear-gradient(180deg, #ffeded, #fff8f7); }
.walk-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; padding: 0 12px; }
.walk-metrics > div { padding: 9px 5px; border: 1px solid #ebe8e2; border-radius: 11px; background: #fff; text-align: center; }
.walk-metrics span, .walk-metrics small, .walk-metrics strong { display: block; }
.walk-metrics span { font-size: 14px; }
.walk-metrics .pa-icon { display: block; margin: 0 auto; color: #628879; font-size: 14px; }
.walk-metrics small { margin: 3px 0; color: #92968f; font-size: 8px; }
.walk-metrics strong { color: #3e433d; font-size: 10px; }
.guardian-tip { position: relative; margin: 10px 12px 14px; padding: 12px 40px 12px 12px; border: 1px solid #e8e7e1; border-radius: 12px; background: #fbfcfa; }
.tip-title-row { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; }
.guardian-tip h3 { margin: 0; color: #4e8b70; font-size: 10px; }
.tip-badge { padding: 4px 6px; border-radius: 999px; background: #eef7f2; color: #6f8c7e; font-size: 8px; font-weight: 800; }
.guardian-tip ul { margin: 0; padding-left: 15px; color: #656b64; font-size: 9px; line-height: 1.7; }
.tip-dog { position: absolute; right: 13px; bottom: 10px; font-size: 22px; }
.no-dog-profile { padding: 36px 18px; border: 1px dashed #d9ded8; border-radius: 16px; background: #fbfcfa; color: #80877f; text-align: center; }
.no-dog-profile > .pa-icon { display: block; margin: 0 auto 8px; color: #62927d; font-size: 27px; }
.no-dog-profile strong { display: block; color: #555d55; font-size: 12px; }
.no-dog-profile p { margin: 7px 0 0; font-size: 10px; line-height: 1.6; }
/* ------------------------------ Bottom ------------------------------ */
.bottom-grid { width: 100%; margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.about-box, .guide-box { padding: 22px; }
.about-box h2, .guide-box h2 { margin: 0 0 12px; color: #373a35; font-size: 17px; }
.about-description { color: #686d66; font-size: 12px; line-height: 1.6; }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
.feature { padding: 16px 12px; border-radius: 14px; background: #fafbf9; text-align: center; }
.feature-icon { width: 44px; height: 44px; margin: 0 auto 9px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 21px; }
.feature-icon.blue { background: #edf5f8; }
.feature-icon.green { background: #edf7f1; }
.feature-icon.purple { background: #f5f1f8; }
.feature strong { color: #434943; font-size: 11px; }
.feature p { color: #898f88; font-size: 9px; line-height: 1.5; }
.guide-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
.guide { padding: 15px 8px; border-radius: 14px; text-align: center; }
.guide strong, .guide span { display: block; }
.guide span { margin: 8px 0; font-size: 24px; }
.guide p { margin: 0; font-size: 9px; }
.guide.safe { background: #edf7f0; }
.guide.light { background: #fff7e8; }
.guide.risk { background: #fff0e9; }
.guide.ban { background: #ffeded; }
.contextual-tip { min-height: 118px; padding: 20px; display: flex; align-items: center; gap: 16px; border-radius: 16px; background: #edf7f0; }
.contextual-tip-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; border-radius: 16px; background: rgba(255,255,255,.72); font-size: 27px; }
.contextual-tip strong { display: block; color: #34443a; font-size: 14px; }
.contextual-tip p { margin: 7px 0 0; color: #68736b; font-size: 10px; line-height: 1.6; }
.contextual-tip.tip-hot,.contextual-tip.tip-caution { background: #fff5df; }
.contextual-tip.tip-rain,.contextual-tip.tip-cold { background: #edf4fb; }
.contextual-tip.tip-danger { background: #ffeded; }
.contextual-tip.tip-neutral { background: #f3f5f3; }
.bottom-banner { margin-top: 20px; padding: 20px 26px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e6e7df; border-radius: 20px; background: linear-gradient(90deg, #f1f8f3, #fff8ec); color: #5e685f; font-size: 14px; line-height: 1.6; }
.bottom-banner strong { color: #478267; }
.bottom-banner > .pa-icon { color: #589276; font-size: 40px; }
.information-bar { margin-top: 12px; padding: 9px; color: #8d928b; font-size: 10px; text-align: center; }
.information-bar .pa-icon { color: #65917d; }
.information-bar a { color: #5d8d78; font-weight: 800; text-decoration: none; }
.information-bar a:hover { text-decoration: underline; }
/* ------------------------------ Footer ------------------------------ */
.footer { width: 100%; padding: 26px clamp(24px, 4vw, 64px); border-top: 1px solid #e5e3dc; background: #f7f5ef; color: #5f625d; }
.footer-inner { width: 100%; display: flex; align-items: center; gap: 40px; }
.footer-brand { display: flex; flex-direction: column; font-size: 13px; }
.footer-brand strong { color: #353934; font-size: 18px; }
.footer-brand small { color: #92958f; }
.footer-links { flex: 1; font-size: 10px; }
.copyright { font-size: 9px; color: #999c96; }
/* ------------------------------ Responsive ------------------------------ */
@media (max-width: 1250px) {
  .hero-profile-grid, .main-grid { grid-template-columns: minmax(0, 1.55fr) minmax(310px, 0.85fr); }
}
@media (max-width: 980px) {
  .navigation { display: none; }
  .header-icons { margin-left: auto; }
  .hero-profile-grid, .main-grid, .bottom-grid { grid-template-columns: 1fr; }
  .hero { height: 340px; }
}
@media (max-width: 720px) {
  .header-inner { height: 72px; padding: 0 16px; }
  .brand-mark { width: 72px; height: 54px; transform: scale(1.05); }
  .brand-name { font-size: 23px; }
  .page-container { padding: 0 12px 34px; }
  .hero-profile-grid { padding-top: 12px; }
  .hero { height: 390px; border-radius: 20px; }
  .hero-image { object-position: 58% center; }
  .hero-overlay { background: linear-gradient( 90deg, rgba(255, 253, 247, 0.96), rgba(255, 253, 247, 0.65) ); }
  .hero-content { left: 24px; width: 78%; }
  .hero-content h1 { font-size: 31px; }
  .walk-section, .about-box, .guide-box { border-radius: 20px; }
  .feature-grid, .guide-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .header-icons { gap: 14px; font-size: 21px; }
  .hero { height: 410px; }
  .hero-content { left: 20px; width: 84%; }
  .hero-content h1 { font-size: 28px; }
  .walk-status { align-items: flex-start; flex-direction: column; }
  .walk-metrics { grid-template-columns: 1fr 1fr; }
  .feature-grid, .guide-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; align-items: flex-start; gap: 14px; }
}
/* ========================================================= 2차 디자인 보정 - 기능/내용 변경 없음 - Hero 강아지 노출 범위 확대 - 카드/타이포/간격 보정 - 프로필 사진 업로드 없음 ========================================================= */
:global(body) { background: #faf9f5; }
/* Header */
.top-header { background: rgba(255, 254, 251, 0.98); box-shadow: 0 4px 18px rgba(75, 67, 54, 0.035); }
.header-inner { height: 90px; }
.brand-mark { width: 94px; height: 70px; transform: scale(1.12); transform-origin: left center; }
.brand-name { font-size: 31px; }
.navigation a { font-size: 16px; }
/* Hero + Profile */
.hero-profile-grid { gap: 22px; padding-top: 20px; }
.hero { height: 455px; border-radius: 30px; background: linear-gradient(90deg, #fffdf8 0%, #f7f3e9 42%, #eef2e8 100%); }
.hero-image { position: absolute; top: 0; right: 0; width: 74%; height: 100%; object-fit: contain; object-position: right center; }
.hero-overlay { background: linear-gradient( 90deg, rgba(255, 253, 247, 0.98) 0%, rgba(255, 253, 247, 0.94) 29%, rgba(255, 253, 247, 0.72) 40%, rgba(255, 253, 247, 0.25) 56%, rgba(255, 253, 247, 0) 72% ); }
.hero-content { left: clamp(36px, 4.8vw, 78px); width: min(500px, 51%); }
.hero-content h1 { margin-bottom: 18px; font-size: clamp(40px, 3.25vw, 54px); line-height: 1.16; }
.hero-content p { margin-bottom: 27px; font-size: 16px; }
.hero-button { padding: 15px 23px; font-size: 14px; }
/* Weather */
.section-header, .walk-section-header { margin-bottom: 18px; }
.section-header h2, .walk-section-header h2 { font-size: 19px; }
/* Walk result */
.walk-section { padding: 22px; }
.no-dog-profile { min-height: 145px; padding: 32px 18px; display: flex; flex-direction: column; justify-content: center; }
.dog-walk-result { border-radius: 20px; }
.dog-result-header { padding: 18px 18px 12px; }
.dog-result-header h2 { font-size: 15px; }
.walk-main { margin: 0 14px 12px; padding: 17px; }
.walk-status h3 { font-size: 23px; }
.walk-status strong { font-size: 12px; }
.walk-main > p { font-size: 11px; }
.dog-motion-track { height: 150px; }
.dog-motion-image { width: 120px; height: 120px; }
.dog-motion-image.motion-danger { width: 136px; }
.walk-metrics { gap: 8px; padding: 0 14px; }
.walk-metrics > div { padding: 10px 6px; }
.guardian-tip { margin: 11px 14px 15px; }
/* Bottom */
.bottom-grid { margin-top: 22px; gap: 22px; }
.about-box, .guide-box { padding: 24px; }
.about-box h2, .guide-box h2 { font-size: 18px; }
.feature { min-height: 118px; }
.bottom-banner { margin-top: 22px; }
/* 노트북/태블릿 */
@media (max-width: 1250px) and (min-width: 981px) {
  .hero { height: 405px; }
  .hero-image { width: 76%; object-fit: contain; object-position: right center; }
  .hero-content h1 { font-size: 42px; }
}
/* 태블릿 이하 */
@media (max-width: 980px) {
  .hero { height: 400px; }
  .hero-image { width: 76%; object-fit: contain; object-position: right center; }
}
/* 모바일 */
@media (max-width: 720px) {
  .hero { height: 430px; }
  .hero-image { width: 100%; object-fit: contain; object-position: right center; }
  .hero-content { width: 82%; }
  .hero-content h1 { font-size: 32px; }
  .hero-content p { font-size: 14px; }
  .walk-section { padding: 16px; }
}
.walk-duration-badge { display: inline-flex; width: fit-content; margin: 1px 0 6px; padding: 4px 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.72); color: currentColor; font-size: 9px; font-weight: 900; }
</style>

<style scoped>
.static-dog-track { cursor: default; }
.static-dog-image { left: 50%; transform: translateX(-50%); }
</style>
