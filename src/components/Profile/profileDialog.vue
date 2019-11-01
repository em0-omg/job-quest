<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" v-on="on" @click="setProfile()">
          設定
          <v-icon dark right>mdi-settings-outline</v-icon>
        </v-btn>
      </template>
      <v-card v-if="loading">
        <vue-loading type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <span class="title">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  label="ユーザ名*"
                  required
                  :rules="[rules.required]"
                  v-model="updateUser.displayName"
                  counter="20"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field label="所属" counter="50" v-model="updateUser.belongTo"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea label="プロフィール" required counter="1000" v-model="updateUser.profile"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">キャンセル</v-btn>
          <v-btn v-if="updateOK" color="blue darken-1" text @click="saveUserProfile()">登録</v-btn>
          <v-btn v-else disabled color="blue darken-1" text @click="saveUserProfile()">登録</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import { VueLoading } from "vue-loading-template";
import store from "./../../store";

export default {
  components: { VueLoading },
  props: ["userprofile"],
  data: () => ({
    dialog: false,
    loading: false,
    rules: {
      required: value => !!value || "Required"
    },

    loginUser: firebase.auth().currentUser,

    updateUser: {
      belongTo: "",
      id: "",
      displayName: "",
      email: "",
      photoURL: "",
      // advanced
      profile: "",
      Rank: 1,
      isAdmin: false,
      favoriteFrom: [],
      favoriteUser: []
    }
  }),
  computed: {
    updateOK() {
      var v_nameLength = this.updateUser.displayName.length > 20 ? false : true;
      var v_depLength = this.updateUser.belongTo.length > 50 ? false : true;
      var v_profileLength =
        this.updateUser.profile.length > 1000 ? false : true;
      var v_nameExist = this.updateUser.displayName ? true : false;
      if (v_nameLength && v_depLength && v_profileLength && v_nameExist)
        return true;
      else return false;
    }
  },
  updated: function() {},
  methods: {
    setProfile: function() {
      var self = this;
      self.updateUser.displayName = self.userprofile.displayName;
      self.updateUser.profile = self.userprofile.profile;
      self.updateUser.belongTo = self.userprofile.belongTo;
    },
    saveUserProfile: function() {
      var self = this;
      this.loading = true;
      //firebase上の
      this.loginUser
        .updateProfile({
          displayName: this.updateUser.displayName
        })
        .then(function() {
          self.loading = false;
        })
        .catch(function(error) {
          alert(error);
        });
      this.saveToFirestore();
      this.dialog = false;
    },
    saveToFirestore: function() {
      var newUser = this.updateUser;
      newUser.name = this.loginUser.displayName;
      newUser.email = this.loginUser.email;
      newUser.photoURL = this.loginUser.photoURL;
      var newUserRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(newUser.email);
      newUserRef.set(newUser, { merge: true });
      // TODO メールをキーにしてるので、メールを変えたらここのキーも変える
      store.commit("isExistUser", true);
    }
  }
};
</script>
