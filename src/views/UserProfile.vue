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
import { doc, setDoc, getFirestore } from 'firebase/firestore'

export default {
  data () {
    return {
      name: null,
    }
  },
  methods: {
    userProfileRegistration: function () {
      const auth = getAuth();
      const db = getFirestore()

      if (this.name) {
        updateProfile(auth.currentUser, {
          displayName: this.name
        }).then(() => {
          this.$router.push('/')
          setDoc(doc(db, "users", auth.lastNotifiedUid), {})
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
