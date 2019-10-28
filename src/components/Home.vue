<template>
  <v-container v-if="isExistUser">
    <!--
    <v-layout justify-center>
      <h1>JobQuest</h1>
    </v-layout>
    -->
    <br />
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
      {{ new Date().getFullYear() }} - &nbsp;
      <strong>Powered By JohnWORKS.</strong>
    </v-layout>
    <br />
    <br />
    <br />
  </v-container>
  <v-container v-else>
    <v-layout justify-center>
      <h1>JobQuest</h1>
    </v-layout>
    <br />
    <v-alert outlined type="warning" prominent border="left">
      <p>最初にプロフィール情報を設定してください</p>
    </v-alert>
    <!-- <v-divider></v-divider> -->
    <v-layout justify-center>
      <Profile />
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
      {{ new Date().getFullYear() }} - &nbsp;
      <strong>Powered By JohnWORKS.</strong>
    </v-layout>
    <br />
    <br />
    <br />
  </v-container>
</template>

<script>
import firebase from "firebase";
import Firebase from "./../firebase";
import store from "./../store";
import Timeline from "./Timeline/Timeline";
import Profile from "./Profile";
import Notification from "./Notification";
import ContactForm from "./ContactForm";

export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Timeline,
    Profile,
    Notification,
    ContactForm
  },
  created: function() {
    Firebase.onAuth();
  },
  mounted: function() {
    var loginUser = firebase.auth().currentUser;
    var docRef = firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email);

    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("no problem!", doc.data());
          store.commit("isExistUser", true);
        } else {
          console.log("No such document!");
          store.commit("isExistUser", false);
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
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
    },
    isExistUser() {
      return this.$store.getters.isExistUser;
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
