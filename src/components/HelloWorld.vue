<script setup>
import { ref, onMounted  } from 'vue'

const dataNews = ref(null);

fetch('http://servicodados.ibge.gov.br/api/v3/noticias/').then(response => response.json()).then(data => dataNews.value = data.items)

</script>

<template>
  <div>
    <ul>
      <li v-for="itemNews in dataNews" :id="itemNews.id">
        <!-- <h2>
          {{ itemNews.titulo }}
        </h2>

        <img :src="itemNews.imagens" alt=""> -->
        <h2>{{itemNews}}</h2>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
