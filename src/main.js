import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueChatScroll from "vue-chat-scroll";
import { firestorePlugin } from "vuefire";
import Firebase from "./firebase";
import ShowProfile from "./components/Profile/ShowProfile";
import "./registerServiceWorker";

Vue.use(firestorePlugin);
Vue.use(VueChatScroll);

Vue.component("ShowProfile", ShowProfile);

Vue.config.productionTip = false;
Firebase.init();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
