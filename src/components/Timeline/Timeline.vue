<template>
  <v-container>
    <v-list three-line>
      <template v-for="(item, index) in showPosts">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.id" @click="selectId(item.id)">
          <v-list-item-avatar>
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="'<h3>'+item.title+'</h3>'"></v-list-item-title>
            <v-list-item-content v-html="item.content"></v-list-item-content>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.id"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.favoriteFrom"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="user.email"></v-list-item-subtitle>
          </v-list-item-content>
          <v-layout justify-center :key="item.id">
            <v-btn icon>
              <postDetailDialog :selectedId="selectedId"></postDetailDialog>&nbsp;
              &nbsp;
              &nbsp;
              <v-btn icon v-if="!isFavorite(item.favoriteFrom)" @click="favorite(item.id)">
                <v-icon>mdi-heart-multiple-outline</v-icon>
              </v-btn>
              <v-btn icon v-else @click="unfavorite(item.id)">
                <v-icon>mdi-heart-multiple</v-icon>
              </v-btn>
            </v-btn>
          </v-layout>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>
<script>
import firebase from "firebase";
import postDetailDialog from "../Post/postDetailDialog";

export default {
  name: "timeline",
  components: {
    postDetailDialog
  },
  data() {
    return {
      db: null,
      posts: [],
      count: 0,

      postSize: 0,
      showLimit: 1000,

      allPosts: [],
      showPosts: [],

      selectedId: "",

      isFav: false
    };
  },
  created: function() {
    var db = firebase.firestore();
    var _this = this;
    _this.db = db;
  },
  computed: {
    nowTimeline: function() {
      return this.$store.getters.nowTimeline;
    },
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  },
  mounted: function() {
    var self = this;
    self.db
      .collection("users")
      .doc("company")
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(this.showLimit)
      .onSnapshot(function(querySnapshot) {
        self.allPosts = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          //self.allPosts.push(doc.data());
          self.allPosts.push(docData);
          self.showPosts.push(docData);
        });
      });

    self.db
      .collection("users")
      .doc("company")
      .collection("posts")
      .onSnapshot(snap => {
        self.postSize = snap.size;
      });
  },
  methods: {
    isFavorite: function(fromList) {
      if (fromList.indexOf(this.user.email) >= 0) return true;
      else return false;
    },
    favorite: function(id) {
      var favRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id);
      return favRef
        .update({
          favoriteFrom: ["tmp", this.user.email]
        })
        .then(function() {
          console.log("fav!");
        })
        .catch(function(error) {
          console.log("fav faliled...");
        });
    },
    unfavorite: function(id) {
      var favRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id);
      return favRef
        .update({
          favoriteFrom: ["tmp"]
        })
        .then(function() {
          console.log("fav!");
        })
        .catch(function(error) {
          console.log("fav faliled...");
        });
    },
    selectId: function(id) {
      this.selectedId = id;
    },
    swichTimeline: function(now) {
      var showPosts = [];
      var post = {};
      var key = "";
      if (now === "favorite") {
        console.log("switch fav");
        // TODO userのfavoriteリスト.indexOf('post.owner')で絞り込む
        this.showPosts = showPosts;
      } else if (now === "mypost") {
        console.log("switch my");
        for (key in this.allPosts) {
          post = this.allPosts[key];
          if (post.owner === this.user.email) {
            showPosts[key] = post;
          }
        }
        this.showPosts = showPosts;
      } else {
        console.log("switch else");
        this.showPosts = this.allPosts;
      }
    }
  },
  watch: {
    nowTimeline() {
      this.$nextTick(() => {
        this.swichTimeline(this.nowTimeline);
      });
    }
  }
};
</script>