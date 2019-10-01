<template>
    <v-content>
        <v-container>
            <v-layout justify-center>
                <h1>JobQuest</h1>
            </v-layout>
            <v-layout justify-space-around>
                <p>{{ mail }}</p>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Home',
  components: {
  },
  data: () => ({
    mail: firebase.auth().currentUser.email,
  }),
};
</script>
