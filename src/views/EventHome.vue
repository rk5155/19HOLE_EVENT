<template>
  <div class="events">
    <h1 class="eventsTitle">イベント一覧</h1>
    <div class="eventList">
      <div v-for="(event, index) in events" :key="index" class="eventItem card text-dark bg-light mb-3">
        <div class="card-header">開催日時<br>{{ event.timesDay }} {{event.playTime}}</div>
        <div class="card-body">
          <h2 class="card-title">{{ event.eventName }}</h2>
          <p class="card-text">会場<br>{{ event.venue }}</p>
          <p class="card-text">締め切り<br>{{ event.deadline }}</p>
          <p class="card-text">プレー日<br>{{ event.cost.toLocaleString() }}円</p>
          <p class="card-text">組数<br>{{ event.numberOfPairs }}</p>
          <p class="card-text">キャンセル規定<br>{{ event.cancel }}</p>

          <template v-if="isEventToAttend(event.eventId)">
            <p class="events__participation">このイベントに参加予定です</p>
            <!-- <button class="btn btn-primary"><router-link :to="{ name: 'ChatRoom', params: { eventId: event.eventId }}">グループチャット</router-link></button> -->
            <button class="btn btn-primary" @click="nonParticipationEvent(event.eventId)">不参加</button>
          </template>
          <button v-else class="btn btn-primary" @click="participationFeePayment(event.eventId)">参加する</button>
          <button v-if="currentUserData.admin" class="btn btn-primary" @click="eventDelete(event.eventId)">イベント削除</button>
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

export default {
  components: {
    StripeCheckout,
  },
  data () {
    this.publishableKey = 'pk_live_51Ko2ckHIT4Uh5KIjb0UXJHWVs2vpbCAmF152Vw5C0QqeVm2SBC4TcVET1guSf3Poz8subJBE6RujxgkZGvoA6fa300smCFrF7F'
    return {
      loading: false,
      lineItems: [
        {
          price: 'price_1LFxrlHIT4Uh5KIjNMhUVsJe', // The id of the one-time price you created in your Stripe dashboard
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
      result.forEach((event) => {
        let eventData = event.data()
        eventData.eventId = event.id
        this.events.push(eventData)
      });
    }))

    if (this.isLoggedIn) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      this.loginUserProfile = doc(this.getFirestoreDb, "users", this.currentUser.uid);

      if (location.search) {
        const eventId = location.search.slice(1)

        updateDoc(this.loginUserProfile, {
          eventsToAttend: arrayUnion(eventId)
        })

        const participationEvent = doc(this.getFirestoreDb, "events", eventId);

        updateDoc(participationEvent, {
          eventParticiPants: arrayUnion(this.currentUser.displayName)
        })
      }

      getDoc(this.loginUserProfile).then((result) => {
        this.loginUserEventsToAttend = result.data().eventsToAttend
      })
    }
  },
  methods: {
    participationFeePayment (eventId) {
      this.successURL = `${this.successURL}?${eventId}`
      // You will be redirected to Stripe's secure checkout page
      this.$refs.checkoutRef.redirectToCheckout();
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
    }
  },
}
</script>

<style>

.eventsTitle {
  font-size: 30px;
  color: black;
  padding: 1rem 2rem;
  border-bottom: 6px double #000;
  text-align: center;
  font-weight: bold;
  margin-bottom: 40px;
}

h2.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.eventList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.eventItem {
  width: 49%;
}

.btn.btn-primary {
  color: white;
  font-weight: bold;
}

.events__participation {
  color: red;
}
@media screen and (max-width: 580px) {
  .eventsTitle {
    font-size: 24px;
  }

  .card-title {
    font-size: 18px;
  }

  .eventItem {
    font-size: 14px;
    width: 100%;
  }

  .eventList {
    display: block;
  }
}
</style>