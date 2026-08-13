<script setup>
import { RouterLink } from 'vue-router'

const refinements = [
  { area: '컴포넌트 구조', detail: '헤더·산책 결과·서비스 요약·푸터를 독립 컴포넌트로 분리하고 props로 화면 데이터를 전달하였음' },
  { area: '외부 라이브러리', detail: 'VueUse를 직접 의존성으로 추가하고 저장·네트워크·접근성 기능에 활용하였음' },
  { area: '사용자 설정', detail: '강아지 프로필, 한국어·영어, 섭씨·화씨 선택을 localStorage에 유지하였음' },
  { area: '네트워크 상태', detail: '오프라인에서 새 API 검색을 차단하고 현재 데이터와 함께 안내를 표시하였음' },
  { area: '접근성', detail: '키보드 포커스, aria 안내, reduced motion 환경을 반영하였음' },
  { area: '시각 완성도', detail: '서로 다른 컬러 이모티콘을 공통 단색 SVG 아이콘으로 통일하였음' },
  { area: '페이지 완성도', detail: '라우트별 브라우저 제목과 과제 이동 메뉴를 정리하였음' },
  { area: '프로젝트 문서', detail: '설치부터 기능·구조·API·주의사항까지 README를 전면 개편하였음' }
]
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 08 · WEATHER REFINEMENT</span>
      <h1>최종 서비스 완성도 개선</h1>
      <p class="summary">과제 1부터 7까지 구현한 기능을 다시 점검하고, 외부 라이브러리 활용·상태 보존·오류 대응·접근성·아이콘 체계·프로젝트 문서를 실제 제출 가능한 수준으로 정리하였음.</p>

      <div class="section">
        <h2>과제 요구사항과 적용</h2>
        <ol>
          <li>작성된 과제물을 정교하게 다듬고 중복되거나 불안정한 동작을 정비하였음</li>
          <li>외부 라이브러리를 목적에 맞게 추가하여 기능 완성도를 높였음</li>
          <li>색상·아이콘·포커스·반응형 스타일을 하나의 시각 체계로 정리하였음</li>
          <li>README에 서비스 목적, 설치법, API, 기능과 구조를 최신 상태로 기록하였음</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>Refinement 체크리스트</h2>
        <el-table :data="refinements" stripe class="refinement-table">
          <el-table-column prop="area" label="개선 영역" min-width="145" />
          <el-table-column prop="detail" label="적용 내용" min-width="390" />
        </el-table>
      </div>

      <div class="section">
        <h2>VueUse로 상태 보존</h2>
        <p><code>useLocalStorage()</code>를 Pinia setup store와 연결하였음. 페이지를 새로고침한 뒤에도 등록한 강아지, 선택한 언어, 섭씨·화씨 설정이 유지되도록 하였고 기존 컴포넌트의 Pinia 사용 방식도 그대로 유지하였음.</p>
        <pre><code>Pinia setup store
       ↓
useLocalStorage('paweather-dog-profiles', [])
       ↓
새로고침 후 프로필 · 언어 · 온도 단위 복원</code></pre>
      </div>

      <div class="section accent">
        <h2>불완전한 환경 대응</h2>
        <p><code>useOnline()</code>으로 네트워크 상태를 감지하였음. 오프라인 상태에서는 장소·주소 검색 요청을 차단하고 한국어·영어 안내를 표시하였음. <code>usePreferredReducedMotion()</code>과 CSS 미디어 쿼리로 동작 줄이기 환경에서 애니메이션과 전환 시간을 최소화하였음.</p>
      </div>

      <div class="section">
        <h2>스타일과 접근성 정리</h2>
        <ul>
          <li>컬러 이모티콘 대신 크기와 선 굵기가 일정한 <code>PaIcon</code> SVG 시스템을 사용하였음</li>
          <li>링크·버튼·입력 요소에 키보드 전용 <code>:focus-visible</code>을 표시하였음</li>
          <li>선택 영역 색상, 글꼴 렌더링과 스크롤 동작을 전역 디자인 토큰으로 정리하였음</li>
          <li>메뉴 버튼의 문자 기호를 접근 가능한 SVG 메뉴 아이콘으로 교체하였음</li>
          <li>각 Router 페이지 이동 시 브라우저 탭 제목을 자동 변경하도록 구현하였음</li>
        </ul>
      </div>

      <div class="section accent">
        <h2>컴포넌트 책임 재구성</h2>
        <pre><code>WeatherParent.vue · API 상태와 계산, 화면 조합
├─ PaweatherHeader.vue · 내비게이션과 사용자 설정
├─ DogProfileForm.vue · 프로필 입력과 검증
├─ SearchBar.vue · 장소·주소 자동완성
├─ CurrentLocationDashboard.vue · 날씨·대기질·화장실
│  └─ RestroomLocationMap.vue · 실제 지도
├─ WalkIndexPanel.vue · 여러 강아지 산책 결과
├─ ServiceSummarySection.vue · 서비스 기능과 상황별 팁
└─ PaweatherFooter.vue · 하단 정보</code></pre>
        <p>부모는 데이터 소유와 조합에 집중하고 자식은 각 영역의 마크업·표시 로직·반응형 스타일을 자체 관리하도록 역할을 나누었음.</p>
      </div>

      <div class="section accent">
        <h2>README 최종 문서화</h2>
        <p>과제 6에 머물러 있던 문서를 현재 기능 기준으로 다시 작성하였음. 서비스 소개, 핵심 기능, 기술 스택, 실행 방법, 환경변수, 사용자 흐름, 디렉터리 구조, 라우트, API 출처, 산책 지수 주의사항과 과제 1~8 발전 과정을 한 문서에 정리하였음.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>기능 추가에 그치지 않고 사용자 설정 보존, 연결 실패, 접근성, 일관된 시각 언어와 인수인계 문서까지 포함한 최종 서비스 형태로 정리하였음.</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/7">← 과제 7</RouterLink>
        <RouterLink to="/assignments/9">과제 9 →</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.report-page { min-height: 100vh; padding: 88px 20px 50px; background: linear-gradient(180deg,#f4f9f6,#fffdfa); font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; color: #333a34; }
.report-card { width: min(920px,100%); margin: auto; padding: 34px; border: 1px solid #e2e7e2; border-radius: 26px; background: #fff; box-sizing: border-box; }
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
.refinement-table { --el-table-header-bg-color: #edf7f1; --el-table-row-hover-bg-color: #f1f8f4; font-size: 11px; }
.result { margin-top: 24px; padding: 18px; border-radius: 15px; background: #eef8f1; }
.result strong,.result span { display: block; }
.result strong { color: #448166; }
.result span { margin-top: 5px; color: #52675b; font-size: 11px; line-height: 1.7; }
.page-links { margin-top: 22px; display: flex; justify-content: space-between; }
@media (max-width:650px) {
  .report-card { padding: 24px; }
  h1 { font-size: 32px; }
  .section { padding: 16px; }
}
</style>
