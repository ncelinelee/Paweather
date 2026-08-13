<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 06 · Axios &amp; Open API</span>
      <h1>실시간 날씨 · 대기질 · 공중화장실</h1>
      <p class="summary">Mock Data 중심의 Paweather를 대한민국 전용 서비스로 확장하고 Axios로 실제 장소·주소, 날씨, 대기질, 행정동과 공중화장실 데이터를 연결하였음.</p>

      <div class="section">
        <h2>교재 요구사항과 실제 적용</h2>
        <ol>
          <li>Axios를 설치하고 서비스 파일에서 외부 API 요청을 분리하였음</li>
          <li><code>async / await</code>와 <code>try / catch / finally</code>로 로딩·성공·오류 상태를 처리하였음</li>
          <li>API Key를 Vite 환경변수로 분리하였음</li>
          <li>응답 데이터를 화면에서 사용하는 동일한 형식으로 정규화하였음</li>
          <li>Axios 응답을 <code>ref</code>에 저장하여 Vue 화면이 자동 갱신되도록 구현하였음</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>현재 연결한 실제 데이터</h2>
        <ul>
          <li>대한민국 17개 시·도 안에서 건물명·도로명·지번주소·동네를 검색하도록 구현하였음</li>
          <li>Kakao Local 키워드 검색과 주소 검색을 병렬 호출하고 중복 결과를 제거하였음</li>
          <li>OpenWeather Current Weather + Forecast로 현재와 예보 날씨를 조회하였음</li>
          <li>OpenWeather Air Pollution으로 AQI·PM2.5·PM10을 조회하였음</li>
          <li>Geolocation <code>watchPosition()</code>으로 현재 위치를 갱신하였음</li>
          <li>Kakao 좌표→행정구역 API로 시·구·동을 표시하였음</li>
          <li>Kakao 장소 검색과 지자체 공공데이터를 비교하여 가장 가까운 공중화장실을 선택하였음</li>
          <li>Leaflet + OpenStreetMap으로 출발지와 화장실을 실제 지도에 표시하였음</li>
        </ul>
      </div>

      <div class="section">
        <h2>Axios 데이터 흐름</h2>
        <pre><code>검색어 + 선택한 시·도
        ↓
Kakao Local 장소 검색 + 주소 검색
        ↓ 정확한 latitude / longitude
OpenWeather 날씨 + 대기질
        ↓
Kakao 역지오코딩으로 산책 지역 행정동 표시
        ↓
Kakao 화장실 검색 + 지자체 공식 시설 비교
        ↓
가장 가까운 화장실 · 거리 · 도보 시간 · 지도</code></pre>
      </div>

      <div class="section accent">
        <h2>장소 검색과 표시 기준 분리</h2>
        <p>검색창에는 건물명이나 도로명도 입력하도록 구현하였고, 상단의 <strong>검색한 산책 지역</strong>에는 역지오코딩한 행정동까지만 표시하였음. 날씨·대기질·공중화장실에는 선택한 건물이나 주소의 정확한 좌표를 사용하여 사용자가 의도한 출발점을 유지하였음.</p>
      </div>

      <div class="section">
        <h2>3시간 예보를 1시간 간격 예상으로</h2>
        <p>OpenWeather 무료 Forecast의 3시간 간격 데이터를 현재 시각부터 6시간 뒤까지 선형 보간하였음. 이미 지나간 시간은 제외하고 옆으로 스크롤하도록 구성하였음. 이 값은 <strong>1시간 간격 관측값이 아니라 예상값</strong>이므로 화면에도 예상이라고 표시하였음.</p>
        <pre><code>현재 날씨 + 3시간 Forecast
        ↓ interpolateForecast()
지금, 다음 정시, +2h ... +6h
        ↓
등록한 강아지별 getWalkLevel()
        ↓
가장 높은 위험도를 시간 카드에 표시</code></pre>
        <p>현재 강아지 카드가 <strong>위험</strong>인데 아래의 지금 카드가 <strong>가능</strong>으로 보이는 모순을 막기 위해 두 영역에 같은 산책 판정 함수를 적용하였음.</p>
      </div>

      <div class="section accent">
        <h2>공중화장실과 실제 지도 개선</h2>
        <ul>
          <li><code>공중화장실·공공화장실·화장실</code> 검색 결과를 합치고 거리순으로 정렬하였음</li>
          <li>장소 검색에서 누락된 확인 시설은 지자체 공공데이터 목록으로 보완하였음</li>
          <li>장소명이 줄바꿈되지 않도록 처리하고 정확한 주소와 데이터 출처를 표시하였음</li>
          <li>직선거리의 도로 우회분을 고려한 예상 도보 시간을 제공하였음</li>
          <li>실제 지도에 출발지·도착지 마커와 직선 방향을 표시하였음</li>
          <li>카카오맵 도보 길찾기와 장소 정보 링크를 제공하였음</li>
        </ul>
      </div>

      <div class="section">
        <h2>환경변수</h2>
        <pre><code>VITE_OPENWEATHER_API_KEY=OpenWeather_API_KEY
VITE_KAKAO_REST_API_KEY=Kakao_REST_API_KEY</code></pre>
        <p>API Key를 소스에 직접 작성하지 않고 <code>.env</code>로 분리하였음. Vite 환경변수가 개발 서버 시작 시 주입되는 것을 확인하였고, 값 변경 후 개발 서버를 재시작하는 절차를 적용하였음.</p>
      </div>

      <div class="section accent">
        <h2>오류와 불완전한 데이터 처리</h2>
        <p>위치 권한 거부, GPS 확인 실패, API Key 누락, 401/429 응답, 검색 결과 없음, 공중화장실 없음 상태를 구분하여 안내하였음. 한국어 API 오류가 영어 화면에 그대로 노출되지 않도록 사용자용 메시지도 언어별로 정리하였음.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>Axios 요청 → 응답 정규화 → 정확한 좌표 유지 → 반응형 화면 갱신 흐름을 장소 검색, 실시간 날씨·대기질, 시간대 추천, 주변 화장실과 실제 지도까지 확장하였음.</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/5">← 과제 5</RouterLink>
        <RouterLink to="/assignments/7">과제 7 →</RouterLink>
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
