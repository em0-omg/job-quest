<template>
  <v-card max-width="450" class="mx-auto">
    <v-list three-line>
      <template v-for="(item, index) in log">
        <v-list-item :key="item.id">
          <v-btn class="ma-2" color="orange darken-2" dark>
            <v-icon dark left>mdi-check-bold</v-icon>
            {{ index }}
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>名前：{{ item.name }}</v-list-item-title>
            <v-list-item-title>{{item.category}}</v-list-item-title>
            <v-list-item-subtitle>{{ item.contents }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ item.createdAt }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      log: []
    };
  },
  mounted() {
    var logRef = firebase
      .firestore()
      .collection("admin")
      .doc("log")
      .collection("messages");
    var self = this;
    logRef.onSnapshot(function(querySnapshot) {
      self.log = [];
      var _self = self;
      querySnapshot.forEach(function(doc) {
        var docData = doc.data();
        docData.id = doc.id;
        _self.log.push(docData);
      });
    });
  }
};
</script>