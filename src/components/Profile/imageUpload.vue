<template>
  <v-container>
    <v-file-input v-model="image" :rules="rules" show-size accept="image/*" label="プロフィール画像を変更"></v-file-input>
    <v-layout justify-center>
      <v-btn class="mx-2" fab dark large color="cyan">
        <v-icon dark>mdi-arrow-up-bold-outline</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    innerImage: null,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ]
  }),
  computed: {
    image: {
      get() {
        return this.innerImage;
      },
      set(value) {
        this.innerImage = value;
      }
    }
  },
  methods: {
    uploadPhoto() {
      alert("upload");
    }
  }
};
</script>