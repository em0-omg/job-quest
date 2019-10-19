<template>
  <v-container>
    <v-layout justify-center>
      <h1>JobQuest</h1>
    </v-layout>
    <br />
    <!-- <v-divider></v-divider> -->
    <v-layout justify-center v-show="nowTimeline==='setting'">
      <Profile />
    </v-layout>
    <v-layout justify-center v-show="nowTimeline==='notification'">
      <Notification />
    </v-layout>
    <v-layout justify-center v-show="nowTimeline==='contact'">
      <ContactForm />
    </v-layout>
    <v-layout justify-center v-show="isTimeline()">
      <Timeline />
    </v-layout>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
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
import Notification from "./Notification";
import ContactForm from "./ContactForm";

export default {
  name: "Home",
  components: {
    Timeline,
    Profile,
    Notification,
    ContactForm
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
      else if (this.nowTimeline === "notification") return false;
      else if (this.nowTimeline === "contact") return false;
      else return true;
    }
  }
};
</script>
