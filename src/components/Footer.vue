<template>
<v-card>
  <v-footer
    dark
    padless
    fixed
  >
    <v-card
      width="100%"
      flat
      tile
      class="indigo lighten-1 white--text text-center"
    >

      <v-card-text v-if="userStatus">
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4 white--text"
          icon
        >
          <v-icon size="32px">{{ icon }}</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Powered By JohnWORKS.</strong>
      </v-card-text>

    </v-card>
  </v-footer>
</v-card>
</template>

<script>
  export default {
    computed: {
      user() {
          return this.$store.getters.user;
      },
      userStatus() {
          return this.$store.getters.isSignedIn;
      }
    },
    data: () => ({
      icons: [
        'mdi-ticket-confirmation',
        'mdi-home',
        'mdi-phone-forward',
        'mdi-account',
      ],
    }),
  }
</script>
