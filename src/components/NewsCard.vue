<template>
  <div>
    <ul>
      <li
        v-for="itemNews in dataNews"
        :key="itemNews.id">
        <p>{{ formatTime(itemNews.data_publicacao) }}</p>

        <img
          :src="
            'https://agenciadenoticias.ibge.gov.br/' +
            getImagePath(itemNews.imagens)
          "
          alt="Imagem de Introdução" />
        <h2>{{ itemNews.titulo }}</h2>
        <p>{{ itemNews.tipo }}</p>
        <p class="description">{{ itemNews.introducao }}</p>
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
      "http://servicodados.ibge.gov.br/api/v3/noticias/"
    );
    const data = await response.json();
    dataNews.value = data.items.filter(item => item.tipo === "Notícia"); // Atribui o array de notícias
  } catch (error) {
    console.error("Erro ao buscar as notícias:", error);
  }
};

// Função para extrair o caminho da imagem do campo 'imagens'
const getImagePath = (imagens) => {
  if (imagens) {
    const parsedImages = JSON.parse(imagens); // Parse do JSON string para objeto
    return parsedImages.image_intro || ""; // Retorna o caminho da imagem ou string vazia
  }
  return ""; // Retorna vazio caso não haja imagem
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
