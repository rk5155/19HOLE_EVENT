import Vue from 'vue'
import Router from 'vue-router'
import EventHome from '@/views/EventHome'
import eventCreation from '@/views/eventCreation'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'EventHome',
      component: EventHome
    },
    {
      path: '/eventCreation',
      name: 'eventCreation',
      component: eventCreation
    }
  ]
})