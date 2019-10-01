import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyD9sC8Di2L-3Sxkh7pWvgX_H845KyT62Dk",
  authDomain: "jobquest-b6a5c.firebaseapp.com",
  databaseURL: "https://jobquest-b6a5c.firebaseio.com",
  projectId: "jobquest-b6a5c",
  storageBucket: "",
  messagingSenderId: "800186525898",
  appId: "1:800186525898:web:7e1b1aa927be7b50992c33",
  measurementId: "G-F7QSEK4M2X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
