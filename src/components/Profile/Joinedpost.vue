<template>
  <v-container>
    <v-list three-line v-if="userPost">
      <template v-for="(item, index) in userPost">
        <v-divider :key="index"></v-divider>

        <v-list-item :key="item.id">
          <v-list-item-avatar v-if="item.image">
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>
          <v-btn v-else>
            <v-list-item-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
            </v-list-item-avatar>
          </v-btn>

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
                <postdetaildialog :selectedPost="item"></postdetaildialog>&nbsp;
              </v-btn>
              <v-btn icon v-if="!isFavorite(item.favoriteFrom)" @click="favorite(item.id)">
                <v-icon>mdi-heart-multiple-outline</v-icon>
              </v-btn>
              <v-btn icon v-else @click="unfavorite(item.id)">
                <v-icon>mdi-heart-multiple</v-icon>
              </v-btn>&nbsp;
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
import postdetaildialog from "./postDetailDialog";

export default {
  props: ["email"],
  components: {
    postdetaildialog
  },
  data() {
    return {
      userPost: [],
      user: {
        email: firebase.auth().currentUser.email
      }
    };
  },
  mounted: function() {
    var self = this;
    // post取得
    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("posts")
      .where("joiners", "array-contains", self.email)
      .onSnapshot(function(querySnapshot) {
        self.userPost = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          self.userPost.push(docData);
        });
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
    }
  }
};
</script>