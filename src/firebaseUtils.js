import { getAuth, onAuthStateChanged } from 'firebase/auth'
import store from '@/store'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

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

      const db = getFirestore()

      // cuurentUser.email の存在チェックでログアウト時のエラーを解決
      if (cuurentUser.uid) {
        getDoc(doc(db, 'users', cuurentUser.uid)).then(result => {

          if (result.exists()) {
            let currentUserData = result.data()
            store.commit('setCuurentUserData', currentUserData)
          }
        })
      }
    })
  }
}
