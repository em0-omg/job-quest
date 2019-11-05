<template>
  <v-row justify="center">
    <v-btn icon color="primary" dark @click.stop="dialog = true">
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">評価</v-card-title>

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
import moment from "moment";
export default {
  props: ["postid"],
  data() {
    return {
      rating: 3,
      receiveRating: 0,
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
            // もしまだ評価未設定ならば評価をおこなう
            if (doc.data().returnRating < 1) {
              self.receiveRating = doc.data().rating;
              ratioRef
                .update({
                  returnRating: self.rating
                })
                .then(function() {
                  console.log("ratio set:" + self.rating);
                  self.closePost();
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
          console.log("error setReturnRatio: " + er);
        });
    },
    closePost: function() {
      var postRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.postid);

      var userRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user");

      // 投稿者にratio追加
      var self = this;
      postRef.get().then(function(doc) {
        if (doc.exists) {
          var owner = doc.data().ownerEmail;
          var ownerName = doc.data().ownerName;
          var ownerImage = doc.data().image;
          var loginUser = firebase.auth().currentUser;
          var nowDate = Date.now();
          userRef
            .doc(owner)
            .get()
            .then(function(userDoc) {
              if (userDoc.exists) {
                var newRank = userDoc.data().Rank + self.rating;
                userRef.doc(owner).update({
                  Rank: newRank
                });
                console.log("投稿者にratio追加");
              }
            });
          //投稿者に通知
          var _self = self;
          firebase
            .firestore()
            .collection("users")
            .doc("company")
            .collection("user")
            .doc(owner)
            .collection("notification")
            .add({
              noteType: "ratioAlert",
              avatarImage: loginUser.photoURL,
              content:
                loginUser.displayName +
                "から" +
                _self.rating +
                "つスターの贈り物です！",
              createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
              postID: _self.postid,
              icon: "mdi-star-circle",
              color: "lime",
              title: "評価通知",
              isRead: false
            });

          //参加者にランク追加、通知
          var joinerRef = firebase
            .firestore()
            .collection("users")
            .doc("company")
            .collection(user);
          joinerRef
            .doc(loginUser.email)
            .get()
            .then(function(userDoc) {
              if (userDoc.exists) {
                var newRank = userDoc.data().Rank + self.receiveRating;
                userRef.doc(loginUser.email).update({
                  Rank: newRank
                });
                console.log("参加者にratio追加");
              }
            });
          firebase
            .firestore()
            .collection("users")
            .doc("company")
            .collection("user")
            .doc(loginUser.email)
            .collection("notification")
            .add({
              noteType: "ratioAlert",
              avatarImage: ownerImage,
              content:
                ownerName +
                "から" +
                _self.receiveRating +
                "つスターの贈り物です！",
              createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
              postID: _self.postid,
              icon: "mdi-star-circle",
              color: "lime",
              title: "評価通知",
              isRead: false
            })
            .then(function() {
              console.log("note ok");
            })
            .catch(function(errr) {
              console.log("note error: " + errr);
            });
        } else {
          console.log("no doc");
        }
      });

      //参加者にratio追加
      var targetUser = firebase.auth().currentUser;
      postRef
        .collection("joinUsers")
        .where("email", "==", targetUser.email)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.log("doc id:" + doc.id);
            var userKey = doc.id;
            var addRank = self.receiveRating;
            userRef
              .doc(userKey)
              .get()
              .then(function(userDoc) {
                var newRank = userDoc.data().Rank + addRank;
                userRef.doc(userKey).update({
                  Rank: newRank
                });
                console.log("参加者ratio set ok");
              })
              .catch(function(uer) {
                console.log("uer:" + uer);
              });
          });
        });
      alert("双方評価完了！お疲れ様でした");
    }
  }
};
</script>