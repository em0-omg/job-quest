<template>
  <v-bottom-navigation v-model="bottomNav" dark shift fixed>
    <v-btn>
      <span>contact</span>
      <v-icon>mdi-phone-forward</v-icon>
    </v-btn>

    <v-btn @click="toHome()">
      <span>home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn @click="toProfile()">
      <span>profile</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  data() {
    return {
      bottomNav: 3
    };
  },
  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
      }
    }
  },
  methods: {
    toProfile: function() {
      this.$router.push("/profile");
    },
    toHome: function() {
      this.$router.push("/");
    }
  }
};
</script>
