<template>
  <v-container>
    <v-file-input v-model="image" :rules="rules" show-size accept="image/*" label="プロフィール画像を変更"></v-file-input>
    <v-layout justify-center>
      <v-btn class="mx-2" fab dark large color="cyan" @click="uploadPhoto()">
        <v-icon dark>mdi-arrow-up-bold-outline</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase";

export default {
  data: () => ({
    innerImage: null,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    user: null
  }),
  computed: {
    image: {
      get() {
        return this.innerImage;
      },
      set(value) {
        this.innerImage = value;
      }
    }
  },
  methods: {
    uploadPhoto() {
      if (!this.innerImage) {
        alert("ファイルを選択してください");
        return;
      }
      alert("upload");
      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      var photoImageRef = storageRef.child(
        "images/" + user.displayName + "/photo.png"
      );
      photoImageRef
        .put(this.innerImage)
        .then(function() {
          photoImageRef.getDownloadURL().then(url => {
            var photoURL = url;
            if (user) {
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