<template>
  <v-container>
    <v-layout justify-center>
      <h1>JobQuest</h1>
    </v-layout>
    <br />
    <!-- <v-divider></v-divider> -->
    <v-layout justify-space-around>
      <Timeline />
    </v-layout>
    <br />
    <br />
    <br />
    <br />
  </v-container>
</template>

<script>
import Firebase from "./../firebase";
import Timeline from "./Timeline";

export default {
  name: "Home",
  components: {
    Timeline
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
    }
  },
  data: () => ({})
};
</script>
