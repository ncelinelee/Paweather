import { ref, watch, onScopeDispose } from 'vue'
import { createLatestRequest } from '../utils/latestRequest.js'

export const provinceOptions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
  '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도',
  '경상남도', '제주특별자치도'
]

export const usePlaceSearch = ({ language, isOnline, selectedCityInfo, searchPlaces, onSelect, onClear, onQueryChanged, readableError }) => {
  const selectedProvince = ref('울산광역시')
  const searchQuery = ref('')
  const searchSuggestions = ref([])
  const searchLoading = ref(false)
  const searchMessage = ref('')
  let searchDebounceId = null
  const suggestionRequest = createLatestRequest()

  const runAreaSearch = async ({ autoSelect = false } = {}) => {
    clearTimeout(searchDebounceId)
    const request = suggestionRequest.start()
    const keyword = searchQuery.value.trim()
    searchMessage.value = ''
    searchLoading.value = false

    if (!isOnline.value) {
      searchSuggestions.value = []
      searchMessage.value = language.value === 'en' ? 'You are offline. Check your connection.' : '오프라인 상태예요. 인터넷 연결을 확인해주세요.'
      return
    }

    if (!selectedProvince.value) {
      searchSuggestions.value = []
      searchMessage.value = language.value === 'en' ? 'Select a province first.' : '먼저 시·도를 선택해주세요.'
      return
    }

    if (!keyword) {
      searchSuggestions.value = []
      return
    }

    searchLoading.value = true
    try {
      const suggestions = await searchPlaces(keyword, selectedProvince.value)
      if (!suggestionRequest.isCurrent(request)) return
      searchSuggestions.value = suggestions

      if (searchSuggestions.value.length === 0) {
        searchMessage.value = language.value === 'en'
          ? `No place or address matching “${keyword}” was found in the selected province.`
          : `${selectedProvince.value}에서 “${keyword}” 장소나 주소를 찾지 못했어요.`
        return
      }

      if (autoSelect) {
        await onSelect(searchSuggestions.value[0])
      }
    } catch (error) {
      if (!suggestionRequest.isCurrent(request)) return
      console.error('[지역 검색 오류]', error)
      searchSuggestions.value = []
      searchMessage.value = readableError(error, language.value === 'en' ? 'Place and address search failed.' : '장소·주소 검색에 실패했어요.')
    } finally {
      if (suggestionRequest.isCurrent(request)) searchLoading.value = false
    }
  }

  watch(searchQuery, (value) => {
    clearTimeout(searchDebounceId)
    suggestionRequest.invalidate()

    const keyword = value.trim()
    const selectedNames = selectedCityInfo.value
      ? [selectedCityInfo.value.searchName, selectedCityInfo.value.name, selectedCityInfo.value.nameKo, selectedCityInfo.value.nameEn].filter(Boolean)
      : []

    if (selectedNames.includes(keyword)) {
      searchSuggestions.value = []
      return
    }

    onQueryChanged()
    searchLoading.value = false
    if (keyword.length < 2) {
      searchSuggestions.value = []
      return
    }

    searchDebounceId = setTimeout(() => runAreaSearch(), 450)
  }, { flush: 'sync' })

  const updateProvince = (value) => {
    suggestionRequest.invalidate()
    onQueryChanged()
    searchLoading.value = false
    selectedProvince.value = value
    searchQuery.value = ''
    searchSuggestions.value = []
    onClear()
    searchMessage.value = ''
  }

  const resetSearch = () => {
    clearTimeout(searchDebounceId)
    suggestionRequest.invalidate()
    onQueryChanged()
    searchQuery.value = ''
    searchSuggestions.value = []
    searchLoading.value = false
    searchMessage.value = ''
    onClear()
  }

  onScopeDispose(() => {
    clearTimeout(searchDebounceId)
    suggestionRequest.invalidate()
    onQueryChanged()
  })

  return { selectedProvince, searchQuery, searchSuggestions, searchLoading, searchMessage,
    suggestionRequest, runAreaSearch, updateProvince, resetSearch,
    searchWeather: () => runAreaSearch({ autoSelect: true }) }
}
