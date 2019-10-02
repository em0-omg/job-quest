<template>
    <v-container>

        <v-list three-line>
        <v-subheader
            v-text="'TODAY'"
        ></v-subheader>
        <template v-for="(item, index) in posts">

            <v-divider
                :key="index"
            ></v-divider>

            <v-list-item
                :key="item.id"
                @click="tmp"
            >
                <v-list-item-avatar>
                    <v-img :src="item.image"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title v-html="'<h2>'+item.title+'</h2>'"></v-list-item-title>
                    <v-list-item-content v-html="item.content"></v-list-item-content>
                    <v-list-item-subtitle v-html="item.createdAt"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </template>
        </v-list>
        <createPostButton/>
    </v-container>
</template>
<script>
import firebase from 'firebase';
import createPostButton from './createPostButton';

export default {
    name: 'timeline',
    components: {
        createPostButton,
    },
    data() {
        return {
            db: null,
            usersCollectionRef: null,
            workerDocRef: null,
            companyDocRef: null,
            workers: [],
            companies: [],
            posts: [],
        }
    },
    created: function () {
        var db = firebase.firestore();
        var _this = this;
        _this.db = db;

        _this.usersCollectionRef = db.collection('users');
        _this.workerDocRef = db.collection('users').doc('worker');
        _this.companyDocRef = db.collection('users').doc('company').collection('user');

        _this.companies = _this.companyDocRef.where('isActive', '==', true)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function(error) {
            alert(error)
        })
    },
    methods: {
        tmp: function () {
            console.log('tmp');
        }
    },
    firestore() {
        return {
            posts: firebase.firestore().collection('users').doc('company').collection('posts').orderBy('createdAt', 'desc').limit(20)
        }
    }
}
</script>