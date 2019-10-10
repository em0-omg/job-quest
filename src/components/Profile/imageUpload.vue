<template>
  <v-container>
    <v-file-input v-model="image" :rules="rules" show-size accept="image/*" label="画像を選択"></v-file-input>
    <v-layout justify-center>
      <v-btn class="mx-4" fab dark large color="cyan" @click="uploadPhoto(uid)">
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
  props: ["uid"],
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
      photoImageRef
        .put(this.innerImage)
        .then(function() {
          photoImageRef.getDownloadURL().then(url => {
            var photoURL = url;
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

              return userCollectionRef
                .update({
                  photoURL: photoURL
                })
                .then(function() {
                  console.log("firestore update");
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