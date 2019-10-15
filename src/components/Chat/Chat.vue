<template>
  <v-timeline dense light class="chat">
    <v-timeline-item reverse v-for="n in 9" :key="n" large>
      <template v-slot:icon>
        <v-avatar>
          <img src="http://i.pravatar.cc/64" />
        </v-avatar>
      </template>
      <template v-slot:opposite>
        <span>Tus eu perfecto</span>
      </template>
      <v-card class="elevation-24">
        <v-card-text class="body-2 overline">{{ userinfo }}</v-card-text>
      </v-card>
    </v-timeline-item>
    <Chatinput :info="userinfo" />
  </v-timeline>
</template>
<script>
import Chatinput from "./Chatinput";
export default {
  props: ["userinfo"],
  components: { Chatinput }
};
</script>
<style scoped>
.chat {
  background-color: white;
}
</style>