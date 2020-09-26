import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Triggers from '../views/Triggers.vue'
import Watcher from '../views/Watcher.vue'
import Connections from '../views/Connections.vue'
import Commands from '../views/Commands.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
  {
    path: '/commands',
    name: 'Commands',
    component: Commands
  },
]

const router = new VueRouter({
  routes,
})

export default router
