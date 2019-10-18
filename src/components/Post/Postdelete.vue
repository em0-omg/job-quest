<template>
  <v-row justify="center">
    <v-btn icon @click="dialog = true">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">投稿削除確認</v-card-title>

        <v-card-text>本当に削除してよろしいですか？</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="warning" text @click="dialog = false">キャンセル</v-btn>

          <v-btn color="primary" text @click="deletePost">確定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  props: ["postid"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    deletePost: function() {
      var key = this.postid;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(key)
        .delete()
        .then(function() {
          console.log("delete succsee");
        })
        .catch(function(error) {
          console.error("delete error:", error);
        });
      this.dialog = false;
    }
  }
};
</script>