<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>投稿を編集</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>内容を編集</v-subheader>
        </v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ selectedPost.title }}</v-list-item-title>
            <br />
            <v-list-item-subtitle>{{ selectedPost.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>Other content</v-subheader>
          <CheckJoiner :id="selectedPost.id" />
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import CheckJoiner from "./CheckJoiner";
export default {
  components: {
    CheckJoiner
  },
  props: ["selectedPost"],
  mounted: () => {},
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    };
  },
  methods: {
    mountJoiner: function(selectedPost) {
      var id = selectedPost.id;
      alert(id);
    }
  }
};
</script>