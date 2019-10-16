<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="blue-grey white--text">
      <span class="title">ポャット</span>
      <v-spacer></v-spacer>
      <!--
      <v-btn icon @click="tmp()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      -->
    </v-card-title>
    <v-card-text class="py-0">
      <v-timeline dense light class="chat">
        <v-timeline-item reverse v-for="item in messages" :key="item.id" large>
          <template v-slot:icon>
            <v-avatar :key="item.id" v-if="item.photoURL">
              <img :src="item.photoURL" />
            </v-avatar>
            <v-avatar :key="item.id" v-else>
              <span class="black--text" caption style="background-color: white;">{{ item.sendBy }}</span>
            </v-avatar>
          </template>
          <v-card class="elevation-24" :key="item.id">
            <v-card-text class="body-2 overline">{{ item.content }}</v-card-text>
          </v-card>
          <v-row justify="space-between">
            <v-col cols="7">&nbsp;</v-col>
            <v-col class="text-right" cols="5">{{ item.createdAt }}</v-col>
          </v-row>
        </v-timeline-item>
        <Chatinput :info="userinfo" :postid="pid" />
      </v-timeline>
    </v-card-text>
  </v-card>
</template>
<script>
import Chatinput from "./ChatInput";
import firebase from "firebase";

export default {
  props: {
    userinfo: String,
    pid: String
  },
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
      .orderBy("createdAt")
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
      return keyArray.sort().join("+" + this.pid + "+");
    }
  }
};
</script>
<style scoped>
.chat {
  background-color: white;
}
</style>