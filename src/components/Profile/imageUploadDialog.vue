<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" v-on="on">
          プロフィール画像を変更
          <v-icon dark right>mdi-settings-outline</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>プロフィール画像を設定</v-card-title>

        <v-card-text>
          <imageUpload :uid="uid" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import imageUpload from "./imageUpload";

export default {
  components: {
    imageUpload
  },
  data() {
    return {
      dialog: false
    };
  },
  props: ["uid"]
};
</script>