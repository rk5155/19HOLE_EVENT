<template>
  <div>
    <h1>イベント一覧</h1>
    <div v-for="(event, index) in events" :key="index">
      {{ event }}
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default {
  data () {
    return {
      events: []
    }
  },
  created () {
    const db = getFirestore()
    getDocs(collection(db, "events")).then((result => {
      result.forEach((doc) => {
        this.events.push(doc.data())
      });
    }))
  }
}
</script>
