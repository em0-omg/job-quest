<template>
  <v-container>
    <v-layout justify-center>
      <span class="subtitle-1">ようこそ 職探しの旅へ</span>
    </v-layout>
    <br />
    <v-layout justify-center>
      <v-card max-width="90%">
        <v-img src="./../../assets/jq-header1.jpg"></v-img>
        <br />
        <p class="subtitle-2 text-center">
          SNSのようなシンプルなシステム
          <br />求人募集や職探しが簡単に行えます。
        </p>
        <v-divider></v-divider>
        <GuestTimeline />
      </v-card>
    </v-layout>
    <br />
    <v-layout justify-center>
      <v-card max-width="90%">
        <v-img src="./../../assets/jq-header3.jpg"></v-img>
        <br />
        <p class="subtitle-2 text-center">
          双方向の評価制度
          <br />ユーザーのマナーを一定に保ち、
          <br />採用や応募の指標となります。
        </p>
        <v-layout justify-center>
          <v-img src="./../../assets/jq-header2.jpg"></v-img>
        </v-layout>
      </v-card>
    </v-layout>
    <br />
    <v-layout justify-center>
      <v-card max-width="90%">
        <v-img src="./../../assets/jq-header.jpg"></v-img>
        <br />
        <p class="subtitle-2 text-center">
          誰もが手軽に参加できる
          <br />職探しコミュニティー
          <br />史上初の体験をいますぐに
          <br />
          <br />
          <template>
            <v-btn small outlined @click="toSignIn()">
              <span class="caption">入場</span>
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
            <v-btn small outlined @click="toSignUp()">
              <span class="caption">登録</span>
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </template>
        </p>
        <br />
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import GuestTimeline from "./GuestTimeline";
export default {
  components: {
    GuestTimeline
  },
  methods: {
    toSignUp: function() {
      this.$router.push("/signup");
    },
    toSignIn: function() {
      this.$router.push("/signin");
    }
  }
};
</script>