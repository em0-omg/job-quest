<template>
    <v-container>
        <v-layout justify-center>
            <h1>JobQuest</h1>
        </v-layout>
        <v-divider></v-divider>
        <v-layout justify-space-around>
            <p>{{ user.displayName }}</p>
        </v-layout>
        <v-layout justify-space-around>
            <p>{{ user.email }}</p>
        </v-layout>
    </v-container>
</template>

<script>
import Firebase from './../firebase';

export default {
    name: 'Home',
    created: function () {
        Firebase.onAuth();
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
        userStatus() {
            return this.$store.getters.isSignedIn;
        }
    },
    components: {
    },
    data: () => ({
    }),
};
</script>
