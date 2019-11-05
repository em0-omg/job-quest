<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" tile outlined color="indigo" v-on="on">
          <u>
            <v-icon left>mdi-email-send</v-icon>
          </u>
          <u>こちらから再設定</u>
        </v-btn>
      </template>

      <v-card>
        <v-form>
          <v-container>
            <v-card-title class="headline grey lighten-2" primary-title>パスワード再設定</v-card-title>

            <v-text-field label="メールアドレス" v-model="email"></v-text-field>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="changePassword()">送信</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      dialog: false,
      email: ""
    };
  },
  methods: {
    changePassword: function() {
      var auth = firebase.auth();
      var emailAddress = this.email;

      auth
        .sendPasswordResetEmail(emailAddress)
        .then(function() {
          // Email sent.
          alert("パスワード再設定のメールを送りました");
        })
        .catch(function(error) {
          // An error happened.
        });
      this.dialog = false;
    }
  }
};
</script>