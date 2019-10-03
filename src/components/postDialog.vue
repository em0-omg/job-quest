<template>
  <v-row justify="center">
    <!-- <v-dialog v-model="dialog" persistent max-width="600px"> -->
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-pencil-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">募集する{{ dateLimit }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="締め切り*" type="date" required v-model="dateLimit"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="募集人数*" type="number" v-model="howMany"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="タイトル*" required v-model="title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="内容*" required v-model="content"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field label="タグ" hint="「,」区切りで入力してください" v-model="tags"></v-text-field>
              </v-col>
              <!--
                <v-col cols="12" sm="6">
                    <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                ></v-autocomplete>
                </v-col>
              -->
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="post">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  created: function() {
    var db = firebase.firestore();
    var _this = this;
    _this.db = db;
  },
  data: () => ({
    dialog: false,

    db: null,

    dateLimit: "",
    howMany: 0,
    title: "",
    content: "",
    tags: ""
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
    post: function() {
      var nowDate = Date.now();
      var newPost = {
        content: this.content,
        createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
        image: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        owner: this.user.email,
        // TODO 空白考慮
        tags: this.tags.split(","),
        title: this.title
      };
      var newPostRef = this.db
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc();
      newPostRef.set(newPost);
    }
  }
};
</script>