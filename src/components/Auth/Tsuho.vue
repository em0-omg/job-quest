<template>
  <div class="text-right">
    <v-btn small color="red lighten-2" dark @click.stop="dialog = true">
      通報する
      <v-icon dark right>mdi-alert-decagram</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">通報</v-card-title>

        <v-card-text>
          <v-textarea v-model="contents" label="内容" required></v-textarea>
          <v-snackbar
            v-model="snackBar.show"
            :color="snackBar.color"
            bottom
            right
            :timeout="3000"
            class="font-weight-bold"
          >{{snackBar.message}}</v-snackbar>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">キャンセル</v-btn>

          <v-btn color="green darken-1" text @click="tsuho()">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
import moment from "moment";
export default {
  props: ["email"],
  data() {
    return {
      dialog: false,
      contents: "",
      snackBar: {
        show: false,
        color: "",
        message: ""
      }
    };
  },
  methods: {
    tsuho: function() {
      var loginUser = firebase.auth().currentUser;
      var self = this;
      var nowDate = Date.now();
      var contactRef = firebase
        .firestore()
        .collection("admin")
        .doc("contact")
        .collection("messages");
      contactRef
        .add({
          name: loginUser.displayName,
          mail: loginUser.email,
          target: self.email,
          contents: self.contents,
          createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm")
        })
        .then(function() {
          self.showSnackBar(
            "success",
            "お問い合わせありがとうございます。送信完了しました"
          );
        })
        .catch(function(err) {
          self.showSnackBar(
            "error",
            "送信に失敗しました。時間をおいて再度お試しください"
          );
        });
    },
    showSnackBar: function(color, message) {
      this.snackBar.message = message;
      this.snackBar.color = color;
      this.snackBar.show = true;
    }
  }
};
</script>