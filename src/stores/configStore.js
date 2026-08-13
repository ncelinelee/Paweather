import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// 과제 8: 사용자가 선택한 언어와 온도 단위를 브라우저에 보존한다.
export const useConfigStore = defineStore('config', () => {
  const unit = useLocalStorage('paweather-temperature-unit', 'celsius')
  const language = useLocalStorage('paweather-language', 'ko')
  const unitSymbol = computed(() => unit.value === 'celsius' ? '°C' : '°F')

  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const toggleLanguage = () => {
    language.value = language.value === 'ko' ? 'en' : 'ko'
  }

  return { unit, language, unitSymbol, toggleUnit, toggleLanguage }
})
