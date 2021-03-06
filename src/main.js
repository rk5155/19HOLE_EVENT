import Vue from 'vue'
import App from './App.vue'
import { initializeApp } from "firebase/app"
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from "./store";

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const firebaseConfig = {
  apiKey: "AIzaSyA8f8xlna2zteGLTikFz7lx-4DPEUjVATI",
  authDomain: "hole-golf.firebaseapp.com",
  projectId: "hole-golf",
  storageBucket: "hole-golf.appspot.com",
  messagingSenderId: "73046976270",
  appId: "1:73046976270:web:9403ce494172943dc0595f",
  measurementId: "G-878F4B3C9F"
};

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
