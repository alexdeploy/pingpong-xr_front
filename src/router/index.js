import { createRouter, createWebHistory } from 'vue-router'
import RankingView from '../views/RankingView.vue'
import MatchesView from '../views/MatchesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/ranking'
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: RankingView
    },
    {
      path: '/matches',
      name: 'matches',
      component: MatchesView
    }
  ]
})

export default router