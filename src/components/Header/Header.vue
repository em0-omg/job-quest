<template>
  <v-card color="grey lighten-4" flat height="50px" tile>
    <v-toolbar dense v-if="userStatus">
      <v-app-bar-nav-icon>
        <Chatlist />
      </v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <v-toolbar-title class="white--text"></v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon>
        <postDialog />
      </v-btn>

      <v-btn icon @click="signOut()">
        <v-icon>mdi-account-off</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout justify-center v-else>
      <h1>JobQuest</h1>
    </v-layout>
  </v-card>
</template>

<script>
import firebase from "firebase";
import Store from "./../../store";
import postDialog from "../Post/postDialog";
import Chatlist from "../Chat/Chatlist";

export default {
  name: "Header",
  components: {
    postDialog,
    Chatlist
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          var user = {};
          Store.commit("onAuthStateChanged", user);
          Store.commit("onUserStatusChanged", user.uid ? true : false);
          this.$router.push("/signin");
        });
    }
  }
};
</script>