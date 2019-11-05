<template>
  <v-card width="100%">
    <v-container>
      <h2>お問い合わせ</h2>
      <v-form ref="form" v-model="contactFormValidation.valid" lazy-validation>
        <v-text-field
          v-model="contactForm.name"
          :rules="contactFormValidation.nameRules"
          label="名前"
          required
        ></v-text-field>
        <v-text-field
          v-model="contactForm.email"
          :rules="contactFormValidation.emailRules"
          label="メールアドレス"
          required
        ></v-text-field>
        <v-textarea
          v-model="contactForm.contents"
          :rules="contactFormValidation.contentsRules"
          label="内容"
          required
        ></v-textarea>
        <v-btn
          :loading="contactForm.loading"
          :disabled="!contactFormValidation.valid"
          @click="sendContact()"
          block
          large
          color="info"
          class="mt-4 font-weight-bold"
        >送信</v-btn>
      </v-form>
    </v-container>
    <v-snackbar
      v-model="snackBar.show"
      :color="snackBar.color"
      bottom
      right
      :timeout="6000"
      class="font-weight-bold"
    >{{snackBar.message}}</v-snackbar>
  </v-card>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  data: () => ({
    contactForm: {
      name: "",
      contents: "",
      email: "",
      loading: false
    },
    contactFormValidation: {
      valid: false,
      nameRules: [v => !!v || "名前は必須項目です"],
      emailRules: [v => !!v || "メールアドレスは必須項目です"],
      contentsRules: [v => !!v || "内容は必須項目です"]
    },
    snackBar: {
      show: false,
      color: "",
      message: ""
    }
  }),
  mounted() {
    var loginUser = firebase.auth().currentUser;
    this.contactForm.name = loginUser.displayName;
    this.contactForm.email = loginUser.email;
  },
  methods: {
    sendContact: function() {
      if (this.$refs.form.validate()) {
        this.contactForm.loading = true;
        var self = this;
        var nowDate = Date.now();
        var contactRef = firebase
          .firestore()
          .collection("admin")
          .doc("contact")
          .collection("messages");
        contactRef
          .add({
            name: self.contactForm.name,
            mail: self.contactForm.email,
            contents: self.contactForm.contents,
            createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm")
          })
          .then(function() {
            self.formReset();
            self.showSnackBar(
              "success",
              "お問い合わせありがとうございます。送信完了しました"
            );
          })
          .catch(function(err) {
            self.showSnackBar(
              "error",
              "送信に失敗しました。時間をおいて再度お試しください"
            );
          })
          .finally(() => {
            self.contactForm.loading = false;
          });
      }
    },
    showSnackBar: function(color, message) {
      this.snackBar.message = message;
      this.snackBar.color = color;
      this.snackBar.show = true;
    },
    formReset: function() {
      var loginUser = firebase.auth().currentUser;
      this.$refs.form.reset();
      this.contactForm.name = loginUser.displayName;
      this.contactForm.email = loginUser.email;
    }
  }
};
</script>
