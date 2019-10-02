<template>
    <v-container>
        <v-layout justify-center>
            <h2>Sign in</h2>
        </v-layout>
        <br>
        <!-- <button @click="googleLogin">Googleでログイン</button> -->
        <v-layout justify-center>
            <Authentication/>
        </v-layout>
        <br>
        <v-layout justify-center>or</v-layout>
        <br>
        <v-devider></v-devider>
        <v-layout justify-center>メールアドレスでログイン</v-layout>
        <v-layout justify-center>
            <input type="text" placeholder="Username" v-model="username">
        </v-layout>
        <v-layout justify-center>
          <input type="password" placeholder="Password" v-model="password">
        </v-layout>
        <v-layout justify-center>
          <v-btn depressed color="primary" @click="signIn()">Signin</v-btn>
        </v-layout>
        <br>
        <v-layout justify-center>
        <p>You don't have an account? 
          <router-link to="/signup">create account now!!</router-link>
        </p>
        </v-layout>
    </v-container>
</template>

<script>
import firebase from 'firebase'
import Authentication from "@/components/Authentication.vue";

export default {
  name: 'Signin',
  components: {
    Authentication
  },
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.username, this.password).then(
        user => {
          alert('Success!')
          this.$router.push('/')
        },
        err => {
          alert(err.message)
        }
      )
    },
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider).then(result => {
        alert('Success!')
        this.$router.push('/')
      }).catch(error => {
          alert(error.message)
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/*.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
*/
input {
  margin: 10px 0;
  padding: 10px;
}
hr {
    border-top: 3px double #8c8b8b;
}
</style>