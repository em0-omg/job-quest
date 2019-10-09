<template>
  <v-card max-width="80%" class="mx-auto">
    <br />
    <v-layout justify-center v-if="user.displayName">
      <h2>ようこそ {{ user.displayName }} さん</h2>
    </v-layout>
    <v-layout justify-center v-else>
      <h2>ようこそ -------- さん</h2>
    </v-layout>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <v-card color="#385f73" dark>
            <v-card-text class="white--text">
              <div class="headline mb-2">プロフィール</div>
              <div v-if="user.photoURL">
                <v-layout justify-center>
                  <img :src="user.photoURL" width="50%" />
                </v-layout>
              </div>
              <div v-else>
                <p>プロフィール画像：未設定</p>
              </div>
              <p>ユーザ名：{{ user.displayName }}</p>
              <p>メールアドレス：{{ user.email }}</p>
            </v-card-text>

            <v-card-actions>
              <v-layout justify-center>
                <profileDialog />
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import profileDialog from "./Profile/profileDialog";
import Firebase from "./../firebase";

export default {
  components: {
    profileDialog
  },
  created: function() {
    Firebase.onAuth();
  },
  data: () => ({
    items: [
      {
        color: "#1F7087",
        src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "Supermodel",
        artist: "Foster the People"
      },
      {
        color: "#952175",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding"
      }
    ]
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  }
};
</script>
