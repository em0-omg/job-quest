<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="getChatWithList()">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </template>
      <Chatlist :userInfo="userInfo" />
    </v-menu>
  </div>
</template>
<script>
import firebase from "firebase";
import ChatList from "./Chatlist";

export default {
  components: {
    Chatlist
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    userInfo: null
  }),
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