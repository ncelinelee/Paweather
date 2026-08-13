import axios from 'axios'

const KAKAO_LOCAL_BASE = '/kakao-local-api'

const PROVINCE_ALIASES = {
  '서울특별시': ['서울', '서울특별시'],
  '부산광역시': ['부산', '부산광역시'],
  '대구광역시': ['대구', '대구광역시'],
  '인천광역시': ['인천', '인천광역시'],
  '광주광역시': ['광주', '광주광역시'],
  '대전광역시': ['대전', '대전광역시'],
  '울산광역시': ['울산', '울산광역시'],
  '세종특별자치시': ['세종', '세종특별자치시'],
  '경기도': ['경기', '경기도'],
  '강원특별자치도': ['강원', '강원특별자치도', '강원도'],
  '충청북도': ['충북', '충청북도'],
  '충청남도': ['충남', '충청남도'],
  '전북특별자치도': ['전북', '전북특별자치도', '전라북도'],
  '전라남도': ['전남', '전라남도'],
  '경상북도': ['경북', '경상북도'],
  '경상남도': ['경남', '경상남도'],
  '제주특별자치도': ['제주', '제주특별자치도']
}

// Kakao 장소 검색에 화장실로 등록되지 않아 누락되는 지자체 공식 시설을 보완함.
// 출처: 울산 동구청 공중화장실 현황(상시), 2026 확인
const OFFICIAL_PUBLIC_RESTROOMS = [
  {
    id: 'ulsan-donggu-bonghwajae-restroom',
    name: '봉화재 반려견놀이터 화장실',
    category: '공중화장실 · 반려견놀이터',
    phone: '',
    address: '울산 동구 화정동 산 160-2',
    roadAddress: '울산 동구 봉수로 27-54',
    latitude: 35.493367139121,
    longitude: 129.414035162117,
    placeUrl: 'https://place.map.kakao.com/126243420',
    source: '울산 동구청 공중화장실 현황'
  }
]

const getKakaoRestApiKey = () => {
  const key = String(import.meta.env.VITE_KAKAO_REST_API_KEY || '').trim()
  if (!key || key.includes('네_Kakao')) {
    throw new Error('VITE_KAKAO_REST_API_KEY를 .env에 입력해주세요.')
  }
  return key
}

const getHeaders = () => ({
  Authorization: `KakaoAK ${getKakaoRestApiKey()}`
})

const matchesSelectedProvince = (item, province) => {
  const aliases = PROVINCE_ALIASES[province] || [province]
  const region = item.region_1depth_name || item.road_address?.region_1depth_name || item.address?.region_1depth_name || ''
  const fullAddress = `${item.road_address_name || item.road_address?.address_name || ''} ${item.address_name || item.address?.address_name || ''}`
  return aliases.some((alias) => region === alias || fullAddress.startsWith(alias))
}

const normalizePlaceResult = (item, province) => ({
  id: item.id || `place-${item.x}-${item.y}`,
  name: item.place_name || item.road_address_name || item.address_name || '검색 위치',
  nameEn: item.place_name || '',
  placeName: item.place_name || '',
  category: item.category_name || '장소',
  addressName: item.address_name || '',
  roadAddress: item.road_address_name || '',
  exactAddress: item.road_address_name || item.address_name || '',
  displayAddress: item.road_address_name || item.address_name || '',
  province,
  latitude: Number(item.y),
  longitude: Number(item.x),
  placeUrl: item.place_url || '',
  resultType: 'place'
})

const normalizeAddressResult = (item, province) => {
  const road = item.road_address
  const lot = item.address
  const exactAddress = road?.address_name || item.address_name || lot?.address_name || ''
  return {
    id: `address-${item.x}-${item.y}`,
    name: road?.building_name || exactAddress || '검색 주소',
    nameEn: '',
    placeName: road?.building_name || '',
    category: road?.building_name ? '건물·도로명주소' : '주소',
    addressName: lot?.address_name || item.address_name || '',
    roadAddress: road?.address_name || '',
    exactAddress,
    displayAddress: exactAddress,
    province,
    latitude: Number(item.y),
    longitude: Number(item.x),
    placeUrl: '',
    resultType: 'address'
  }
}

export const searchKoreanPlaces = async (query, province) => {
  const keyword = String(query || '').trim()
  if (!keyword || !province) return []

  const provinceKeyword = PROVINCE_ALIASES[province]?.[0] || province
  const scopedQuery = PROVINCE_ALIASES[province]?.some((alias) => keyword.startsWith(alias))
    ? keyword
    : `${provinceKeyword} ${keyword}`

  const [placeResponse, addressResponse] = await Promise.all([
    axios.get(`${KAKAO_LOCAL_BASE}/v2/local/search/keyword.json`, {
      headers: getHeaders(),
      params: { query: scopedQuery, size: 15 }
    }),
    axios.get(`${KAKAO_LOCAL_BASE}/v2/local/search/address.json`, {
      headers: getHeaders(),
      params: { query: scopedQuery, size: 15, analyze_type: 'similar' }
    })
  ])

  const places = (placeResponse.data?.documents || [])
    .filter((item) => matchesSelectedProvince(item, province))
    .map((item) => normalizePlaceResult(item, province))
  const addresses = (addressResponse.data?.documents || [])
    .filter((item) => matchesSelectedProvince(item, province))
    .map((item) => normalizeAddressResult(item, province))

  const addressLikeQuery = /(?:동|읍|면|리|로|길)(?:\s*\d.*)?$/.test(keyword) || /\d/.test(keyword)
  const orderedResults = addressLikeQuery ? [...addresses, ...places] : [...places, ...addresses]
  const seen = new Set()
  return orderedResults
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .filter((item) => {
      const addressKey = String(item.exactAddress || '').replace(/\s/g, '')
      const coordinateKey = `${item.latitude.toFixed(5)}-${item.longitude.toFixed(5)}`
      const key = addressKey || coordinateKey
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 10)
}

export const reverseKoreanAddress = async (latitude, longitude) => {
  const response = await axios.get(`${KAKAO_LOCAL_BASE}/v2/local/geo/coord2regioncode.json`, {
    headers: getHeaders(),
    params: {
      x: longitude,
      y: latitude,
      input_coord: 'WGS84',
      output_coord: 'WGS84'
    }
  })

  const documents = Array.isArray(response.data?.documents) ? response.data.documents : []
  const region = documents.find((item) => item.region_type === 'H') || documents.find((item) => item.region_type === 'B') || documents[0]
  if (!region) return null

  return {
    addressName: region.address_name || '',
    province: region.region_1depth_name || '',
    district: region.region_2depth_name || '',
    neighborhood: region.region_3depth_name || '',
    regionType: region.region_type || '',
    regionCode: region.code || '',
    latitude: Number(latitude),
    longitude: Number(longitude)
  }
}

const searchRestroomKeyword = async (query, latitude, longitude, radius) => {
  const response = await axios.get(`${KAKAO_LOCAL_BASE}/v2/local/search/keyword.json`, {
    headers: getHeaders(),
    params: {
      query,
      x: longitude,
      y: latitude,
      radius,
      sort: 'distance',
      size: 15
    }
  })
  return Array.isArray(response.data?.documents) ? response.data.documents : []
}

const normalizeRestroom = (item) => ({
  id: item.id || '',
  name: item.place_name || '공중화장실',
  category: item.category_name || '',
  phone: item.phone || '',
  address: item.address_name || '',
  roadAddress: item.road_address_name || '',
  latitude: Number(item.y),
  longitude: Number(item.x),
  distanceMeters: Number(item.distance || 0),
  placeUrl: item.place_url || '',
  source: 'Kakao Local'
})

const distanceBetweenMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000
  const toRad = (degree) => (degree * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const fetchNearestPublicRestroom = async (latitude, longitude, radius = 3000) => {
  const keywords = ['공중화장실', '공공화장실', '화장실']
  const allResults = []

  for (const keyword of keywords) {
    const results = await searchRestroomKeyword(keyword, latitude, longitude, radius)
    allResults.push(...results)
  }

  const officialResults = OFFICIAL_PUBLIC_RESTROOMS
    .map((item) => ({
      ...item,
      distanceMeters: Math.round(distanceBetweenMeters(latitude, longitude, item.latitude, item.longitude))
    }))
    .filter((item) => item.distanceMeters <= radius)

  const seen = new Set()
  const normalized = allResults
    .filter((item) => /화장실/.test(`${item.place_name || ''} ${item.category_name || ''}`))
    .map(normalizeRestroom)
    .concat(officialResults)
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .filter((item) => {
      const key = item.id || `${item.name}-${item.latitude}-${item.longitude}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)

  return normalized[0] || null
}

export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  return distanceBetweenMeters(lat1, lon1, lat2, lon2) / 1000
}

export const buildKakaoWalkUrl = (startLocation, restroom) => {
  if (!startLocation || !restroom) return ''
  const startName = encodeURIComponent(startLocation.routeName || startLocation.name || startLocation.addressName || '출발지')
  const endName = encodeURIComponent(restroom.name || '공중화장실')
  return `https://map.kakao.com/link/by/walk/${startName},${startLocation.latitude},${startLocation.longitude}/${endName},${restroom.latitude},${restroom.longitude}`
}
