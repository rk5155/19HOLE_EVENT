<template>
  <div class="events">
    <h1 class="events__title">イベント一覧</h1>
    <div class="eventList">
      <div v-for="(event, index) in events" :key="index" class="eventItem card text-dark bg-light mb-3">
        <div class="card-header">
          <h2 class="card-title">{{ event.eventName }}</h2>
        </div>
        <div class="card-body">
          <p v-if="event.numberOfPeople > event.eventParticiPants.length" class="eventList__situation">募集中です！</p>
          <p v-else class="eventList__situation">このイベントは満員です。</p>

          <h3 class="card-text">開催日時</h3>
          <p class="eventList__text">{{ event.timesDay }} ({{ getDayOfWeek(event.timesDay) }}) {{event.playTime}}</p>

          <h3 class="card-text">会場</h3>
          <p class="eventList__text">{{ event.venue }}</p>

          <h3 class="card-text">締め切り</h3>
          <p class="eventList__text">{{ event.deadline }}</p>

          <h3 class="card-text">プレー料金</h3>
          <p class="eventList__text">{{ event.cost.toLocaleString() }}円</p>

          <h3 class="card-text">都道府県</h3>
          <p class="eventList__text">{{ event.prefectures }}</p>

          <h3 class="card-text">募集人数</h3>
          <p class="eventList__text">{{ event.numberOfPeople }}人</p>

          <h3 class="card-text">キャンセル規定</h3>
          <p class="eventList__text">{{ event.cancel }}</p>

          <template v-if="isEventToAttend(event.eventId)">
            <p class="events__participation">このイベントに参加予定です！<br>参加メンバーとオープンチャットでやりとりしましょう！</p>
            <!-- <button class="btn btn-primary"><router-link :to="{ name: 'ChatRoom', params: { eventId: event.eventId }}">グループチャット</router-link></button> -->
            <a :href="event.openChat" target="_blank" class="btn btn-primary eventList__btn">オープンチャットに参加する</a>
            <button class="btn btn-primary eventList__btn eventList__btn--margin" @click="nonParticipationEvent(event.eventId)">不参加</button>
          </template>
          <button v-else class="btn btn-primary eventList__btn" @click="participationFeePayment(event.eventId)">参加する</button>
          <button v-if="currentUserData && currentUserData.admin" class="btn btn-primary eventList__btn eventList__btn--margin" @click="eventDelete(event.eventId)">イベント削除</button>
        </div>
      </div>
    </div>
    <stripe-checkout
      ref="checkoutRef"
      mode="payment"
      :pk="publishableKey"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      :customerEmail='currentUser.email'
      @loading="v => loading = v"
    />
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, updateDoc, doc, arrayUnion, getDoc, arrayRemove, deleteDoc, query, where } from "firebase/firestore";
import { StripeCheckout } from '@vue-stripe/vue-stripe';
import firebaseUtils from '@/firebaseUtils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  components: {
    StripeCheckout,
  },
  data () {
    this.publishableKey = 'pk_live_51Ko2ckHIT4Uh5KIjb0UXJHWVs2vpbCAmF152Vw5C0QqeVm2SBC4TcVET1guSf3Poz8subJBE6RujxgkZGvoA6fa300smCFrF7F'
    this.publishableTestKey = 'pk_test_51Ko2ckHIT4Uh5KIjqI6JgyPkIoI7oGeNSld2MBeKEtpUdCpj4lwyjtPDqwQtbOPgH0SZxB2XCixr2Wx1rUFwUmJc00RJloQKEG'

    return {
      loading: false,
      lineItems: [
        {
          price: 'price_1LFxrlHIT4Uh5KIjNMhUVsJe', // The id of the one-time price you created in your Stripe dashboard
          quantity: 1,
        },
      ],
      lineTestItems: [
        {
          price: 'price_1LFxtCHIT4Uh5KIj2oJQQmS6',
          quantity: 1,
        },
      ],
      successURL: `${location.protocol}//${location.host}/`,
      cancelURL: `${location.protocol}//${location.host}/`,
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
    participationFeePayment (eventId) {
      if (this.isLoggedIn && this.currentUser.displayName) {
        this.successURL = `${this.successURL}?${eventId}`
        // You will be redirected to Stripe's secure checkout page
        this.$refs.checkoutRef.redirectToCheckout();
      } else if (this.isLoggedIn && !this.currentUser.displayName) {
        this.$router.push('/UserProfile?nameNotRegistered')
      } else {
        this.$router.push('/SignUp?notLogged')
      }
    },
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
      }
    },
    getDayOfWeek (timesDayEvent) {
      const week = ['日', '月', '火', '水', '木', '金', '土']
      return week[new Date(timesDayEvent).getDay()]
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