<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>投稿を編集</v-toolbar-title>
          <div class="flex-grow-1"></div>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>内容を編集</v-subheader>
        </v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ selectedPost.title }}</v-list-item-title>
            <br />
            <v-list-item-subtitle>{{ selectedPost.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>参加者を編集</v-subheader>
          <Editjoiner :id="selectedPost.id" />
        </v-list>
        <br />
        <v-divider></v-divider>
        <br />
        <v-list>
          <v-list-item>
            <v-list-item-title>公開設定</v-list-item-title>
            <v-list-item-action>
              <v-switch
                v-model="selectedPost.isActive"
                color="purple"
                @click="deleteThisPost(selectedPost)"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import Editjoiner from "./Editjoiner";
import firebase from "firebase";

export default {
  components: {
    Editjoiner
  },
  props: ["selectedPost"],
  mounted: () => {},
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    };
  },
  methods: {
    deleteThisPost: function(post) {
      var id = post.id;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id)
        .update({
          isActive: !post.isActive
        })
        .then(function() {
          console.log("post isActive" + !post.isActive);
        })
        .catch(function(perror) {
          console.log(perror);
        });
    }
  }
};
</script>