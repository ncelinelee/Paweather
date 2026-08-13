import axios from 'axios'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org'

const PROVINCE_CONFIG = {
  '서울특별시': { aliases: ['Seoul', '서울'], bounds: [37.40, 37.72, 126.76, 127.20] },
  '부산광역시': { aliases: ['Busan', '부산'], bounds: [34.95, 35.40, 128.75, 129.35] },
  '대구광역시': { aliases: ['Daegu', '대구'], bounds: [35.55, 36.05, 128.35, 129.05] },
  '인천광역시': { aliases: ['Incheon', '인천'], bounds: [37.00, 37.90, 124.50, 126.90] },
  '광주광역시': { aliases: ['Gwangju', '광주'], bounds: [35.00, 35.30, 126.65, 127.00] },
  '대전광역시': { aliases: ['Daejeon', '대전'], bounds: [36.15, 36.55, 127.20, 127.55] },
  '울산광역시': { aliases: ['Ulsan', '울산'], bounds: [35.30, 35.75, 128.95, 129.50] },
  '세종특별자치시': { aliases: ['Sejong', '세종'], bounds: [36.35, 36.75, 127.05, 127.40] },
  '경기도': { aliases: ['Gyeonggi', 'Gyeonggi-do', '경기'], bounds: [36.85, 38.30, 126.25, 127.95] },
  '강원특별자치도': { aliases: ['Gangwon', 'Gangwon-do', '강원'], bounds: [37.00, 38.75, 127.45, 129.45] },
  '충청북도': { aliases: ['Chungcheongbuk-do', 'North Chungcheong', '충북'], bounds: [36.00, 37.30, 127.25, 128.70] },
  '충청남도': { aliases: ['Chungcheongnam-do', 'South Chungcheong', '충남'], bounds: [35.90, 37.10, 125.90, 127.65] },
  '전북특별자치도': { aliases: ['Jeonbuk', 'Jeollabuk-do', 'North Jeolla', '전북'], bounds: [35.25, 36.20, 126.30, 127.85] },
  '전라남도': { aliases: ['Jeollanam-do', 'South Jeolla', '전남'], bounds: [33.90, 35.60, 125.80, 127.90] },
  '경상북도': { aliases: ['Gyeongsangbuk-do', 'North Gyeongsang', '경북'], bounds: [35.50, 37.60, 128.35, 130.00] },
  '경상남도': { aliases: ['Gyeongsangnam-do', 'South Gyeongsang', '경남'], bounds: [34.50, 35.95, 127.50, 129.35] },
  '제주특별자치도': { aliases: ['Jeju', 'Jeju-do', '제주'], bounds: [33.00, 33.70, 126.00, 127.00] }
}

const getApiKey = () => {
  const apiKey = String(import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim()
  if (!apiKey || apiKey.includes('네_OpenWeather')) throw new Error('VITE_OPENWEATHER_API_KEY를 .env에 입력해주세요.')
  return apiKey
}

const round1 = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0
}

const getWeatherStatus = (main, code) => {
  if (main === 'Clear') return '맑음'
  if (main === 'Clouds') return '흐림'
  if (main === 'Thunderstorm') return '뇌우'
  if (main === 'Rain') return Number(code) >= 502 ? '폭우' : '비'
  if (main === 'Drizzle') return '비'
  if (main === 'Snow') return '눈'
  if (['Mist','Smoke','Haze','Dust','Fog','Sand','Ash','Squall','Tornado'].includes(main)) return '흐림'
  return main || '맑음'
}

const isInsideBounds = (lat, lon, bounds) => {
  if (!bounds) return true
  const [minLat, maxLat, minLon, maxLon] = bounds
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon
}

const matchesProvince = (item, province) => {
  const config = PROVINCE_CONFIG[province]
  if (!config) return true
  const state = String(item.state || '')
  const stateMatched = config.aliases.some((alias) => state.toLowerCase().includes(alias.toLowerCase()))
  return stateMatched || isInsideBounds(Number(item.lat), Number(item.lon), config.bounds)
}

const normalizeLocation = (item, province) => ({
  name: item.local_names?.ko || item.name,
  nameEn: item.local_names?.en || item.name,
  state: item.state || province || '',
  province: province || '',
  country: '대한민국',
  countryCode: 'KR',
  latitude: Number(item.lat),
  longitude: Number(item.lon),
  displayAddress: [province, item.local_names?.ko || item.name].filter(Boolean).join(' · ')
})

const directGeocode = async (q, apiKey) => {
  const response = await axios.get(`${OPENWEATHER_BASE_URL}/geo/1.0/direct`, {
    params: { q, limit: 5, appid: apiKey }
  })
  return Array.isArray(response.data) ? response.data : []
}

export const searchKoreanAreas = async (query, province) => {
  const apiKey = getApiKey()
  const keyword = String(query || '').trim()
  if (!keyword || !province) return []

  const variants = [keyword]
  if (!/[동읍면리가로]$/.test(keyword)) variants.push(`${keyword}동`)

  let results = []
  for (const variant of variants) {
    const provinceAlias = PROVINCE_CONFIG[province]?.aliases?.[0] || province
    const queries = [`${variant},${provinceAlias},KR`, `${variant},${province},KR`, `${variant},KR`]
    for (const q of queries) {
      try {
        results = results.concat(await directGeocode(q, apiKey))
      } catch (error) {
        if (error?.response?.status === 401) throw error
      }
      if (results.length >= 8) break
    }
    if (results.length >= 8) break
  }

  const seen = new Set()
  return results
    .filter((item) => item.country === 'KR')
    .filter((item) => matchesProvince(item, province))
    .map((item) => normalizeLocation(item, province))
    .filter((item) => {
      const key = `${item.name}-${item.latitude.toFixed(4)}-${item.longitude.toFixed(4)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 8)
}

export const reverseKoreanLocation = async (latitude, longitude) => {
  const apiKey = getApiKey()
  const response = await axios.get(`${OPENWEATHER_BASE_URL}/geo/1.0/reverse`, {
    params: { lat: latitude, lon: longitude, limit: 1, appid: apiKey }
  })
  const item = response.data?.[0]
  if (!item) return null
  return {
    name: item.local_names?.ko || item.name,
    nameEn: item.local_names?.en || item.name,
    state: item.state || '',
    country: item.country,
    latitude: Number(latitude),
    longitude: Number(longitude)
  }
}

export const inferProvinceByCoordinates = (latitude, longitude) => {
  const lat = Number(latitude), lon = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return ''
  // 광역시/특별시를 먼저 검사해 도 단위의 겹치는 범위보다 우선시함.
  const priority = ['서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','제주특별자치도','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도']
  return priority.find((province) => isInsideBounds(lat, lon, PROVINCE_CONFIG[province]?.bounds)) || ''
}

export const fetchCurrentWeather = async (location) => {
  const apiKey = getApiKey()
  const [weatherResponse, forecastResponse] = await Promise.all([
    axios.get(`${OPENWEATHER_BASE_URL}/data/2.5/weather`, {
      params: { lat: location.latitude, lon: location.longitude, appid: apiKey, units: 'metric', lang: 'kr' }
    }),
    axios.get(`${OPENWEATHER_BASE_URL}/data/2.5/forecast`, {
      params: { lat: location.latitude, lon: location.longitude, appid: apiKey, units: 'metric', lang: 'kr', cnt: 8 }
    })
  ])

  const data = weatherResponse.data
  const firstForecast = forecastResponse.data?.list?.[0]
  const hourlyForecast = (forecastResponse.data?.list || []).map((item) => {
    const info = item.weather?.[0] || {}
    return {
      timestamp: Number(item.dt || 0) * 1000,
      temp: round1(item.main?.temp),
      feelsLike: round1(item.main?.feels_like),
      humidity: Math.round(item.main?.humidity ?? 0),
      rain: Math.round((item.pop ?? 0) * 100),
      wind: round1(item.wind?.speed),
      status: getWeatherStatus(info.main, info.id),
      description: info.description || '',
      weatherCode: Number(info.id ?? 0)
    }
  })
  const weatherInfo = data.weather?.[0] || {}

  return {
    id: location.id || `${Number(location.latitude).toFixed(4)}-${Number(location.longitude).toFixed(4)}`,
    name: location.name || data.name || '현재 위치',
    country: '대한민국', countryCode: 'KR', state: location.state || location.province || '',
    latitude: Number(location.latitude), longitude: Number(location.longitude),
    temp: round1(data.main?.temp), feelsLike: round1(data.main?.feels_like), humidity: Math.round(data.main?.humidity ?? 0),
    rain: Math.round((firstForecast?.pop ?? 0) * 100), wind: round1(data.wind?.speed),
    status: getWeatherStatus(weatherInfo.main, weatherInfo.id), description: weatherInfo.description || '',
    weatherCode: Number(weatherInfo.id ?? 0), localTime: new Date((data.dt ?? 0) * 1000).toISOString(),
    hourlyForecast
  }
}

export const fetchAirQuality = async (latitude, longitude) => {
  const apiKey = getApiKey()
  const response = await axios.get(`${OPENWEATHER_BASE_URL}/data/2.5/air_pollution`, {
    params: { lat: latitude, lon: longitude, appid: apiKey }
  })
  const air = response.data?.list?.[0]
  if (!air) throw new Error('대기질 데이터가 없습니다.')
  return {
    aqi: Number(air.main?.aqi ?? 0), pm25: round1(air.components?.pm2_5), pm10: round1(air.components?.pm10),
    o3: round1(air.components?.o3), no2: round1(air.components?.no2)
  }
}

export const fetchWeatherAndAir = async (location) => {
  const [weather, airQuality] = await Promise.all([
    fetchCurrentWeather(location),
    fetchAirQuality(location.latitude, location.longitude)
  ])
  return { weather, airQuality }
}
