<template>
  <v-card max-width="500" class="mx-auto">
    <v-card-title>Chat List</v-card-title>
    <v-list two-line>
      <v-list-item v-for="item in userInfo.ChatWith" :key="item.postID">
        <v-list-item-icon>
          <OpenChat />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.with"></v-list-item-title>
          <v-list-item-subtitle v-text="'last updated 2019/10/11'"></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar>
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import OpenChat from "./OpenChat";
export default {
  props: ["userInfo"],
  components: {
    OpenChat
  },
  data() {
    return {
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
  }
};
</script>