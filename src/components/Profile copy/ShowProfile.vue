<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-account-search-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="flex-grow-1"></div>
      </v-toolbar>
      <v-card class="mx-auto" max-width="434" tile v-if="userInfo">
        <v-img height="100%" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
          <v-row align="end" class="fill-height">
            <v-col align-self="start" class="pa-0" cols="12">
              <v-avatar class="profile" color="grey" size="164" tile>
                <v-img v-if="userInfo.photoURL" :src="userInfo.photoURL"></v-img>
                <v-img v-else src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
              </v-avatar>
            </v-col>
            <v-col class="py-0">
              <v-list-item color="rgba(0, 0, 0, .4)" dark>
                <v-list-item-content v-if="loginUser.email!=userInfo.email">
                  <v-list-item-title class="title">{{ post.ownerName }}</v-list-item-title>
                  <v-list-item-subtitle class="text-center" v-if="userInfo.favoriteFrom">
                    <v-btn
                      light
                      @click="removeFavoriteUser()"
                      v-if="userInfo.favoriteFrom.includes(loginUser.email)"
                    >
                      お気に入りユーザから外す
                      <v-icon>mdi-account-heart</v-icon>
                    </v-btn>
                    <v-btn light @click="addFavoriteUser()" v-else>
                      お気に入りユーザに登録する
                      <v-icon>mdi-account-heart-outline</v-icon>
                    </v-btn>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-center">
                    <v-btn light @click="createChatRoom()">
                      <v-icon color="success" v-show="createChatAlert">mdi-check-bold</v-icon>チャットルームを作成する
                      <v-icon>mdi-chat-processing</v-icon>
                    </v-btn>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-img>
        <br />
        <div class="container">
          <v-list-item>
            <v-list-item-content class="text-left">
              <v-list-item-title class="subtitle-2">
                <span>プロフィール</span>
                <v-icon color="primary">mdi-account-card-details</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle class="body-2">{{ userInfo.profile }}</v-list-item-subtitle>
              <br />
              <v-list-item-title class="subtitle-2">
                <span>メールアドレス</span>
                <v-icon color="primary">mdi-email</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
              <br />
              <v-list-item-title class="subtitle-2">
                <span>電話番号</span>
                <v-icon color="primary">mdi-phone</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.phone }}</v-list-item-subtitle>
              <br />
              <v-list-item-title class="subtitle-2">
                <span>所属</span>
                <v-icon color="primary">mdi-office-building</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.belongTo }}</v-list-item-subtitle>
              <br />
              <v-list-item-title class="subtitle-2">
                <span>レベル</span>
                <v-icon color="primary">mdi-account-star</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="userInfo"
              >{{ level }} &nbsp; (レベルアップまで{{ userInfo.Rank }}/{{ needRank }})</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-card>
      <v-tabs background-color="primary" centered dark grow icons-and-text v-if="userInfo">
        <v-tab>
          投稿履歴
          <v-icon>mdi-post</v-icon>
        </v-tab>
        <v-tab>
          参加履歴
          <v-icon>mdi-hand</v-icon>
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <profilemypost :email="userInfo.email" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <joinedpost :email="userInfo.email" />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>
<script>
import firebase from "firebase";
import profilemypost from "./Profilemypost";
import joinedpost from "./Joinedpost";

export default {
  name: "ShowProfile",
  props: ["post"],
  components: {
    profilemypost,
    joinedpost
  },
  data() {
    return {
      tab: null,

      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,

      userInfo: {},
      userPost: [],
      userJoin: [],
      favoriteFrom: [],

      loginUser: firebase.auth().currentUser,
      createChatAlert: false
    };
  },
  computed: {
    level() {
      var userRank = this.userInfo.Rank;
      if (userRank > 0 && userRank < 10) return 1;
      else if (userRank > 10 && userRank < 20) return 2;
      else return 3;
    },
    needRank() {
      var userRank = this.userInfo.Rank;
      if (userRank > 0 && userRank < 9) return 10;
      else if (userRank > 9 && userRank < 19) return 20;
      else return 30;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      var self = this;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(self.post.ownerEmail)
        .get()
        .then(function(doc) {
          self.userInfo = doc.data();
        });
      /*
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .where("email", "==", self.post.ownerEmail)
        .doc(self.post.ownerEmail)
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            self.userInfo = doc.data();
          });
        });
        */
    });
  },
  methods: {
    addFavoriteUser: function() {
      var loginUser = firebase.auth().currentUser;
      var userRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(loginUser.email);

      var toRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(this.post.ownerEmail);

      userRef.update({
        favoriteUser: firebase.firestore.FieldValue.arrayUnion(
          this.post.ownerEmail
        )
      });

      toRef.update({
        favoriteFrom: firebase.firestore.FieldValue.arrayUnion(loginUser.email)
      });
    },
    removeFavoriteUser: function() {
      var loginUser = firebase.auth().currentUser;
      var userRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(loginUser.email);

      var toRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(this.post.ownerEmail);

      userRef.update({
        favoriteUser: firebase.firestore.FieldValue.arrayRemove(
          this.post.ownerEmail
        )
      });

      toRef.update({
        favoriteFrom: firebase.firestore.FieldValue.arrayRemove(loginUser.email)
      });
    },
    createChatRoom: function() {
      var self = this;

      var firestoreUserRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user");

      var chatInfo = {
        with: self.loginUser.email,
        photoURL: self.loginUser.photoURL
      };

      console.table(chatInfo);

      // 相手に設定
      firestoreUserRef
        .doc(self.userInfo.email)
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
        with: self.userInfo.email,
        photoURL: self.userInfo.photoURL
      };
      console.table(chatInfoMyself);
      firestoreUserRef
        .doc(self.loginUser.email)
        .update({
          ChatWith: firebase.firestore.FieldValue.arrayUnion(chatInfoMyself)
        })
        .then(function() {
          console.log("create myself chatroom");
        })
        .catch(function() {
          console.log("chatroom failed");
        });
      this.createChatAlert = true;
      setTimeout(() => (this.createChatAlert = false), 2000);
    }
  }
};
</script>