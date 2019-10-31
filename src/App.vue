<template>
  <v-app>
    <v-content>
      <Header />
      <br />
      <v-layout justify-center>
        <span class="display-2">JobQuest</span>
      </v-layout>
      <router-view />
      <br />
      <br />
      <v-layout justify-center>
        {{ new Date().getFullYear() }} - &nbsp;
        <strong>
          Powered By
          <a href="https://johnworks.jp">JohnWORKS.</a>
        </strong>
      </v-layout>
      <br />
      <br />
      <br />
      <Footer />
    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
//import Nav from './components/Nav';
//import Home from './components/Home';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

export default {
  name: "App",
  components: {
    //HelloWorld,
    //Nav,
    //Home,
    Header,
    Footer
  },
  data: () => ({})
};
</script>
