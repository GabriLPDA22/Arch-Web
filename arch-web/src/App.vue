<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from './components/ui/ToastContainer.vue'
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>