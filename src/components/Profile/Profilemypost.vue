<template>
  <v-container>
    <v-list three-line>
      <template v-for="(item, index) in userPost.slice(0,count)">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.id">
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
            <v-list-item-subtitle>
              <p class="text-truncate">{{ item.content }}</p>
            </v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
            <!-- <v-list-item-content>{{ item.favoriteFrom.length }}件のお気に入り登録者</v-list-item-content> -->
            <v-layout justify-center :key="item.id">
              <v-btn icon>
                <postdetaildialog :selectedPost="item"></postdetaildialog>&nbsp;
              </v-btn>
              <v-btn icon v-if="!isFavorite(item.favoriteFrom)" @click="favorite(item.id)">
                <v-icon>mdi-heart-multiple-outline</v-icon>
                {{ item.favoriteFrom.length }}
              </v-btn>
              <v-btn icon v-else @click="unfavorite(item.id)">
                <v-icon>mdi-heart-multiple</v-icon>
                {{ item.favoriteFrom.length }}
              </v-btn>&nbsp;
              <v-btn v-if="item.ownerEmail===user.email" icon>
                <editpost :selectedPost="item" />
              </v-btn>
              <v-btn icon v-if="item.ownerEmail===user.email">
                <PostDelete :postid="item.id" />&nbsp;
              </v-btn>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
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
import editpost from "./../Timeline/EditPost";
import InfiniteLoading from "vue-infinite-loading";
import PostDelete from "./../Post/PostDelete";
import postdetaildialog from "./postDetailDialog";

export default {
  props: ["email"],
  components: {
    PostDelete,
    editpost,
    InfiniteLoading,
    postdetaildialog
  },
  data() {
    return {
      iposts: [],
      count: 0,
      userPost: [],
      user: {
        email: firebase.auth().currentUser.email
      }
    };
  },
  mounted: function() {
    var self = this;
    // post取得
    if (self.email === self.user.email) {
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .where("ownerEmail", "==", self.email)
        .orderBy("createdAt", "desc")
        .onSnapshot(function(querySnapshot) {
          self.userPost = [];
          querySnapshot.forEach(function(doc) {
            var docData = doc.data();
            docData.id = doc.id;
            self.userPost.push(docData);
          });
        });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .where("ownerEmail", "==", self.email)
        .where("isActive", "==", true)
        .orderBy("createdAt", "desc")
        .onSnapshot(function(querySnapshot) {
          self.userPost = [];
          querySnapshot.forEach(function(doc) {
            var docData = doc.data();
            docData.id = doc.id;
            self.userPost.push(docData);
          });
        });
    }
  },
  methods: {
    infiniteHandler() {
      setTimeout(() => {
        var self = this;
        if (self.userPost.length >= this.count) {
          /*
          this.userPost
            .slice(this.count, this.count + 5)
            .filter(function(item) {
              self.iposts.push(item);
              return item;
            });
            */
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
    favorite: function(id) {
      console.table(this.userPost);
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
          favoriteFrom: firebase.firestore.FieldValue.arrayUnion(
            this.user.email
          )
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
    }
  }
};
</script>
