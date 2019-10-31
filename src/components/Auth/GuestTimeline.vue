<template>
  <v-container>
    <v-list three-line>
      <template v-for="(item, index) in showPosts">
        <v-list-item :key="item.id">
          <v-list-item-avatar v-if="item.image">
            <v-img :src="item.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-content v-html="'<h3>'+item.title+'</h3>'"></v-list-item-content>
            <v-list-item-content v-html="item.content"></v-list-item-content>
            <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
            <v-list-item-subtitle>投稿者 {{ item.ownerName }} {{ item.region}}</v-list-item-subtitle>
            <v-list-item-content>{{ item.favoriteFrom.length }}件のお気に入り登録者</v-list-item-content>
            <v-layout justify-center :key="item.id">
              <v-btn icon>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-heart-multiple-outline</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-account-search-outline</v-icon>
              </v-btn>
            </v-layout>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      searchWords: "",
      showPosts: []
    };
  },
  computed: {},
  mounted: function() {
    var self = this;
    firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("posts")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .limit(3)
      .onSnapshot(function(querySnapshot) {
        self.showPosts = [];
        querySnapshot.forEach(function(doc) {
          var docData = doc.data();
          docData.id = doc.id;
          self.showPosts.push(docData);
        });
      });
  }
};
</script>