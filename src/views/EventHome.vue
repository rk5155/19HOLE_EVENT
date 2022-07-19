<template>
  <div class="events">
    <h1 class="events__title">イベント一覧</h1>
    <p>{{ eventTotalNumber }}件</p>
    <div class="eventList">
      <div v-for="(event, index) in events" :key="index" class="card eventItem">
        <img src="@/assets/images/sample.png" class="card-img-top">
        <div class="card-body">
          <p v-if="isEventCrowded(event)" class="eventList__situation">募集中です！</p>
          <p v-else class="eventList__situation">このイベントは満員です。</p>

          <span>{{ event.timesDay }}({{ getDayOfWeek(event.timesDay) }}) {{ event.playTime }} スタート！</span>
          <span>{{ event.prefectures }}</span>
          <h2 class="card-text">{{ event.eventName }}</h2>
          <router-link :to="{ name: 'EventDetail', params: { eventId: event.eventId, event: event }}" class="btn btn-primary eventList__btn">詳細を見る</router-link>

          <template v-if="isEventToAttend(event.eventId)">
            <p class="events__participation">このイベントに参加予定です！<br>参加メンバーとオープンチャットでやりとりしましょう！</p>
            <!-- <button class="btn btn-primary"><router-link :to="{ name: 'ChatRoom', params: { eventId: event.eventId }}">グループチャット</router-link></button> -->
            <a :href="event.openChat" target="_blank" class="btn btn-primary eventList__btn">オープンチャットに参加する</a>
            <button class="btn btn-primary eventList__btn eventList__btn--margin" @click="nonParticipationEvent(event.eventId)">不参加</button>
          </template>

          <button v-if="currentUserData && currentUserData.admin" class="btn btn-primary eventList__btn eventList__btn--margin" @click="eventDelete(event.eventId)">イベント削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, updateDoc, doc, arrayUnion, getDoc, arrayRemove, deleteDoc, query, where } from "firebase/firestore";
import firebaseUtils from '@/firebaseUtils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, deleteObject } from "firebase/storage";

export default {
  data () {
    return {
      events: [],
      getFirestoreDb: null,
      loginUserProfile: null,
      loginUserEventsToAttend: null
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.cuurentUser
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    currentUserData () {
      return this.$store.getters.currentUserData
    },
    eventTotalNumber () {
      let eventTotalNumber = this.events.length

      if (eventTotalNumber !== 0) {
        return eventTotalNumber
      } else {
        return null
      }
    }
  },
  created () {
    firebaseUtils.onAuth()

    this.getFirestoreDb = getFirestore()

    getDocs(collection(this.getFirestoreDb, "events")).then((result => {
      let eventArray = []

      result.forEach((event) => {
        let eventData = event.data()

        eventData.eventId = event.id
        eventArray.push(eventData)
      });

      // イベントを日付順に並び替える
      this.events = 
      eventArray.sort((a, b) => {
        return (a.timesDay < b.timesDay) ? -1 : 1;
      })
    }))

    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      if (user) {
        this.loginUserProfile = doc(this.getFirestoreDb, "users", user.uid);

        getDoc(this.loginUserProfile).then((result) => {
          if (result.data()) this.loginUserEventsToAttend = result.data().eventsToAttend
        })
      }

      if (location.search) {
        const eventId = location.search.slice(1)

        updateDoc(this.loginUserProfile, {
          eventsToAttend: arrayUnion(eventId)
        })

        const participationEvent = doc(this.getFirestoreDb, "events", eventId);

        updateDoc(participationEvent, {
          eventParticiPants: arrayUnion(user.displayName)
        })
      }
    })
  },
  methods: {
    isEventToAttend (eventId) {
      return this.loginUserEventsToAttend && this.loginUserEventsToAttend.includes(eventId)
    },
    nonParticipationEvent (eventId) {
      if (window.confirm('参加費は返金されませんがよろしいですか？')) {
        const nonParticipationEvent = doc(this.getFirestoreDb, "events", eventId);

        updateDoc(nonParticipationEvent, {
          eventParticiPants: arrayRemove(this.currentUser.displayName)
        }).then(() => {
          updateDoc(this.loginUserProfile, {
            eventsToAttend: arrayRemove(eventId)
          }).then(() => {
            this.$router.push('/')
            // 一度リロードして、画面を更新
            this.$router.go({path: '/', force: true})
          })
        })
      }
    },
    eventDelete (eventId) {
      console.log(eventId);
      if (window.confirm('イベントを削除しますよ？')) {
        deleteDoc(doc(this.getFirestoreDb, "events", eventId))
          .then(() => {
            // イベント参加のユーザーを検索してeventsToAttendからイベントを削除
            getDocs(query(collection(this.getFirestoreDb, "users"), where("eventsToAttend", "array-contains", eventId)))
              .then(eventParticipants => {
                eventParticipants.forEach(user => {
                  const eventParticipantsUser = doc(this.getFirestoreDb, "users", user.id);

                  updateDoc(eventParticipantsUser, {
                    eventsToAttend: arrayRemove(eventId)
                  })
                })
              })
              .then(() => {
                this.$router.push('/')
                // 一度リロードして、画面を更新
                this.$router.go({path: '/', force: true})
              })
          })
        
        // イベント画像を削除
        const storage = getStorage();
        const desertRef = ref(storage, `event_images/${eventId}.png`);
        deleteObject(desertRef).then(() => {})
      }
    },
    getDayOfWeek (timesDayEvent) {
      const week = ['日', '月', '火', '水', '木', '金', '土']
      return week[new Date(timesDayEvent).getDay()]
    },
    isEventCrowded (event) {
      return event.numberOfPeople > event.eventParticiPants.length
    }
  },
}
</script>

<style>

.events__title {
  font-size: 30px;
  color: black;
  padding: 1rem 2rem;
  border-bottom: 6px double #000;
  text-align: center;
  font-weight: bold;
  margin-bottom: 40px;
}

h2.card-title {
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
}

.card-text {
  font-size: 18px;
  font-weight: bold;
}

.eventList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.eventItem {
  width: 49%;
  font-size: 16px;
}

.btn.btn-primary {
  color: white;
  font-weight: bold;
}

.events__participation, .eventList__situation {
  color: red;
}

.eventList__btn {
  width: 100%;
}

.eventList__btn--margin {
  margin-top: 10px;
}

.eventList__text {
  margin-bottom: 30px;
}
@media screen and (max-width: 580px) {
  .events__title {
    font-size: 24px;
  }

  .card-title {
    font-size: 18px;
  }

  .eventItem {
    width: 100%;
  }

  .eventList {
    display: block;
  }
}
</style>