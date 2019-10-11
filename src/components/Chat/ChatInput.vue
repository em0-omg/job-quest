<template>
  <v-card height="150">
    <v-footer fixed class="font-weight-medium">
      <v-text-field label="文章を書く"></v-text-field>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-card>
</template>