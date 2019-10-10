<template>
  <v-bottom-navigation v-if="userStatus" v-model="bottomNav" dark shift fixed>
    <v-btn>
      <span>contact</span>
      <v-icon>mdi-phone-forward</v-icon>
    </v-btn>
    <v-btn @click="toFavorite()">
      <span>favorite</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn @click="toHome()">
      <span>home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn @click="toMyPost()">
      <span>my post</span>
      <v-icon>mdi-account-clock</v-icon>
    </v-btn>

    <v-btn @click="toSetting()">
      <span>setting</span>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
import store from "./../../store";

export default {
  created: function() {
    var self = this;
    var timelineList = {
      phone: 0,
      favorite: 1,
      home: 2,
      mypost: 3,
      setting: 4
    };
    //TODO なぜか反応しない
    var selectedFooter = timelineList[self.nowTimeline];
    self.bottomNav = selectedFooter;
  },
  data() {
    return {
      bottomNav: 2
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    nowTimeline: function() {
      return this.$store.getters.nowTimeline;
    },
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
      }
    }
  },
  methods: {
    toHome: function() {
      store.commit("nowTimelineChanged", "home");
      this.$router.push("/");
    },
    toSetting: function() {
      store.commit("nowTimelineChanged", "setting");
      this.$router.push("/");
    },
    toMyPost: function() {
      store.commit("nowTimelineChanged", "mypost");
      this.$router.push("/");
    },
    toFavorite: function() {
      store.commit("nowTimelineChanged", "favorite");
      this.$router.push("/");
    }
  }
};
</script>
