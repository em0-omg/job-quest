<template>
  <v-container>
    <v-list three-line>
      <!--
      <v-layout justify-center v-show="isUpdated">新着があります</v-layout>
      <v-layout justify-center>
        <v-btn class="ma-2" color="primary" dark @click="updateTimeline()" v-show="isUpdated">
          タイムラインを更新
          <v-icon dark right>mdi-reload</v-icon>
        </v-btn>
      </v-layout>
      <br />
      -->

      <template v-for="(item, index) in allPosts">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.id" @click="tmp">
          <v-list-item-avatar>
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="'<h2>'+item.title+'</h2>'"></v-list-item-title>
            <v-list-item-content v-html="item.content"></v-list-item-content>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <!--
    <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
      <div slot="no-results" />
    </infinite-loading>
    -->
  </v-container>
</template>
<script>
import firebase from "firebase";

export default {
  name: "timeline",
  components: {},
  data() {
    return {
      db: null,
      posts: [],
      count: 0,

      postSize: 0,
      showLimit: 1000,

      allPosts: []
    };
  },
  created: function() {
    var db = firebase.firestore();
    var _this = this;
    _this.db = db;
  },
  computed: {},
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
          self.allPosts.push(doc.data());
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
    tmp: function() {
      console.log("tmp");
    }
    /*
    infiniteHandler() {
      var self = this;
      setTimeout(() => {
        if (this.count < this.postSize) {
          var counter = 0;
          this.allPosts.forEach(function(item) {
            if (counter >= self.count && counter < self.count + 5) {
              self.showPosts.push(item);
            }
            counter++;
          });
          this.count += 5;
          this.$refs.infiniteLoading.stateChanger.loaded();
        } else {
          this.$refs.infiniteLoading.stateChanger.complete();
        }
      }, 1000);
    }
    */
  }
};
</script>