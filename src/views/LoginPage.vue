<template>
  <div class="loginPage">
    <div>
      <input v-model="email" type="email" class="form-control loginPage__form" placeholder="メールアドレス" autocomplete="on">
      <input v-model="password" type="password" class="form-control form-control--margin loginPage__form" placeholder="パスワード" autocomplete="on">
      <button @click="login" class="btn btn-primary loginPage__button" type="button">ログイン</button>
    </div>
    <div>
      <p class="loginPage__error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  data () {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    login: function () {
      const auth = getAuth()

      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$router.push('/')
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
            this.errorMessage = 'パスワードかメールアドレスが間違っています。ご確認ください。'
          } else if (error.code === 'auth/user-not-found') {
            this.errorMessage = '入力されたメールアドレスはアカウントと一致しません。メールアドレスをご確認の上、もう一度実行してください。'
          }
        })
    }
  }
}
</script>

<style>
.loginPage__form {
  margin-bottom: 10px;
}

.loginPage__button {
  text-align: center;
  width: 100%;
}

.loginPage__error {
  color: red;
  margin-top: 10px;
}
</style>