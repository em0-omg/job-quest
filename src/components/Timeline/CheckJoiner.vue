<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn color="indigo" dark v-on="on" @click="createJoiner()">参加者を編集する</v-btn>
      </template>
      <v-card>
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
            <v-list-item-title>参加者に設定</v-list-item-title>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-title>詳細</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveJoinerEdit(id)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  props: ["id"],
  mounted: () => {},
  data: () => ({
    joinersList: [],
    rating: 3,
    menu: false,
    isJoin: false,

    myself: firebase.auth().currentUser.email
  }),
  methods: {
    createJoiner: function() {
      var joiners = [];
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
          joiners.push(docData);
        });
      });
      this.joinersList = joiners;
    },
    saveJoinerEdit: function(postID) {
      var loginUser = firebase.auth().currentUser;
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
            postID: postID
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
            postID: postID
          };
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
      this.menu = false;
      console.log("menuoff");
    }
  }
};
</script>
