<template>
  <v-container v-if="loading">
    <vue-loading type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
  </v-container>
  <v-container v-else>
    <div class="signup">
      <h2>サインアップ</h2>
      <input type="text" placeholder="メールアドレス" v-model="username" />
      <input type="password" placeholder="パスワード" v-model="password" />
      <input type="password" placeholder="パスワード確認" v-model="password2" />
      <v-layout justify-center>
        <v-btn depressed color="primary" @click="signUp()">サインアップ</v-btn>
      </v-layout>
      <br />
      <p class="text-center">
        アカウントをお持ちですか？
        <br />
        <router-link to="/signin">こちらからサインインしましょう！</router-link>
      </p>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { VueLoading } from "vue-loading-template";

export default {
  name: "Signup",
  components: {
    VueLoading
  },
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      password2: ""
    };
  },
  methods: {
    signUp: function() {
      if (this.password != this.password2) {
        alert("passwordが一致していません");
        return;
      }
      this.loading = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(user => {
          this.loading = false;
          alert("Create account: ", user.email);
          this.$router.push("/signin").catch(err => {
            alert(err.message);
          });
        })
        .catch(error => {
          this.loading = false;
          alert(error.message);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
.signup {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>