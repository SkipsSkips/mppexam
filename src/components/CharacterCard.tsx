import { Character } from '@/types/character';

interface CharacterCardProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  const maxStatValue = 100; // Maximum value for percentage calculation

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this character?')) {
      onDelete();
    }
  };

  const getStatColor = (statName: string) => {
    const colors: { [key: string]: string } = {
      Health: 'bg-red-500',
      Mana: 'bg-blue-500',
      Stamina: 'bg-green-500',
      Strength: 'bg-red-600',
      Agility: 'bg-green-600',
      Intelligence: 'bg-blue-600',
      Spirit: 'bg-purple-500',
      Armor: 'bg-gray-500',
      Critical: 'bg-yellow-500',
      Haste: 'bg-orange-500',
      Mastery: 'bg-indigo-500',
      Versatility: 'bg-pink-500'
    };
    return colors[statName] || 'bg-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>

      <h2 className="text-2xl font-wow text-yellow-400 mb-2">{character.name}</h2>
      <p className="text-gray-400 text-sm mb-4">ID: {character.id}</p>

      <div className="space-y-3">
        {Object.entries(character.stats).map(([name, value]) => (
          <div key={name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{name}</span>
              <span className="text-gray-400">{value}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(name)} transition-all duration-300`}
                style={{ width: `${(value / maxStatValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 