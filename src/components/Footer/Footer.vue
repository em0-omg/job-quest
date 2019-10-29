<template>
  <v-bottom-navigation v-if="userStatus" v-model="bottomNav" dark shift fixed>
    <v-btn @click="toContact()">
      <span>contact</span>
      <v-icon>mdi-email-send</v-icon>
    </v-btn>
    <v-btn @click="toFavorite()">
      <span>like user</span>
      <v-icon>mdi-account-heart</v-icon>
    </v-btn>

    <v-btn @click="toHome()">
      <span>home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn @click="toNote()">
      <span>notification</span>
      <v-icon>mdi-bell-ring</v-icon>
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
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {
      var self = this;
      var timelineList = {
        phone: 0,
        favorite: 1,
        home: 2,
        notification: 3,
        setting: 4
      };
      var selectedFooter = timelineList[self.nowTimeline];
      self.bottomNav = selectedFooter;
    });
  },
  updated: function() {
    this.$nextTick(function() {
      var self = this;
      var timelineList = {
        phone: 0,
        favorite: 1,
        home: 2,
        notification: 3,
        setting: 4
      };
      var selectedFooter = timelineList[self.nowTimeline];
      self.bottomNav = selectedFooter;
    });
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
    toNote: function() {
      store.commit("nowTimelineChanged", "notification");
      this.$router.push("/");
    },
    toFavorite: function() {
      store.commit("nowTimelineChanged", "favorite");
      this.$router.push("/");
    },
    toContact: function() {
      store.commit("nowTimelineChanged", "contact");
      this.$router.push("/");
    }
  },
  watch: {
    nowTimeline: function(newVal, oldVal) {
      console.log(oldVal + "=>" + newVal);
      if (newVal === "setting") this.bottomNav = 4;
    }
  }
};
</script>
