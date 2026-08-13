<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 03 · p.160</span>
      <h1>Weather Component</h1>
      <p class="summary">확장된 화면을 입력·설정·대시보드·지도 역할로 분리하고 Props Down / Events Up과 Slot을 적용하였음.</p>

      <div class="section">
        <h2>교재 요구사항에 맞춘 분리</h2>
        <div class="component-list">
          <div><strong>WeatherParent.vue</strong><span>반응형 데이터와 주요 함수를 관리하도록 구성하였음</span></div>
          <div><strong>BaseDashboardCard.vue</strong><span>공통 카드 디자인과 slot을 담당하도록 구성하였음</span></div>
          <div><strong>SearchBar.vue</strong><span>props로 검색값을 받고 emit으로 검색 변경을 전달하도록 구성하였음</span></div>
          <div><strong>WeatherCard.vue</strong><span>props로 도시 객체를 받고 select/detail 이벤트를 emit하도록 구성하였음</span></div>
          <div><strong>DogProfileForm.vue</strong><span>Paweather 전용 프로필 Component로 추가하였음</span></div>
          <div><strong>CurrentLocationDashboard.vue</strong><span>날씨·대기질·시간대 추천·화장실 영역으로 분리하였음</span></div>
          <div><strong>RestroomLocationMap.vue</strong><span>Leaflet 지도와 마커 생명주기를 담당하도록 분리하였음</span></div>
          <div><strong>UnitToggler.vue</strong><span>Pinia 기반 섭씨·화씨 전환 버튼으로 구성하였음</span></div>
        </div>
      </div>

      <div class="section accent">
        <h2>Props Down / Events Up</h2>
        <pre><code>&lt;WeatherCard
  :weather="weather"
  @select="selectCity"
  @detail="goToWeatherDetail"
/&gt;</code></pre>
        <p>부모가 날씨 데이터를 props로 전달하고, 자식에서 발생한 카드 선택·상세보기 동작은 emit으로 다시 부모에게 전달하는 구조를 적용하였음.</p>
      </div>

      <div class="section">
        <h2>Slot 적용</h2>
        <p><code>BaseDashboardCard.vue</code> 안에 <code>&lt;slot /&gt;</code>을 두고 검색 영역의 내용을 부모에서 주입하였음. 공통 외곽 디자인은 하나의 Component에서 관리하였음.</p>
      </div>

      <div class="section">
        <h2>추가 Component</h2>
        <p>반려견 프로필은 <code>DogProfileForm.vue</code>로 분리하여 입력값을 props로 받고 변경·저장 동작을 emit하였음. 위치 대시보드는 <code>CurrentLocationDashboard.vue</code>, 실제 주변 지도는 <code>RestroomLocationMap.vue</code>로 나누어 지도 인스턴스가 부모의 날씨 계산과 섞이지 않도록 구성하였음.</p>
      </div>

      <div class="section accent">
        <h2>현재 부모-자식 데이터 흐름</h2>
        <pre><code>WeatherParent
  ├─ SearchBar
  │    └─ emit: 검색어·시도·검색·초기화·후보 선택
  ├─ DogProfileForm
  │    └─ emit: 이름·나이·단위·체급·저장·초기화
  └─ CurrentLocationDashboard
       ├─ props: 위치·날씨·대기질·강아지별 결과
       └─ RestroomLocationMap
            └─ props: 출발지·화장실·거리·도보 시간</code></pre>
        <p>시간대 카드도 현재 카드와 같은 규칙을 사용하도록 부모의 <code>getWalkLevel</code> 함수를 prop으로 전달하여 판정 모순을 제거하였음.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>검색·프로필·위치 대시보드·지도·단위 설정을 역할별 Component로 분리하고 데이터 흐름을 명확하게 정리하였음</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/2">← 과제 2</RouterLink>
        <RouterLink to="/assignments/4">과제 4 · Router →</RouterLink>
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
.section p { color: #666e67; font-size: 11px; line-height: 1.8; }
.component-list { display: grid; gap: 9px; }
.component-list div { padding: 12px; border-radius: 10px; background: #f7f9f7; }
.component-list strong,.component-list span { display: block; }
.component-list strong { color: #467c65; font-size: 12px; }
.component-list span { margin-top: 3px; color: #7a817a; font-size: 10px; }
code { padding: 2px 5px; border-radius: 5px; background: #f2f4f2; }
pre { overflow: auto; margin: 14px 0; padding: 15px; border-radius: 12px; background: #282d29; color: #eaf3ed; font-size: 10px; line-height: 1.7; }
pre code { padding: 0; background: transparent; }
.result { margin-top: 24px; padding: 18px; border-radius: 15px; background: #fff3e6; }
.result strong,.result span { display: block; }
.result strong { color: #c67645; }
.result span { margin-top: 5px; color: #745e50; font-size: 11px; }
.page-links { margin-top: 22px; display: flex; justify-content: space-between; }
</style>
