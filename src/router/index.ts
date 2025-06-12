import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
import Patient from '@/pages/patient/index.vue'
import Procedure from '@/pages/procedure/index.vue'
import Settings from '@/pages/settings/index.vue'
import TreatmentPlan from '@/pages/treatment-plan/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/patient',
      name: 'patient',
      component: Patient,
    },
    {
      path: '/patient/:id/treatment-plan/:id',
      name: 'treatment-plan',
      component: TreatmentPlan,
    },
    {
      path: '/procedure',
      name: 'procedure',
      component: Procedure,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
  ],
})

export default router
