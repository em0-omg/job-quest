<template>
  <v-container v-if="loading">
    <vue-loading type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
  </v-container>
  <v-container v-else>
    <div class="signup">
      <h2>登録</h2>
      <v-layout justify-center>
        <div width="60%">
          <v-text-field label="メールアドレス" type="text" required v-model="username"></v-text-field>
          <v-text-field label="パスワード" type="password" required v-model="password"></v-text-field>
          <v-text-field label="パスワード確認" type="password" required v-model="password2"></v-text-field>
        </div>
      </v-layout>
      <!--
      <input type="text" placeholder="メールアドレス" v-model="username" />
      <input type="password" placeholder="パスワード" v-model="password" />
      <input type="password" placeholder="パスワード確認" v-model="password2" />
      -->
      <v-layout justify-center>
        <v-btn depressed color="primary" @click="signUp()">登録</v-btn>
      </v-layout>
      <br />
      <p class="text-center">
        アカウントをお持ちですか？
        <br />
        <v-layout justify-center>
          <router-link to="/signin">
            <v-btn class="ma-2" tile outlined color="indigo">
              <v-icon left>mdi-account</v-icon>こちらから入場
            </v-btn>
          </router-link>
        </v-layout>
      </p>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase";
import Firebase from "./../../firebase";
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

          // ログを残す
          Firebase.logging(
            this.username,
            "Signup",
            "ユーザが新規登録されました！"
          );

          alert("Create account", user.email);
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