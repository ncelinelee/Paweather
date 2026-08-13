<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<template>
  <section class="dashboard-card" :class="`dashboard-card--${variant}`">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  min-width: 0;
  border: 1px solid #e8e5dd;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 26px rgba(88, 78, 60, 0.055);
}
.dashboard-card--search { margin-bottom: 16px; padding: 13px 18px; border-radius: 20px; }
.dashboard-card--weather { padding: 22px; border-radius: 24px; }
@media (max-width: 720px) {
  .dashboard-card--search, .dashboard-card--weather { border-radius: 20px; }
  .dashboard-card--weather { padding: 16px; }
}
</style>
