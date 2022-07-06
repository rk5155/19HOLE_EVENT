import Vue from 'vue'
import Router from 'vue-router'
import EventHome from '@/views/EventHome'
import eventCreation from '@/views/eventCreation'
import SignUp from '@/views/SignUp'
import UserProfile from '@/views/UserProfile'
import ChatRoom from '@/views/ChatRoom'
import AdminPage from '@/views/AdminPage'
import LoginPage from '@/views/LoginPage'

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
    },
    {
      path: '/AdminPage',
      name: 'AdminPage',
      component: AdminPage
    },
    {
      path: '/LoginPage',
      name: 'LoginPage',
      component: LoginPage
    }
  ]
})