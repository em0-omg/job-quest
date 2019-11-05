import firebase from "firebase";
import "firebase/firestore";
import store from "./store";
import moment from "moment";

const config = {
  apiKey: "AIzaSyD9sC8Di2L-3Sxkh7pWvgX_H845KyT62Dk",
  authDomain: "jobquest-b6a5c.firebaseapp.com",
  databaseURL: "https://jobquest-b6a5c.firebaseio.com",
  projectId: "jobquest-b6a5c",
  storageBucket: "jobquest-b6a5c.appspot.com",
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
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        alert("Success!");
        console.log(result);
        this.$router.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  },
  logout() {
    alert("logoff");
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.push("/signin");
      });
  },
  onAuth() {
    firebase.auth().onAuthStateChanged(user => {
      user = user ? user : {};
      store.commit("onAuthStateChanged", user);
      store.commit("onUserStatusChanged", user.uid ? true : false);
      store.commit("nowTimelineChanged", "home");
    });
  },
  logging(who, what, contents) {
    var nowDate = Date.now();
    var logRef = firebase
      .firestore()
      .collection("admin")
      .doc("log")
      .collection("messages");
    logRef
      .add({
        name: who,
        category: what,
        contents: contents,
        createdAt: moment(nowDate).format("YYYY/MM/DD HH:mm")
      })
      .then(() => {
        console.log("log ok");
      })
      .catch(error => {
        console.log("log error:" + error);
      });
  }
};
