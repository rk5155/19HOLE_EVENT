import { getAuth, onAuthStateChanged } from 'firebase/auth'
import store from '@/store'

export default {
  onAuth () {
    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
      let cuurentUser

      if (user) {
        cuurentUser = user
      } else {
        cuurentUser = {}
      }

      store.commit('onAuthStateChanged', cuurentUser)
      store.commit('onUserLoginStatusChanged', cuurentUser.uid ? cuurentUser.uid : false)
    })
  }
}
