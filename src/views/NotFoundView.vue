<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found">
    <div class="card">
      <span>404</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>등록되지 않은 주소입니다. Paweather 메인 또는 과제 진행 기록으로 이동해주세요.</p>
      <div>
        <RouterLink to="/">Paweather 홈</RouterLink>
        <RouterLink to="/assignments/1">과제 기록</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found { min-height: 100vh; display: grid; place-items: center; padding: 20px; background: linear-gradient(180deg,#fffdfa,#f0f7f3); font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; color: #363c37; }
.card { width: min(540px,100%); padding: 42px; border: 1px solid #e3e6e0; border-radius: 26px; background: #fff; text-align: center; box-shadow: 0 16px 40px rgba(60,75,66,.08); }
.card > span { color: #6aa88d; font-size: 44px; font-weight: 900; }
h1 { margin: 8px 0 10px; font-size: 25px; }
p { color: #7e857f; font-size: 11px; line-height: 1.7; }
.card div { margin-top: 22px; display: flex; justify-content: center; gap: 9px; }
a { padding: 10px 13px; border-radius: 10px; background: #edf7f1; color: #478169; text-decoration: none; font-size: 10px; font-weight: 800; }
</style>
