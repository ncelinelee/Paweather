import { ref, onMounted, onScopeDispose } from 'vue'
import { fetchWeatherAndAir } from '../services/weatherApi.js'
import { reverseKoreanAddress, getDistanceKm } from '../services/kakaoLocalApi.js'
import { createLatestRequest } from '../utils/latestRequest.js'

export const useLiveLocation = ({ language, getRestroomResult, readableError }) => {
  const currentLocation = ref(null)
  const currentWeather = ref(null)
  const currentAirQuality = ref(null)
  const nearestRestroom = ref(null)
  const locationMessage = ref('')
  const restroomMessage = ref('')
  const locationLoading = ref(true)
  const requestGate = createLatestRequest()
  let locationWatchId = null
  let lastWeatherFetchLocation = null

  const loadRestroomForLocation = async (location, request) => {
    const result = await getRestroomResult(location)
    if (!requestGate.isCurrent(request)) return
    nearestRestroom.value = result.nearest
    restroomMessage.value = result.message
  }

  const loadLiveWeather = async (location, request) => {
    try {
      const result = await fetchWeatherAndAir(location)
      if (!requestGate.isCurrent(request)) return
      currentWeather.value = result.weather
      currentAirQuality.value = result.airQuality
      lastWeatherFetchLocation = { ...location }
      locationMessage.value = ''
    } catch (error) {
      if (!requestGate.isCurrent(request)) return
      console.error('[현재 위치 날씨 오류]', error)
      locationMessage.value = readableError(error, language.value === 'en' ? 'Unable to load weather and air quality for your location.' : '현재 위치의 날씨·대기질을 불러오지 못했어요.')
    }
  }

  const handlePosition = async (position) => {
    const request = requestGate.start()
    const rawLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy || 0),
      name: currentLocation.value?.name || '현재 위치',
      addressName: currentLocation.value?.addressName || '',
      province: currentLocation.value?.province || '',
      district: currentLocation.value?.district || '',
      neighborhood: currentLocation.value?.neighborhood || ''
    }

    currentLocation.value = rawLocation
    locationLoading.value = false

    // GPS 좌표가 조금 움직여도 이미 찾은 화장실까지의 직선거리는 즉시 다시 계산함.
    if (nearestRestroom.value) {
      nearestRestroom.value = {
        ...nearestRestroom.value,
        distanceMeters: Math.round(getDistanceKm(
          rawLocation.latitude,
          rawLocation.longitude,
          nearestRestroom.value.latitude,
          nearestRestroom.value.longitude
        ) * 1000)
      }
    }

    // 외부 API는 GPS 오차로 매번 재호출하지 않고 첫 조회 또는 약 500m 이동 시 다시 호출함.
    const shouldRefresh = !lastWeatherFetchLocation ||
      getDistanceKm(
        lastWeatherFetchLocation.latitude,
        lastWeatherFetchLocation.longitude,
        rawLocation.latitude,
        rawLocation.longitude
      ) >= 0.5

    let effectiveLocation = currentLocation.value

    if (shouldRefresh || !currentLocation.value?.addressName) {
      try {
        const region = await reverseKoreanAddress(rawLocation.latitude, rawLocation.longitude)
        if (requestGate.isCurrent(request) && region) {
          currentLocation.value = {
            ...rawLocation,
            ...region,
            name: region.addressName || '현재 위치'
          }
          effectiveLocation = currentLocation.value
        }
      } catch (error) {
        console.warn('[Kakao 행정동 조회 오류]', error)
      }
    }

    if (!requestGate.isCurrent(request)) return
    if (shouldRefresh) {
      await Promise.all([
        loadLiveWeather(effectiveLocation, request),
        loadRestroomForLocation(effectiveLocation, request)
      ])
    }
  }

  const handlePositionError = (error) => {
    locationLoading.value = false
    if (error.code === error.PERMISSION_DENIED) {
      locationMessage.value = language.value === 'en' ? 'Allow location access in your browser.' : '브라우저에서 위치 권한을 허용해주세요.'
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      locationMessage.value = language.value === 'en' ? 'Your current location is unavailable.' : '현재 위치를 확인할 수 없어요.'
    } else {
      locationMessage.value = language.value === 'en' ? 'The location request timed out. Please try again.' : '현재 위치 요청 시간이 초과됐어요. 다시 시도해주세요.'
    }
  }

  onMounted(() => {
    if (!navigator.geolocation) {
      locationLoading.value = false
      locationMessage.value = language.value === 'en'
        ? 'This browser does not support geolocation.' : '이 브라우저는 위치 기능을 지원하지 않아요.'
      return
    }
    locationWatchId = navigator.geolocation.watchPosition(
      handlePosition, handlePositionError,
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 12_000 }
    )
  })
  onScopeDispose(() => {
    requestGate.invalidate()
    if (locationWatchId != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchId)
    }
  })
  return { currentLocation, currentWeather, currentAirQuality, nearestRestroom,
    locationMessage, restroomMessage, locationLoading }
}
