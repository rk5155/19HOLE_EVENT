<template>
  <div class="events">
    <h1 class="eventsTitle">イベント一覧</h1>
    {{loginUserName}}
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
          <button class="btn btn-warning" @click="submit">参加する</button>
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
      :customerEmail='loginUserEmail'
      @loading="v => loading = v"
    />
  </div>
</template>

<script>
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StripeCheckout } from '@vue-stripe/vue-stripe';

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
      successURL: 'https://19hole-golf-event.netlify.app/',
      cancelURL: 'https://19hole-golf-event.netlify.app/',
      events: [],
      loginUserName: null,
      loginUserEmail: null
    }
  },
  created () {
    const db = getFirestore()
    getDocs(collection(db, "events")).then((result => {
      result.forEach((doc) => {
        this.events.push(doc.data())
      });
    }))

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.loginUserName = user.displayName;
          this.loginUserEmail = user.email;
        }
    });
  },
  methods: {
    submit () {
      // You will be redirected to Stripe's secure checkout page
      this.$refs.checkoutRef.redirectToCheckout();
    },
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