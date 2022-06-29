import Vue from 'vue'
import App from './App.vue'
import { initializeApp } from 'firebase/app'

Vue.config.productionTip = false

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
  render: h => h(App),
}).$mount('#app')
