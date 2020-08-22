import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import DBEvents from '../views/DBEvents.vue'
import Comparison from '../views/Comparison.vue'
import Triggers from '../views/Triggers.vue'
import Watcher from '../views/Watcher.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/events',
    name: 'Events',
    component: DBEvents
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: Comparison,
  },
  {
    path: '/triggers',
    name: 'Triggers',
    component: Triggers
  },
  {
    path: '/watcher',
    name: 'Watcher',
    component: Watcher
  },
]

const router = new VueRouter({
  routes
})

export default router
