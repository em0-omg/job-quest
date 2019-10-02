<template>
  <v-app>
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
