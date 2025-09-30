// Lista completa de animais válidos organizados por categoria
const ANIMALS = {
  mammals: [
    'dog', 'cat', 'horse', 'cow', 'pig', 'sheep', 'goat', 'rabbit', 'hamster', 'guinea pig',
    'lion', 'tiger', 'leopard', 'cheetah', 'jaguar', 'puma', 'lynx', 'bobcat', 'ocelot',
    'wolf', 'fox', 'coyote', 'jackal', 'dingo', 'arctic fox', 'red fox', 'fennec fox',
    'bear', 'polar bear', 'brown bear', 'black bear', 'panda', 'grizzly bear',
    'monkey', 'ape', 'gorilla', 'chimpanzee', 'orangutan', 'baboon', 'lemur', 'gibbon',
    'elephant', 'rhino', 'hippo', 'giraffe', 'zebra', 'buffalo', 'antelope', 'gazelle',
    'deer', 'elk', 'moose', 'reindeer', 'caribou', 'kangaroo', 'koala', 'wombat',
    'sloth', 'armadillo', 'anteater', 'pangolin', 'meerkat', 'hyena', 'otter', 'badger',
    'skunk', 'raccoon', 'squirrel', 'chipmunk', 'bat', 'hedgehog', 'llama', 'alpaca'
  ],
  marine: [
    'whale', 'dolphin', 'seal', 'sea lion', 'walrus', 'orca', 'beluga whale', 'blue whale',
    'humpback whale', 'sperm whale', 'narwhal', 'manatee', 'dugong', 'sea otter'
  ],
  fish: [
    'shark', 'great white shark', 'hammerhead shark', 'tiger shark', 'whale shark',
    'fish', 'tuna', 'salmon', 'trout', 'bass', 'cod', 'swordfish', 'marlin',
    'angelfish', 'clownfish', 'pufferfish', 'seahorse', 'ray', 'stingray', 'manta ray'
  ],
  birds: [
    'eagle', 'hawk', 'falcon', 'owl', 'vulture', 'condor', 'osprey',
    'parrot', 'macaw', 'cockatoo', 'parakeet', 'canary', 'finch', 'cardinal',
    'robin', 'sparrow', 'crow', 'raven', 'woodpecker', 'hummingbird',
    'peacock', 'pheasant', 'turkey', 'chicken', 'rooster', 'duck', 'goose', 'swan',
    'pelican', 'crane', 'heron', 'stork', 'flamingo', 'penguin', 'albatross',
    'ostrich', 'emu', 'kiwi'
  ],
  reptiles: [
    'snake', 'python', 'boa', 'cobra', 'viper', 'rattlesnake', 'anaconda',
    'lizard', 'iguana', 'gecko', 'chameleon', 'monitor lizard', 'komodo dragon',
    'turtle', 'tortoise', 'sea turtle', 'crocodile', 'alligator', 'caiman'
  ],
  amphibians: [
    'frog', 'toad', 'tree frog', 'poison dart frog', 'bullfrog', 'salamander', 'newt', 'axolotl'
  ],
  insects: [
    'butterfly', 'moth', 'bee', 'wasp', 'ant', 'beetle', 'ladybug', 'dragonfly',
    'grasshopper', 'cricket', 'praying mantis', 'spider', 'tarantula', 'scorpion'
  ],
  portuguese: [
    'cão', 'gato', 'cavalo', 'vaca', 'porco', 'ovelha', 'cabra', 'coelho',
    'leão', 'tigre', 'leopardo', 'onça', 'raposa', 'lobo', 'urso', 'panda',
    'elefante', 'rinoceronte', 'hipopótamo', 'girafa', 'zebra', 'macaco', 'gorila',
    'baleia', 'golfinho', 'foca', 'tubarão', 'peixe', 'salmão', 'águia', 'coruja',
    'papagaio', 'flamingo', 'pinguim', 'galinha', 'pato', 'cobra', 'lagarto',
    'tartaruga', 'crocodilo', 'jacaré', 'sapo', 'rã', 'borboleta', 'abelha',
    'aranha', 'canguru', 'coala', 'preguiça', 'tatu', 'esquilo', 'morcego'
  ]
};

// Função para verificar se um termo é um animal válido
export const isValidAnimal = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  
  // Converte o objeto em array plano
  const allAnimals = Object.values(ANIMALS).flat();
  
  return allAnimals.some(animal => 
    animal.toLowerCase() === term || 
    animal.toLowerCase().includes(term) || 
    term.includes(animal.toLowerCase())
  );
};

// Lista de exemplos para mostrar ao usuário
export const ANIMAL_EXAMPLES = [
  'cão', 'gato', 'leão', 'elefante', 'tigre', 'urso', 'lobo', 'raposa',
  'dog', 'cat', 'lion', 'elephant', 'tiger', 'bear', 'wolf', 'fox'
];