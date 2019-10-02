import firebase from "firebase";
import 'firebase/firestore'
import store from "./store";

const config = {
    apiKey: "AIzaSyD9sC8Di2L-3Sxkh7pWvgX_H845KyT62Dk",
    authDomain: "jobquest-b6a5c.firebaseapp.com",
    databaseURL: "https://jobquest-b6a5c.firebaseio.com",
    projectId: "jobquest-b6a5c",
    storageBucket: "",
    messagingSenderId: "800186525898",
    appId: "1:800186525898:web:7e1b1aa927be7b50992c33",
    measurementId: "G-F7QSEK4M2X"
};

export default {
    init() {
        firebase.initializeApp(config);
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    },
    login() {
        const provider = new firebase.auth.GoogleAuthProvider()

        firebase.auth().signInWithPopup(provider).then(result => {
            alert('Success!')
            console.log(result);
            this.$router.push('/')
        }).catch(error => {
            alert(error.message)
        })
    },
    logout() {
        alert("logoff")
        firebase.auth().signOut().then(() => {
            this.$router.push('/signin')
        })
    },
    onAuth() {
        firebase.auth().onAuthStateChanged(user => {
            user = user ? user : {};
            store.commit('onAuthStateChanged', user);
            store.commit('onUserStatusChanged', user.uid ? true : false);
        });
    }
};