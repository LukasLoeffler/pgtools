import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Triggers from '../views/Triggers.vue'
import Watcher from '../views/Watcher.vue'
import Connections from '../views/Connections.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
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
  {
    path: '/connections',
    name: 'Connections',
    component: Connections
  },
]

const router = new VueRouter({
  routes,
})

export default router
