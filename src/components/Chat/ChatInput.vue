<template>
  <!-- <v-textarea outlined background-color="grey lighten-2" label="Outlined textarea" value="aaa"></v-textarea> -->
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" xs="6">
          <v-text-field label="Outlined" outlined></v-text-field>
          <div class="mt-12 text-right">
            <v-btn small color="primary">send</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "firebase";

export default {
  methods: {
    createRoomKey: () => {},
    sendMessage: () => {
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
