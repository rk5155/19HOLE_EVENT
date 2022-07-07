import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cuurentUser: {},
    isLoggedIn: false,
    currentUserData: null
  },
  mutations: {
    onAuthStateChanged (state, cuurentUser) {
      // firebaseが返したユーザー情報
      state.cuurentUser = cuurentUser
    },
    onUserLoginStatusChanged (state, isLoggedIn) {
      // ログインしているかどうか
      state.isLoggedIn = isLoggedIn
    },
    setCuurentUserData (state, currentUserData) {
      state.currentUserData = currentUserData
    }
  },
  getters: {
    cuurentUser (state) {
      return state.cuurentUser
    },
    isLoggedIn (state) {
      return state.isLoggedIn
    },
    currentUserData (state) {
      return state.currentUserData
    }
  }
})
