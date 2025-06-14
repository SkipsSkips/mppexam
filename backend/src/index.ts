import express, { Request, Response, Router, RequestHandler } from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';
import { Character } from './types';

const app = express();
const router = Router();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for characters
let characters: Character[] = [
  {
    id: 1,
    name: "Thrall",
    stats: {
      Health: 8500,
      Mana: 7200,
      Stamina: 6800,
      Strength: 95,
      Agility: 85,
      Intelligence: 75,
      Spirit: 80,
      Armor: 90
    }
  },
  {
    id: 2,
    name: "Jaina Proudmoore",
    stats: {
      Health: 6200,
      Mana: 9500,
      Stamina: 4500,
      Intelligence: 100,
      Spirit: 90,
      Critical: 85,
      Haste: 80
    }
  }
];

// Character generation configuration
let isGenerating = false;
let generationInterval: NodeJS.Timeout | null = null;

const statTypes = [
  'Health', 'Mana', 'Stamina', 'Strength', 'Agility', 'Intelligence',
  'Spirit', 'Armor', 'Critical', 'Haste', 'Mastery', 'Versatility'
];

const characterClasses = [
  'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Death Knight',
  'Shaman', 'Mage', 'Warlock', 'Monk', 'Druid', 'Demon Hunter'
];

function generateRandomCharacter(id: number): Character {
  const name = faker.person.fullName();
  const characterClass = faker.helpers.arrayElement(characterClasses);
  
  const numStats = faker.number.int({ min: 5, max: 8 });
  const selectedStats = faker.helpers.arrayElements(statTypes, numStats);
  
  const stats = selectedStats.reduce((acc, stat) => {
    const isPrimaryStat = ['Health', 'Mana', 'Stamina'].includes(stat);
    const min = isPrimaryStat ? 5000 : 50;
    const max = isPrimaryStat ? 10000 : 100;
    acc[stat] = faker.number.int({ min, max });
    return acc;
  }, {} as { [key: string]: number });

  return {
    id,
    name: `${name} the ${characterClass}`,
    stats
  };
}

// API Routes
const getCharacters: RequestHandler = (_req, res) => {
  console.log('[GET] /api/characters');
  res.json(characters);
  return;
};

const createCharacter: RequestHandler = (req, res) => {
  console.log('[POST] /api/characters', req.body);
  const newCharacter = req.body as Omit<Character, 'id'>;
  if (!newCharacter.name || !newCharacter.stats) {
    console.log('  -> Missing required fields');
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const id = Math.max(0, ...characters.map(c => c.id)) + 1;
  const characterWithId = { ...newCharacter, id };
  characters.push(characterWithId);
  console.log('  -> Character created:', characterWithId);
  res.status(201).json(characterWithId);
  return;
};

const updateCharacter: RequestHandler = (req, res) => {
  console.log('[PUT] /api/characters', req.body);
  const updatedCharacter = req.body as Character;
  const index = characters.findIndex(c => c.id === updatedCharacter.id);
  
  if (index === -1) {
    console.log('  -> Character not found:', updatedCharacter.id);
    res.status(404).json({ error: 'Character not found' });
    return;
  }

  characters[index] = updatedCharacter;
  console.log('  -> Character updated:', updatedCharacter);
  res.json(characters[index]);
  return;
};

const deleteCharacter: RequestHandler = (req, res) => {
  const id = parseInt(req.query.id as string);
  console.log('[DELETE] /api/characters', id);
  const index = characters.findIndex(c => c.id === id);
  
  if (index === -1) {
    console.log('  -> Character not found:', id);
    res.status(404).json({ error: 'Character not found' });
    return;
  }

  const deletedCharacter = characters[index];
  characters.splice(index, 1);
  console.log('  -> Character deleted:', deletedCharacter);
  res.json({ success: true, deletedCharacter });
  return;
};

const startGeneration: RequestHandler = (_req, res) => {
  console.log('[POST] /api/generate/start');
  if (isGenerating) {
    console.log('  -> Generation already in progress');
    res.status(400).json({ error: 'Generation already in progress' });
    return;
  }

  isGenerating = true;
  generationInterval = setInterval(() => {
    const shouldRemove = Math.random() < 0.3 && characters.length > 5;

    if (shouldRemove) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const removed = characters[randomIndex];
      characters.splice(randomIndex, 1);
      console.log('  -> Character removed by generator:', removed);
    } else {
      const newCharacter = generateRandomCharacter(Math.max(0, ...characters.map(c => c.id)) + 1);
      characters.push(newCharacter);
      console.log('  -> Character generated:', newCharacter);
    }
  }, 2000);

  res.json({ success: true, message: 'Generation started' });
  return;
};

const stopGeneration: RequestHandler = (_req, res) => {
  console.log('[POST] /api/generate/stop');
  if (!isGenerating) {
    console.log('  -> No generation in progress');
    res.status(400).json({ error: 'No generation in progress' });
    return;
  }

  if (generationInterval) {
    clearInterval(generationInterval);
    generationInterval = null;
  }
  isGenerating = false;

  console.log('  -> Generation stopped');
  res.json({ success: true, message: 'Generation stopped' });
  return;
};

const getGenerationStatus: RequestHandler = (_req, res) => {
  console.log('[GET] /api/generate/status');
  res.json({ isGenerating });
  return;
};

// Mount routes
router.get('/characters', getCharacters);
router.post('/characters', createCharacter);
router.put('/characters', updateCharacter);
router.delete('/characters', deleteCharacter);
router.post('/generate/start', startGeneration);
router.post('/generate/stop', stopGeneration);
router.get('/generate/status', getGenerationStatus);

// Mount the router
app.use('/api', router);

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
}); 