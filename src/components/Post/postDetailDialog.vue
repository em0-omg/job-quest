<template>
  <v-row justify="center">
    <!-- <v-dialog v-model="dialog" persistent max-width="600px"> -->
    <v-dialog v-model="dialog" max-width="80%">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </template>
      <v-card max-width="100%" class="mx-auto">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png" height="200px" dark>
          <v-row class="fill-height">
            <!--
            <div class="flex-grow-1"></div>
            <v-card-title class="white--text pl-12 pt-12">
              <div class="display-1 pl-12 pt-12 text-truncate">{{ selectedPost.ownerName }}&nbsp;</div>
            </v-card-title>
            -->
          </v-row>
        </v-img>

        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-comment-question</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <h2>{{ selectedPost.title }}</h2>
              <br />
              <p>
                <br />
                <br />
                {{ selectedPost.content }}
              </p>
              <br />
              <v-layout justify-center>
                <v-alert dense text type="success" v-show="joinAlert">参加申請が完了しました</v-alert>
              </v-layout>
              <br />
              <br />
              <v-list-item-subtitle>
                <p>投稿者：{{ selectedPost.ownerName }}</p>
                <p>場所：{{ selectedPost.region }}</p>
                <p>募集期限：{{ selectedPost.dateLimit }}</p>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <div class="text-center">
            <v-btn
              class="ma-2"
              tile
              outlined
              color="indigo"
              @click="joinPost(selectedPost)"
              v-if="!alreadyJoined"
            >
              <v-icon left>mdi-hand</v-icon>参加を希望する！
            </v-btn>
            <v-btn class="ma-2" tile outlined color="success" v-else>
              <v-icon left>mdi-hand-okay</v-icon>参加を希望済み
            </v-btn>
          </div>
          <br />

          <!--
          <v-divider></v-divider>
          <v-divider inset></v-divider>

          <v-list-item @click="tmp()">
            <v-list-item-icon>
              <v-icon color="indigo">mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ selectedPost.ownerEmail }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          -->
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  components: {},
  data: () => ({
    dialog: false,
    joinAlert: false,
    userData: null,
    alreadyJoined: false
  }),
  props: ["selectedPost"],
  computed: {},
  mounted: function() {
    console.log("Mount");
    var self = this;
    var loginUser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          if (docData.email === loginUser.email) {
            self.userData = docData;
          }
        });
      });
    // すでに応募済みかチェック
    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("posts")
      .doc(this.selectedPost.id)
      .collection("joinUsers")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.id === loginUser.email) {
            self.alreadyJoined = true;
          } else {
            console.log(doc.id + ":" + loginUser.email);
          }
        });
      });
  },
  methods: {
    joinPost: function(post) {
      var loginUser = firebase.auth().currentUser;
      if (this.selectedPost.ownerEmail === loginUser.email) {
        alert("自分の投稿には参加希望を出せません");
        return;
      } else if (this.userData === null) {
        alert(
          "冒険者情報が登録されていません！プロフィールから登録してください"
        );
        return;
      }
      var self = this;
      var nowDate = Date.now();

      // joinersに追加
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(post.id)
        .update({
          joiners: firebase.firestore.FieldValue.arrayUnion(loginUser.email)
        })
        .then(function() {
          console.log("joiners add");
        })
        .catch(function(eee) {
          console.log(eee);
        });

      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(this.selectedPost.ownerEmail)
        .collection("notification")
        .add({
          noteType: "joinAlert",
          content: loginUser.displayName + "が参加希望を行いました！",
          avatarImage: loginUser.photoURL,
          createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
          postTitle: this.selectedPost.title,
          postID: this.selectedPost.id,
          icon: "mdi-hand",
          color: "success",
          title: "参加希望者お知らせ",
          isRead: false
        })
        .then(function() {
          console.log("note ok");
        })
        .catch(function(errr) {
          console.log("note error: " + errr);
        });

      var postRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(post.id)
        .collection("joinUsers")
        .doc(loginUser.email);
      return postRef
        .set(
          {
            postTitle: post.title,
            photoURL: loginUser.photoURL,
            email: loginUser.email,
            isJoin: false,
            joinedAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
            rating: 3,
            returnRating: 0
          },
          { merge: true }
        )
        .then(function() {
          console.log("join!");
          self.alreadyJoined = true;
          self.joinAlert = true;
          setTimeout(() => (self.joinAlert = false), 2000);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    tmp: function() {
      console.log("tmp methods");
    }
  }
};
</script>