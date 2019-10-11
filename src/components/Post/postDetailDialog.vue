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
            <v-card-title>
              <v-btn dark icon>
                <v-icon>mdi-information-variant</v-icon>
              </v-btn>
            </v-card-title>

            <div class="flex-grow-1"></div>

            <v-card-title class="white--text pl-12 pt-12">
              <div class="display-1 pl-12 pt-12 text-truncate">{{ selectedPost.ownerName }}&nbsp;</div>
            </v-card-title>
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
                <v-btn class="ma-2" tile outlined color="indigo" @click="joinPost(selectedPost.id)">
                  <v-icon left>mdi-hand</v-icon>参加を希望する
                </v-btn>
              </v-layout>
              <br />
              <v-layout justify-center>
                <v-alert dense text type="success" v-show="joinAlert">参加申請が完了しました</v-alert>
              </v-layout>
              <br />
              <br />
              <v-list-item-subtitle>
                <p>募集人数：{{ selectedPost.howMany }}</p>
                <p>現在の参加者：</p>
                <p>募集期限：{{ selectedPost.dateLimit }}</p>
              </v-list-item-subtitle>
            </v-list-item-content>
            <!--
            <v-list-item-icon>
              <v-icon>mdi-message-text</v-icon>
            </v-list-item-icon>
            -->
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item @click="tmp()">
            <v-list-item-icon>
              <v-icon color="indigo">mdi-phone</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>(650) 555-1234</v-list-item-title>
            </v-list-item-content>
            <!--
            <v-list-item-icon>
              <v-icon>mdi-message-text</v-icon>
            </v-list-item-icon>
            -->
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item @click="tmp()">
            <v-list-item-icon>
              <v-icon color="indigo">mdi-email</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ selectedPost.ownerEmail }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
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
    userData: null
  }),
  props: ["selectedPost"],
  computed: {},
  methods: {
    joinPost: function(postID) {
      var self = this;
      var nowDate = Date.now();
      var loginUser = firebase.auth().currentUser;
      var postRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(postID)
        .collection("joinUsers")
        .doc(loginUser.email);
      return postRef
        .set(
          {
            photoURL: loginUser.photoURL,
            email: loginUser.email,
            isJoin: false,
            joinedAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
            rating: 3
          },
          { merge: true }
        )
        .then(function() {
          console.log("join!");
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