import { createRouter, createWebHistory } from 'vue-router'
import CircleGraphView from '../views/CircleGraphView.vue'
import LineGraphView from '@/views/LineGraphView.vue'
import CircleGraphFinal from '@/views/CircleGraphFinal.vue'
import CircleGraphTranslation from '@/views/CircleGraphTranslation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/circle_graphs',
      name: 'circle_graph',
      component: CircleGraphView
    },
    {
      path: '/circles_final',
      name: 'circles_final',
      component: CircleGraphFinal
    },
    {
      path: '/circles_translation',
      name: 'circles_translation',
      component: CircleGraphTranslation
    },
    {
      path: '/line_graphs/:swaidId',
      name: 'line_graph',
      component: LineGraphView,
      props: true
    },
  ]
})

export default router
