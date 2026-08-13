<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 01 · p.98</span>
      <h1>Weather Mockup</h1>
      <p class="summary">첫 단계에서 Vue 기본 문법으로 날씨 Mockup을 제작하였고, 이후 완성 화면에서도 같은 문법을 위치 검색·강아지 목록·시간대 예보에 확장하여 사용하였음.</p>

      <div class="section">
        <h2>교재 요구사항 반영</h2>
        <ol>
          <li><strong>v-for</strong>로 날씨 배열을 반복 출력하고 <code>:key="weather.id"</code>를 사용하였음</li>
          <li><strong>v-if / v-else</strong>로 기온 조건에 따라 상태 라벨을 표시하였음</li>
          <li><strong>:value + @input</strong>으로 한글 도시 검색을 구현하였음</li>
          <li>카드 선택 이벤트와 <strong>@click.stop</strong> 상세보기 이벤트를 구현하였음</li>
          <li>울산·서울·광주 데이터와 Paweather Mockup을 추가하였음</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>내가 진행한 방식</h2>
        <p>교재 예제 구조는 유지하고, 도시를 SKALA 캠퍼스를 기준으로 <strong>울산·서울·광주</strong>로 변경하였음. 날씨 카드에 기온뿐 아니라 습도·강수확률·풍속을 추가하여 이후 Paweather로 확장한 기본 화면을 제작하였음.</p>
        <pre><code>const weatherList = ref([
  { id: 'city_01', name: '울산', temp: 26, status: '바람' },
  { id: 'city_02', name: '서울', temp: 31, status: '맑음' },
  { id: 'city_03', name: '광주', temp: 29, status: '흐림' }
])</code></pre>
      </div>

      <div class="section">
        <h2>이 단계에서 이해한 것</h2>
        <p><code>script의 데이터 → template의 v-for/v-if → 사용자 클릭과 입력 이벤트</code>가 연결되면서 Vue가 화면을 변경하는 기본 흐름을 확인하였음.</p>
      </div>

      <div class="section accent">
        <h2>최종 화면까지 확장된 기본 문법</h2>
        <ul>
          <li><code>v-for</code>: 17개 시·도, 장소 검색 후보, 등록한 모든 강아지, 현재부터 6시간 뒤까지의 예보를 반복 출력하였음</li>
          <li><code>v-if / v-else-if</code>: API 로딩·오류·데이터 유무와 안전/가벼운 산책/주의/위험 상태를 조건부로 표시하였음</li>
          <li><code>:class</code>: 날씨와 맞춤 산책 단계에 따라 카드 색상과 배지 스타일을 변경하였음</li>
          <li><code>@input / @click</code>: 위치 자동완성, 프로필 저장, 살·개월 토글, 검색 초기화 동작을 연결하였음</li>
        </ul>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>Weather Mockup에서 익힌 반복·조건·속성 바인딩·이벤트 문법을 최종 Paweather 화면의 기본 렌더링 구조로 확장하였음</span>
      </div>

      <RouterLink to="/assignments/2" class="next">과제 2로 →</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.report-page { min-height: 100vh; padding: 88px 20px 50px; background: linear-gradient(180deg,#f4f9f6,#fffdfa); font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; color: #333a34; }
.report-card { width: min(920px,100%); margin: auto; padding: 34px; border: 1px solid #e2e7e2; border-radius: 26px; background: #fff; }
.back,.next { display: inline-block; color: #4d816a; text-decoration: none; font-size: 11px; font-weight: 800; }
.step { display: block; margin-top: 26px; color: #68a188; font-size: 9px; font-weight: 900; letter-spacing: 1.4px; }
h1 { margin: 7px 0 10px; font-size: 40px; }
.summary { color: #727972; line-height: 1.8; font-size: 12px; }
.section { margin-top: 24px; padding: 20px; border: 1px solid #e8ebe7; border-radius: 16px; }
.section.accent { background: #f7fbf8; }
.section h2 { margin: 0 0 12px; font-size: 16px; }
.section p,.section li { color: #666e67; font-size: 11px; line-height: 1.8; }
.section li+li { margin-top: 5px; }
code { padding: 2px 5px; border-radius: 5px; background: #f2f4f2; }
pre { overflow: auto; margin: 14px 0 0; padding: 15px; border-radius: 12px; background: #282d29; color: #eaf3ed; font-size: 10px; line-height: 1.7; }
pre code { padding: 0; background: transparent; }
.result { margin-top: 24px; padding: 18px; border-radius: 15px; background: #fff3e6; }
.result strong,.result span { display: block; }
.result strong { color: #c67645; }
.result span { margin-top: 5px; color: #745e50; font-size: 11px; }
.next { margin-top: 22px; float: right; }
</style>
