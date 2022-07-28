<template>
  <div class="adminPage">
    <h1>管理者</h1>

    <div v-for="event in events" :key="event.id" class="adminPageList">
      <h2>{{ event.eventName }}</h2>
      <h3>参加締め切り</h3>
      <p>{{ event.deadline }}</p>
      <h3>イベント参加者</h3>
      <ul>
        <template v-if="event.eventParticiPants.length !== 0">
          <li v-for="(participant, i) in event.eventParticiPants" :key="i">{{ participant }}</li>
        </template>
        <template v-else>
          0人です
        </template>
      </ul>
      <hr>
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

<style scoped>
.adminPageList {
  margin-bottom: 40px;
}

h1 {
  margin-bottom: 60px;
}

h2 {
  margin-bottom: 30px;
}

h3 {
  font-size: 20px;
}
</style>