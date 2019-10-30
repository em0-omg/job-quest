<template>
  <v-card>
    <v-card class="mx-auto" max-width="434" tile>
      <v-img height="100%" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
        <!-- sample src="" -->
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img v-if="showUserProfile.photoURL" :src="showUserProfile.photoURL"></v-img>
              <v-img v-else src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title">{{ user.displayName }}</v-list-item-title>
                <v-list-item-subtitle>
                  <p v-if="showUserProfile.photoURL"></p>
                  <p v-else>プロフィール画像を設定してください</p>
                  <imageUploadDialog :uid="showUserProfile.id" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
      <div class="container">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              <span>プロフィール</span>
              <v-icon color="primary">mdi-account-card-details</v-icon>
            </v-list-item-title>
            <v-list-item-content v-if="showUserProfile" class="body-2">{{ showUserProfile.profile }}</v-list-item-content>
            <br />
            <v-list-item-title class="subtitle-2">
              <span>メールアドレス</span>
              <v-icon color="primary">mdi-email</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle>{{ showUserProfile.email }}</v-list-item-subtitle>
            <br />
            <v-list-item-title class="subtitle-2">
              <span>電話番号</span>
              <v-icon color="primary">mdi-phone</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle>{{ showUserProfile.phone }}</v-list-item-subtitle>
            <br />
            <v-list-item-title class="subtitle-2">
              <span>所属</span>
              <v-icon color="primary">mdi-office-building</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle>{{ showUserProfile.belongTo }}</v-list-item-subtitle>
            <br />
            <v-list-item-title class="subtitle-2">
              <span>獲得スター数</span>
              <v-icon color="primary">mdi-account-star</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle v-if="showUserProfile">
              <!-- {{ level }} &nbsp; (レベルアップまで{{ showUserProfile.Rank }}/{{ needRank }})</v-list-item-subtitle> -->
              {{ showUserProfile.Rank }}
            </v-list-item-subtitle>
            <v-card-actions>
              <v-layout justify-center>
                <profileDialog :userprofile="showUserProfile" />
              </v-layout>
            </v-card-actions>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-card>
    <v-tabs background-color="primary" centered dark grow icons-and-text>
      <v-tab>
        投稿履歴
        <v-icon>mdi-post</v-icon>
      </v-tab>
      <v-tab>
        お気に入り投稿
        <v-icon>mdi-heart</v-icon>
      </v-tab>
      <v-tab>
        参加履歴
        <v-icon>mdi-hand</v-icon>
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <profilemypost :email="loginUser.email" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <favoritepost :email="loginUser.email" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <joinedpost :email="loginUser.email" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import profileDialog from "./Profile/profileDialog";
import profilemypost from "./Profile/Profilemypost";
import joinedpost from "./Profile/Joinedpost";
import favoritepost from "./Profile/Favoritepost";
import imageUploadDialog from "./Profile/imageUploadDialog";
import firebase from "firebase";
import Firebase from "./../firebase";

export default {
  components: {
    profileDialog,
    imageUploadDialog,
    profilemypost,
    joinedpost,
    favoritepost
  },
  created: function() {
    Firebase.onAuth();
  },
  mounted: function() {
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
            console.log("find user " + docData.id);
            self.showUserProfile = docData;
          }
        });
      });
  },
  data: () => ({
    items: [
      {
        color: "#1F7087",
        src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "Supermodel",
        artist: "Foster the People"
      },
      {
        color: "#952175",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      }
    ],
    showUserProfile: {},
    loginUser: firebase.auth().currentUser
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    level() {
      var userRank = this.showUserProfile.Rank;
      if (userRank > 0 && userRank < 10) return 1;
      else if (userRank > 10 && userRank < 20) return 2;
      else if (userRank > 20 && userRank < 30) return 3;
      else if (userRank > 30 && userRank < 40) return 4;
      else if (userRank > 40 && userRank < 50) return 5;
      else if (userRank > 50 && userRank < 60) return 6;
      else if (userRank > 60 && userRank < 70) return 7;
      else if (userRank > 70 && userRank < 80) return 8;
      else if (userRank > 80 && userRank < 90) return 9;
      else if (userRank > 90 && userRank < 100) return 10;
      else return 11;
    },
    needRank() {
      var userRank = this.showUserProfile.Rank - 0;
      console.log("userRank" + userRank);
      if (userRank > 0 && userRank < 9) return 10;
      else if (userRank > 9 && userRank < 19) return 20;
      else if (userRank > 19 && userRank < 29) return 30;
      else if (userRank > 29 && userRank < 39) return 40;
      else if (userRank > 39 && userRank < 49) return 50;
      else if (userRank > 49 && userRank < 59) return 60;
      else if (userRank > 59 && userRank < 69) return 70;
      else if (userRank > 69 && userRank < 79) return 80;
      else if (userRank > 79 && userRank < 89) return 90;
      else if (userRank > 89 && userRank < 99) return 100;
      else return 0;
    }
  }
};
</script>
