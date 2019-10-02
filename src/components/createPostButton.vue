<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="6" offset-md="3">
        <v-card>
          <v-card-text style="height: 50px;" class="grey lighten-5 text-center">
            <v-btn color="primary" @click="hidden = !hidden">
              {{ hidden ? 'Show' : 'Hide' }}
            </v-btn>
          </v-card-text>
          <v-card-text style="height: 200px; position: relative">
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
    export default {
        created: function () {
            var db = firebase.firestore();
            var _this = this;
            _this.db = db;
        },
        data: () => ({
            hidden: false,
        db: null,
        }),
        methods: {
            createPost: function () {
                alert("in")
                var newPost = {
                    content: 'content',
                    createdAt: 'nowdate',
                    image: 'imageURL',
                    pk: 'pk',
                    subtitle: 'tmpSub',
                    tags: ['t,m,p'],
                    title: 'tmpTitle',
                };
                var newPostRef = this.db.collection('users').doc('company').collection('posts').doc();
                newPostRef.set(newPost);
            }
        }
    }
</script>