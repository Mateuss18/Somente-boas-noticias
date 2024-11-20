<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Notícias Positivas</h1>
    
    <!-- Debug info -->
    <div v-if="debugInfo.length > 0" class="mb-4 p-4 bg-gray-100 rounded">
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <div v-for="(info, index) in debugInfo" :key="index" class="text-sm">
        {{ info }}
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <p>Carregando notícias...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- News list -->
    <div v-if="positiveNews.length > 0" class="grid gap-4">
      <div v-for="news in positiveNews" :key="news.id" class="border p-4 rounded-lg">
        <h2 class="text-xl font-semibold">{{ news.titulo }}</h2>
        <p class="text-gray-600 mt-2">{{ news.introducao }}</p>
        <div class="mt-2 text-sm text-gray-500">
          <span>Data: {{ formatDate(news.data_publicacao) }}</span>
          <span class="ml-2">Score: {{ news.sentimentScore?.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !error" class="text-center">
      <p>Nenhuma notícia positiva encontrada.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const positiveNews = ref([]);
const loading = ref(false);
const error = ref(null);
const debugInfo = ref([]);

const API_TOKEN = "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";

const addDebugInfo = (info) => {
  debugInfo.value.push(`${new Date().toLocaleTimeString()}: ${info}`);
  console.log(info);
};

// Lista de palavras positivas em português
const palavrasPositivas = [
  'crescimento', 'aumento', 'melhoria', 'desenvolvimento', 'avanço',
  'conquista', 'sucesso', 'positivo', 'benefício', 'progresso',
  'oportunidade', 'inovação', 'expansão', 'crescer', 'melhorar',
  'desenvolver', 'avançar', 'conquistar', 'beneficiar', 'progredir',
  'recorde', 'superávit', 'alta', 'alcançar', 'superar',
  'crescente', 'evolução', 'evolui', 'evoluir', 'aprovação',
  'celebra', 'celebrar', 'comemora', 'comemorar', 'vitória'
];

// Lista de palavras negativas em português
const palavrasNegativas = [
  'queda', 'redução', 'diminuição', 'declínio', 'perda',
  'deficit', 'crise', 'problema', 'dificuldade', 'negativo',
  'risco', 'prejuízo', 'baixa', 'menor', 'pior',
  'reduzir', 'diminuir', 'cair', 'piorar', 'deteriorar',
  'inflação', 'desemprego', 'recessão', 'dívida', 'déficit'
];

const analyzeSentiment = (text) => {
  const textoLowerCase = text.toLowerCase();
  let scorePositivo = 0;
  let scoreNegativo = 0;

  // Conta palavras positivas
  palavrasPositivas.forEach(palavra => {
    const regex = new RegExp(palavra, 'gi');
    const matches = textoLowerCase.match(regex);
    if (matches) {
      scorePositivo += matches.length;
    }
  });

  // Conta palavras negativas
  palavrasNegativas.forEach(palavra => {
    const regex = new RegExp(palavra, 'gi');
    const matches = textoLowerCase.match(regex);
    if (matches) {
      scoreNegativo += matches.length;
    }
  });

  // Calcula score final
  const scoreTotal = scorePositivo - scoreNegativo;
  const isPositive = scoreTotal > 0;
  const score = Math.abs(scoreTotal) / (scorePositivo + scoreNegativo + 1); // Normaliza o score

  addDebugInfo(`Análise de texto: Palavras positivas: ${scorePositivo}, Palavras negativas: ${scoreNegativo}, Score final: ${scoreTotal}`);

  return {
    isPositive,
    score: score
  };
};

const fetchNews = async () => {
  loading.value = true;
  error.value = null;
  debugInfo.value = [];
  
  try {
    addDebugInfo("Iniciando busca de notícias");
    
    const response = await fetch(
      "http://servicodados.ibge.gov.br/api/v3/noticias/?qtd=10"
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar notícias do IBGE');
    }

    const data = await response.json();
    const newsItems = data.items;

    addDebugInfo(`Encontradas ${newsItems.length} notícias no total`);

    const processedNews = [];

    for (const item of newsItems) {
      const textoCompleto = `${item.titulo}. ${item.introducao}`;
      const sentiment = analyzeSentiment(textoCompleto);
      
      addDebugInfo(`Análise da notícia "${item.titulo}": ${sentiment.isPositive ? 'Positiva' : 'Negativa'} (${sentiment.score.toFixed(2)})`);
      
      if (sentiment.isPositive) {
        processedNews.push({
          ...item,
          sentimentScore: sentiment.score
        });
      }
    }

    positiveNews.value = processedNews;
    
    if (processedNews.length === 0) {
      error.value = "Não foi possível encontrar notícias positivas no momento.";
    }

    addDebugInfo(`Processamento finalizado. Encontradas ${processedNews.length} notícias positivas`);
  } catch (err) {
    console.error("Erro:", err);
    error.value = "Ocorreu um erro ao carregar as notícias. Por favor, tente novamente mais tarde.";
    addDebugInfo(`Erro geral: ${err.message}`);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Carrega as notícias quando o componente é montado
onMounted(() => {
  fetchNews();
});
</script>