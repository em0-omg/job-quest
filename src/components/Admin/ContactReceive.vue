<template>
  <v-card max-width="450" class="mx-auto">
    <v-list three-line>
      <template v-for="(item, index) in contact">
        <v-list-item :key="item.id">
          <v-btn class="ma-2" color="orange darken-2" dark>
            <v-icon dark left>mdi-check-bold</v-icon>
            {{ index }}
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>名前：{{ item.name }}</v-list-item-title>
            <v-list-item-title>メール：{{item.mail}}</v-list-item-title>
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
import firebase from "firebase";
export default {
  data: () => ({
    items: [
      { header: "Today" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle:
          "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
      }
    ],
    contact: []
  }),
  mounted() {
    var contactRef = firebase
      .firestore()
      .collection("admin")
      .doc("contact")
      .collection("messages");
    var self = this;
    contactRef.onSnapshot(function(querySnapshot) {
      self.contact = [];
      var _self = self;
      querySnapshot.forEach(function(doc) {
        var docData = doc.data();
        docData.id = doc.id;
        _self.contact.push(docData);
      });
    });
  }
};
</script>