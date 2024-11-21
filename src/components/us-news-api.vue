<template>
  <div>
    <ul>
      <!-- TESTE
      {{ dataNews }} -->
      <li
        v-for="itemNews in dataNews"
        :key="itemNews.source.id">
        <!-- <p>{{ formatTime(itemNews.data_publicacao) }}</p> -->

        <!-- <h2>{{ itemNews }}</h2> -->

        <h2>{{ itemNews.title }}</h2>

        <img :src="itemNews.urlToImage" alt="Imagem de Introdução" />

        <p class="description">{{ itemNews.description }}</p> 
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const dataNews = ref([]); // Inicializamos como array vazio

// Requisição para a API
const fetchNews = async () => {
  try {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=2b00f2b6760d42edb2ef5a8696cdc2a0"
    );
    const data = await response.json();
    dataNews.value = data.articles.filter(item => item.title !== '[Removed]' ); // Atribui o array de notícias
  } catch (error) {
    console.error("Erro ao buscar as notícias:", error);
  }
};

const formatTime = (dateTime) => {
  if (!dateTime) return ""; // Verifica se o valor existe

  // Separa a data e o tempo
  const [date, time] = dateTime.split(" ");
  const [hours, minutes] = time.split(":");

  // Converte a hora para remover o zero à esquerda, se necessário
  const formattedTime = `${parseInt(hours)}h${minutes}`;

  // Retorna a data com a hora formatada
  return `${date} ${formattedTime}`;
};

// Faz a requisição ao montar o componente
onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
}
li {
  list-style-type: none;
  max-width: 25%;
  padding: 32px;
  border: solid 3.5px #000;
}
li h2 {
  font-size: 18px;
  height: 81px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
li .description {
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 72px;
}
img {
  width: 100%;
  height: auto;
  height: 230px;
  object-position: center;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
