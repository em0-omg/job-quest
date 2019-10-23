<template>
  <v-row justify="center">
    <v-btn icon color="primary" dark @click.stop="dialog = true">
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">評価{{ postid }}</v-card-title>

        <v-card-text>オーナーの評価をお願いします</v-card-text>
        <v-layout justify-center>
          <v-rating v-model="rating"></v-rating>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">キャンセル</v-btn>

          <v-btn color="green darken-1" text @click="setReturnRatio(); dialog = false">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  props: ["postid"],
  data() {
    return {
      rating: 3,
      dialog: false
    };
  },
  methods: {
    setReturnRatio: function() {
      var loginUser = firebase.auth().currentUser;
      var self = this;
      var ratioRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(self.postid)
        .collection("joinUsers")
        .doc(loginUser.email);
      ratioRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            if (doc.data().returnRating < 1) {
              ratioRef
                .update({
                  returnRating: self.rating
                })
                .then(function() {
                  console.log("ratio set:" + self.rating);
                })
                .catch(function(error) {
                  console.log("ratio set error:" + error);
                });
            } else {
              console.log(doc.data().returnRating);
              alert("すでに設定済みです");
            }
          } else {
            console.log("no such doc: " + loginUser.email + "," + self.postid);
          }
        })
        .catch(function(er) {
          console.log("error: " + er);
        });
    }
  }
};
</script>