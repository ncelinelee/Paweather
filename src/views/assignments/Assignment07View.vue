<script setup>
import { RouterLink } from 'vue-router'

const components = [
  { name: 'ElForm · ElFormItem', use: '반려견 프로필 입력 검증과 오류 메시지' },
  { name: 'ElInput · ElInputNumber', use: '이름과 살·개월 단위 나이 입력' },
  { name: 'ElSelect · ElSegmented', use: '체급, 시·도, 나이 단위 선택' },
  { name: 'ElAutocomplete', use: '건물명·도로명·지번·동네 검색 결과 표시' },
  { name: 'ElButton · ElTag', use: '저장·검색 동작과 프로필 수 표시' },
  { name: 'ElMessage · ElMessageBox', use: '저장 결과와 초기화 확인 피드백' },
  { name: 'ElAlert', use: '장소 검색 실패·안내 메시지' },
  { name: 'ElDrawer', use: '모바일에서도 사용할 수 있는 과제 메뉴' },
  { name: 'ElSkeleton · ElEmpty', use: '현재 위치 로딩과 빈 상태' }
]
</script>

<template>
  <main class="report-page">
    <section class="report-card">
      <RouterLink to="/" class="back">← Paweather 홈</RouterLink>
      <span class="step">ASSIGNMENT 07 · UI LIBRARY</span>
      <h1>Element Plus로 공통 UI 체계화</h1>
      <p class="summary">Paweather의 고유한 카드와 지도 디자인은 유지하면서, 반복 사용되는 입력·선택·검증·알림·메뉴를 Vue 3 UI 라이브러리인 Element Plus 컴포넌트로 교체함.</p>

      <div class="section">
        <h2>과제 요구사항</h2>
        <ol>
          <li><code>element-plus</code> 패키지를 설치하고 Vue 애플리케이션에 등록</li>
          <li>완성된 UI 컴포넌트를 화면 목적에 맞게 조합</li>
          <li>라이브러리 기본 색상과 크기를 Paweather 디자인 토큰으로 재정의</li>
          <li>폼 검증, 키보드 포커스, 로딩·빈 상태 등 공통 동작 활용</li>
          <li>데스크톱과 모바일 화면에서 동일한 기능 제공</li>
        </ol>
      </div>

      <div class="section accent">
        <h2>적용한 Element Plus 컴포넌트</h2>
        <el-table :data="components" stripe class="component-table">
          <el-table-column prop="name" label="컴포넌트" min-width="190" />
          <el-table-column prop="use" label="Paweather 적용 위치" min-width="300" />
        </el-table>
      </div>

      <div class="section">
        <h2>반려견 프로필 폼</h2>
        <p><code>ElForm</code> 규칙으로 이름 필수 입력, 이름 길이, 나이 범위를 검증함. 살은 1~30, 개월은 1~11 정수만 허용하고 단위를 변경하면 잘못 남아 있는 값을 초기화함. 저장 프로필 전체 삭제 전에는 <code>ElMessageBox</code>로 한 번 더 확인함.</p>
        <pre><code>&lt;el-form :model="form" :rules="rules"&gt;
  &lt;el-input v-model="form.name" clearable /&gt;
  &lt;el-input-number v-model="form.age" /&gt;
  &lt;el-segmented v-model="form.ageUnit" /&gt;
  &lt;el-select v-model="form.size" /&gt;
&lt;/el-form&gt;</code></pre>
      </div>

      <div class="section accent">
        <h2>장소·주소 자동완성</h2>
        <p><code>ElAutocomplete</code>를 기존 Kakao Local 검색 흐름과 연결함. 사용자는 시·도를 선택한 뒤 건물명, 도로명, 지번 또는 동네를 입력할 수 있고, 검색 결과에는 원문 장소명·주소와 영어 보조 표기를 함께 확인할 수 있음.</p>
      </div>

      <div class="section">
        <h2>일관된 상태 피드백</h2>
        <ul>
          <li>현재 위치를 가져오는 동안 <code>ElSkeleton</code> 표시</li>
          <li>위치 권한이나 데이터가 없으면 <code>ElEmpty</code> 표시</li>
          <li>장소 검색 오류는 <code>ElAlert</code>로 본문 흐름 안에서 안내</li>
          <li>프로필 저장·초기화 결과는 <code>ElMessage</code>로 즉시 안내</li>
          <li>과제 이동 메뉴는 <code>ElDrawer</code>로 화면 폭에 맞게 제공</li>
        </ul>
      </div>

      <div class="section accent">
        <h2>Paweather 테마 유지</h2>
        <p>Element Plus의 <code>--el-color-primary</code>, 테두리, 둥근 모서리, 글꼴 변수를 기존 민트색과 카드 스타일에 맞춰 재정의함. 날씨 카드, 산책 위험도, 실제 지도처럼 서비스 성격이 강한 영역은 기존 전용 컴포넌트를 유지해 획일적인 라이브러리 화면이 되지 않도록 구성함.</p>
      </div>

      <div class="result">
        <strong>결과</strong>
        <span>직접 작성한 반복 UI를 검증된 Vue 3 컴포넌트로 교체해 폼 검증, 접근성, 상태 피드백과 반응형 동작을 보강하면서 Paweather의 기존 시각 정체성을 유지함.</span>
      </div>

      <div class="page-links">
        <RouterLink to="/assignments/6">← 과제 6</RouterLink>
        <RouterLink to="/assignments/8">과제 8 →</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.report-page{min-height:100vh;padding:88px 20px 50px;background:linear-gradient(180deg,#f4f9f6,#fffdfa);font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;color:#333a34}.report-card{width:min(920px,100%);margin:auto;padding:34px;border:1px solid #e2e7e2;border-radius:26px;background:#fff;box-sizing:border-box}.back,.page-links a{color:#4d816a;text-decoration:none;font-size:11px;font-weight:800}.step{display:block;margin-top:26px;color:#68a188;font-size:9px;font-weight:900;letter-spacing:1.4px}h1{margin:7px 0 10px;font-size:40px}.summary{color:#727972;line-height:1.8;font-size:12px}.section{margin-top:24px;padding:20px;border:1px solid #e8ebe7;border-radius:16px}.section.accent{background:#f7fbf8}.section h2{margin:0 0 12px;font-size:16px}.section p,.section li{color:#666e67;font-size:11px;line-height:1.8}.section li+li{margin-top:5px}code{padding:2px 5px;border-radius:5px;background:#f2f4f2}pre{overflow:auto;margin:14px 0;padding:15px;border-radius:12px;background:#282d29;color:#eaf3ed;font-size:10px;line-height:1.7}pre code{padding:0;background:transparent}.component-table{--el-table-header-bg-color:#edf7f1;--el-table-row-hover-bg-color:#f1f8f4;font-size:11px}.result{margin-top:24px;padding:18px;border-radius:15px;background:#eef8f1}.result strong,.result span{display:block}.result strong{color:#448166}.result span{margin-top:5px;color:#52675b;font-size:11px;line-height:1.7}.page-links{margin-top:22px;display:flex;justify-content:space-between}@media(max-width:650px){.report-card{padding:24px}h1{font-size:32px}.section{padding:16px}}
</style>
