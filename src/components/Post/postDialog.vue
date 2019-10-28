<template>
  <v-row justify="center">
    <!-- <v-dialog v-model="dialog" persistent max-width="600px"> -->
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-pencil-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <!--
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="締め切り*" type="date" required v-model="dateLimit"></v-text-field>
              </v-col>
              -->
              <v-col cols="12" sm="6">
                <v-select :items="region" label="地域*" required v-model="region"></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="タイトル*" required v-model="title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="内容*" required v-model="content"></v-textarea>
              </v-col>
            </v-row>
            <v-card-subtitle>締め切り*</v-card-subtitle>
            <br />
            <v-row justify="center">
              <v-date-picker locale="ja" :allowed-dates="allowedDate" v-model="dateLimit"></v-date-picker>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="post">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  created: function() {
    var db = firebase.firestore();
    var _this = this;
    _this.db = db;
  },
  data: () => ({
    dialog: false,

    db: null,

    dateLimit: new Date().toISOString().substr(0, 10),
    title: "",
    content: "",
    region: "",
    tags: "",

    region: [
      "北海道",
      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
      "鳥取県",
      "島根県",
      "岡山県",
      "広島県",
      "山口県",
      "徳島県",
      "香川県",
      "愛媛県",
      "高知県",
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県"
    ]
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    }
  },
  methods: {
    allowedDate: function(val) {
      // 今日～100日後までを選べるようにする
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      let maxAllowedDay = new Date();
      maxAllowedDay.setDate(today.getDate() + 100);
      maxAllowedDay = new Date(
        maxAllowedDay.getFullYear(),
        maxAllowedDay.getMonth(),
        maxAllowedDay.getDate()
      );
      return today <= new Date(val) && new Date(val) <= maxAllowedDay;
    },
    post: function() {
      var nowDate = Date.now();
      var newPost = {
        joiners: [],
        isActive: true,
        isClose: false,
        dateLimit: this.dateLimit,
        content: this.content,
        createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm"),
        // image: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        image: this.user.photoURL,
        ownerName: this.user.displayName,
        ownerEmail: this.user.email,
        // TODO 空白考慮
        tags: this.tags.split(","),
        title: this.title,
        region: this.region,
        favoriteFrom: []
      };
      var newPostRef = this.db
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc();
      newPostRef.set(newPost);
      this.dialog = false;
    }
  }
};
</script>