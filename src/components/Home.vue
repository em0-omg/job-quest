<template>
  <v-container v-if="isExistUser && isVerified">
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
    <!--
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
    -->
  </v-container>
  <v-container v-else>
    <br />
    <v-alert outlined type="warning" prominent border="left" v-if="!isProfiled">
      <p>最初にプロフィール情報を設定してください</p>
    </v-alert>
    <v-alert outlined type="warning" prominent border="left" v-if="!isVerified">
      <p>アカウント確認のメールを送りました！メールボックスから認証を行ってください</p>
    </v-alert>
    <!-- <v-divider></v-divider> -->
    <v-layout justify-center>
      <Profile />
    </v-layout>
    <!--
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
    -->
  </v-container>
</template>

<script>
import firebase from "firebase";
import Firebase from "./../firebase";
import store from "./../store";
import Timeline from "./Timeline/Timeline";
import Profile from "./Profile";
import Notification from "./Notification";
import ContactForm from "./Admin/ContactForm";

export default {
  name: "Home",
  data() {
    return {
      isVerified: false,
      isProfiled: false
    };
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
    var self = this;
    if (loginUser.emailVerified != true) {
      loginUser.sendEmailVerification();
    } else {
      self.isVerified = true;
    }
    var docRef = firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email);

    docRef.get().then(function(doc) {
      if (doc.exists) {
        self.isProfiled = true;
        if (self.isVerified) {
          store.commit("isExistUser", true);
        } else {
          store.commit("isExistUser", false);
        }
      } else {
        store.commit("isExistUser", false);
      }
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
