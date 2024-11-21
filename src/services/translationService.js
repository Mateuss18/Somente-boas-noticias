import axios from 'axios';

const TRANSLATION_API_URL = 'https://lingva.ml/api/v1';

export const translateText = async (text) => {
  try {
    const response = await axios.get(`${TRANSLATION_API_URL}/en/pt/${encodeURIComponent(text)}`);
    return response.data.translation;
  } catch (error) {
    console.error('Erro ao traduzir:', error.response?.data || error.message);
    return text;
  }
};
