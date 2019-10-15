<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon>
          <v-icon color="pink" v-on="on" @click="setChatWith()">mdi-open-in-new</v-icon>
        </v-btn>
      </template>
      <Chat :userinfo="info" :pid="postid" />
    </v-dialog>
  </v-row>
</template>
<script>
import Chat from "./Chat";
export default {
  props: {
    info: String,
    postid: String
  },
  components: {
    Chat
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    setChatWith: () => {}
  }
};
</script>