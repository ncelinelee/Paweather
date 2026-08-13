import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Paweather · 반려견 산책 날씨' },
      component: () => import('@/views/WeatherHomeView.vue')
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      meta: { title: '날씨 상세 · Paweather' },
      component: () => import('@/views/WeatherDetailView.vue')
    },
    {
      path: '/about',
      name: 'about',
      meta: { title: '서비스 소개 · Paweather' },
      component: () => import('@/views/WeatherAboutView.vue')
    },
    {
      path: '/donate',
      name: 'donate',
      meta: { title: '유기견 후원하기 · Paweather' },
      component: () => import('@/views/DonationView.vue')
    },
    {
      path: '/assignments/1',
      name: 'assignment-1',
      meta: { title: '과제 1 · Paweather' },
      component: () => import('@/views/assignments/Assignment01View.vue')
    },
    {
      path: '/assignments/2',
      name: 'assignment-2',
      meta: { title: '과제 2 · Paweather' },
      component: () => import('@/views/assignments/Assignment02View.vue')
    },
    {
      path: '/assignments/3',
      name: 'assignment-3',
      meta: { title: '과제 3 · Paweather' },
      component: () => import('@/views/assignments/Assignment03View.vue')
    },
    {
      path: '/assignments/4',
      name: 'assignment-4',
      meta: { title: '과제 4 · Paweather' },
      component: () => import('@/views/assignments/Assignment04View.vue')
    },
    {
      path: '/assignments/5',
      name: 'assignment-5',
      meta: { title: '과제 5 · Paweather' },
      component: () => import('@/views/assignments/Assignment05View.vue')
    },
    {
      path: '/assignments/6',
      name: 'assignment-6',
      meta: { title: '과제 6 · Paweather' },
      component: () => import('@/views/assignments/Assignment06View.vue')
    },
    {
      path: '/assignments/7',
      name: 'assignment-7',
      meta: { title: '과제 7 · Paweather' },
      component: () => import('@/views/assignments/Assignment07View.vue')
    },
    {
      path: '/assignments/8',
      name: 'assignment-8',
      meta: { title: '과제 8 · Weather Refinement' },
      component: () => import('@/views/assignments/Assignment08View.vue')
    },
    {
      path: '/assignments/9',
      name: 'assignment-9',
      meta: { title: '과제 9 · Weather Deployment' },
      component: () => import('@/views/assignments/Assignment09View.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Paweather'
})

export default router
