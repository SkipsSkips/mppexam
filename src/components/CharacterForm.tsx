import { useState, useEffect } from 'react';
import { Character } from '@/types/character';

interface CharacterFormProps {
  character?: Character | null;
  onSubmit: (character: Character | Omit<Character, 'id'>) => void;
  onCancel: () => void;
}

interface Stat {
  name: string;
  value: number;
}

export default function CharacterForm({ character, onSubmit, onCancel }: CharacterFormProps) {
  const [name, setName] = useState('');
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (character) {
      setName(character.name);
      // Convert stats object to array
      setStats(Object.entries(character.stats).map(([name, value]) => ({
        name,
        value
      })));
    } else {
      setName('');
      setStats([{ name: 'Health', value: 100 }]);
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Convert stats array back to object
    const statsObject = stats.reduce((acc, stat) => ({
      ...acc,
      [stat.name.trim()]: Math.max(0, Math.min(100, stat.value))
    }), {} as { [key: string]: number });

    const characterData = {
      ...(character ? { id: character.id } : {}),
      name: name.trim(),
      stats: statsObject
    } as Character | Omit<Character, 'id'>;

    onSubmit(characterData);
  };

  const addStat = () => {
    setStats([...stats, { name: '', value: 100 }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof Stat, value: string | number) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-yellow-500/30">
      <div className="mb-4">
        <label className="block text-yellow-400 mb-2 font-wow">Character Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-yellow-500/30 focus:border-yellow-500 focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-yellow-400 font-wow">Stats</label>
          <button
            type="button"
            onClick={addStat}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
          >
            Add Stat
          </button>
        </div>
        {stats.map((stat, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={stat.name}
              onChange={(e) => updateStat(index, 'name', e.target.value)}
              placeholder="Stat name"
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-yellow-500/30 focus:border-yellow-500 focus:outline-none"
              required
            />
            <input
              type="number"
              value={stat.value}
              onChange={(e) => updateStat(index, 'value', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-24 bg-gray-700 text-white px-4 py-2 rounded border border-yellow-500/30 focus:border-yellow-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => removeStat(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
        >
          {character ? 'Update Character' : 'Create Character'}
        </button>
      </div>
    </form>
  );
} 