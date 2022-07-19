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
        <label for="exampleFormControlTextarea1">会場のある都道府県</label>
        <select v-model="prefectures" class="form-select" aria-label="Default select example">
          <option value="茨城県">茨城県</option>
          <option value="栃木県">栃木県</option>
          <option value="群馬県">群馬県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="千葉県">千葉県</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
        </select>
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
        <label for="exampleFormControlTextarea1">オープンチャット</label>
        <input v-model="openChat" type="text" class="form-control">
      </div>

      <div class="form-group">
        <label for="exampleFormControlTextarea1">キャンセル規定</label>
        <input v-model="cancel" type="text" class="form-control">
      </div>

      <div class="form-group">
        <input @change="selectedFile" type="file" accept=".png">
        <label class="custom-file-label" for="inputFile" data-browse="参照">ファイルを選択(ここにドロップすることもできます)</label>
      </div>

      <button @click="postEvent" type="button">イベント追加</button>
    </form>
  </div>
</template>

<script>
import { collection, addDoc, getFirestore } from "firebase/firestore";
// import { getDatabase, ref, set } from "firebase/database";
import { getStorage, ref as sRef, uploadBytes } from "firebase/storage";

export default {
  data () {
    return {
      eventName: null,
      venue: null,
      timesDay: null,
      deadline: null,
      cost: null,
      cancel: null,
      prefectures: null,
      playTime: null,
      numberOfPeople: null,
      openChat: null,
      uploadFile: null
    }
  },
  computed: {
    emptyCheck () {
      if (this.eventName && this.venue && this.timesDay && this.deadline && this.cost && this.cancel && this.prefectures && this.playTime && this.numberOfPeople && this.openChat && this.uploadFile) {
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
            prefectures: this.prefectures,
            playTime: this.playTime,
            numberOfPeople: this.numberOfPeople,
            openChat: this.openChat,
            eventParticiPants: []
          }).then((result) => {
            this.eventName = this.venue = this.timesDay = this.deadline = this.cost = this.cancel = this.prefectures = this.playTime = this.numberOfPeople = this.openChat = null
  
            // const realTimedb = getDatabase()
            // // イベントチャットルームを作成
            // set(ref(realTimedb, `eventChatRoom/${result.id}`), {
            //   eventId: result.id,
            // })
            this.upload(result.id)
          }).then(() => {
            alert("イベントを作成しました")
            this.$router.push('/')
          })
          .catch((error) => {
            console.log(error)
          })
        } else {
          alert("未入力があるよ")
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    },
    selectedFile (e) {
      e.preventDefault()
      let files = e.target.files
      this.uploadFile = files[0]
    },
    upload (eventId) {
      const storage = getStorage()
      const storageRef = sRef(storage, `event_images/${eventId}.${this.uploadFile.name.split('.')[1]}`)

      // 画像をStorageにアップロード
      uploadBytes(storageRef, this.uploadFile).then(() => {
        console.log('Uploaded a blob or file!')
      }).catch((error) => {
        console.log(error);
      })
    }
  }
}
</script>

