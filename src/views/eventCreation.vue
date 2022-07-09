<template>
  <div>
    <form>
      <div class="mb-3">
        <span>※</span>
        <label class="form-label">イベント名</label>
        <input v-model="eventName" type="text" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">プレー日</label>
        <input v-model="timesDay" type="date" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">プレー時刻</label>
        <input v-model="playTime" type="time" class="form-control">
      </div>

      <div class="mb-3">
        <span>※</span>
        <label class="form-label">開催場所</label>
        <input v-model="venue" type="text" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">料金</label>
        <input v-model.number="cost" type="number" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">組数</label>
        <input v-model.number="numberOfPairs" type="number" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">人数</label>
        <input v-model.number="numberOfPeople" type="number" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">締め切り</label>
        <input v-model="deadline" type="date" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">キャンセル規定</label>
        <input v-model="cancel" type="text" class="form-control">
      </div>

      <button @click="postEvent" type="button">イベント追加</button>
    </form>
  </div>
</template>

<script>
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";

export default {
  data () {
    return {
      eventName: null,
      venue: null,
      timesDay: null,
      deadline: null,
      cost: null,
      cancel: null,
      numberOfPairs: null,
      playTime: null,
      numberOfPeople: null
    }
  },
  computed: {
    emptyCheck () {
      if (this.eventName && this.venue && this.timesDay && this.deadline && this.cost && this.cancel && this.numberOfPairs && this.playTime && this.numberOfPeople) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    postEvent: function () {
      const db = getFirestore()

      try {
        if (this.emptyCheck) {
          addDoc(collection(db, "events"), {
            eventName: this.eventName,
            venue: this.venue,
            timesDay: this.timesDay,
            deadline: this.deadline,
            cost: this.cost,
            cancel: this.cancel,
            numberOfPairs: this.numberOfPairs,
            playTime: this.playTime,
            numberOfPeople: this.numberOfPeople
          }).then((result) => {
            this.eventName = this.venue = this.timesDay = this.deadline = this.cost = this.cancel = this.numberOfPairs = this.playTime = this.numberOfPeople = null

            const realTimedb = getDatabase()
            // イベントチャットルームを作成
            set(ref(realTimedb, `eventChatRoom/${result.id}`), {
              eventId: result.id,
            })
            alert("イベントを作成しました")
            this.$router.push('/')
          }).catch((error) => {
            console.log(error)
          })
        } else {
          alert("未入力があるよ")
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    }
  }
}
</script>

