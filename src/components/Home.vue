<template>
  <v-container>
    <v-layout justify-center>
      <h1>JobQuest</h1>
    </v-layout>
    <br />
    <!-- <v-divider></v-divider> -->
    <v-layout justify-center v-show="!isTimeline()">
      <Profile />
    </v-layout>
    <v-layout justify-center v-show="isTimeline()">
      <Timeline />
    </v-layout>
    <br />
    <v-layout justify-center>
      {{ new Date().getFullYear() }} —
      <strong>Powered By JohnWORKS.</strong>
    </v-layout>
    <br />
    <br />
    <br />
  </v-container>
</template>

<script>
import Firebase from "./../firebase";
import Timeline from "./Timeline/Timeline";
import Profile from "./Profile";

export default {
  name: "Home",
  components: {
    Timeline,
    Profile
  },
  created: function() {
    Firebase.onAuth();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    nowTimeline() {
      return this.$store.getters.nowTimeline;
    }
  },
  methods: {
    isTimeline: function() {
      if (this.nowTimeline === "setting") return false;
      else return true;
    }
  }
};
</script>
