<template>
  <div class="signup">
      <template>
        <label for="">氏名</label>
        <input v-model="name" type="text" class="form-control">
        
        <button @click="userProfileRegistration" class="btn btn-warning" type="button">登録する</button>
      </template>
  </div>
</template>

<script>
import { getAuth, updateProfile } from 'firebase/auth'

export default {
  data () {
    return {
      name: null,
    }
  },
  methods: {
    userProfileRegistration: function () {
      const auth = getAuth();

      if (this.name) {
        updateProfile(auth.currentUser, {
          displayName: this.name
        }).then(() => {
          this.$router.push('/')
        }).catch((error) => {
          console.log(error);
        });
      } else {
        alert('氏名を入力してください')
      }
    },
  }
}
</script>
