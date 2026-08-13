<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const labels = computed(() => configStore.language === 'en'
  ? { weatherUnit: 'Weather unit', changeUnit: 'Change' }
  : { weatherUnit: '날씨단위', changeUnit: '단위변경' })
</script>

<template>
  <button class="unit-toggler" type="button" @click="configStore.toggleUnit">
    <span>{{ labels.weatherUnit }}</span>
    <strong>{{ configStore.unitSymbol }}</strong>
    <small>{{ labels.changeUnit }}</small>
  </button>
</template>

<style scoped>
.unit-toggler {
  height: 36px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #dfe3dd;
  border-radius: 999px;
  background: #fff;
  color: #70766f;
  cursor: pointer;
  white-space: nowrap;
}

.unit-toggler span {
  color: #8a8f89;
  font-size: 9px;
  font-weight: 700;
}

.unit-toggler strong {
  color: #3f9274;
  font-size: 11px;
}

.unit-toggler small {
  padding: 4px 6px;
  border-radius: 999px;
  background: #eef7f2;
  color: #4d806a;
  font-size: 8px;
  font-weight: 900;
}

@media (max-width: 520px) {
  .unit-toggler span,
  .unit-toggler small {
    display: none;
  }
}
</style>
