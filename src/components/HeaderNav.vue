<template>
  <div class="header">
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand><router-link to="/" class="nav-link">19HOLE</router-link></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <template v-if="isLoggedIn && currentUserData && currentUserData.admin">
            <router-link to="/" class="nav-link">ホーム</router-link>
            <router-link to="/WayToParticipate" class="nav-link">参加方法</router-link>
            <router-link to="/AdminPage" class="nav-link">管理者</router-link>
            <router-link to="/eventCreation" class="nav-link">イベント作成</router-link>
            <router-link to="/LogOutPage" class="nav-link">ログアウト</router-link>
          </template>

          <template v-else-if="isLoggedIn">
            <router-link to="/" class="nav-link">ホーム</router-link>
            <router-link to="/WayToParticipate" class="nav-link">参加方法</router-link>
            <router-link to="/LogOutPage" class="nav-link">ログアウト</router-link>
          </template>

          <template v-else>
            <router-link to="/SignUp" class="nav-link">新規登録</router-link>
            <router-link to="/LoginPage" class="nav-link">ログイン</router-link>
            <router-link to="/WayToParticipate" class="nav-link">参加方法</router-link>
          </template>
        </b-navbar-nav>
        <span v-if="currentUser.displayName" class="header__userName">{{ currentUser.displayName }} さん</span>
      </b-collapse>
    </b-navbar> 
  </div>
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
    },
    currentUserData () {
      return this.$store.getters.currentUserData
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

<style>
.header {
  background-color: black;
  font-weight: bold;
  position: fixed;
  width: 100%;
  z-index: 1;
  top: 0;
}
.navbar {
  width: 860px;
  margin: 0 auto;
}

.navbar-nav a {
  color: white;
}

.header__userName {
  color: white;
  text-align: right;
}

.navbar-expand-lg .navbar-collapse {
  justify-content: space-between;
}

@media screen and (max-width: 580px) {
  .navbar {
    width: 90%;
    margin: 0 auto;
  }
}
</style>