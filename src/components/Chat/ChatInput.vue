<template>
  <!-- <v-textarea outlined background-color="grey lighten-2" label="Outlined textarea" value="aaa"></v-textarea> -->
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="メッセージを入力" outlined v-model="message"></v-text-field>
          <div class="text-right">
            <v-btn small color="primary" @click="sendMessage()">送信</v-btn>
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
  props: ["info"],
  data() {
    return {
      message: "",
      roomKey: ""
    };
  },
  methods: {
    createRoomKey: function() {
      var keyArray = [];
      var loginUser = firebase.auth().currentUser;
      keyArray.push(loginUser.email);
      keyArray.push(this.info);
      return keyArray.sort().join("+KEYJOIN+");
    },
    sendMessage: function() {
      this.roomKey = this.createRoomKey();
      var loginUser = firebase.auth().currentUser;
      var nowDate = Date.now();
      var messageRef = firebase
        .firestore()
        .collection("chatroom")
        .doc(this.roomKey)
        .collection("messages");
      messageRef
        .set(
          {
            content: this.message,
            createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
            photoURL: loginUser.photoURL
          },
          { merge: true }
        )
        .then(function() {
          console.log("send message success!");
        })
        .catch(function(error) {
          console.log("send failed");
        });
    }
  }
};
</script>
<style scoped>
</style>
