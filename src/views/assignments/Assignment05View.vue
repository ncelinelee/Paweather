<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 05 · Weather Store</span>
      <h1>Weather Store · Pinia</h1>
      <p class="summary">앱 전체에서 공유하는 온도 단위와 언어는 configStore로, 여러 영역에서 사용하는 등록 완료 반려견 목록은 profileStore로 관리하였음.</p>

      <div class="section">
        <h2>교재 요구사항 반영</h2>
        <ol>
          <li><code>stores/configStore.js</code>를 만들고 state / getter / action을 구성하였음</li>
          <li>Navigation 영역에 <code>UnitToggler.vue</code>를 배치하였음</li>
          <li>메인 날씨와 상세 날씨에 °C / °F 단위 설정을 적용하였음</li>
          <li>profileStore를 추가하고 실제 화면에서 활용하였음</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>1. configStore · 단위 + 언어 설정</h2>
        <pre><code>state: () =&gt; ({
  unit: 'celsius',
  language: 'ko'
}),

getters: {
  unitSymbol: (state) =&gt;
    state.unit === 'celsius' ? '°C' : '°F'
},

actions: {
  toggleUnit() { ... },
  toggleLanguage() { ... }
}</code></pre>
        <p>온도 단위와 KOR / ENG는 여러 화면에서 같은 기준으로 사용되는 설정값이므로 configStore에서 관리하였음.</p>
      </div>

      <div class="section">
        <h2>2. 온도 단위 전환</h2>
        <pre><code>const displayTemp = computed(() =&gt; {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.weather.temp * 9) / 5 + 32)
  }
  return props.weather.temp
})</code></pre>
        <p>Mock Data의 원본 온도는 섭씨로 유지하였고, 화면에 표시할 때만 Store의 현재 단위를 읽어 변환하였음. WeatherCard와 WeatherDetailView에는 같은 configStore를 적용하였음.</p>
      </div>

      <div class="section accent">
        <h2>3. 본인 추가 Store · 반려견 프로필</h2>
        <pre><code>state: () =&gt; ({
  savedDogs: []
}),

getters: {
  savedCount: (state) =&gt; state.savedDogs.length,
  primaryDog: (state) =&gt; { ... }
},

actions: {
  addDog(dog) {
    this.savedDogs.push({ ... })
  },
  resetProfiles() {
    this.savedDogs = []
  }
}</code></pre>
        <p>프로필 폼에 입력 중인 값은 기존 <code>reactive</code>로 유지하였음. 저장 버튼을 누른 뒤 실제 산책 지수와 시간대 예보에서 사용하는 <strong>저장 완료 프로필</strong>만 profileStore로 이동하였음. 여러 마리를 저장하면 현재 날씨 아래와 PAWALK INDEX에 모든 강아지가 각각 표시되도록 구현하였음.</p>
      </div>

      <div class="section">
        <h2>4. 살·개월 단위와 하위 호환</h2>
        <pre><code>profileStore.addDog({
  name,
  age,       // 위험도 계산용 연 단위 값
  ageValue,  // 사용자가 입력한 원래 값
  ageUnit,   // years | months
  size
})</code></pre>
        <p>1살 미만 강아지를 1~11개월로 입력하도록 구현하였음. 계산에는 연 단위 값을 사용하였지만 화면에는 <code>2개월</code>처럼 원래 단위를 유지하였고, 이전 형식의 소수 나이 데이터도 개월로 복원하여 표시하였음.</p>
      </div>

      <div class="section accent">
        <h2>5. Props / Emits도 그대로 유지</h2>
        <pre><code>DogProfileForm
  ↓ emit('save')
WeatherParent
  ↓ profileStore.addDog()
profileStore
  ↓
산책 지수 / 시간대 추천</code></pre>
        <p>Pinia를 적용하였지만 모든 데이터를 Store로 옮기지는 않았음. 폼 입력처럼 부모-자식 관계가 명확한 부분은 Props / Emits를 유지하였고, 저장된 프로필처럼 여러 영역에서 함께 사용하는 값만 Store에서 관리하였음.</p>
      </div>

      <div class="section">
        <h2>6. 설정이 전체 화면에 적용되는 방식</h2>
        <p>섭씨·화씨 변경을 현재 날씨, 시간대 예보, 환경 체감온도, 상세 페이지에 동시에 적용하였음. KOR / ENG 변경 시 메뉴·검색·날씨·지도·화장실·산책 문구와 고유명사 아래의 영문 표기까지 함께 갱신되도록 구현하였음.</p>
      </div>

      <div class="section">
        <h2>Pinia를 적용한 기준</h2>
        <p><strong>ref / reactive</strong>는 컴포넌트 내부 상태에, <strong>Pinia</strong>는 여러 컴포넌트와 Router 페이지가 공유하는 상태에 사용하였음. 앱 설정은 configStore, 저장된 반려견 프로필은 profileStore로 역할을 나누었음.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>단위·언어 설정과 여러 반려견 프로필을 전역에서 일관되게 사용하였음. 산책 판단에서는 환경 체감온도 자체를 임의 변경하지 않았고, 어린 강아지·노령견과 체급별 취약성이 있는 환경에서 위험 단계를 한 단계 높이도록 적용하였음.</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/4">← 과제 4</RouterLink>
        <RouterLink to="/assignments/6">과제 6 →</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.report-page { min-height: 100vh; padding: 88px 20px 50px; background: linear-gradient(180deg,#f4f9f6,#fffdfa); font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; color: #333a34; }
.report-card { width: min(920px,100%); margin: auto; padding: 34px; border: 1px solid #e2e7e2; border-radius: 26px; background: #fff; }
.back,.page-links a { color: #4d816a; text-decoration: none; font-size: 11px; font-weight: 800; }
.step { display: block; margin-top: 26px; color: #68a188; font-size: 9px; font-weight: 900; letter-spacing: 1.4px; }
h1 { margin: 7px 0 10px; font-size: 40px; }
.summary { color: #727972; line-height: 1.8; font-size: 12px; }
.section { margin-top: 24px; padding: 20px; border: 1px solid #e8ebe7; border-radius: 16px; }
.section.accent { background: #f7fbf8; }
.section h2 { margin: 0 0 12px; font-size: 16px; }
.section p,.section li { color: #666e67; font-size: 11px; line-height: 1.8; }
.section li+li { margin-top: 5px; }
code { padding: 2px 5px; border-radius: 5px; background: #f2f4f2; }
pre { overflow: auto; margin: 14px 0; padding: 15px; border-radius: 12px; background: #282d29; color: #eaf3ed; font-size: 10px; line-height: 1.7; }
pre code { padding: 0; background: transparent; }
.result { margin-top: 24px; padding: 18px; border-radius: 15px; background: #eef8f1; }
.result strong,.result span { display: block; }
.result strong { color: #448166; }
.result span { margin-top: 5px; color: #52675b; font-size: 11px; line-height: 1.7; }
.page-links { margin-top: 22px; display: flex; justify-content: space-between; }
@media (max-width:650px) {
  .report-card { padding: 24px; }
  h1 { font-size: 34px; }
}
</style>
