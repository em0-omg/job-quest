<template>
  <v-timeline align-top dense>
    <v-timeline-item
      v-for="(item, i) in note"
      :key="i"
      :color="item.color"
      :icon="item.icon"
      fill-dot
    >
      <v-card :color="item.color" dark>
        <v-card-title class="title">{{ item.title }}</v-card-title>
        <v-card-text class="white text--primary">
          <p>{{ item.userFrom }}から{{ item.content }}</p>
          {{ item.createdAt }}&nbsp;
          <v-btn :color="item.color" icon>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
<script>
import firebase from "firebase";
export default {
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
    items: [
      {
        action: "15 min",
        headline: "Brunch this weekend?",
        title: "Ali Connors",
        subtitle:
          "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      },
      {
        action: "2 hr",
        headline: "Summer BBQ",
        title: "me, Scrott, Jennifer",
        subtitle: "Wish I could come, but I'm out of town this weekend."
      },
      {
        action: "6 hr",
        headline: "Oui oui",
        title: "Sandra Adams",
        subtitle: "Do you have Paris recommendations? Have you ever been?"
      },
      {
        action: "12 hr",
        headline: "Birthday gift",
        title: "Trevor Hansen",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        action: "18hr",
        headline: "Recipe to try",
        title: "Britta Holt",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      }
    ]
  })
};
</script>