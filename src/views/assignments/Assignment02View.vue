<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 02 · p.127</span>
      <h1>Weather Composition</h1>
      <p class="summary">Composition API의 반응형 상태와 파생값을 이용해 단순 날씨 조회를 위치·반려견·산책 조건이 함께 바뀌는 Paweather로 확장함.</p>

      <div class="section">
        <h2>교재 요구사항</h2>
        <ol>
          <li><code>searchQuery</code>, <code>selectedCityInfo</code>, <code>weatherList</code>를 반응형 상태로 정의</li>
          <li><code>computed</code>로 검색 결과 배열 <code>filteredWeatherList</code> 생성</li>
          <li><code>watch</code>로 선택 도시 변경 감시</li>
          <li><code>watchEffect</code>로 검색어 변경 자동 추적</li>
          <li>본인만의 Reactive / Computed / Watcher 추가</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>컨셉을 확장한 이유</h2>
        <p>날씨 수치만 보여주는 것보다 반려견 보호자가 <strong>“오늘 산책해도 되는지”</strong> 바로 판단할 수 있으면 더 실용적이라고 생각함. 그래서 반려견 이름·나이·체급을 저장하고, 선택 도시 날씨와 연결해 맞춤 산책 지수를 계산하도록 확장함.</p>
      </div>

      <div class="section">
        <h2>실제 적용</h2>
        <pre><code>const filteredWeatherList = computed(() => {
  return weatherList.value.filter((weather) =>
    weather.name.includes(searchQuery.value)
  )
})

watch(selectedCityInfo, (newCity) => {
  console.log('선택 도시 변경:', newCity)
})

watchEffect(() => {
  console.log(searchQuery.value, filteredWeatherList.value.length)
})</code></pre>
        <p>초기 과제에서는 배열 필터링과 로그 출력으로 동작을 확인했고, 최종 화면에서는 같은 원리를 실제 검색·프로필·대시보드 갱신에 적용함.</p>
      </div>

      <div class="section accent">
        <h2>최종 구현의 Composition API</h2>
        <ul>
          <li><code>ref</code>: 검색어·검색 후보·현재 위치·날씨·대기질·화장실·로딩 상태 관리</li>
          <li><code>reactive</code>: 이름·나이·나이 단위·체급을 가진 프로필 입력 폼 관리</li>
          <li><code>computed</code>: 현재/검색 위치 중 활성 위치 선택, 등록한 강아지별 산책 결과, 가장 보수적인 시간대 추천 생성</li>
          <li><code>watch</code>: 검색어 입력 후 450ms 디바운스 검색, 살·개월과 체급에 따른 안내 문구 갱신</li>
          <li><code>onMounted / onUnmounted</code>: 위치 추적과 기준시간 타이머를 시작하고 페이지를 떠날 때 정리</li>
        </ul>
        <pre><code>const savedDogWalkList = computed(() =&gt;
  profileStore.savedDogs.map((dog) =&gt; ({
    ...dog,
    ...getWalkLevel(activeWalkWeather.value, dog)
  }))
)</code></pre>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>위치·언어·온도 단위·프로필·API 응답이 바뀌면 관련 computed와 화면이 자동으로 다시 계산되는 구조를 완성함</span>
      </div>

      <div class="page-links"><RouterLink to="/assignments/1">← 과제 1</RouterLink><RouterLink to="/assignments/3">과제 3 →</RouterLink></div>
    </section>
  </main>
</template>

<style scoped>
.report-page{min-height:100vh;padding:88px 20px 50px;background:linear-gradient(180deg,#f4f9f6,#fffdfa);font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;color:#333a34}.report-card{width:min(920px,100%);margin:auto;padding:34px;border:1px solid #e2e7e2;border-radius:26px;background:#fff}.back,.page-links a{color:#4d816a;text-decoration:none;font-size:11px;font-weight:800}.step{display:block;margin-top:26px;color:#68a188;font-size:9px;font-weight:900;letter-spacing:1.4px}h1{margin:7px 0 10px;font-size:40px}.summary{color:#727972;line-height:1.8;font-size:12px}.section{margin-top:24px;padding:20px;border:1px solid #e8ebe7;border-radius:16px}.section.accent{background:#f7fbf8}.section h2{margin:0 0 12px;font-size:16px}.section p,.section li{color:#666e67;font-size:11px;line-height:1.8}.section li+li{margin-top:5px}code{padding:2px 5px;border-radius:5px;background:#f2f4f2}pre{overflow:auto;margin:14px 0;padding:15px;border-radius:12px;background:#282d29;color:#eaf3ed;font-size:10px;line-height:1.7}pre code{padding:0;background:transparent}.result{margin-top:24px;padding:18px;border-radius:15px;background:#fff3e6}.result strong,.result span{display:block}.result strong{color:#c67645}.result span{margin-top:5px;color:#745e50;font-size:11px}.page-links{margin-top:22px;display:flex;justify-content:space-between}
</style>
