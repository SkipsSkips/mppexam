import { faker } from '@faker-js/faker';
import { Character } from '@/types/character';

const statTypes = [
  'Health', 'Mana', 'Stamina', 'Strength', 'Agility', 'Intelligence',
  'Spirit', 'Armor', 'Critical', 'Haste', 'Mastery', 'Versatility'
];

const characterClasses = [
  'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Death Knight',
  'Shaman', 'Mage', 'Warlock', 'Monk', 'Druid', 'Demon Hunter'
];

export function generateRandomCharacter(id: number): Character {
  const name = faker.person.fullName();
  const characterClass = faker.helpers.arrayElement(characterClasses);
  
  // Generate 5-8 random stats
  const numStats = faker.number.int({ min: 5, max: 8 });
  const selectedStats = faker.helpers.arrayElements(statTypes, numStats);
  
  const stats = selectedStats.reduce((acc, stat) => {
    // Generate higher values for primary stats
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

export function generateRandomCharacters(count: number, startId: number): Character[] {
  return Array.from({ length: count }, (_, i) => generateRandomCharacter(startId + i));
} 