<template>
  <div id="app">
    <HeaderNav/>

    <main id="main">
      <router-view/>
    </main>
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav.vue'
export default {
  components: {
    HeaderNav
  }
}
</script>

<style>
#main {
  width: 860px;
  margin: 86px auto;
}
@media screen and (max-width: 580px) {
  #main {
    width: 96%;
  }
}
</style>