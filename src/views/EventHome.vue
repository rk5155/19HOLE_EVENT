<template>
  <div class="events">
    <h1 class="eventsTitle">イベント一覧</h1>
    {{currentUser.displayName}}
    <div class="eventList">
      <div v-for="(event, index) in events" :key="index" class="eventItem card text-dark bg-light mb-3">
        <div class="card-header">開催日時: {{ event.timesDay }} {{event.playTime}}</div>
        <div class="card-body">
          <h2 class="card-title">{{ event.eventName }}</h2>
          <p class="card-text">会場: {{ event.venue }}</p>
          <p class="card-text">締め切り: {{ event.deadline }}</p>
          <p class="card-text">プレー日: {{ event.cost.toLocaleString() }}円</p>
          <p class="card-text">キャンセル規定: {{ event.cancel }}</p>
          <p class="card-text">組数: {{ event.numberOfPairs }}</p>
          <template v-if="isEventToAttend(event.eventId)">
            <p class="">このイベントに参加予定です</p>
            <button class="btn btn-warning"><router-link :to="{ name: 'ChatRoom', params: { eventId: event.eventId }}">グループチャット</router-link></button>
            <button class="btn btn-warning" @click="nonParticipationEvent(event.eventId)">不参加</button>
          </template>
          <button v-else class="btn btn-warning" @click="participationFeePayment(event.eventId)">参加する</button>
          <button v-if="currentUserData.admin" class="btn btn-warning" @click="eventDelete(event.eventId)">イベント削除</button>
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
    this.publishableKey = 'pk_test_51Ko2ckHIT4Uh5KIjqI6JgyPkIoI7oGeNSld2MBeKEtpUdCpj4lwyjtPDqwQtbOPgH0SZxB2XCixr2Wx1rUFwUmJc00RJloQKEG'
    return {
      loading: false,
      lineItems: [
        {
          price: 'price_1LFxtCHIT4Uh5KIj2oJQQmS6', // The id of the one-time price you created in your Stripe dashboard
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
  padding: 1rem 2rem;
  color: #fff;
  background-image: -webkit-gradient(linear, left top, right top, from(#fa709a), to(#fee140));
  background-image: -webkit-linear-gradient(left, #fa709a 0%, #fee140 100%);
  background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
  border-radius: 10px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 26px;
}

.eventList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.eventItem {
  width: 49%;
}
</style>