<template>
  <div id="app">
    <Header />
    <NewsCard />
    <!-- <TesteAPI /> -->
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import NewsCard from './components/NewsCard.vue';
import TesteAPI from './components/TesteAPI.vue'
</script>

<style scoped>
#app {
  background-color: #D9D9D9;
  border: solid 3.5px #000;
}
</style>
