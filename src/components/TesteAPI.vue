<template>
  <div>
    <div v-if="positivesNewsArray.length > 0">
      <article>
        <div>
          {{ positivesNewsArray[0] }}

          <img :src="positivesNewsArray[0].urlToImage" alt="">

          <aside>
            <h2>{{ positivesNewsArray[0].title }}</h2>
            <p>
              {{ positivesNewsArray[0].description }}
            </p>
          </aside>
        </div>
      </article>

      <ul>
        <li v-for="(news, index) in positivesNewsArray" :key="index">
          <img :src="news.urlToImage" alt="Imagem de Introdução" />
          <span>{{ news.source.name }} • {{ news.publishedAt }}</span>
          <h2>{{ news.title }}</h2>
          <!-- <p>{{ news.description }}</p> -->
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Carregando ou nenhuma notícia positiva encontrada...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { translateText } from "../services/translationService"; // Certifique-se de que este arquivo existe e está correto

const positivesNewsArray = ref([]); // Variável reativa para armazenar as notícias positivas traduzidas

const fetchNews = async () => {
  try {
    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=2b00f2b6760d42edb2ef5a8696cdc2a0"
    );
    const dataNews = response.data.articles.filter((item) => item.title !== "[Removed]");

    // console.log(dataNews);

    // Processar as notícias
    const positiveNews = []; // Array temporário para armazenar notícias positivas antes de traduzir

    for (const itemNewsEn of dataNews) {
      const isPositive = await analyzeSentiment(itemNewsEn.title);

      if (isPositive) {
        positiveNews.push(itemNewsEn); // Adiciona ao array temporário
      }
    }

    // Traduzir os títulos e descrições das notícias positivas
    const translatedNews = await Promise.all(
      positiveNews.map(async (article) => {
        const translatedTitle = await translateText(article.title); 
        // const translatedDescription = article.description
        //   ? await translateText(article.description) 
        //   : "Sem descrição disponível.";

        return {
          ...article,
          title: translatedTitle
          // description: translatedDescription,
        };
      })
    );

    positivesNewsArray.value = translatedNews; // Atualiza o array reativo com as notícias traduzidas
  } catch (error) {
    console.error("Erro ao buscar as notícias:", error);
  }
};

const analyzeSentiment = async (text) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        headers: {
          Authorization: `Bearer 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`,
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );

    const result = await response.json();

    if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
      const sentimentArray = result[0]; // Acessar o array interno

      const sentiment = sentimentArray.reduce((prev, current) =>
        prev?.score > current?.score ? prev : current
      );

      if (sentiment && sentiment.label && typeof sentiment.score === "number") {
        return sentiment.label === "POSITIVE";
      }
    }

    console.error("Resposta inesperada ou formato inválido:", result);
    return false;
  } catch (error) {
    console.error("Erro ao chamar a API do Hugging Face:", error);
    return false;
  }
};

// Chamar a função ao carregar a página
fetchNews();
</script>

<style scoped>
article {
  padding: 70px 90px;
  border: solid 3.5px #000;
}
article div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1440px;
}
article img {
  height: 550px;
  width: 100%;
  max-width: 580px;
}
article aside {
  width: 55%;
}
article aside h2 {
  font-size: 32px;
  margin-bottom: 30px;
}
article aside p {
  font-size: 18px;
}
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
  height: 230px;
  object-position: center;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 8px;
}
</style>