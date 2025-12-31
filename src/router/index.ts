import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/locales'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        titleKey: 'routes.titles.ecommerce',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        titleKey: 'routes.titles.calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        titleKey: 'routes.titles.profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        titleKey: 'routes.titles.formElements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        titleKey: 'routes.titles.basicTables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: {
        titleKey: 'routes.titles.lineChart',
      },
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: {
        titleKey: 'routes.titles.barChart',
      },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        titleKey: 'routes.titles.alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        titleKey: 'routes.titles.avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        titleKey: 'routes.titles.badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        titleKey: 'routes.titles.buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        titleKey: 'routes.titles.images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        titleKey: 'routes.titles.videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        titleKey: 'routes.titles.blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        titleKey: 'routes.titles.error404',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        titleKey: 'routes.titles.signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        titleKey: 'routes.titles.signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const titleKey = to.meta.titleKey as string | undefined
  const title = titleKey ? i18n.global.t(titleKey) : i18n.global.t('common.app.name')
  document.title = i18n.global.t('routes.documentTitle', { title })
  next()
})
