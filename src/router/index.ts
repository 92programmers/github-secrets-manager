import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        private: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        private: false
      }
    },
    {
      path: '/welcome',
      name: 'welcom',
      component: () => import('../views/WelcomeView.vue'),
      meta: {
        private: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.private) {
    const auth = localStorage.getItem('auth')
    const oldToken: { token: string } = auth && JSON.parse(auth)
    if (!oldToken?.token) next({ name: "login" })
  }
  next()
})

export default router
