import Vue from 'vue'
import VueRouter from 'vue-router'
import Hooks from '../views/Hooks.vue'
import Watcher from '../views/Watcher.vue'
import Connections from '../views/Connections.vue'
import Commands from '../views/Commands.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Connections',
    component: Connections
  },
  {
    path: '/hooks',
    name: 'Hooks',
    component: Hooks
  },
  {
    path: '/watcher',
    name: 'Watcher',
    component: Watcher
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

