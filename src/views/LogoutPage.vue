<template>
  <div class="looutPage">
    <button @click="logout" class="btn btn-primary logoutPage__button">ログアウト</button>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'

export default {
  methods: {
    logout: function () {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          this.$router.push('/')
          // 一度リロードして、画面を更新
          this.$router.go({path: '/', force: true})
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
.logoutPage__button {
  text-align: center;
  width: 100%;
}
</style>