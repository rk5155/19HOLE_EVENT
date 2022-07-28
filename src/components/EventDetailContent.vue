<template>
  <div class="card eventDetail">
    <h5 class="card-header">{{ event.eventName }}</h5>
    <div class="card-body">
      
      <h3 class="card-text">開催日時</h3>
      <p class="eventDetail__text">{{ event.timesDay }} {{event.playTime}}</p>

      <h3 class="card-text">都道府県</h3>
      <p class="eventDetail__text">{{ event.prefectures }}</p>

      <h3 class="card-text">会場</h3>
      <p class="eventDetail__text">{{ event.venue }}</p>

      <h3 class="card-text">プレー料金</h3>
      <p class="eventDetail__text">
        {{ (event.cost + 1000).toLocaleString() }}円 - 1,000円(参加費) = {{ event.cost.toLocaleString() }}円<br>
        ※プレー料金は当日各自でご精算となります。
      </p>

      <h3 class="card-text">参加費</h3>
      <p class="eventDetail__text">
        1,000円<br>
        ※参加費を先にお支払いお願いします。参加確定の預かり金として、先にいただいております。<br>
        ※プレー料金は参加費を差し引いた金額となっております。<br>
        ※イベント開催が中止となった場合は返金させていただきます。
      </p>

      <h3 class="card-text">締め切り</h3>
      <p class="eventDetail__text">{{ event.deadline }}</p>


      <h3 class="card-text">募集人数</h3>
      <p class="eventDetail__text">{{ event.numberOfPeople }}人</p>

      <h3 class="card-text">キャンセル規定</h3>
      <p class="eventDetail__text">{{ event.cancel }}</p>

      <p class="eventDetail__participation" v-if="isEventToAttend">このイベントに参加予定です。</p>
      <p class="eventDetail__participation" v-else-if="!isEventCrowded">このイベントは満員です。</p>
      <button v-else class="btn eventList__btn" @click="participationFeePayment(event.eventId)">参加する</button>

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
  </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';

export default {
  props: ["event", "isEventToAttend", "isEventCrowded"],
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
      cancelURL: `${location.protocol}//${location.host}/`
    }
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
}
</script>

<style>
.card-header {
  text-align: center;
  font-weight: bold;
}

.card-text {
  border-bottom: 2px dotted;
  display: inline-block;
  padding-bottom: 4px;
}

.btn.eventList__btn {
  width: 100%;
  color: white;
  font-weight: bold;
  background-color: #88D8DC;
}

.eventDetail__text {
  margin-bottom: 26px;
}

.eventDetail__participation {
  color: #F65656;
  font-weight: bold;
}
</style>