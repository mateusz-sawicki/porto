import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
import Patient from '@/pages/patient/index.vue'
import PatientDetails from '@/pages/patient/details/index.vue'
import Procedure from '@/pages/procedure/index.vue'
import Settings from '@/pages/settings/index.vue'
import TreatmentPlan from '@/pages/treatment-plan/index.vue'
import TreatmentPlanEdit from '@/pages/treatment-plan/edit/index.vue'

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
      path: '/patient/:id',
      name: 'patient-details',
      component: PatientDetails,
    },
    {
      path: '/patient/:patientId/treatment-plan/:planId',
      name: 'treatment-plan',
      component: TreatmentPlan,
    },
    {
      path: '/patient/:patientId/treatment-plan/edit/:planId',
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
  ],
})

export default router
