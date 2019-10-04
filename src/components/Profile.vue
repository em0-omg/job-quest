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
              <div v-if="user.photoUrl">
                <img :src="user.photoUrl" />>
              </div>
              <div v-else>
                <p>プロフィール画像：未設定</p>
              </div>
              <p>ユーザ名：{{ user.displayName }}</p>
              <p>メールアドレス：{{ user.email }}</p>
            </v-card-text>

            <v-card-actions>
              <v-layout justify-center>
                <v-btn class="ma-2">
                  編集
                  <v-icon dark right>mdi-settings-outline</v-icon>
                </v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <v-card color="#952175" dark>
            <v-card-text class="white--text">
              <div class="headline mb-2">項目2</div>Listen to your favorite artists and albums whenever and wherever, online and offline.
            </v-card-text>

            <v-layout justify-center>
              <v-btn class="ma-2">
                編集
                <v-icon dark right>mdi-settings-outline</v-icon>
              </v-btn>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
export default {
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
