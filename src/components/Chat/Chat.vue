<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="blue-grey white--text">
      <span class="title">チャット</span>
      <v-spacer></v-spacer>
      <!--
      <v-btn icon @click="tmp()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      -->
    </v-card-title>
    <v-card-text class="py-0">
      <v-timeline dense light class="chat">
        <v-timeline-item reverse v-for="(item, index) in messages" :key="id" large>
          <template v-slot:icon>
            <v-avatar>
              <img :src="item.photoURL" />
            </v-avatar>
          </template>
          <template v-slot:opposite>
            <span>Tus eu perfecto</span>
          </template>
          <v-card class="elevation-24">
            <v-card-text class="body-2 overline">{{ item.content }}</v-card-text>
          </v-card>
        </v-timeline-item>
        <Chatinput :info="userinfo" />
      </v-timeline>
    </v-card-text>
  </v-card>
</template>
<script>
import Chatinput from "./Chatinput";
import firebase from "firebase";

export default {
  props: ["userinfo"],
  components: { Chatinput },
  data() {
    return {
      messages: []
    };
  },
  mounted: function() {
    var self = this;
    var docKey = this.createRoomKey();
    console.log("docKey:" + docKey);
    firebase
      .firestore()
      .collection("chatroom")
      .doc(docKey)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot(function(querySnapshot) {
        self.messages = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          self.messages.push(docData);
        });
      });
  },
  methods: {
    createRoomKey: function() {
      var keyArray = [];
      var loginUser = firebase.auth().currentUser;
      keyArray.push(loginUser.email);
      keyArray.push(this.userinfo);
      return keyArray.sort().join("+KEYJOIN+");
    }
  }
};
</script>
<style scoped>
.chat {
  background-color: white;
}
</style>