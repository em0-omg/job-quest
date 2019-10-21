<template>
  <v-card max-width="500" class="mx-auto">
    <v-list two-line v-if="chatlist">
      <v-list-item v-for="item in chatlist" :key="item.postID+item.with">
        <v-list-item-icon>
          <OpenChat :info="item.with" :postid="item.postID" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.with"></v-list-item-title>
          <v-list-item-subtitle>投稿「{{item.postTitle}}」について</v-list-item-subtitle>
          <!-- <v-list-item-subtitle v-text="'last updated 2019/10/11'"></v-list-item-subtitle> -->
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img v-if="item.photoURL" :src="item.photoURL"></v-img>
          <v-img v-else src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-action>
          <chatdelete :chatinfo="item" />
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;チャット相手がいません</span>
    </v-list>
  </v-card>
</template>
<script>
import chatdelete from "./ChatDelete";
import OpenChat from "./OpenChat";
import firebase from "firebase";
export default {
  components: {
    OpenChat,
    chatdelete
  },
  mounted: function() {
    var self = this;
    var loginUser = firebase.auth().currentUser;
    self.chatlist = [];
    var docRef = firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          doc.data().ChatWith.forEach(function(uw) {
            var chatlistItem = {
              with: uw.with,
              postID: uw.postID,
              postTitle: uw.postTitle,
              photoURL: uw.photoURL
            };
            self.chatlist.push(chatlistItem);
          });
        } else {
          console.log("no such doc");
        }
      })
      .catch(function(error) {
        console.log("error: " + error);
      });
  },
  data() {
    return {
      chatlist: [],
      items: [
        {
          icon: true,
          title: "Jason Oner",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg"
        },
        {
          title: "Travis Howard",
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg"
        },
        {
          title: "Ali Connors",
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg"
        },
        {
          title: "Cindy Baker",
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg"
        }
      ]
    };
  },
  methods: {
    getIcon: function(emailKey) {
      var docRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(emailKey);
      docRef.get().then(function(doc) {
        console.log(doc.data().photoURL);
        return doc.data().photoURL;
      });
    },
    getPostTitle: function(postKey) {
      var docRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(postKey);
      docRef.get().then(function(doc) {
        console.log(doc.data().title);
        return doc.data().title;
      });
    }
  }
};
</script>