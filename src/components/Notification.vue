<template>
  <v-container>
    <v-timeline align-top dense>
      <v-timeline-item
        v-for="(item, i) in note.slice(0,count)"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
      >
        <v-card :color="item.color" dark v-if="item.noteType==='ratioAlert'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <br />
            <p>
              <v-btn icon>
                <v-avatar size="20px">
                  <img :src="item.avatarImage" />
                </v-avatar>
              </v-btn>
              {{ item.content }}
            </p>
            {{ item.createdAt }}&nbsp;
            <ShowProfile :post="item" />
          </v-card-text>
        </v-card>
        <v-card :color="item.color" dark v-if="item.noteType==='favorite'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <br />
            <p>「{{item.post.title}}」</p>
            <p>
              <v-btn icon>
                <v-avatar size="20px">
                  <img :src="item.userFromImage" />
                </v-avatar>
              </v-btn>
              {{ item.userFrom }}から{{ item.content }}
            </p>
            {{ item.createdAt }}&nbsp;
          </v-card-text>
        </v-card>
        <v-card :color="item.color" dark v-else-if="item.noteType==='limitAlert'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <br />
            <p>「{{ item.postTitle }}」</p>
            <p>
              <v-btn icon>
                <v-avatar size="20px">
                  <img :src="item.ownerImage" />
                </v-avatar>
              </v-btn>
              {{ item.content }}
            </p>
            {{ item.createdAt }}&nbsp;
            <SetOwnerRatio :postid="item.postID" />
          </v-card-text>
        </v-card>
        <v-card :color="item.color" dark v-else-if="item.noteType==='joinAlert'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <br />
            <p>「{{item.postTitle}}」</p>
            <p>
              <v-btn icon>
                <v-avatar size="20px">
                  <img :src="item.avatarImage" />
                </v-avatar>
              </v-btn>
              {{ item.content }}
            </p>
            {{ item.createdAt }}&nbsp;
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
      <div slot="no-more">:( No more data...</div>
      <div slot="no-results">:( No results</div>
    </infinite-loading>
  </v-container>
</template>
<script>
import firebase from "firebase";
import SetOwnerRatio from "./Notification/SetOwnerRatio";
import InfiniteLoading from "vue-infinite-loading";
import store from "./../store";

export default {
  components: {
    SetOwnerRatio,
    InfiniteLoading
  },
  mounted: function() {
    var loginUser = firebase.auth().currentUser;

    var self = this;
    var nRef = firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email)
      .collection("notification")
      .orderBy("createdAt", "desc");

    nRef.onSnapshot(function(querySnapshot) {
      self.note = [];
      self.unreadNote = 0;
      querySnapshot.forEach(function(doc) {
        var docData = doc.data();
        docData.id = doc.id;
        if (!docData.isRead) {
          self.unreadNote += 1;
          console.log("unreadnote count:" + self.unreadNote);
        }
        self.note.push(docData);
      });
      store.commit("setUnreadNote", self.unreadNote);
    });
  },
  data: () => ({
    note: [],
    count: 3,
    unreadNote: 0
  }),
  computed: {
    unreadNoteNum: function() {
      return this.$store.getters.unreadNote;
    },
    nowTimeline: function() {
      return this.$store.getters.nowTimeline;
    }
  },
  methods: {
    kidoku() {
      var loginUser = firebase.auth().currentUser;
      // 既読をつける
      var kidokuRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("user")
        .doc(loginUser.email)
        .collection("notification");

      kidokuRef
        .where("isRead", "==", false)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            kidokuRef
              .doc(doc.id)
              .update({
                isRead: true
              })
              .then(function() {
                console.log("既読");
              })
              .catch(function() {
                console.log("既読 失敗");
              });
          });
        })
        .catch(function(eee) {
          console.log("kidoku error: " + eee);
        });
    },
    infiniteHandler() {
      setTimeout(() => {
        var self = this;
        if (self.note.length >= this.count) {
          this.count += 5;
          this.$refs.infiniteLoading.stateChanger.loaded();
        } else {
          this.$refs.infiniteLoading.stateChanger.complete();
        }
      }, 1000);
    }
  },
  watch: {
    unreadNoteNum() {
      this.$nextTick(() => {
        if (this.nowTimeline === "notification") {
          this.kidoku();
        }
      });
    }
  }
};
</script>