'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/types/character';
import CharacterCard from '@/components/CharacterCard';
import CharacterForm from '@/components/CharacterForm';
import CharacterStats from '@/components/CharacterStats';
import { generateRandomCharacters } from '@/utils/characterGenerator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://mppexam.onrender.com/api';

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInterval, setGenerationInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch characters on component mount
  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE}/characters`);
      if (!response.ok) throw new Error('Failed to fetch characters');
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
      alert('Failed to load characters');
    }
  };

  const handleCreateCharacter = async (character: Omit<Character, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create character');
      }

      const newCharacter = await response.json();
      setCharacters(prev => [...prev, newCharacter]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating character:', error);
      alert(error instanceof Error ? error.message : 'Failed to create character');
    }
  };

  const handleUpdateCharacter = async (character: Character) => {
    try {
      const response = await fetch(`${API_BASE}/characters`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update character');
      }

      const updatedCharacter = await response.json();
      setCharacters(prev => prev.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
      setSelectedCharacter(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating character:', error);
      alert(error instanceof Error ? error.message : 'Failed to update character');
    }
  };

  const handleDeleteCharacter = async (id: number) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      const response = await fetch(`${API_BASE}/characters?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete character');
      }

      setCharacters(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting character:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete character');
    }
  };

  const handleGenerateCharacters = useCallback(async () => {
    if (isGenerating) {
      // Stop generation
      if (generationInterval) {
        clearInterval(generationInterval);
        setGenerationInterval(null);
      }
      setIsGenerating(false);
      return;
    }

    // Start generation
    setIsGenerating(true);
    const interval = setInterval(async () => {
      // Randomly decide whether to add or remove a character
      const shouldRemove = Math.random() < 0.3 && characters.length > 5; // 30% chance to remove if we have more than 5 characters

      if (shouldRemove) {
        // Remove a random character
        const randomIndex = Math.floor(Math.random() * characters.length);
        const characterToRemove = characters[randomIndex];
        try {
          const response = await fetch(`${API_BASE}/characters?id=${characterToRemove.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to remove character');
          }

          setCharacters(prev => prev.filter(c => c.id !== characterToRemove.id));
        } catch (error) {
          console.error('Error removing character:', error);
        }
      } else {
        // Add a new character
        const newCharacters = generateRandomCharacters(1, Math.max(0, ...characters.map(c => c.id)) + 1);
        try {
          const response = await fetch(`${API_BASE}/characters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCharacters[0]),
          });

          if (!response.ok) {
            throw new Error('Failed to generate character');
          }

          const createdCharacter = await response.json();
          setCharacters(prev => [...prev, createdCharacter]);
        } catch (error) {
          console.error('Error generating character:', error);
        }
      }
    }, 2000); // Generate or remove a character every 2 seconds

    setGenerationInterval(interval);
  }, [isGenerating, characters, generationInterval]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 font-wow">WoW Character Manager</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedCharacter(null);
                setIsFormOpen(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Create Character
            </button>
            <button
              onClick={handleGenerateCharacters}
              className={`${
                isGenerating
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105`}
            >
              {isGenerating ? 'Stop Generation' : 'Generate Characters'}
            </button>
          </div>
        </div>

        <CharacterStats characters={characters} />

        {isFormOpen && (
          <div className="mb-8">
            <CharacterForm
              character={selectedCharacter}
              onSubmit={(character) => {
                if ('id' in character) {
                  void handleUpdateCharacter(character as Character);
                } else {
                  void handleCreateCharacter(character as Omit<Character, 'id'>);
                }
              }}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedCharacter(null);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={() => {
                setSelectedCharacter(character);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDeleteCharacter(character.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
