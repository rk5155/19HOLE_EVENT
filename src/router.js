import Vue from 'vue'
import Router from 'vue-router'
import EventHome from '@/views/EventHome'
import eventCreation from '@/views/eventCreation'
import SignUp from '@/views/SignUp'
import UserProfile from '@/views/UserProfile'
import ChatRoom from '@/views/ChatRoom'
import AdminPage from '@/views/AdminPage'
import LoginPage from '@/views/LoginPage'
import LogoutPage from '@/views/LogoutPage'
import multiguard from "vue-router-multiguard";
import { getAuth, onAuthStateChanged } from 'firebase/auth'


Vue.use(Router)

// 僕のアカウントのみ、管理者ページへのアクセスを許可
const adminAuthority = (to, from, next) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user.uid === 'ZngB0KUd6EMxh0rNArPYvA5rCQv1') {
      next()
    } else {
      next({ name: 'EventHome' })
    }
  })
};

// ログイン済のユーザのみ許可
const logindPermission = (to, from, next) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      next()
    } else {
      // 認証されていない場合、認証画面へ
      next({ name: 'LoginPage' })
    }
  })
};

// 未ログインのみ許可
const notLogindPermission = (to, from, next) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      next({ name: 'EventHome' })
    } else {
      next()
    }
  })
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'EventHome',
      component: EventHome,
      beforeEnter: multiguard([logindPermission]),
    },
    {
      path: '/eventCreation',
      name: 'eventCreation',
      component: eventCreation,
      beforeEnter: multiguard([adminAuthority]),
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: multiguard([notLogindPermission]),
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
      component: AdminPage,
      beforeEnter: multiguard([adminAuthority]),
    },
    {
      path: '/LoginPage',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/LogoutPage',
      name: 'LogoutPage',
      component: LogoutPage
    }
  ]
})