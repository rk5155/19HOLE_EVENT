import Vue from 'vue'
import Router from 'vue-router'
import EventHome from '@/views/EventHome'
import eventCreation from '@/views/eventCreation'
import SignUp from '@/views/SignUp'
import UserProfile from '@/views/UserProfile'
import ChatRoom from '@/views/ChatRoom'

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
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/UserProfile',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/ChatRoom/:eventId',
      name: 'ChatRoom',
      component: ChatRoom
    }
  ]
})