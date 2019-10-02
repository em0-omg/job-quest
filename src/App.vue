<template>
  <v-app>
    <!--
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>
    -->
    <v-content>
      <Header/>
      <router-view/>
      <Footer/>
    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld';
//import Nav from './components/Nav';
//import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    //HelloWorld,
    //Nav,
    //Home,
    Header,
    Footer,
  },
  data: () => ({
  }),
};
</script>
