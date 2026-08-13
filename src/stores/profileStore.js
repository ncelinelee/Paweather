import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// 과제 8: VueUse 저장소를 연결해 새로고침 후에도 반려견 프로필을 유지한다.
export const useProfileStore = defineStore('profile', () => {
  const savedDogs = useLocalStorage('paweather-dog-profiles', [])
  const savedCount = computed(() => savedDogs.value.length)
  const primaryDog = computed(() => savedDogs.value.at(-1) || null)

  const addDog = (dog) => {
    savedDogs.value.push({
      id: `${Date.now()}-${savedDogs.value.length}`,
      name: dog.name,
      age: dog.age,
      ageValue: dog.ageValue ?? dog.age,
      ageUnit: dog.ageUnit || 'years',
      size: dog.size
    })
  }

  const resetProfiles = () => {
    savedDogs.value = []
  }

  return { savedDogs, savedCount, primaryDog, addDog, resetProfiles }
})
