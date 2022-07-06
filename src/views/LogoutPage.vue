<template>
  <div class="signin">
    <h2>ログアウト</h2>
      <button @click="logout">ログアウト</button>
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
