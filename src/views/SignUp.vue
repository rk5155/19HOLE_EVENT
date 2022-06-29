<template>
  <div class="signup">
      <template>
        <label for="">メールアドレス</label>
        <input v-model="email" type="email" class="form-control" placeholder="メールアドレス" autocomplete="on">
        <label for="">パスワード</label>
        <input v-model="password" type="password" class="form-control form-control--margin" placeholder="パスワード" autocomplete="on">
        <button @click="signUp" class="btn btn-warning" type="button">登録する</button>
      </template>
      <p class="signinError">
        {{ errorMessage }}
      </p>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  data () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      name: null
    }
  },
  methods: {
    signUp: function () {
      const auth = getAuth()

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user
          console.log(user)
          document.querySelector('header')
          this.$router.push('/UserProfile')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = 'このメールアドレスは既に使用されています。'
              break
            case 'auth/invalid-email':
              this.errorMessage = '無効なメールアドレスです。'
              break
            case 'auth/weak-password':
              this.errorMessage = 'パスワードが短すぎます。'
              break
          }
        })
    },
  }
}
</script>
