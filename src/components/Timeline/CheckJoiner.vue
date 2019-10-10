<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn color="indigo" dark v-on="on" @click="createJoiner()">参加者を編集する</v-btn>
      </template>
      <v-card>
        <v-list v-for="(item,id) in joinersList" :key="id">
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{item.email}}</v-list-item-title>
              <v-list-item-subtitle>subtitle</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-rating v-model="rating"></v-rating>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable messages</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn text @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" text @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  props: ["id"],
  mounted: () => {},
  data: () => ({
    joinersList: [],
    rating: 3,
    fav: true,
    menu: false,
    message: false
  }),
  methods: {
    createJoiner: function() {
      var joiners = [];
      var joinerRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.id)
        .collection("joinUsers");
      joinerRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          joiners.push(doc.data());
        });
      });
      this.joinersList = joiners;
    }
  }
};
</script>
