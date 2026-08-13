<script setup>
import { RouterLink } from 'vue-router'

const checks = [
  { item: 'Vue 문법 검사', tool: 'ESLint + eslint-plugin-vue', command: 'npm run lint', status: '통과' },
  { item: '프로덕션 빌드', tool: 'Vite', command: 'npm run build', status: '통과' },
  { item: '통합 검사', tool: 'npm scripts', command: 'npm run check', status: '통과' },
  { item: 'API 키 보호', tool: '.gitignore + .env.example', command: '.env 제외', status: '적용' },
  { item: 'SPA 라우팅', tool: 'Vercel Rewrite', command: '모든 경로 → index.html', status: '적용' },
  { item: 'Kakao 프록시', tool: 'Vercel External Rewrite', command: '/kakao-local-api/*', status: '적용' }
]
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 09 · WEATHER DEPLOYMENT</span>
      <h1>소스 품질 검사와 배포 준비</h1>
      <p class="summary">최종 Paweather 소스를 ESLint로 점검하고 API 키를 저장소에서 분리한 뒤, Vite 프로덕션 빌드와 SPA·API 프록시를 포함한 호스팅 설정을 구성함.</p>

      <div class="section">
        <h2>과제 요구사항</h2>
        <ol>
          <li>ESLint로 Vue와 JavaScript 소스를 검사해 제출 오류 제거</li>
          <li>API Key를 환경변수로 관리하고 Git 업로드 대상에서 제외</li>
          <li>프로젝트를 프로덕션 모드로 빌드해 정적 결과물 생성</li>
          <li>정적 파일을 호스팅할 때 새로고침 라우팅과 외부 API 연결 유지</li>
          <li>배포 후 홈과 각 Router 경로, 검색·지도 기능 확인</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>품질·배포 체크리스트</h2>
        <el-table :data="checks" stripe class="check-table">
          <el-table-column prop="item" label="검사 항목" min-width="135" />
          <el-table-column prop="tool" label="도구·설정" min-width="180" />
          <el-table-column prop="command" label="명령·경로" min-width="180" />
          <el-table-column prop="status" label="상태" width="80" />
        </el-table>
      </div>

      <div class="section">
        <h2>ESLint 품질 관리</h2>
        <p>ESLint Flat Config와 <code>eslint-plugin-vue</code>를 적용함. 일반 JavaScript 권장 규칙과 Vue 필수 규칙을 함께 검사하며, 경고도 제출 실패로 처리하도록 <code>--max-warnings=0</code>을 사용함.</p>
        <pre><code>npm run lint       # Vue·JavaScript 문법 검사
npm run lint:fix   # 자동 수정 가능한 항목 정리
npm run check      # lint 통과 후 production build</code></pre>
      </div>

      <div class="section accent">
        <h2>환경변수와 API Key 보호</h2>
        <p>OpenWeather와 Kakao REST API Key는 <code>import.meta.env</code>로만 읽으며 실제 값이 있는 <code>.env</code>는 <code>.gitignore</code>에서 제외함. 저장소에는 변수 이름만 제공하는 <code>.env.example</code>을 포함함.</p>
        <pre><code>VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key</code></pre>
      </div>

      <div class="section">
        <h2>Build &amp; Deployment</h2>
        <pre><code>npm install
npm run check
npm run preview</code></pre>
        <p><code>npm run build</code> 결과는 <code>dist/</code>에 생성됨. <code>vercel.json</code>에는 Vue Router 새로고침을 위한 SPA fallback, Kakao Local 프록시, 정적 에셋 캐시와 기본 보안 헤더를 설정함.</p>
      </div>

      <div class="section accent">
        <h2>Vercel 환경변수</h2>
        <p>배포 프로젝트의 Settings → Environment Variables에 두 API Key를 등록한 다음 다시 배포해야 함. Vite의 <code>VITE_</code> 변수는 빌드 시점에 포함되므로 키 변경 후 재배포가 필요함.</p>
      </div>

      <div class="section">
        <h2>배포 후 확인 항목</h2>
        <ul>
          <li>홈과 <code>/about</code>, <code>/donate</code>, <code>/assignments/9</code> 직접 접속</li>
          <li>건물명·도로명·지번 검색과 한국어·영어 결과</li>
          <li>OpenWeather 날씨·대기질 응답과 오류 상태</li>
          <li>공중화장실 실제 지도와 카카오맵 길찾기</li>
          <li>새로고침 후 강아지 프로필·언어·온도 단위 유지</li>
          <li>모바일 레이아웃과 위치 권한 허용·거부 상태</li>
        </ul>
      </div>

      <div class="result">
        <strong>로컬 검증 결과</strong>
        <span>ESLint 오류·경고 0개, Vite production build 성공, SPA와 API 프록시를 포함한 Vercel 배포 설정 완료.</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/8">← 과제 8</RouterLink>
        <RouterLink to="/">최종 화면 보기 →</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.report-page{min-height:100vh;padding:88px 20px 50px;background:linear-gradient(180deg,#f4f9f6,#fffdfa);font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;color:#333a34}.report-card{width:min(920px,100%);margin:auto;padding:34px;border:1px solid #e2e7e2;border-radius:26px;background:#fff;box-sizing:border-box}.back,.page-links a{color:#4d816a;text-decoration:none;font-size:11px;font-weight:800}.step{display:block;margin-top:26px;color:#68a188;font-size:9px;font-weight:900;letter-spacing:1.4px}h1{margin:7px 0 10px;font-size:40px}.summary{color:#727972;line-height:1.8;font-size:12px}.section{margin-top:24px;padding:20px;border:1px solid #e8ebe7;border-radius:16px}.section.accent{background:#f7fbf8}.section h2{margin:0 0 12px;font-size:16px}.section p,.section li{color:#666e67;font-size:11px;line-height:1.8}.section li+li{margin-top:5px}code{padding:2px 5px;border-radius:5px;background:#f2f4f2}pre{overflow:auto;margin:14px 0;padding:15px;border-radius:12px;background:#282d29;color:#eaf3ed;font-size:10px;line-height:1.7}pre code{padding:0;background:transparent}.check-table{--el-table-header-bg-color:#edf7f1;--el-table-row-hover-bg-color:#f1f8f4;font-size:11px}.result{margin-top:24px;padding:18px;border-radius:15px;background:#eef8f1}.result strong,.result span{display:block}.result strong{color:#448166}.result span{margin-top:5px;color:#52675b;font-size:11px;line-height:1.7}.page-links{margin-top:22px;display:flex;justify-content:space-between}@media(max-width:650px){.report-card{padding:24px}h1{font-size:32px}.section{padding:16px}}
</style>
