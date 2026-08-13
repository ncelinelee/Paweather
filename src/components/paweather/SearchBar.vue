<script setup>
import { computed, ref, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { toEnglishLocation } from '@/utils/locationEnglish'
import PaIcon from '@/components/paweather/PaIcon.vue'

const configStore = useConfigStore()
const ui = computed(() => configStore.language === 'en' ? {
  help: 'Choose a province, then search a building, road, lot number or neighborhood.',
  selectProvince: 'Select province', loading: 'Searching'
} : {
  help: '시·도를 고른 뒤 건물명, 도로명, 지번 또는 동네를 검색해요.',
  selectProvince: '시·도 선택', loading: '검색 중'
})

const props = defineProps({
  query: { type: String, default: '' },
  selectedProvince: { type: String, default: '' },
  provinceOptions: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  message: { type: String, default: '' },
  labels: { type: Object, required: true }
})

const emit = defineEmits(['update-query', 'update-province', 'search', 'reset', 'select-suggestion'])
const pendingSuggestion = ref(null)

const queryModel = computed({
  get: () => props.query,
  set: (value) => emit('update-query', value)
})
const provinceModel = computed({
  get: () => props.selectedProvince,
  set: (value) => emit('update-province', value)
})

const categoryLabel = (item) => {
  if (configStore.language !== 'en') return item.category
  if (item.resultType === 'address') return item.placeName ? 'Building · Road address' : 'Address'
  return 'Place'
}
const provinceLabel = (province) => {
  if (configStore.language !== 'en') return province
  return ({
    '서울특별시':'Seoul', '부산광역시':'Busan', '대구광역시':'Daegu', '인천광역시':'Incheon',
    '광주광역시':'Gwangju', '대전광역시':'Daejeon', '울산광역시':'Ulsan', '세종특별자치시':'Sejong',
    '경기도':'Gyeonggi-do', '강원특별자치도':'Gangwon-do', '충청북도':'Chungcheongbuk-do',
    '충청남도':'Chungcheongnam-do', '전북특별자치도':'Jeonbuk-do', '전라남도':'Jeollanam-do',
    '경상북도':'Gyeongsangbuk-do', '경상남도':'Gyeongsangnam-do', '제주특별자치도':'Jeju-do'
  })[province] || province
}
const englishLocationLine = (item) => {
  const name = toEnglishLocation(item.name)
  const address = toEnglishLocation(item.displayAddress)
  return [name, address && address !== name ? address : ''].filter(Boolean).join(' · ')
}
const normalizedSuggestions = () => props.suggestions.map((item) => ({ ...item, value: item.name }))

const fetchSuggestions = (query, callback) => {
  if (!props.selectedProvince || query.trim().length < 2) {
    callback([])
    return
  }
  pendingSuggestion.value = { query: query.trim(), callback, started: props.isLoading }
}

watch(() => props.isLoading, (loading) => {
  if (!pendingSuggestion.value) return
  if (loading) {
    pendingSuggestion.value.started = true
    return
  }
  if (pendingSuggestion.value.started && props.query.trim() === pendingSuggestion.value.query) {
    pendingSuggestion.value.callback(normalizedSuggestions())
    pendingSuggestion.value = null
  }
})

watch(() => props.query, (query) => {
  if (pendingSuggestion.value && query.trim() !== pendingSuggestion.value.query) pendingSuggestion.value = null
})

const selectItem = (item) => {
  pendingSuggestion.value = null
  emit('select-suggestion', item)
}
</script>

<template>
  <div class="search-wrap">
    <div class="search-bar">
      <div class="search-title">
        <strong><PaIcon name="location" /> {{ labels.searchTitle }}</strong>
        <small>{{ ui.help }}</small>
      </div>

      <label class="search-field province-field">
        <small>{{ labels.province }}</small>
        <el-select v-model="provinceModel" :placeholder="ui.selectProvince" filterable>
          <el-option v-for="province in provinceOptions" :key="province" :label="provinceLabel(province)" :value="province" />
        </el-select>
      </label>

      <label class="search-field area-field">
        <small>{{ labels.area }}</small>
        <el-autocomplete
          v-model="queryModel"
          class="location-autocomplete"
          :fetch-suggestions="fetchSuggestions"
          :placeholder="labels.searchPlaceholder"
          :disabled="!selectedProvince"
          :trigger-on-focus="false"
          :debounce="0"
          clearable
          popper-class="paweather-location-popper"
          @select="selectItem"
          @keyup.enter="emit('search')"
        >
          <template #suffix><span v-if="isLoading" class="loading-dot">{{ ui.loading }}</span></template>
          <template #default="{ item }">
            <div class="suggestion-content">
              <strong>{{ item.name }}</strong>
              <small>{{ item.displayAddress }}</small>
              <small v-if="configStore.language === 'en'" class="english-location">{{ englishLocationLine(item) }}</small>
              <em v-if="item.category">{{ categoryLabel(item) }}</em>
            </div>
          </template>
        </el-autocomplete>
      </label>

      <div class="search-actions">
        <el-button type="primary" :loading="isLoading" :disabled="!selectedProvince" @click="emit('search')">{{ labels.search }}</el-button>
        <el-button plain @click="emit('reset')">{{ labels.reset }}</el-button>
      </div>
    </div>

    <el-alert v-if="message" class="search-message" :title="message" type="warning" show-icon :closable="false" />
  </div>
</template>

<style scoped>
.search-wrap { position:relative; width:100%; }
.search-bar { width:100%; min-width:0; display:grid; grid-template-columns:minmax(220px,1fr) minmax(170px,.8fr) minmax(230px,1.2fr) minmax(145px,auto); align-items:end; gap:12px; }
.search-title { min-width:0; align-self:center; }
.search-title strong { display:block; color:#3d403b; font-size:15px; font-weight:900; line-height:1.3; }
.search-title small { display:block; margin-top:4px; color:#8a8e88; font-size:9px; line-height:1.4; }
.search-field { min-width:0; display:flex; flex-direction:column; gap:5px; }
.search-field > small { color:#8a8e88; font-size:9px; font-weight:800; }
.location-autocomplete { width:100%; }
.loading-dot { color:#6b8d7d; font-size:8px; font-weight:800; white-space:nowrap; }
.search-actions { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
.search-actions :deep(.el-button) { min-width:0; height:46px; margin:0; padding:0 12px; border-radius:12px; font-size:11px; font-weight:900; }
.search-message { margin-top:10px; }
:deep(.el-select__wrapper),:deep(.el-input__wrapper) { min-height:46px; border-radius:12px; box-shadow:0 0 0 1px #dfdfda inset; }
:deep(.el-input__wrapper.is-focus),:deep(.el-select__wrapper.is-focused) { box-shadow:0 0 0 1px #69ad92 inset,0 0 0 3px rgba(81,160,129,.11); }
:deep(.el-alert__title) { font-size:10px; font-weight:700; line-height:1.5; }
@media(max-width:1400px){.search-bar{grid-template-columns:minmax(170px,.8fr) minmax(230px,1.2fr) minmax(145px,auto)}.search-title{grid-column:1/-1}}
@media(max-width:900px){.search-bar{grid-template-columns:1fr 1fr}.search-title,.search-actions{grid-column:1/-1}}
@media(max-width:720px){.search-bar{grid-template-columns:1fr}.search-title,.search-actions{grid-column:auto}}
</style>
