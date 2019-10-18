<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="100%">
      <template v-slot:activator="{ on }">
        <v-btn color="indigo" dark v-on="on" @click="createJoiner()">参加者を編集する</v-btn>
      </template>
      <v-card v-if="joinersList.length > 0">
        <v-list three-line v-for="(item,id) in joinersList" :key="id">
          <v-list-item v-if="item.email!=myself">
            <v-list-item-avatar>
              <img v-if="item.photoURL" :src="item.photoURL" :alt="item.email" />
              <img v-else src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{item.email}}</v-list-item-title>
              <v-list-item-subtitle>{{item.joinedAt}}に参加希望</v-list-item-subtitle>
              <v-list-item-action-text>
                <v-rating v-model="item.rating"></v-rating>
              </v-list-item-action-text>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="item.email!=myself">
            <v-list-item-action>
              <v-switch v-model="item.isJoin" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>参加承認</v-list-item-title>
            <v-list-item-action>
              <v-btn icon>
                <showprofile :post="item" />
              </v-btn>
            </v-list-item-action>
            <v-list-item-title>詳細</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveJoinerEdit(id)">Save</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <br />
        <v-card-text>まだ参加者はいません</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import showprofile from "./../Profile/showprofile";

export default {
  props: ["id"],
  components: {
    showprofile
  },
  data: () => ({
    dialog: false,
    joinersList: [],
    mailList: [],
    rating: 3,
    isJoin: false,

    myself: firebase.auth().currentUser.email
  }),
  methods: {
    createJoiner: function() {
      var joiners = [];
      var mails = [];
      var joinerRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.id)
        .collection("joinUsers");
      joinerRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          mails.push(doc.id);
          joiners.push(docData);
        });
      });
      this.joinersList = joiners;
      this.mailList = mails;
    },
    saveJoinerEdit: function(postID) {
      var loginUser = firebase.auth().currentUser;
      var postRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.id);

      var joinerRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.id)
        .collection("joinUsers");

      var firestoreUserRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user");

      // postにも情報追加
      postRef.set(
        {
          joiners: this.mailList
        },
        { merge: true }
      );

      this.joinersList.forEach(function(joiner) {
        // ratingと参加情報を設定
        joinerRef
          .doc(joiner.email)
          .update({
            rating: joiner.rating,
            isJoin: joiner.isJoin
          })
          .then(function() {
            console.log("update fin");
          })
          .catch(function(error) {
            console.log(error);
          });

        // チャットルーム作成情報を追加
        if (joiner.isJoin) {
          var chatInfo = {
            with: loginUser.email,
            postID: postID,
            postTitle: joiner.postTitle,
            photoURL: loginUser.photoURL
          };
          // 相手に設定
          firestoreUserRef
            .doc(joiner.email)
            .update({
              ChatWith: firebase.firestore.FieldValue.arrayUnion(chatInfo)
            })
            .then(function() {
              console.log("create with chatroom");
            })
            .catch(function() {
              console.log("chatroom failed");
            });

          // 自分にも設定
          var chatInfoMyself = {
            with: joiner.email,
            postID: postID,
            postTitle: joiner.postTitle,
            photoURL: joiner.photoURL
          };
          console.table(chatInfoMyself);
          firestoreUserRef
            .doc(loginUser.email)
            .update({
              ChatWith: firebase.firestore.FieldValue.arrayUnion(chatInfoMyself)
            })
            .then(function() {
              console.log("create myself chatroom");
            })
            .catch(function() {
              console.log("chatroom failed");
            });
        } else {
          var chatInfoRemove = {
            with: loginUser.email,
            postID: postID
          };
          // 相手
          firestoreUserRef
            .doc(joiner.email)
            .update({
              ChatWith: firebase.firestore.FieldValue.arrayRemove(
                chatInfoRemove
              )
            })
            .then(function() {
              console.log("delete chatroom");
            })
            .catch(function() {
              console.log("chatroom failed");
            });
          // 自分
          var chatInfoRemoveMyself = {
            with: joiner.email,
            postID: postID
          };
          firestoreUserRef
            .doc(loginUser.email)
            .update({
              ChatWith: firebase.firestore.FieldValue.arrayRemove(
                chatInfoRemoveMyself
              )
            })
            .then(function() {
              console.log("delete myself chatroom");
            })
            .catch(function() {
              console.log("chatroom failed");
            });
        }
      });
      this.dialog = false;
    }
  }
};
</script>
