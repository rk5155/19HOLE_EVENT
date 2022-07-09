<template>
  <div class="userProfile">
    <div v-if="nameNotRegistered" class="userProfile__nameNotRegistered">
      <p>イベント参加には氏名の登録が必要です。</p>
    </div>  

    <template>
      <input v-model="name" type="text" class="form-control userProfile__form" placeholder="氏名">
      
      <button @click="userProfileRegistration" class="btn btn-primary userProfile__button" type="button">登録する</button>
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
  computed: {
    nameNotRegistered () {
      return location.search === '?nameNotRegistered'
    },
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

<style>
.userProfile__form {
  margin-bottom: 10px;
}

.userProfile__button {
  text-align: center;
  width: 100%;
}

.userProfile__nameNotRegistered {
  color: red;
}
</style>