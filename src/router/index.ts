import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import DashboardView from '@/views/DashboardView.vue'
import PageNotFound from '@/pages/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PageNotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  const publicPages = ['/signin', '/signup']

  if (publicPages.includes(to.path)) {
    next()
  } else {
    if (!isAuthenticated) {
      next('/signin')
    } else {
      next()
    }
  }
})
export default router
