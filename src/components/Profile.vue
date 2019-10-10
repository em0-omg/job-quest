<template>
  <v-container>
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
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
      <v-row>
        <v-col>
          <v-card color="#385f73" dark>
            <v-card-text class="white--text">
              <div class="headline mb-2">プロフィール</div>
              <p v-if="showUserProfile.photoURL">プロフィール画像を変更する</p>
              <p v-else>プロフィール画像を設定してください</p>
              <v-layout justify-center>
                <imageUploadDialog :uid="showUserProfile.id" />
              </v-layout>
              <br />
              <p>ユーザ名：{{ showUserProfile.displayName }}</p>
              <p>メールアドレス：{{ showUserProfile.email }}</p>
              <br />
              <hr />
              <br />
              <div v-if="showUserProfile">
                <p>
                  プロフィール文:
                  <br />
                  {{ showUserProfile.profile }}
                </p>
                <p>ランク: {{ showUserProfile.Rank }}</p>
              </div>
              <div v-else>
                <p>追加情報を設定しましょう！</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center>
                <profileDialog />
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import profileDialog from "./Profile/profileDialog";
import imageUploadDialog from "./Profile/imageUploadDialog";
import firebase from "firebase";
import Firebase from "./../firebase";

export default {
  components: {
    profileDialog,
    imageUploadDialog
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
    showUserProfile: {}
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  }
};
</script>
