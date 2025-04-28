import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import CalculationsDashboard from '@/pages/calculations-dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calculations-dashboard',
      component: CalculationsDashboard,
    },
  ],
})

export default router
