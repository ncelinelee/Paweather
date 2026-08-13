<script setup>
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import UnitToggler from '@/components/paweather/UnitToggler.vue'

defineProps({
  logo: { type: String, required: true },
  weatherLabel: { type: String, required: true },
  donateLabel: { type: String, required: true }
})

const configStore = useConfigStore()
</script>

<template>
  <header class="top-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="Paweather home">
        <img :src="logo" alt="Paweather logo" class="brand-mark" />
        <span class="brand-text"><strong>Paweather</strong><small>Paw + Weather</small></span>
      </RouterLink>

      <nav class="navigation" aria-label="Main navigation">
        <a href="#weather" class="active">{{ weatherLabel }}</a>
        <RouterLink to="/donate">{{ donateLabel }}</RouterLink>
      </nav>

      <div class="header-actions">
        <UnitToggler />
        <button class="language-toggle" type="button" aria-label="한국어와 영어 전환" @click="configStore.toggleLanguage">
          <span :class="{ active: configStore.language === 'ko' }">KOR</span><i>/</i><span :class="{ active: configStore.language === 'en' }">ENG</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-header{position:sticky;top:0;z-index:30;width:100%;border-bottom:1px solid #ece9e2;background:rgba(255,254,251,.98);box-shadow:0 4px 18px rgba(75,67,54,.035);backdrop-filter:blur(12px)}
.header-inner{width:100%;height:90px;padding:0 clamp(24px,4vw,64px);display:flex;align-items:center;gap:28px}
.brand{display:flex;align-items:center;flex:0 0 auto;gap:10px;text-decoration:none}.brand-mark{width:94px;height:70px;object-fit:contain;object-position:center;transform:scale(1.12);transform-origin:left center}.brand-text{display:flex;flex-direction:column;justify-content:center}.brand-text strong{color:#2f2c28;font-size:31px;font-weight:900;line-height:1;letter-spacing:-1px}.brand-text small{margin-top:5px;color:#7a746c;font-size:11px;font-weight:600}
.navigation{flex:1;min-width:0;display:flex;justify-content:center;align-items:center;gap:40px}.navigation a{position:relative;padding:31px 2px 27px;color:#4d4b47;text-decoration:none;font-size:16px;font-weight:800;white-space:nowrap}.navigation a::after{position:absolute;right:0;bottom:16px;left:0;height:2px;border-radius:999px;background:transparent;content:""}.navigation a:hover,.navigation .active{color:#3f9274}.navigation a:hover::after,.navigation .active::after{background:#55a988}
.header-actions{margin-right:56px;display:flex;justify-content:flex-end;align-items:center;flex:0 0 auto;gap:20px}.language-toggle{height:36px;padding:0 11px;display:inline-flex;align-items:center;gap:5px;border:1px solid #dfe3dd;border-radius:999px;background:#fff;color:#9a9d97;font-size:10px;font-weight:900;cursor:pointer}.language-toggle span.active{color:#3f9274}.language-toggle i{color:#c7cac5;font-style:normal}
@media(max-width:980px){.navigation{display:none}.header-actions{margin-left:auto}}
@media(max-width:720px){.header-inner{height:72px;padding:0 16px}.brand-mark{width:72px;height:54px;transform:scale(1.05)}.brand-text strong{font-size:23px}.header-actions{margin-right:46px;gap:14px}}
@media(max-width:520px){.brand-text{display:none}.header-actions{gap:10px}.language-toggle{padding:0 8px}}
</style>
