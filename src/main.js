import 'element-plus/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 과제 5: Pinia를 앱 전체에서 사용할 수 있도록 등록
app.use(createPinia())
app.use(router)
// 과제 7: 공통 입력·피드백·레이아웃 컴포넌트에 Element Plus를 사용한다.
app.use(ElementPlus)

app.mount('#app')
