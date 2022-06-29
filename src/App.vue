<template>
  <div id="app">
    <router-link to="/">home</router-link>
    <router-link to="/SignUp">SignUp</router-link>
    <router-link to="/eventCreation">イベント作成</router-link>
    <main id="main">
      <router-view/>
    </main>
  </div>
</template>
<style>
#main {
  width: 860px;
  margin: 30px auto;
}
</style>