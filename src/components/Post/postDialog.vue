<template>
  <v-row justify="center">
    <!-- <v-dialog v-model="dialog" persistent max-width="600px"> -->
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          募集
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
                <v-select autofocus :items="region" label="地域*" required v-model="selectedRegion"></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="タイトル*"
                  required
                  v-model="title"
                  counter="20"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="内容*" v-model="content" counter="500" :rules="[rules.required]"></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="締め切り*" type="date" required v-model="dateLimit" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-date-picker locale="ja" :allowed-dates="allowedDate" v-model="dateLimit"></v-date-picker>
            </v-row>
            <br />
            <v-row justify="center">
              <!-- <imageUpload /> -->
              <v-file-input
                v-model="image"
                :rules="imageRules"
                show-size
                accept="image/*"
                label="投稿の背景画像を選択"
              ></v-file-input>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">キャンセル</v-btn>
          <v-btn color="blue darken-1" text @click="post" v-if="postOK">投稿</v-btn>
          <v-btn color="blue darken-1" text @click="post" disabled v-else>投稿</v-btn>
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
    rules: {
      required: value => !!value || "Required"
    },
    dialog: false,

    db: null,
    innerImage: null,
    imageRules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],

    dateLimit: new Date().toISOString().substr(0, 10),
    title: "",
    titleOK: true,
    content: "",
    contentOK: true,
    selectedRegion: "北海道",
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
    ],
    userRank: 0
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    postOK() {
      var v_titleLength = this.title.length > 20 ? false : true;
      var v_contentLength = this.content.length > 500 ? false : true;
      var v_titleExist = this.title ? true : false;
      var v_contentExist = this.content ? true : false;
      if (v_titleLength && v_contentLength && v_titleExist && v_contentExist)
        return true;
      else return false;
    },
    image: {
      get() {
        return this.innerImage;
      },
      set(value) {
        this.innerImage = value;
      }
    }
  },
  mounted() {
    var self = this;
    var loginUser = firebase.auth().currentUser;
    var userRef = firebase
      .firestore()
      .collection("users")
      .doc("company")
      .collection("user")
      .doc(loginUser.email);
    userRef.get().then(function(doc) {
      self.userRank = doc.data().Rank;
    });
  },
  methods: {
    uploadPhoto(postid) {
      if (!this.innerImage) {
        alert("ファイルを選択してください");
        return;
      }
      var user = firebase.auth().currentUser;
      var storageRef = firebase.storage().ref();
      var photoImageRef = storageRef.child(
        "images/post/" + postid + "/photo.png"
      );
      photoImageRef
        .put(this.innerImage)
        .then(function() {
          photoImageRef.getDownloadURL().then(url => {
            var photoURL = url;
            if (user) {
              // firestore更新
              var userCollectionRef = firebase
                .firestore()
                .collection("users")
                .doc("company")
                .collection("posts")
                .doc(postid);

              return userCollectionRef
                .update({
                  photoURL: photoURL
                })
                .then(function() {
                  console.log("firestore update");
                })
                .catch(function(ferror) {
                  console.log(ferror);
                });
            }
            console.log("uploaded a file");
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
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
    getUniqueStr() {
      var strong = 1000;
      return (
        new Date().getTime().toString(16) +
        Math.floor(strong * Math.random()).toString(16)
      );
    },
    post: function() {
      var nowDate = Date.now();
      var uniqueKey = this.getUniqueStr();
      console.log("1:" + uniqueKey);
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
        title: this.title,
        region: this.selectedRegion,
        favoriteFrom: [],
        userRank: this.userRank
      };
      var newPostRef = this.db
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(uniqueKey);
      newPostRef.set(newPost, { merge: true });
      console.log("2:" + uniqueKey);
      this.uploadPhoto(uniqueKey);
      this.dialog = false;
    }
  }
};
</script>