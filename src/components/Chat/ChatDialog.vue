<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="getChatWithList()">
          <v-badge overlap>
            <template v-slot:badge>
              <span v-if="unreadChatNum > 0">!</span>
            </template>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>チャットリスト</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <Chatlist />
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import Chatlist from "./Chatlist";

export default {
  components: {
    Chatlist
  },
  data: () => ({
    fav: true,
    menu: false,
    hints: true,
    userInfo: null,
    dialog: false
  }),
  computed: {
    unreadChatNum: function() {
      return this.$store.getters.unreadChat;
    }
  },
  methods: {
    getChatWithList: function() {
      var self = this;
      var loginUser = firebase.auth().currentUser;
      var firestoreUserRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(loginUser.email);

      firestoreUserRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            self.userInfo = doc.data();
            console.log(self.userInfo);
          } else {
            console.log("No such document!");
          }
        })
        .catch(function(e) {
          console.log(e);
        });
    }
  }
};
</script>