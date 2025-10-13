import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
import Patient from '@/pages/patient/index.vue'
import PatientDetails from '@/pages/patient/details/index.vue'
import Procedure from '@/pages/procedure/index.vue'
import Settings from '@/pages/settings/index.vue'
import TreatmentPlan from '@/pages/treatment-plan/index.vue'
import TreatmentPlanEdit from '@/pages/treatment-plan/edit/index.vue'
import IconifyTest from '@/components/test/IconifyTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/patients',
      name: 'patients',
      component: Patient,
    },
    {
      path: '/patients/:id',
      name: 'patient-details',
      component: PatientDetails,
    },
    {
      path: '/patients/:patientId/treatment-plans/:planId',
      name: 'treatment-plan',
      component: TreatmentPlan,
    },
    {
      path: '/patients/:patientId/treatment-plans/edit/:planId',
      name: 'treatment-plan-edit',
      component: TreatmentPlanEdit,
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
    {
      path: '/test-iconify',
      name: 'test-iconify',
      component: IconifyTest,
    },
  ],
})

export default router
