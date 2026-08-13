<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import paweatherLogo from '@/assets/paweather-logo.png'

const configStore = useConfigStore()

const content = computed(() => configStore.language === 'en' ? {
  eyebrow: 'PAWEATHER SUPPORT',
  title: 'Support Rescue Dogs',
  description: 'We are preparing reliable information and ways to support rescued dogs.',
  preparing: 'This page is coming soon.',
  back: '← Back to Paweather'
} : {
  eyebrow: 'PAWEATHER SUPPORT',
  title: '유기견 후원하기',
  description: '유기견에게 안전하게 마음을 전할 수 있는 후원 정보와 방법을 준비하고 있어요.',
  preparing: '페이지 준비 중입니다.',
  back: '← Paweather로 돌아가기'
})
</script>

<template>
  <div class="donation-page">
    <header class="donation-header">
      <RouterLink to="/" class="brand"><img :src="paweatherLogo" alt="" /><strong>Paweather</strong></RouterLink>
    </header>

    <main class="donation-shell">
      <span class="eyebrow">{{ content.eyebrow }}</span>
      <h1>{{ content.title }}</h1>
      <p>{{ content.description }}</p>

      <section class="coming-soon" aria-live="polite">
        <img :src="paweatherLogo" alt="Paweather" />
        <strong>{{ content.preparing }}</strong>
      </section>

      <RouterLink to="/" class="back-link">{{ content.back }}</RouterLink>
    </main>
  </div>
</template>

<style scoped>
.donation-page { min-height: 100vh; background: linear-gradient(180deg,#fffdfa 0%,#f4f9f6 100%); color: #303630; font-family: -apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif; }
.donation-header { height: 76px; padding: 0 clamp(20px,4vw,58px); display: flex; align-items: center; border-bottom: 1px solid #e7e6df; background: rgba(255,255,252,.95); }
.brand { display: flex; align-items: center; gap: 8px; color: #354139; text-decoration: none; font-size: 15px; }
.brand img { width: 38px; height: 38px; object-fit: contain; }
.donation-shell { width: min(920px,calc(100% - 34px)); margin: 0 auto; padding: 72px 0; }
.eyebrow { color: #67a488; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; }
h1 { margin: 13px 0 16px; color: #303630; font-size: clamp(34px,5vw,56px); line-height: 1.2; letter-spacing: -2px; }
.donation-shell > p { margin: 0; color: #707970; font-size: 14px; line-height: 1.8; }
.coming-soon { min-height: 260px; margin-top: 38px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; border: 1px dashed #cfded5; border-radius: 26px; background: rgba(255,255,255,.8); }
.coming-soon img { width: 150px; height: 92px; object-fit: contain; }
.coming-soon strong { color: #55806c; font-size: 18px; }
.back-link { display: inline-block; margin-top: 26px; padding: 11px 14px; border: 1px solid #d9e2dc; border-radius: 11px; background: #fff; color: #47745f; text-decoration: none; font-size: 11px; font-weight: 800; }
@media (max-width:650px) {
  .donation-shell { padding: 46px 0; }
  .coming-soon { min-height: 220px; }
}
</style>
