<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import PaIcon from '@/components/paweather/PaIcon.vue'

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="submission-nav">
    <button class="menu-button" type="button" aria-label="과제 메뉴 열기" @click="isMenuOpen = true"><PaIcon name="menu" /></button>

    <el-drawer v-model="isMenuOpen" title="과제 진행 기록" direction="rtl" size="min(340px, 88vw)" class="assignment-drawer">
      <RouterLink to="/" @click="closeMenu">Paweather 홈</RouterLink>
      <RouterLink to="/about" @click="closeMenu">서비스 소개</RouterLink>
      <RouterLink to="/assignments/1" @click="closeMenu">과제 1 · Weather Mockup</RouterLink>
      <RouterLink to="/assignments/2" @click="closeMenu">과제 2 · Weather Composition</RouterLink>
      <RouterLink to="/assignments/3" @click="closeMenu">과제 3 · Weather Component</RouterLink>
      <RouterLink to="/assignments/4" @click="closeMenu">과제 4 · Weather Router</RouterLink>
      <RouterLink to="/assignments/5" @click="closeMenu">과제 5 · Weather Store</RouterLink>
      <RouterLink to="/assignments/6" @click="closeMenu">과제 6 · Weather Axios API</RouterLink>
      <RouterLink to="/assignments/7" @click="closeMenu">과제 7 · Weather UI Library</RouterLink>
      <RouterLink to="/assignments/8" @click="closeMenu">과제 8 · Weather Refinement</RouterLink>
      <RouterLink to="/assignments/9" @click="closeMenu">과제 9 · Weather Deployment</RouterLink>
    </el-drawer>
  </div>

  <RouterView />
</template>

<style scoped>
.submission-nav { position: fixed; top: 24px; right: 28px; z-index: 200; }
.menu-button { width: 40px; height: 40px; border: 1px solid #dfe4df; border-radius: 11px; background: rgba(255,255,255,.95); color: #414640; font-size: 22px; cursor: pointer; box-shadow: 0 6px 18px rgba(55,65,58,.08); }
@media(max-width:720px){ .submission-nav{top:16px; right:14px} }
</style>
