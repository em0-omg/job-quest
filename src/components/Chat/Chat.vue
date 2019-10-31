<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title class="blue-grey white--text">
      <span class="title">ポャット</span>
      <v-spacer></v-spacer>
      <!--
      <v-btn icon @click="tmp()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      -->
    </v-card-title>
    <v-card-text class="py-0" ref="scroll">
      <v-timeline dense light class="chat" ref="scroll">
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
            <v-col class="text-right" cols="12">{{ item.createdAt }}</v-col>
          </v-row>
        </v-timeline-item>
        <Chatinput :info="userinfo" />
        <div class="text-center">
          <br />
          <img src="./../../assets/jwlogo.png" width="32" ref="targetRef" />
        </div>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>
<script>
import Chatinput from "./ChatInput";
import firebase from "firebase";

export default {
  props: {
    userinfo: String
  },
  components: { Chatinput },
  data() {
    return {
      messages: []
    };
  },
  mounted: function() {
    this.$nextTick(() => this.scrollToEnd());
    this.$refs.targetRef.focus();
    var self = this;
    var docKey = this.createRoomKey();
    console.log("docKey:" + docKey);
    firebase
      .firestore()
      .collection("chatroom")
      .doc(docKey)
      .collection("messages")
      .orderBy("orderCreatedAt")
      .onSnapshot(function(querySnapshot) {
        self.messages = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          self.messages.push(docData);
        });
      });
  },
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },
  methods: {
    createRoomKey: function() {
      var keyArray = [];
      var loginUser = firebase.auth().currentUser;
      keyArray.push(loginUser.email);
      keyArray.push(this.userinfo);
      return keyArray.sort().join("+");
    },
    scrollToEnd: function() {
      var container = this.$refs.scroll;
      console.log("before:" + container.scrollTop);
      container.scrollTop = container.scrollHeight;
      console.log("after:" + container.scrollTop);
    }
  },
  watch: {
    messages: function() {
      this.$refs.targetRef.focus();
    }
  }
};
</script>
<style scoped>
.chat {
  background-color: white;
}
</style>
