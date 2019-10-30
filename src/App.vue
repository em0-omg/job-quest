<template>
  <v-app>
    <v-content>
      <Header />
      <br />
      <v-layout justify-center>
        <span class="display-1">JobQuest</span>
      </v-layout>
      <router-view />
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
