<template>
  <v-container>
    <v-list three-line v-if="showPosts">
      <template v-for="(item, index) in showPosts">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.id" @click="selectId(item.id)">
          <v-list-item-avatar v-if="item.image">
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <!-- 折り返してくれない -->
            <!-- <v-list-item-title v-html="'<h4>'+item.title+'</h4>'"></v-list-item-title> -->
            <v-list-item-content v-if="!item.isActive">
              <span style="color: red;">非公開設定中</span>
            </v-list-item-content>
            <v-list-item-content v-html="'<h3>'+item.title+'</h3>'"></v-list-item-content>
            <v-list-item-content v-html="item.content"></v-list-item-content>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.ownerEmail"></v-list-item-subtitle>
            <v-list-item-content>{{ item.favoriteFrom.length }}件のお気に入り登録者</v-list-item-content>
            <v-layout justify-center :key="item.id">
              <v-btn icon>
                <postDetailDialog :selectedPost="item"></postDetailDialog>&nbsp;
              </v-btn>
              <v-btn icon v-if="!isFavorite(item.favoriteFrom)" @click="favorite(item.id)">
                <v-icon>mdi-heart-multiple-outline</v-icon>
              </v-btn>
              <v-btn icon v-else @click="unfavorite(item.id)">
                <v-icon>mdi-heart-multiple</v-icon>
              </v-btn>&nbsp;
              <v-btn icon v-if="nowTimeline==='mypost'">
                <EditPost :selectedPost="item" />
              </v-btn>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <v-list v-else>
      <p>no posts...</p>
    </v-list>
  </v-container>
</template>
<script>
import firebase from "firebase";
import postDetailDialog from "../Post/postDetailDialog";
import EditPost from "./EditPost";

export default {
  name: "timeline",
  components: {
    postDetailDialog,
    EditPost
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
        self.showPosts = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
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
      var loginUser = firebase.auth().currentUser;
      if (fromList.indexOf(loginUser.email) >= 0) return true;
      else return false;
    },
    favorite: function(id) {
      var favRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id);
      // showPosts再生成 結局いらなかったけどやり方はメモ
      // var newArray = this.showPosts.filter(p => p.id !== id);
      // this.showPosts = newArray;
      return favRef
        .update({
          favoriteFrom: ["tmp", this.user.email]
        })
        .then(function() {
          console.log("favorite add!");
        })
        .catch(function(error) {
          console.log(error);
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
          console.log("favorite remove");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectId: function(id) {
      this.selectedId = id;
    },
    switchTimeline: function(now) {
      if (now === "favorite") {
        var newFavArray = this.allPosts.filter(p =>
          p.favoriteFrom.includes(this.user.email)
        );
        this.showPosts = newFavArray.filter(p => p.isActive === true);
      } else if (now === "mypost") {
        var newMyArray = this.allPosts.filter(
          p => p.ownerEmail === this.user.email
        );
        this.showPosts = newMyArray;
      } else {
        this.showPosts = this.allPosts.filter(p => p.isActive === true);
      }
    }
  },
  watch: {
    nowTimeline() {
      this.$nextTick(() => {
        this.switchTimeline(this.nowTimeline);
      });
    },
    allPosts() {
      this.$nextTick(() => {
        this.switchTimeline(this.nowTimeline);
      });
    }
  }
};
</script>