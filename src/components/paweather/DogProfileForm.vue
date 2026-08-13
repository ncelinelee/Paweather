<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import PaIcon from '@/components/paweather/PaIcon.vue'

const props = defineProps({
  name: { type: String, default: '' },
  age: { type: [String, Number], default: '' },
  ageUnit: { type: String, default: 'years' },
  size: { type: String, default: '대형견' },
  savedCount: { type: Number, default: 0 },
  profileMessage: { type: String, default: '' },
  ageNotice: { type: String, default: '' },
  labels: { type: Object, required: true }
})

const emit = defineEmits(['update-name', 'update-age', 'update-age-unit', 'update-size', 'save', 'reset'])
const formRef = ref()
const form = reactive({ name: '', age: null, ageUnit: 'years', size: '대형견' })

watch(
  () => [props.name, props.age, props.ageUnit, props.size],
  ([name, age, ageUnit, size]) => {
    form.name = name
    form.age = age === '' ? null : Number(age)
    form.ageUnit = ageUnit
    form.size = size
  },
  { immediate: true }
)

const ageOptions = computed(() => [
  { label: props.labels.years, value: 'years' },
  { label: props.labels.months, value: 'months' }
])

const validateAge = (_rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error(props.labels.ageRequired))
    return
  }
  const max = form.ageUnit === 'months' ? 11 : 30
  if (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > max) {
    callback(new Error(form.ageUnit === 'months' ? props.labels.monthRange : props.labels.yearRange))
    return
  }
  callback()
}

const rules = computed(() => ({
  name: [
    { required: true, message: props.labels.nameRequired, trigger: ['blur', 'change'] },
    { max: 10, message: props.labels.nameLength, trigger: 'blur' }
  ],
  age: [{ validator: validateAge, trigger: ['blur', 'change'] }],
  size: [{ required: true, message: props.labels.sizeRequired, trigger: 'change' }]
}))

const handleNameInput = (value) => {
  emit('update-name', value)
  formRef.value?.clearValidate('name')
}
const updateAge = (value) => {
  emit('update-age', value ?? '')
  formRef.value?.clearValidate('age')
}
const updateSize = (value) => {
  emit('update-size', value)
  formRef.value?.clearValidate('size')
}
const updateAgeUnit = (value) => {
  form.age = null
  emit('update-age-unit', value)
  formRef.value?.clearValidate('age')
}

const submitProfile = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('update-name', form.name.trim())
  emit('save')
}

const confirmReset = async () => {
  try {
    await ElMessageBox.confirm(props.labels.resetConfirmText, props.labels.resetConfirmTitle, {
      confirmButtonText: props.labels.confirm,
      cancelButtonText: props.labels.cancel,
      type: 'warning',
      customClass: 'paweather-confirm'
    })
    emit('reset')
    formRef.value?.clearValidate()
  } catch {
    // 사용자가 취소한 경우 현재 프로필을 그대로 유지한다.
  }
}
</script>

<template>
  <aside class="profile-panel">
    <div class="profile-title-row">
      <div>
        <span class="profile-eyebrow">CUSTOM PROFILE</span>
        <h2><PaIcon name="paw" /> {{ labels.profileTitle }}</h2>
      </div>
      <el-tag class="saved-count" type="success" effect="light" round>{{ labels.savedCount(savedCount) }}</el-tag>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      label-position="top"
      class="profile-form"
      @submit.prevent="submitProfile"
    >
      <el-form-item :label="labels.name" prop="name">
        <el-input
          v-model="form.name"
          maxlength="10"
          show-word-limit
          clearable
          :validate-event="false"
          :placeholder="labels.dogNamePlaceholder"
          @input="handleNameInput"
        />
      </el-form-item>

      <el-form-item :label="labels.age" prop="age">
        <div class="age-input">
          <el-input-number
            v-model="form.age"
            :min="1"
            :max="form.ageUnit === 'months' ? 11 : 30"
            :step="1"
            step-strictly
            :controls="false"
            :validate-event="false"
            @change="updateAge"
          />
          <el-segmented v-model="form.ageUnit" :options="ageOptions" :aria-label="labels.ageUnit" @change="updateAgeUnit" />
        </div>
      </el-form-item>

      <el-form-item :label="labels.size" prop="size">
        <el-select v-model="form.size" :validate-event="false" @change="updateSize">
          <el-option :label="labels.smallDog" value="소형견" />
          <el-option :label="labels.mediumDog" value="중형견" />
          <el-option :label="labels.largeDog" value="대형견" />
        </el-select>
      </el-form-item>

      <div class="profile-save-row">
        <el-button class="profile-save-btn" type="primary" native-type="submit"><PaIcon name="paw" /> {{ labels.saveProfile }}</el-button>
        <el-button class="profile-reset-btn" plain :disabled="savedCount === 0" @click="confirmReset">{{ labels.resetProfile }}</el-button>
      </div>
    </el-form>

    <p v-if="profileMessage" class="profile-message">✓ {{ profileMessage }}</p>
    <p v-if="ageNotice" class="age-notice">{{ ageNotice }}</p>
  </aside>
</template>

<style scoped>
.profile-panel { min-width: 0; padding: 28px; border: 1px solid #e9e5dd; border-radius: 30px; background: rgba(255,255,255,.96); box-shadow: 0 12px 30px rgba(88,78,60,.07); }
.profile-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 21px; }
.profile-title-row h2 { margin: 5px 0 0; color: #343531; font-size: 21px; }
.profile-eyebrow { display: block; color: #8e9a91; font-size: 10px; font-weight: 900; letter-spacing: 1.3px; }
.saved-count { flex: 0 0 auto; font-size: 10px; font-weight: 800; }
.profile-form { display: grid; grid-template-columns: 1fr; gap: 2px; }
.age-input { width: 100%; display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 8px; }
.profile-save-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 3px; }
.profile-save-btn,.profile-reset-btn { width: 100%; height: 46px; margin: 0; border-radius: 12px; font-size: 12px; font-weight: 900; }
.profile-save-btn { border: 0; background: linear-gradient(135deg,#ff9e6f,#f18757); box-shadow: 0 9px 20px rgba(224,126,79,.18); }
.profile-save-btn:hover,.profile-save-btn:focus { background: linear-gradient(135deg,#f79566,#e87f50); }
.profile-message,.age-notice { margin: 10px 0 0; padding: 10px 11px; border-radius: 10px; font-size: 11px; line-height: 1.5; }
.profile-message { background: #eef8f1; color: #438260; }
.age-notice { background: #fff7e7; color: #91671f; }
:deep(.el-form-item) { margin-bottom: 15px; }
:deep(.el-form-item__label) { height: auto; padding: 0 0 6px; color: #555952; font-size: 12px; font-weight: 800; line-height: 1.2; }
:deep(.el-input__wrapper),:deep(.el-select__wrapper) { min-height: 46px; border-radius: 12px; box-shadow: 0 0 0 1px #deded8 inset; }
:deep(.el-input-number) { width: 100%; }
:deep(.el-input-number .el-input__wrapper) { padding-left: 13px; }
:deep(.el-segmented) { height: 46px; padding: 4px; --el-segmented-item-selected-color: #3f8468; --el-segmented-item-selected-bg-color: #fff; --el-segmented-bg-color: #f2f5f2; }
:deep(.el-segmented__item) { min-width: 42px; font-size: 10px; font-weight: 800; }
@media (max-width:980px) {
  .profile-panel { padding: 24px; }
}
@media (max-width:720px) {
  .profile-panel { border-radius: 20px; }
  .age-input { grid-template-columns: 1fr; }
  .profile-save-row { grid-template-columns: 1fr; }
}
</style>
