<template>
  <div id="app">
    <Header />
    <!-- <NewsComponent /> -->
    <!-- <usNewsApi /> -->
    <!-- <NewsCard /> -->
    <TesteAPI />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import usNewsApi from './components/us-news-api.vue';
import NewsComponent from './components/NewsComponent.vue';
import NewsCard from './components/NewsCard.vue';
import TesteAPI from './components/TesteAPI.vue'
</script>

<style scoped>
#app {
  background-color: #D9D9D9;
  border: solid 3.5px #000;
}
</style>
