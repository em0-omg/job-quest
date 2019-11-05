<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account-edit</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>投稿を編集</v-toolbar-title>
          <div class="flex-grow-1"></div>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>内容を編集</v-subheader>
        </v-list>
        <v-list-item>
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
                    <v-select :items="region" label="地域*" required v-model="initRegion"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="タイトル*" required v-model="title"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea label="内容*" required v-model="content"></v-textarea>
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
                    label="投稿の背景画像を更新"
                  ></v-file-input>
                </v-row>
                <span>現在</span>
                <v-img :src="nowImageURL"></v-img>
              </v-container>
              <!-- <imageUploadDialog /> -->
              <!-- <imageUpload /> -->
              <small>*indicates required field</small>
              <br />
              <br />
              <v-layout justify-center>
                <v-alert dense text type="success" v-show="updateAlert">更新しました</v-alert>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="post">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-list-item>
        <br />
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>参加者を編集</v-subheader>
          <Editjoiner :id="selectedPost.id" />
        </v-list>
        <br />
        <v-divider></v-divider>
        <br />
        <v-list>
          <v-list-item v-if="selectedPost.isClose">
            <v-list-item-title class="red">公開設定 *期限を過ぎています</v-list-item-title>
            <v-list-item-action>
              <v-switch
                v-model="selectedPost.isActive"
                color="purple"
                @click="deleteThisPost(selectedPost)"
                disabled
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-title>公開設定</v-list-item-title>
            <v-list-item-action>
              <v-switch
                v-model="selectedPost.isActive"
                color="purple"
                @click="deleteThisPost(selectedPost)"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <br />
        <br />
        <br />
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import Editjoiner from "./Editjoiner";
import firebase from "firebase";

export default {
  components: {
    Editjoiner
  },
  props: ["selectedPost"],
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      updateAlert: false,
      title: "",
      content: "",
      dateLimit: new Date().toISOString().substr(0, 10),
      initRegion: "",
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
      nowImageURL: "",
      innerImage: null,
      imageRules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!"
      ]
    };
  },
  computed: {
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
    this.title = this.selectedPost.title;
    this.initRegion = this.selectedPost.region;
    this.content = this.selectedPost.content;
    this.dateLimit = this.selectedPost.dateLimit;
    this.nowImageURL = this.selectedPost.photoURL;
  },
  methods: {
    uploadPhoto(postid) {
      if (!this.innerImage) {
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
    post: function() {
      var self = this;
      var newPost = {
        dateLimit: this.dateLimit,
        content: this.content,
        title: this.title,
        region: this.initRegion
      };
      var newPostRef = firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(this.selectedPost.id);
      newPostRef
        .set(newPost, { merge: true })
        .then(function() {
          console.log("update ok");
          self.updateAlert = true;
          setTimeout(() => (self.updateAlert = false), 2000);
        })
        .catch(function(error) {
          console.log("error:" + error);
        });
      this.uploadPhoto(this.selectedPost.id);
    },
    deleteThisPost: function(post) {
      var id = post.id;
      firebase
        .firestore()
        .collection("users")
        .doc("company")
        .collection("posts")
        .doc(id)
        .update({
          isActive: !post.isActive
        })
        .then(function() {
          console.log("post isActive" + !post.isActive);
        })
        .catch(function(perror) {
          console.log(perror);
        });
    }
  }
};
</script>