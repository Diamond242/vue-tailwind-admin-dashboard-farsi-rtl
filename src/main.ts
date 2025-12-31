import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr-jalali-support/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import i18n, { initI18n } from './locales'

const bootstrap = async () => {
  await initI18n()

  const app = createApp(App)

  app.use(router)
  app.use(VueApexCharts)
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
