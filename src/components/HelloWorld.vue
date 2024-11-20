<template>
  <div class="gerador-imagem">
    <h1>Gerador de Imagens IA</h1>

    <input
      v-model="prompt"
      type="text"
      placeholder="Digite a manchete"
    />
    <button @click="gerarImagem">Gerar Imagem</button>

    <div v-if="imagemUrl" class="imagem-container">
      <h2>Imagem Gerada:</h2>
      <img :src="imagemUrl" alt="Imagem gerada pela IA" />
    </div>

    <div v-if="erro" class="erro">{{ erro }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prompt: '',
      imagemUrl: '',
      erro: ''
    };
  },
  methods: {
    async gerarImagem() {
      try {
        const response = await fetch('https://api.deepai.org/api/text2img', {
          method: 'POST',
          headers: {
            'Api-Key': '92a56c32-a3e9-4700-ae53-2e24b56472f6', // Substitua pela sua chave da API
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: this.prompt })
        });

        if (!response.ok) {
          throw new Error('Erro ao gerar a imagem. Verifique a API.');
        }

        const data = await response.json();
        this.imagemUrl = data.output_url;
        this.erro = '';
      } catch (error) {
        this.erro = 'Erro: ' + error.message;
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.gerador-imagem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  width: 80%;
  max-width: 400px;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.imagem-container img {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
}

.erro {
  color: red;
  margin-top: 1rem;
}
</style>
