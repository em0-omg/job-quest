<template>
  <v-row justify="center">
    <v-btn icon @click="dialog = true">
      <v-icon>mdi-alpha-x-circle-outline</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">チャット削除確認</v-card-title>

        <v-card-text>一覧から削除しますか？</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="warning" text @click="dialog = false">キャンセル</v-btn>

          <v-btn color="primary" text @click="deleteChat()">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  props: ["chatinfo"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    deleteChat: function() {
      var userKey = this.chatinfo.with;
      var postKey = this.chatinfo.postID;
      var loginUser = firebase.auth().currentUser;

      var chatRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(loginUser.email);

      chatRef.get().then(function(doc) {
        if (doc.exists) {
          var ChatWith = doc.data().ChatWith;
          ChatWith.forEach(info => {
            if (info.with === userKey && info.postID === postKey) {
              chatRef.update({
                ChatWith: firebase.firestore.FieldValue.arrayRemove(info)
              });
            }
          });
        }
      });
      this.dialog = false;
    }
  }
};
</script>