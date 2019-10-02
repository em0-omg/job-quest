<template>
  <v-card
    color="grey lighten-4"
    flat
    height="50px"
    tile
  >
    <v-toolbar dense v-if="userStatus">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <v-toolbar-title class="white--text"></v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <v-btn icon @click="signOut()">
        <v-icon>mdi-account-off</v-icon>
      </v-btn>

    </v-toolbar>
  </v-card>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Header',
  data () {
    return {

    }
  },
  computed: {
      user() {
          return this.$store.getters.user;
      },
      userStatus() {
          return this.$store.getters.isSignedIn;
      }
  },
  methods: {
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    }
  }
}
</script>