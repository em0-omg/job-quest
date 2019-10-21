import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    status: false,
    timeline: "",
    exist: true
  },
  mutations: {
    onAuthStateChanged(state, user) {
      state.user = user; //firebaseが返したユーザー情報
    },
    onUserStatusChanged(state, status) {
      state.status = status; //ログインしてるかどうか true or false
    },
    nowTimelineChanged(state, timeline) {
      state.timeline = timeline; //現在のタイムライン表示
    },
    isExistUser(state, isExistUser) {
      state.exist = isExistUser;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
    nowTimeline(state) {
      return state.timeline;
    },
    isExistUser(state) {
      return state.exist;
    }
  }
});
