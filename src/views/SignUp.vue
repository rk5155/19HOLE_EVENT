<template>
  <div class="signup">
    <div>
      <input v-model="email" type="email" class="form-control signup__form" placeholder="メールアドレス" autocomplete="on">
      <input v-model="password" type="password" class="form-control form-control--margin signup__form" placeholder="パスワード" autocomplete="on">
      <button @click="signUp" class="btn btn-primary signup__button" type="button">登録する</button>
    </div>
    <p class="signup__error">
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

<style>
.signup__form {
  margin-bottom: 10px;
}

.signup__button {
  text-align: center;
  width: 100%;
}

.signup__error {
  color: red;
  margin-top: 10px;
}
</style>
