<template>
  <!-- <v-textarea outlined background-color="grey lighten-2" label="Outlined textarea" value="aaa"></v-textarea> -->
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="メッセージを入力" outlined v-model="message"></v-text-field>
          <div class="text-right">
            <v-btn small color="primary" @click="sendMessage()" id="scrollTarget">送信</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "firebase";
import moment from "moment";

export default {
  props: {
    info: String,
    postid: String
  },
  data() {
    return {
      message: "",
      roomKey: ""
    };
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    createRoomKey: function() {
      var keyArray = [];
      var loginUser = firebase.auth().currentUser;
      keyArray.push(loginUser.email);
      keyArray.push(this.info);
      return keyArray.sort().join("+" + this.postid + "+");
    },
    sendMessage: function() {
      var self = this;
      this.roomKey = this.createRoomKey();
      var loginUser = firebase.auth().currentUser;
      var nowDate = Date.now();
      var messageRef = firebase
        .firestore()
        .collection("chatroom")
        .doc(this.roomKey)
        .collection("messages")
        .doc();
      messageRef
        .set(
          {
            sendBy: loginUser.displayName,
            content: this.message,
            createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
            //TODO めっちゃ早く投稿されたらうまくいかないかも
            orderCreatedAt: moment(nowDate).format("YYYY/MM/DD HH:mm:ss"),
            photoURL: loginUser.photoURL
          },
          { merge: true }
        )
        .then(function() {
          self.message = "";
          console.log("send message success!");
          setTimeout(() => console.log(this.message), 1200);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    scrollToEnd() {
      this.$netxTick(() => {
        const chatLog = document.getElementById("scrollTarget");
        if (!chatLog) return;
        chatLog.scrollTop = chatLog.scrollHeight;
      });
    }
  }
};
</script>
<style scoped>
</style>
