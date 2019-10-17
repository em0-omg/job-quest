<template>
  <v-row justify="center">
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
        <v-card class="mx-auto" max-width="434" tile>
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
                  <v-list-item-content>
                    <v-list-item-title class="title">{{ post.ownerName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ post.id }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
          <div class="container">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <span>プロフィール</span>
                  <v-icon color="primary">mdi-account-card-details</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>{{ userInfo.profile }}</v-list-item-subtitle>
                <br />
                <v-list-item-title class="title">
                  <span>メールアドレス</span>
                  <v-icon color="primary">mdi-email</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
                <br />
                <v-list-item-title class="title">
                  <span>星獲得数</span>
                  <v-icon color="primary">mdi-account-star</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>{{ userInfo.Rank }}</v-list-item-subtitle>
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
  </v-row>
</template>
<script>
import firebase from "firebase";
import profilemypost from "./Profilemypost";
import joinedpost from "./Joinedpost";

export default {
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
      userJoin: []
    };
  },
  mounted: function() {
    var self = this;
    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .where("email", "==", self.post.ownerEmail)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          self.userInfo = doc.data();
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
};
</script>