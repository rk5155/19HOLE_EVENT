<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">19HOLE</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="isDisplayHeader" class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">

          <template v-if="isLoggedIn && currentUser.displayName === '川田隆稀'">
            <router-link to="/" class="nav-link">ホーム</router-link>
            <router-link to="/AdminPage" class="nav-link">管理者</router-link>
            <router-link to="/eventCreation" class="nav-link">イベント作成</router-link>
            <router-link to="/LogOutPage" class="nav-link">ログアウト</router-link>
          </template>

          <template v-else-if="isLoggedIn">
            <router-link to="/" class="nav-link">ホーム</router-link>
            <router-link to="/LogOutPage" class="nav-link">ログアウト</router-link>
          </template>

          <template v-else>
            <router-link to="/SignUp" class="nav-link">新規登録</router-link>
            <router-link to="/LoginPage" class="nav-link">ログイン</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseUtils from '@/firebaseUtils'

export default {
  data () {
    return {
      isDisplayHeader: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.cuurentUser
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  created () {
    firebaseUtils.onAuth()

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isDisplayHeader = true
      }
    })
  }
}
</script>