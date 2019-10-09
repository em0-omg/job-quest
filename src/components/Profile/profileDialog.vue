<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" v-on="on">
          設定
          <v-icon dark right>mdi-settings-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <imageUpload />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="6" md="4">
                <v-text-field label="ユーザ名" v-model="updateUser.displayName"></v-text-field>
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
import imageUpload from "./imageUpload";
import firebase from "firebase";

export default {
  components: {
    imageUpload
  },
  data: () => ({
    dialog: false,

    updateUser: {
      name: "",
      email: "",
      photoURL: "",
      // advanced
      displayName: "",
      profile: "",
      Rank: 1
    }
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  },
  methods: {
    saveUserProfile: function() {
      //firebase上の
      this.user
        .updateProfile({
          displayName: this.updateUser.displayName
        })
        .then(function() {
          alert("save");
        })
        .catch(function(error) {
          alert(error);
        });
      this.saveToFirestore();
      this.dialog = false;
    },
    saveToFirestore: function() {
      var newUser = this.updateUser;
      newUser.name = this.user.displayName;
      newUser.email = this.user.email;
      newUser.photoURL = this.user.photoURL;
      var newUserRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc();
      newUserRef.set(newUser);
    }
  }
};
</script>
