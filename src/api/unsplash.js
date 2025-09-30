import axios from 'axios';

const UNSPLASH_API_KEY = '5BEMpeSK7I0NIy0vX6dOjlDSe7URJ-Dds-HwTEQ-_qI';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

export const searchRandomAnimalPhoto = async (animalName) => {
  try {
    // Tenta primeiro uma busca específica do animal
    let searchQuery = animalName;
    
    // Se for português, traduz para inglês para melhores resultados
    const translations = {
      'cão': 'dog',
      'gato': 'cat', 
      'leão': 'lion',
      'tigre': 'tiger',
      'urso': 'bear',
      'lobo': 'wolf',
      'raposa': 'fox',
      'coelho': 'rabbit',
      'cavalo': 'horse',
      'vaca': 'cow',
      'porco': 'pig',
      'ovelha': 'sheep',
      'cabra': 'goat',
      'galinha': 'chicken',
      'pato': 'duck',
      'peixe': 'fish',
      'tubarão': 'shark',
      'baleia': 'whale',
      'golfinho': 'dolphin',
      'elefante': 'elephant',
      'girafa': 'giraffe',
      'zebra': 'zebra',
      'macaco': 'monkey',
      'gorila': 'gorilla'
    };
    
    if (translations[animalName.toLowerCase()]) {
      searchQuery = translations[animalName.toLowerCase()];
    }
    
    // Estratégias para aumentar aleatoriedade
    const randomStrategies = [
      `${searchQuery} animal`,
      `${searchQuery} wildlife`,
      `${searchQuery} nature`,
      `${searchQuery} wild animal`,
      `${searchQuery} cute animal`,
      `${searchQuery} animal photography`
    ];
    
    // Escolhe uma estratégia aleatória
    const randomStrategy = randomStrategies[Math.floor(Math.random() * randomStrategies.length)];
    
    // Adiciona timestamp para garantir aleatoriedade total
    const randomSeed = Date.now().toString();
    
    // Faz múltiplas tentativas para encontrar uma imagem mais relevante
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await axios.get(`${UNSPLASH_BASE_URL}/photos/random`, {
        params: {
          query: randomStrategy,
          client_id: UNSPLASH_API_KEY,
          orientation: 'squarish',
          count: 1,
          // Adiciona parâmetros para forçar aleatoriedade
          seed: randomSeed + attempt,
          per_page: 1
        }
      });
      
      if (response.data && response.data.length > 0) {
        const photo = response.data[0];
        const altDescription = photo.alt_description?.toLowerCase() || '';
        
        // Verifica se a descrição da imagem contém o animal pesquisado
        if (altDescription.includes(searchQuery.toLowerCase()) || attempt === maxAttempts) {
          return {
            url: photo.urls.regular,
            alt: photo.alt_description || animalName,
            photographer: photo.user.name,
            // Adiciona ID único para evitar cache
            id: photo.id,
            timestamp: Date.now()
          };
        }
      }
    }
    
    throw new Error('Nenhuma imagem relevante encontrada');
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    throw error;
  }
};