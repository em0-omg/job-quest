<template>
  <v-card max-width="500" class="mx-auto">
    <v-list two-line v-if="userinfo.ChatWith">
      <v-list-item v-for="item in userinfo.ChatWith" :key="item.postID+item.with">
        <v-list-item-icon>
          <OpenChat :info="item.with" :postid="item.postID" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.with"></v-list-item-title>
          <v-list-item-subtitle v-text="item.postID"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="'last updated 2019/10/11'"></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;チャット相手がいません</span>
    </v-list>
  </v-card>
</template>
<script>
import OpenChat from "./OpenChat";
import firebase from "firebase";
export default {
  props: ["userinfo"],
  components: {
    OpenChat
  },
  mounted: function() {
    var self = this;
    self.chatlist = [];
    this.userinfo.ChatWith.forEach(function(uw) {
      var chatlistItem = {
        with: uw.with,
        postID: uw.postID
        // postName: this.getPostTitle(uw.postID),
        //userIcon: self.getIcon(uw.with)
      };
      self.chatlist.push(chatlistItem);
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
      var self = this;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var docData = doc.data();
            if (docData.email === emailKey) {
              console.log("set:" + self.setIconURL);
            }
          });
        });
    },
    getPostTitle: function(postKey) {
      var self = this;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var docData = doc.data();
            if (docData.id === postKey) {
              console.log("find post " + docData.id);
            }
          });
        });
    }
  }
};
</script>