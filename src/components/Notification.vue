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
        <v-card :color="item.color" dark v-if="item.noteType==='favorite'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <p>{{ item.userFrom }}から{{ item.content }}</p>
            {{ item.createdAt }}&nbsp;
            <ShowProfile :post="item" />
          </v-card-text>
        </v-card>
        <v-card :color="item.color" dark v-else-if="item.noteType==='limitAlert'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <p>「{{ item.postTitle }}」{{ item.content }}</p>
            {{ item.createdAt }}&nbsp;
            <SetOwnerRatio :postid="item.postID" />
          </v-card-text>
        </v-card>
        <v-card :color="item.color" dark v-else-if="item.noteType==='join'">
          <v-card-title class="title">{{ item.title }}</v-card-title>
          <v-card-text class="white text--primary">
            <p>{{ item.content }}</p>
            {{ item.createdAt }}&nbsp;
            <v-btn :color="item.color" icon>
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
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

export default {
  components: {
    SetOwnerRatio,
    InfiniteLoading
  },
  mounted: function() {
    var self = this;
    var loginUser = firebase.auth().currentUser;
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
      querySnapshot.forEach(function(doc) {
        var docData = doc.data();
        docData.id = doc.id;
        self.note.push(docData);
      });
    });
  },
  data: () => ({
    note: [],
    count: 0
  }),
  methods: {
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
  }
};
</script>