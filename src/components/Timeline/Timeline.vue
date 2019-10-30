<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          filled
          label="検索"
          prepend-inner-icon="mdi-feature-search-outline"
          v-model="searchWords"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-list three-line>
      <template v-for="(item, index) in searchedPosts.slice(0,count)">
        <v-list-item :key="item.id">
          <v-list-item-avatar v-if="item.image">
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-content v-if="!item.isActive">
              <span style="color: red;">非公開設定中</span>
            </v-list-item-content>
            <v-list-item-content v-html="'<h3>'+item.title+'</h3>'"></v-list-item-content>
            <v-list-item-content v-html="item.content"></v-list-item-content>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
            <v-list-item-subtitle>投稿者 {{ item.ownerName }} {{ item.region}}</v-list-item-subtitle>
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
              <v-btn icon v-if="nowTimeline!='mypost'">
                <ShowProfile :post="item" />
              </v-btn>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
    <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
      <div slot="no-more">:( No more data...</div>
      <div slot="no-results">:( No results</div>
    </infinite-loading>
  </v-container>
</template>
<script>
import firebase from "firebase";
import InfiniteLoading from "vue-infinite-loading";
import postDetailDialog from "../Post/postDetailDialog";
import ShowProfile from "./../Profile/ShowProfile";
import moment from "moment";

export default {
  name: "timeline",
  components: {
    postDetailDialog,
    ShowProfile,
    InfiniteLoading
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
      loginUserInfo: null,

      selectedId: "",

      isFav: false,
      loading: true,

      // fav押しすぎ防止用
      favCounter: 0,

      // 期限オーバー確認用
      nowDate: null,

      //検索キーワード
      searchWords: ""
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
    },
    searchedPosts() {
      if (this.searchWords.length === 0) {
        return this.showPosts;
      } else {
        var returnPost = [];
        var self = this;
        var keywords = this.searchWords.split(" ");
        keywords.forEach(function(key) {
          var newArray = self.showPosts.filter(
            p =>
              p.region.includes(key) ||
              p.title.includes(key) ||
              p.content.includes(key) ||
              p.ownerName.includes(key)
          );
          returnPost = newArray;
        });
        return returnPost;
      }
    }
  },
  mounted: function() {
    var self = this;
    var loginUser = firebase.auth().currentUser;

    self.nowDateInit();

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
          self.checkOverlimitPosts(docData);
        });
      });

    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email)
      .onSnapshot(function(doc) {
        self.loginUserInfo = doc.data();
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
    infiniteHandler() {
      setTimeout(() => {
        var self = this;
        if (self.showPosts.length >= this.count) {
          this.count += 5;
          this.$refs.infiniteLoading.stateChanger.loaded();
        } else {
          this.$refs.infiniteLoading.stateChanger.complete();
        }
      }, 1000);
    },
    isFavorite: function(fromList) {
      var loginUser = firebase.auth().currentUser;
      if (fromList.indexOf(loginUser.email) >= 0) return true;
      else return false;
    },
    favCounterLock: function() {
      var self = this;
      setTimeout(() => (self.favCounter = 0), 300000);
    },
    /////////////////
    //お気に入り登録//
    /////////////////
    favorite: function(id) {
      var self = this;
      if (self.favCounter > 100) {
        alert("5分間お気に入りが利用できません");
        this.favCounterLock();
        return;
      }
      var favRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id);
      favRef
        .update({
          favoriteFrom: firebase.firestore.FieldValue.arrayUnion(
            this.user.email
          )
        })
        .then(function() {
          self.favCounter += 1;
          console.log(self.favCounter);
        })
        .catch(function(error) {
          console.log(error);
        });

      // 通知を送る
      favRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var nowDate = Date.now();
            var postItem = doc.data();
            firebase
              .firestore()
              .collection("users")
              .doc("company")
              .collection("user")
              .doc(postItem.ownerEmail)
              .collection("notification")
              .add({
                noteType: "favorite",
                content: "投稿がお気に入りに登録されました",
                createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
                userFrom: firebase.auth().currentUser.displayName,
                post: postItem,
                icon: "mdi-heart",
                color: "pink",
                title: "お気に入り",
                isRead: false
              });
          } else {
            console.log("no doc");
          }
        })
        .catch(function(e) {
          console.log("error", e);
        });
    },
    unfavorite: function(id) {
      var favRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id);
      favRef
        .update({
          favoriteFrom: firebase.firestore.FieldValue.arrayRemove(
            this.user.email
          )
        })
        .then(function() {
          console.log("favorite remove");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    switchTimeline: function(now) {
      if (now === "favorite") {
        var newFavArray = this.allPosts.filter(p =>
          this.loginUserInfo.favoriteUser.includes(p.ownerEmail)
        );
        console.log(this.loginUserInfo.favoriteUser);
        this.showPosts = newFavArray.filter(p => p.isActive === true);
      } else if (now === "mypost") {
        var newMyArray = this.allPosts.filter(
          p => p.ownerEmail === this.user.email
        );
        this.showPosts = newMyArray;
      } else {
        this.showPosts = this.allPosts.filter(p => p.isActive === true);
      }
    },
    nowDateInit: function() {
      var dt = new Date();
      var y = dt.getFullYear();
      var m = ("00" + (dt.getMonth() + 1)).slice(-2);
      var d = ("00" + dt.getDate()).slice(-2);
      var nowDate = new Date(y, m, d, 23, 59, 59);
      this.nowDate = nowDate;
    },
    checkOverlimitPosts: function(item) {
      var ymd = item.dateLimit.split("-");
      var postDateLimit = new Date(ymd[0], ymd[1], ymd[2], 0, 0, 0);
      var nowDate = Date.now();
      var loginUser = firebase.auth().currentUser;

      if (this.nowDate > postDateLimit) {
        // 通知を送る
        var joinersRef = firebase
          .firestore()
          .collection("users")
          .doc("company")
          .collection("posts")
          .doc(item.id)
          .collection("joinUsers");

        // 各参加者に通知
        joinersRef.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // 0はまだ未回答、未回答者のみに送信
            // 自身がログインしたときのみ通知
            if (
              doc.data().returnRating === 0 &&
              doc.data().isJoin === true &&
              loginUser.email === doc.data().email
            ) {
              var noteRef = firebase
                .firestore()
                .collection("users")
                .doc("company")
                .collection("user")
                .doc(doc.id)
                .collection("notification");
              noteRef
                .add({
                  noteType: "limitAlert",
                  content: "が期限を迎えました！評価を行ってください",
                  createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
                  postTitle: item.title,
                  postID: item.id,
                  icon: "mdi-alert",
                  color: "warning",
                  title: "募集終了",
                  isRead: false
                })
                .then(function() {
                  console.log("note ok");
                })
                .catch(function(errr) {
                  console.log("note error: " + errr);
                });
            }
          });
        });
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
