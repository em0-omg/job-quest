<template>
  <!-- <v-textarea outlined background-color="grey lighten-2" label="Outlined textarea" value="aaa"></v-textarea> -->
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Outlined" outlined></v-text-field>
          <div class="text-right">
            <v-btn small color="primary" @click="sendMessage()">send</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "firebase";

export default {
  props: ["info"],
  data() {
    return {
      roomKey: ""
    };
  },
  methods: {
    createRoomKey: function() {
      console.log("chatwith:" + this.info);
    },
    sendMessage: function() {
      this.createRoomKey();
      var messageRef = firebase
        .firestore()
        .collection("chatroom")
        .doc();
    }
  }
};
</script>
<style scoped>
</style>
