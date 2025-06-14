import { Character } from '@/types/character';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CharacterStatsProps {
  characters: Character[];
}

export default function CharacterStats({ characters }: CharacterStatsProps) {
  // Calculate average stats across all characters
  const averageStats = characters.reduce((acc, character) => {
    Object.entries(character.stats).forEach(([stat, value]) => {
      if (!acc[stat]) {
        acc[stat] = { total: 0, count: 0 };
      }
      acc[stat].total += value;
      acc[stat].count += 1;
    });
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const chartData = Object.entries(averageStats).map(([stat, { total, count }]) => ({
    name: stat,
    value: Math.round(total / count)
  }));

  // Calculate character count by stat range
  const statRanges = characters.reduce((acc, character) => {
    const totalStats = Object.values(character.stats).reduce((sum, val) => sum + val, 0);
    const range = Math.floor(totalStats / 1000) * 1000;
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const rangeData = Object.entries(statRanges).map(([range, count]) => ({
    name: `${range}-${parseInt(range) + 999}`,
    value: count
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500/30">
        <h3 className="text-xl font-wow text-yellow-400 mb-4">Average Stats</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #f59e0b',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500/30">
        <h3 className="text-xl font-wow text-yellow-400 mb-4">Character Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #f59e0b',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 