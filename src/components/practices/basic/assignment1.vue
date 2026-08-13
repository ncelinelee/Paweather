<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 과제 1에서 시작한 Weather Mockup 데이터를 유지하면서
// 과제 2에서 배운 Composition API까지 확인할 수 있도록 정리한 학습용 파일.
const weatherList = ref([
  { id: 'city_01', name: '울산', temp: 26, status: '바람' },
  { id: 'city_02', name: '서울', temp: 31, status: '맑음' },
  { id: 'city_03', name: '광주', temp: 29, status: '흐림' }
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((weather) => weather.name.includes(query))
})

const handleInput = (event) => {
  searchQuery.value = event.target.value
}

const selectCity = (weather) => {
  selectedCityInfo.value = weather
}

const showDetail = (weather) => {
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
}

watch(selectedCityInfo, (newCity) => {
  if (newCity) console.log('[watch] 선택 도시:', newCity.name)
})

watchEffect(() => {
  console.log('[watchEffect] 검색어:', searchQuery.value)
})
</script>

<template>
  <section class="practice-section">
    <h2>과제 1·2 학습용 Weather Mockup</h2>

    <input
      type="text"
      :value="searchQuery"
      @input="handleInput"
      placeholder="도시 이름 입력"
    />

    <p>검색 중인 도시: {{ searchQuery }}</p>

    <div v-if="filteredWeatherList.length === 0">검색 결과가 없습니다.</div>

    <template v-else>
      <article
        v-for="weather in filteredWeatherList"
        :key="weather.id"
        class="weather-card"
        @click="selectCity(weather)"
      >
        <strong>{{ weather.name }} ({{ weather.status }})</strong>
        <p>현재 기온: {{ weather.temp }}°C</p>
        <span v-if="weather.temp >= 25">더움</span>
        <span v-else>❄️ 선선함</span>
        <button @click.stop="showDetail(weather)">상세보기</button>
      </article>
    </template>

    <p v-if="selectedCityInfo" class="selected">
      {{ selectedCityInfo.name }}이 선택되었습니다.
    </p>
  </section>
</template>

<style scoped>
.practice-section { padding: 24px; }
input { width: 100%; max-width: 420px; padding: 10px; }
.weather-card { margin-top: 12px; padding: 16px; border: 1px solid #ddd; border-radius: 10px; }
.weather-card button { float: right; }
.selected { margin-top: 16px; padding: 10px; background: #eef8f1; }
</style>
