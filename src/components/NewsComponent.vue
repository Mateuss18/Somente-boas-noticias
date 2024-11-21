<template>
  <div>
    <h1>Notícias Traduzidas</h1>
    <div v-if="loading">Carregando notícias...</div>
    <div v-else>
      <div v-for="news in translatedNews" :key="news.id" class="news-item">
        <h2>{{ news.title }}</h2>
        <p>{{ news.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { translateText } from '../services/translationService';

export default {
  data() {
    return {
      news: [], // Notícias originais
      translatedNews: [], // Notícias traduzidas
      loading: true,
    };
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get("https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=2b00f2b6760d42edb2ef5a8696cdc2a0"); // Exemplo de URL
        this.news = response.data.articles.filter(item => item.title !== '[Removed]' );

        // console.log(this.news);
        

        // Traduzir os títulos e descrições
        this.translatedNews = await Promise.all(
          this.news.map(async (article) => {
            const translatedTitle = await translateText(article.title)
            const translatedDescription = await translateText(article.description);

            return {
              ...article,
              title: translatedTitle,
              description: translatedDescription,
            };
          })
        );
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchNews();
  },
};
</script>

<style>
.news-item {
  margin-bottom: 20px;
}
</style>
