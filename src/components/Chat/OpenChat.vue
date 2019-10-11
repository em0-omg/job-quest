<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon>
          <v-icon color="pink" v-on="on">mdi-open-in-new</v-icon>
        </v-btn>
      </template>
      <Chat />
    </v-dialog>
  </v-row>
</template>
<script>
import Chat from "./Chat";
export default {
  components: {
    Chat
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>