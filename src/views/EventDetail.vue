<template>
  <div v-if="event">
    <EventDetailContent :event="event"></EventDetailContent>
  </div>
  <div v-else>
    <EventDetailContent :event="localStorageEvent"></EventDetailContent>
  </div>
</template>

<script>
import EventDetailContent from '@/components/EventDetailContent.vue'

export default {
  props: ["event"],
  data () {
    this.publishableKey = 'pk_live_51Ko2ckHIT4Uh5KIjb0UXJHWVs2vpbCAmF152Vw5C0QqeVm2SBC4TcVET1guSf3Poz8subJBE6RujxgkZGvoA6fa300smCFrF7F'
    this.publishableTestKey = 'pk_test_51Ko2ckHIT4Uh5KIjqI6JgyPkIoI7oGeNSld2MBeKEtpUdCpj4lwyjtPDqwQtbOPgH0SZxB2XCixr2Wx1rUFwUmJc00RJloQKEG'

    return {
      localStorageEvent: null
    }
  },
  components: {
    EventDetailContent
  },
  created () {
    // リロードすると渡されたeventが空になるので、localStorage に保存
    if (this.event) {
      localStorage.setItem("event", JSON.stringify(this.event));
    } else {
      this.localStorageEvent = JSON.parse(localStorage.getItem("event"))
    }
  }
}
</script>