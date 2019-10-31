<template>
  <v-card color="grey lighten-4" flat height="50px" tile>
    <v-toolbar dense v-if="userStatus">
      <v-app-bar-nav-icon>
        <ChatDialog />
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-btn icon v-if="isExistUser">
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
          <v-btn icon color="white" v-on="on" v-if="user.photoURL">
            <v-avatar size="32px">
              <img :src="user.photoURL" />
            </v-avatar>
          </v-btn>
          <v-btn icon v-on="on" v-else>
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="toSetting()" v-if="isExistUser">
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
    <v-toolbar dense v-else>
      <v-toolbar-title>
        <v-btn icon @click="toAbout()">
          <v-avatar size="32px">
            <img src="./../../assets/jwlogo.png" />
          </v-avatar>
        </v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <template>
        <v-btn small outlined @click="toSignIn()">
          <span class="caption">入場</span>
          <v-icon>mdi-account-arrow-right</v-icon>
        </v-btn>
        <v-btn small outlined @click="toSignUp()">
          <span class="caption">登録</span>
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </template>
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
      url: "",
      page: ""
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
    toSignUp: function() {
      this.$router.push("/signup");
    },
    toAbout: function() {
      this.$router.push("/about");
    },
    toSignIn: function() {
      this.$router.push("/signin");
    },
    changePassword: function() {
      var auth = firebase.auth();
      var loginUser = firebase.auth().currentUser;
      if (loginUser) {
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
      } else {
        alert("サインインしてください");
      }
    },
    signOut: function() {
      // User is signed in.
      firebase
        .auth()
        .signOut()
        .then(() => {
          var user = {};
          Store.commit("onAuthStateChanged", user);
          Store.commit("onUserStatusChanged", user.uid ? true : false);
          Store.commit("isExistUser", user.uid ? true : false);
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