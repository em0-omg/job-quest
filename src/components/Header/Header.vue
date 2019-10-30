<template>
  <v-card color="grey lighten-4" flat height="50px" tile>
    <v-toolbar dense v-if="userStatus">
      <v-app-bar-nav-icon>
        <ChatDialog />
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn icon v-if="isExistUser">
        募集
        <postDialog />
      </v-btn>

      <!--
      <v-btn icon color="white" @click="toSetting()">
        <v-avatar size="32px" v-if="loginUser">
          <img :src="loginUser.photoURL" :alt="loginUser.displayName" />
        </v-avatar>
        <v-avatar size="32px" v-else>
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-avatar>
      </v-btn>
      -->
      <v-menu bottom left dark>
        <template v-slot:activator="{ on }">
          <v-btn icon color="white" v-on="on">
            <v-avatar size="32px" v-if="user">
              <img :src="user.photoURL" />
            </v-avatar>
            <v-avatar size="32px" v-else>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="toSetting()">
            プロフィール
            <v-icon>mdi-account-box</v-icon>
          </v-list-item>
          <v-list-item @click="changePassword()">
            パスワードの変更
            <v-icon>mdi-onepassword</v-icon>
          </v-list-item>
          <v-list-item @click="signOut()">
            ログオフ
            <v-icon>mdi-account-off</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-card>
</template>

<script>
import firebase from "firebase";
import Store from "./../../store";
import postDialog from "../Post/postDialog";
import ChatDialog from "../Chat/ChatDialog";

export default {
  name: "Header",
  components: {
    postDialog,
    ChatDialog
  },
  data() {
    return {
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ],
      url: ""
    };
  },
  created: function() {},
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    /*
    photoURL() {
      var loginUser = firebase.auth().currentUser;
      return loginUser.photoURL;
    }
    */
    isExistUser() {
      return this.$store.getters.isExistUser;
    }
  },
  methods: {
    changePassword: function() {
      var auth = firebase.auth();
      var loginUser = firebase.auth().currentUser;
      var emailAddress = loginUser.email;

      auth
        .sendPasswordResetEmail(emailAddress)
        .then(function() {
          // Email sent.
          alert("パスワード再設定のメールを送りました");
        })
        .catch(function(error) {
          // An error happened.
          console.log("mail error: " + error);
        });
    },
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          var user = {};
          Store.commit("onAuthStateChanged", user);
          Store.commit("onUserStatusChanged", user.uid ? true : false);
          this.$router.push("/signin");
        });
    },
    toSetting: function() {
      Store.commit("nowTimelineChanged", "setting");
      this.$router.push("/");
    }
  }
};
</script>