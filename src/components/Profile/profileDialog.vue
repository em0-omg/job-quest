<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" v-on="on">
          設定
          <v-icon dark right>mdi-settings-outline</v-icon>
        </v-btn>
      </template>
      <v-card v-if="loading">
        <vue-loading type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" sm="6" md="4">
                <v-text-field label="ユーザ名*" required v-model="updateUser.displayName"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="6" md="4">
                <v-text-field label="電話番号" type="tel" v-model="updateUser.phone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="6" md="4">
                <v-text-field label="所属" v-model="updateUser.belongTo"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea label="プロフィール" required v-model="updateUser.profile"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveUserProfile()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import { VueLoading } from "vue-loading-template";

export default {
  components: { VueLoading },
  props: ["userprofile"],
  data: () => ({
    dialog: false,
    loading: false,

    loginUser: firebase.auth().currentUser,

    updateUser: {
      phone: "",
      belongTo: "",
      id: "",
      displayName: "",
      email: "",
      photoURL: "",
      // advanced
      profile: "",
      Rank: 1,
      star: 1,
      isAdmin: false
    }
  }),
  computed: {},
  mounted: function() {
    var self = this;
    self.updateUser.displayName = self.userprofile.displayName;
    self.updateUser.profile = self.userprofile.profile;
    self.updateUser.phone = self.userprofile.phone;
    self.updateUser.belongTo = self.userprofile.belongTo;
  },
  methods: {
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
    }
  }
};
</script>
