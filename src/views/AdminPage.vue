<template>
  <div class="adminPage">
    <h1>管理者</h1>

    <div v-for="event in events" :key="event.id" class="adminPageList">
      <h2>{{ event.eventName }}</h2>
      <h3>イベント参加者</h3>
      <ul>
        <template v-if="event.eventParticiPants">
          <li v-for="participant in event.eventParticiPants" :key="participant">{{ participant }}</li>
        </template>
        <template v-else>
          0人です
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
  data () {
    return {
      events: [],
    }
  },
  created () {
    const getFirestoreDb = getFirestore()

    getDocs(collection(getFirestoreDb, "events")).then((result => {
      result.forEach((event) => {
        let eventData = event.data()
        eventData.eventId = event.id
        this.events.push(eventData)
      });
    }))
  }
}
</script>

<style>
.adminPageList {
  margin-bottom: 40px;
}
</style>