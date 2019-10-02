<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="6" offset-md="3">
        <v-card>
          <v-card-text style="height: 80px;" class="grey lighten-5 text-center">
            <v-btn color="primary" @click="hideForm()">
              {{ hidden ? 'Show' : 'Hide' }}
            </v-btn>
          </v-card-text>
          <div class="postForm" v-show="!hidden">
                <h2>Post Form</h2>
                <input type="text" placeholder="Title" v-model="formTitle">
                <input type="text" placeholder="Content" v-model="formContent">
          </div>
          <v-card-text style="height: 200px; position: relative" v-show="!hidden">
            <v-fab-transition>
              <v-btn
                v-show="!hidden"
                color="pink"
                dark
                absolute
                top
                right
                fab
              >
                <v-icon @click="createPost()">mdi-plus</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import firebase from 'firebase';
    import moment from 'moment';

    export default {
        components: {
        },
        created: function () {
            var db = firebase.firestore();
            var _this = this;
            _this.db = db;
        },
        data: () => ({
            hidden: false,
            formTitle: '',
            formContent: '',
            db: null,
        }),
        filters: {
        },
        methods: {
            createPost: function () {
                var nowDate = Date.now();
                var newPost = {
                    content: this.formContent,
                    createdAt: moment(nowDate).format('YYYY/MM/DD HH:mm'),
                    image: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                    pk: 'pk',
                    tags: ['t,m,p'],
                    title: this.formTitle,
                };
                var newPostRef = this.db.collection('users').doc('company').collection('posts').doc();
                newPostRef.set(newPost);
            },
            hideForm: function () {
                this.hidden = !this.hidden;
            }
        }
    }
</script>
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
.postForm {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>