<template>
  <v-container>
    <v-layout>
      <Home/>
    </v-layout>
  </v-container>
</template>

<script>
import Home from "./components/Home.vue"

export default {
  components: {
    Home
  }
}
</script>

<style>
@import url('./css/reset.css');
@import url('./css/common.css');
</style>
