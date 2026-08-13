<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 04 · Weather Router</span>
      <h1>Weather Router</h1>
      <p class="summary">기존 한 화면의 Paweather를 메인·상세·서비스 소개·후원 준비·과제 기록·404 페이지로 분리하고 내부 이동을 Vue Router로 통일함.</p>

      <div class="section">
        <h2>교재 요구사항</h2>
        <ol>
          <li>Vue Router 설정에 <strong>Lazy Loading</strong>과 <strong>Catch-all Route</strong> 적용</li>
          <li><code>App.vue</code>에 Navigation과 <code>&lt;RouterView /&gt;</code> 배치</li>
          <li><code>WeatherHomeView.vue</code>를 메인 날씨 화면으로 구성</li>
          <li>상세보기의 <code>window.alert()</code>를 없애고 <code>router.push('/weather/' + id)</code>로 이동</li>
          <li><code>WeatherDetailView.vue</code>에서 <code>:cityId</code>를 받아 Mock Data의 도시 상세정보 표시</li>
          <li><code>WeatherAboutView.vue</code>와 본인의 추가 View를 Routing</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>프로젝트 폴더 구조</h2>
        <pre><code>src/
├─ main.js
├─ App.vue
├─ router/
│  └─ index.js
├─ components/
│  └─ paweather/
│     ├─ BaseDashboardCard.vue
│     ├─ SearchBar.vue
│     └─ WeatherCard.vue
└─ views/
   ├─ WeatherHomeView.vue
   ├─ WeatherAboutView.vue
   ├─ WeatherDetailView.vue
   ├─ DonationView.vue
   ├─ NotFoundView.vue
   └─ assignments/
      └─ Assignment04View.vue</code></pre>
      </div>

      <div class="section">
        <h2>1. Router 규칙 정의</h2>
        <pre><code>{
  path: '/weather/:cityId',
  name: 'weather-detail',
  component: () =&gt; import('@/views/WeatherDetailView.vue')
},
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () =&gt; import('@/views/NotFoundView.vue')
}</code></pre>
        <p>페이지 Component는 <code>() =&gt; import(...)</code> 형태로 Lazy Loading하고, 정의하지 않은 URL은 마지막 Catch-all Route에서 NotFoundView로 이동하도록 구성함.</p>
      </div>

      <div class="section">
        <h2>2. 상세보기 → Programmatic Navigation</h2>
        <pre><code>const goToWeatherDetail = (weather) =&gt; {
  router.push('/weather/' + weather.id)
}</code></pre>
        <p>과제 1에서는 상세보기 버튼이 <code>window.alert()</code>를 띄웠지만, Router 학습 후에는 선택한 도시 id를 URL에 포함해 실제 상세 페이지로 이동하도록 변경함.</p>
      </div>

      <div class="section">
        <h2>3. 동적 상세 페이지</h2>
        <pre><code>const route = useRoute()

onMounted(() =&gt; {
  city.value = weatherList.find(
    (item) =&gt; item.id === route.params.cityId
  )
})</code></pre>
        <p><code>/weather/seoul</code>, <code>/weather/tokyo</code>처럼 URL은 같고 도시 id만 바뀌는 동적 경로를 사용함. 아직 API 수업 전이므로 상세 페이지도 현재 단계에서는 Mock Data를 사용함.</p>
      </div>

      <div class="section">
        <h2>4. 본인이 추가한 View</h2>
        <p>기본 요구 페이지 외에 <strong>과제 진행 기록 View</strong>와 <strong>유기견 후원 준비 View</strong>를 추가함. 외부 링크 대신 <code>/donate</code> 내부 경로를 사용하고, 서비스 소개는 실제 구현 기능을 사용자 흐름 중심으로 다시 구성함.</p>
        <pre><code>{ path: '/about', component: () =&gt; import('@/views/WeatherAboutView.vue') },
{ path: '/donate', component: () =&gt; import('@/views/DonationView.vue') },
{ path: '/assignments/6', component: () =&gt; import('@/views/assignments/Assignment06View.vue') }</code></pre>
        <p>오른쪽 위 메뉴에서는 Paweather 홈 바로 아래에 서비스 소개를 배치하고, 과제 1~6 페이지로 순서대로 이동할 수 있게 함.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>Lazy Loading과 Catch-all을 유지하면서 메인 / 상세 / 소개 / 후원 / 과제 기록을 URL 기반으로 탐색할 수 있는 구조를 완성함</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/3">← 과제 3</RouterLink>
        <RouterLink to="/assignments/5">과제 5 →</RouterLink>
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
.result { margin-top: 24px; padding: 18px; border-radius: 15px; background: #fff3e6; }
.result strong,.result span { display: block; }
.result strong { color: #c67645; }
.result span { margin-top: 5px; color: #745e50; font-size: 11px; line-height: 1.7; }
.page-links { margin-top: 22px; display: flex; justify-content: space-between; }
@media (max-width:650px) {
  .report-card { padding: 24px; }
  h1 { font-size: 34px; }
}
</style>
