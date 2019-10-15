<template>
  <v-timeline light class="chat">
    <v-timeline-item v-for="n in 4" :key="n" large>
      <template v-slot:icon>
        <v-avatar>
          <img src="http://i.pravatar.cc/64" />
        </v-avatar>
      </template>
      <template v-slot:opposite>
        <span>Tus eu perfecto</span>
      </template>
      <v-card class="elevation-24">
        <v-card-title class="headline">Lorem ipsum</v-card-title>
        <v-card-text>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
<script>
export default {
  components: {}
};
</script>
<style scoped>
.chat {
  background-color: white;
}
</style>