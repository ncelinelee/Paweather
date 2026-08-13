<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import paweatherLogo from '@/assets/paweather-logo.png'

const configStore = useConfigStore()

const content = computed(() => configStore.language === 'en' ? {
  eyebrow: 'ABOUT PAWEATHER',
  title1: 'A walk-weather guide',
  title2: 'made for dogs and their people.',
  intro: 'Paweather combines local weather, air quality, dog profiles and nearby public restrooms so guardians can make a practical decision before every walk.',
  journeyTitle: 'Everything you need before a walk',
  journey: [
    { number: '01', title: 'Choose a location', text: 'Use live GPS or search a building, road address, lot address or neighborhood anywhere in Korea.' },
    { number: '02', title: 'Check the conditions', text: 'See temperature, environmental feels-like temperature, humidity, rain, wind and air quality together.' },
    { number: '03', title: 'Compare every dog', text: 'Each saved dog receives separate walk guidance based on age, size and current environmental risk.' },
    { number: '04', title: 'Plan the actual walk', text: 'Review hourly recommendations and find the nearest public restroom with a map, distance and walking time.' }
  ],
  featuresTitle: 'What Paweather provides',
  features: [
    { label: 'PLACE SEARCH', title: 'Search by building or address', text: 'Kakao Local search keeps the selected place coordinates for accurate weather and restroom results while showing the walk area by neighborhood.' },
    { label: 'LIVE WEATHER', title: 'Weather and air quality at a glance', text: 'OpenWeather data provides current conditions, upcoming hourly estimates, AQI, PM2.5 and PM10.' },
    { label: 'PAWALK INDEX', title: 'Guidance for every registered dog', text: 'The environmental feels-like value stays consistent, while puppy, senior and body-size vulnerabilities adjust the walk risk level.' },
    { label: 'WALKING SUPPORT', title: 'A restroom you can actually reach', text: 'Nearby public restrooms are compared by distance and shown with a real map, approximate walking time and directions.' },
    { label: 'ACCESSIBILITY', title: 'Korean, English, Celsius and Fahrenheit', text: 'Language and temperature units can be changed without losing the current location or selected dog profiles.' },
    { label: 'RESPONSIBLE GUIDE', title: 'A guide, not a diagnosis', text: 'Recommendations are conservative reference information. Guardians should always monitor their dog and seek veterinary advice when needed.' }
  ],
  noticeTitle: 'Built for safer everyday decisions',
  notice: 'Weather alone cannot determine whether every dog is safe to walk. Breed, coat, health, fitness, sunlight and pavement temperature can also change risk. Paweather helps organize the available information—it does not replace veterinary care.',
  home: 'Back to weather dashboard',
  donate: 'Support rescue dogs'
} : {
  eyebrow: 'ABOUT PAWEATHER',
  title1: '강아지와 보호자를 위한',
  title2: '산책 날씨 안내 서비스',
  intro: 'Paweather는 동네 날씨와 대기질, 강아지 프로필, 주변 공중화장실 정보를 한곳에 모아 산책 전 현실적인 판단을 돕는 서비스입니다.',
  journeyTitle: '산책 전에 필요한 정보를 한 흐름으로',
  journey: [
    { number: '01', title: '위치를 정해요', text: '현재 GPS를 사용하거나 전국의 건물명·도로명·지번주소·동네를 검색할 수 있어요.' },
    { number: '02', title: '환경을 확인해요', text: '기온과 환경 체감온도, 습도, 강수, 바람, 대기질을 한 화면에서 비교해요.' },
    { number: '03', title: '강아지별로 판단해요', text: '등록한 강아지마다 나이와 체급, 현재 환경 위험을 반영해 별도의 산책 단계를 안내해요.' },
    { number: '04', title: '실제 산책을 준비해요', text: '시간대별 추천을 보고 지도와 거리, 예상 도보 시간이 포함된 가까운 공중화장실을 찾아요.' }
  ],
  featuresTitle: 'Paweather가 제공하는 기능',
  features: [
    { label: 'PLACE SEARCH', title: '건물과 주소로 위치 검색', text: 'Kakao Local 검색 결과의 정확한 좌표로 날씨와 화장실을 조회하고, 산책 지역은 해당 행정동까지 깔끔하게 표시해요.' },
    { label: 'LIVE WEATHER', title: '날씨와 대기질을 한눈에', text: 'OpenWeather 데이터로 현재 날씨와 앞으로의 시간대별 예상, AQI·PM2.5·PM10을 확인해요.' },
    { label: 'PAWALK INDEX', title: '등록한 모든 강아지별 안내', text: '환경 체감온도는 동일하게 유지하고, 어린 강아지·노령견과 체급별 취약성은 산책 위험 단계에 따로 반영해요.' },
    { label: 'WALKING SUPPORT', title: '실제로 찾아갈 수 있는 화장실', text: '주변 공중화장실을 거리순으로 비교하고 실제 지도, 예상 도보 시간, 길찾기를 함께 제공해요.' },
    { label: 'ACCESSIBILITY', title: '한국어·영어와 섭씨·화씨 지원', text: '현재 위치와 강아지 프로필을 유지한 채 언어와 온도 단위를 바꿀 수 있어요.' },
    { label: 'RESPONSIBLE GUIDE', title: '진단이 아닌 참고 안내', text: '산책 지수는 보수적인 참고 정보이며, 보호자가 강아지 상태를 직접 살피고 필요하면 수의사와 상담해야 해요.' }
  ],
  noticeTitle: '더 안전한 일상 판단을 위해',
  notice: '날씨만으로 모든 강아지의 산책 안전을 확정할 수는 없습니다. 품종, 털, 건강 상태, 체력, 햇빛과 지면 온도도 위험에 영향을 줍니다. Paweather는 확인 가능한 정보를 정리해 주는 도구이며 수의학적 진료를 대신하지 않습니다.',
  home: '날씨 대시보드로 돌아가기',
  donate: '유기견 후원하기'
})
</script>

<template>
  <div class="about-page">
    <header class="about-header">
      <RouterLink to="/" class="brand" aria-label="Paweather home">
        <img :src="paweatherLogo" alt="Paweather" />
      </RouterLink>
    </header>

    <main>
      <section class="about-hero">
        <span class="eyebrow">{{ content.eyebrow }}</span>
        <h1>{{ content.title1 }}<br /><em>{{ content.title2 }}</em></h1>
        <p>{{ content.intro }}</p>
        <div class="hero-actions">
          <RouterLink to="/" class="primary-action">{{ content.home }}</RouterLink>
          <RouterLink to="/donate" class="secondary-action">{{ content.donate }}</RouterLink>
        </div>
      </section>

      <section class="journey-section section-shell">
        <div class="section-heading">
          <span class="eyebrow">HOW IT WORKS</span>
          <h2>{{ content.journeyTitle }}</h2>
        </div>
        <div class="journey-grid">
          <article v-for="item in content.journey" :key="item.number">
            <span>{{ item.number }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <section class="feature-section section-shell">
        <div class="section-heading">
          <span class="eyebrow">SERVICE FEATURES</span>
          <h2>{{ content.featuresTitle }}</h2>
        </div>
        <div class="feature-grid">
          <article v-for="feature in content.features" :key="feature.label">
            <span>{{ feature.label }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </article>
        </div>
      </section>

      <section class="notice-section section-shell">
        <div>
          <span class="eyebrow">PLEASE NOTE</span>
          <h2>{{ content.noticeTitle }}</h2>
        </div>
        <p>{{ content.notice }}</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page { min-height: 100vh; background: #fffdfa; color: #303630; font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; }
.about-header { height: 86px; padding: 0 clamp(22px,5vw,72px); display: flex; align-items: center; border-bottom: 1px solid #e7e6df; background: rgba(255,255,252,.96); }
.brand { display: inline-flex; align-items: center; width: 150px; height: 76px; }
.brand img { width: 100%; height: 100%; object-fit: contain; object-position: left center; }
.about-hero { padding: clamp(72px,9vw,130px) max(22px,calc((100vw - 1120px)/2)); background: radial-gradient(circle at 80% 18%,#e9f5ee 0,transparent 31%),linear-gradient(135deg,#fffdfa,#f7fbf8); }
.eyebrow { display: block; color: #609678; font-size: 10px; font-weight: 900; letter-spacing: 1.8px; }
.about-hero h1 { margin: 18px 0 24px; font-size: clamp(42px,6vw,76px); line-height: 1.12; letter-spacing: -3.8px; }
.about-hero h1 em { color: #55a184; font-style: normal; }
.about-hero>p { max-width: 740px; margin: 0; color: #69736b; font-size: clamp(14px,1.5vw,18px); line-height: 1.85; }
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 34px; }
.hero-actions a { padding: 13px 17px; border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: 900; }
.primary-action { background: #4f9c7f; color: #fff; }
.secondary-action { border: 1px solid #d9e4dd; background: #fff; color: #4d7965; }
.section-shell { width: min(1120px,calc(100% - 40px)); margin: 0 auto; padding: 88px 0; }
.section-heading { margin-bottom: 30px; }
.section-heading h2,.notice-section h2 { margin: 10px 0 0; color: #333a35; font-size: clamp(27px,3.4vw,40px); letter-spacing: -1.7px; }
.journey-grid { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid #dfe5df; border-bottom: 1px solid #dfe5df; }
.journey-grid article { min-width: 0; padding: 29px 24px; border-right: 1px solid #e4e8e3; }
.journey-grid article:last-child { border-right: 0; }
.journey-grid article>span { color: #60a184; font-size: 11px; font-weight: 900; }
.journey-grid h3,.feature-grid h3 { margin: 15px 0 8px; color: #38413a; font-size: 17px; letter-spacing: -.6px; }
.journey-grid p,.feature-grid p { margin: 0; color: #767e77; font-size: 11px; line-height: 1.75; }
.feature-section { padding-top: 36px; }
.feature-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.feature-grid article { min-height: 190px; padding: 25px; border: 1px solid #e3e7e1; border-radius: 20px; background: #fff; box-shadow: 0 10px 26px rgba(72,91,79,.045); }
.feature-grid article>span { color: #73a48e; font-size: 9px; font-weight: 900; letter-spacing: 1.15px; }
.notice-section { margin-bottom: 90px; padding: 38px 42px; display: grid; grid-template-columns: minmax(230px,.7fr) minmax(0,1.3fr); align-items: center; gap: 42px; border-radius: 26px; background: #edf7f1; }
.notice-section p { margin: 0; color: #607067; font-size: 12px; line-height: 1.9; }
.notice-section h2 { font-size: clamp(23px,2.8vw,34px); }
@media (max-width:850px) {
  .journey-grid { grid-template-columns: repeat(2,1fr); }
  .journey-grid article:nth-child(2) { border-right: 0; }
  .journey-grid article:nth-child(-n+2) { border-bottom: 1px solid #e4e8e3; }
  .feature-grid { grid-template-columns: repeat(2,1fr); }
  .notice-section { grid-template-columns: 1fr; gap: 18px; }
}
@media (max-width:560px) {
  .about-header { height: 72px; }
  .brand { width: 126px; height: 64px; }
  .about-hero { padding-top: 62px; }
  .about-hero h1 { letter-spacing: -2.5px; }
  .section-shell { padding: 62px 0; }
  .journey-grid,.feature-grid { grid-template-columns: 1fr; }
  .journey-grid article { border-right: 0; border-bottom: 1px solid #e4e8e3; }
  .journey-grid article:last-child { border-bottom: 0; }
  .feature-grid article { min-height: 0; }
  .notice-section { margin-bottom: 50px; padding: 28px; }
  .hero-actions { flex-direction: column; }
  .hero-actions a { text-align: center; }
}
</style>
