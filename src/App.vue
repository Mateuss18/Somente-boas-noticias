<template>
  <div id="app">
    <Header />
    <NewsCard />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import NewsCard from './components/NewsCard.vue';
</script>

<style scoped>
#app {
  background-color: #D9D9D9;
  border: solid 3.5px #000;
}
</style>
