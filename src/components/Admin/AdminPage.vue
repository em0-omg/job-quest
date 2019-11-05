<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">管理者画面を開く</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>管理者ページ</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <br />
        <v-tabs background-color="primary" centered dark grow icons-and-text>
          <v-tab>
            お問い合わせ
            <v-icon>mdi-post</v-icon>
          </v-tab>
          <v-tab>
            ログ
            <v-icon>mdi-heart</v-icon>
          </v-tab>
          <v-tab>
            tmp
            <v-icon>mdi-hand</v-icon>
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <ContactReceive />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <LogReceive />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>tmp</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import ContactReceive from "./ContactReceive";
import LogReceive from "./LogReceive";
export default {
  components: {
    ContactReceive,
    LogReceive
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>
