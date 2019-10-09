<template>
  <v-card max-width="80%" class="mx-auto">
    <br />
    <v-layout justify-center v-if="user.displayName">
      <h2>ようこそ {{ user.displayName }} さん</h2>
    </v-layout>
    <v-layout justify-center v-else>
      <h2>ようこそ -------- さん</h2>
    </v-layout>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <v-card color="#385f73" dark>
            <v-card-text class="white--text">
              <div class="headline mb-2">プロフィール</div>
              <div v-if="user.photoURL">
                <v-layout justify-center>
                  <img :src="user.photoURL" width="30%" height="30%" />
                </v-layout>
              </div>
              <div v-else>
                <p>プロフィール画像：未設定</p>
              </div>
              <br />
              <p>ユーザ名：{{ user.displayName }}</p>
              <p>メールアドレス：{{ user.email }}</p>
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
      <br />
      <br />
      <br />
    </v-container>
  </v-card>
</template>
<script>
import profileDialog from "./Profile/profileDialog";
import firebase from "firebase";
import Firebase from "./../firebase";

export default {
  components: {
    profileDialog
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
