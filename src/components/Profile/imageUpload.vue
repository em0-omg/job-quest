<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-file-input v-model="image" :rules="rules" show-size accept="image/*" label="アバター画像を選択"></v-file-input>
        <v-layout justify-center>
          <v-btn class="mx-4" fab dark large color="cyan" @click="uploadPhoto(uid)">
            <v-icon dark>mdi-cloud-upload</v-icon>
          </v-btn>
        </v-layout>
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="headerImage"
          :rules="rules"
          show-size
          accept="image/*"
          label="ヘッダー画像を選択"
        ></v-file-input>
        <v-layout justify-center>
          <v-btn class="mx-4" fab dark large color="cyan" @click="uploadHeader(uid)">
            <v-icon dark>mdi-cloud-upload</v-icon>
          </v-btn>
        </v-layout>
      </v-col>
    </v-row>
    <v-layout justify-center>
      <v-alert dense text type="success" v-show="uploadAlert">アップロード完了</v-alert>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase";

export default {
  data: () => ({
    innerImage: null,
    innerHeaderImage: null,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    user: null,
    uploadAlert: false
  }),
  props: ["uid"],
  computed: {
    image: {
      get() {
        return this.innerImage;
      },
      set(value) {
        this.innerImage = value;
      }
    },
    headerImage: {
      get() {
        return this.innerHeaderImage;
      },
      set(value) {
        this.innerHeaderImage = value;
      }
    }
  },
  methods: {
    uploadHeader(uid) {
      if (!this.innerHeaderImage) {
        alert("ファイルを選択してください");
        return;
      }
      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      var photoImageRef = storageRef.child(
        "images/" + user.displayName + "/header/photo.png"
      );
      var self = this;
      photoImageRef
        .put(this.innerHeaderImage)
        .then(function() {
          photoImageRef.getDownloadURL().then(url => {
            var photoURL = url;
            var _self = self;
            if (user) {
              // firestore更新
              var userCollectionRef = firebase
                .firestore()
                .collection("users")
                .doc("company")
                .collection("user")
                .doc(uid);

              var __self = _self;

              return userCollectionRef
                .update({
                  headerURL: photoURL
                })
                .then(function() {
                  console.log("firestore update");
                  __self.uploadAlert = true;
                  setTimeout(() => (__self.uploadAlert = false), 2000);
                })
                .catch(function(ferror) {
                  console.log(ferror);
                });
            }
            console.log("uploaded a file");
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    uploadPhoto(uid) {
      if (!this.innerImage) {
        alert("ファイルを選択してください");
        return;
      }
      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      var photoImageRef = storageRef.child(
        "images/" + user.displayName + "/photo.png"
      );
      var self = this;
      photoImageRef
        .put(this.innerImage)
        .then(function() {
          photoImageRef.getDownloadURL().then(url => {
            var photoURL = url;
            var _self = self;
            if (user) {
              // firebaseAuth更新
              user
                .updateProfile({
                  photoURL: photoURL
                })
                .then(function() {
                  console.log("update:" + photoURL);
                })
                .catch(function(err) {
                  console.log(err);
                });

              // firestore更新
              var userCollectionRef = firebase
                .firestore()
                .collection("users")
                .doc("company")
                .collection("user")
                .doc(uid);
              var __self = _self;

              return userCollectionRef
                .update({
                  photoURL: photoURL
                })
                .then(function() {
                  console.log("firestore update");
                  __self.uploadAlert = true;
                  setTimeout(() => (__self.uploadAlert = false), 2000);
                })
                .catch(function(ferror) {
                  console.log(ferror);
                });
            }
            console.log("uploaded a file");
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>