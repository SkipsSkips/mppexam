import { NextResponse } from 'next/server';
import { characters } from '@/data/characters';
import { Character } from '@/types/character';

// GET all characters
export async function GET() {
  return NextResponse.json(characters);
}

// POST new character
export async function POST(request: Request) {
  const newCharacter: Omit<Character, 'id'> = await request.json();
  
  // Validate required fields
  if (!newCharacter.name || !newCharacter.stats) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Generate new ID (in a real app, this would be handled by a database)
  const id = Math.max(0, ...characters.map(c => c.id)) + 1;
  const characterWithId = { ...newCharacter, id };
  
  characters.push(characterWithId);
  return NextResponse.json(characterWithId, { status: 201 });
}

// PUT update character
export async function PUT(request: Request) {
  const updatedCharacter: Character = await request.json();
  
  const index = characters.findIndex(c => c.id === updatedCharacter.id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Character not found' },
      { status: 404 }
    );
  }

  // Update the character
  characters[index] = updatedCharacter;
  return NextResponse.json(characters[index]);
}

// DELETE character
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');

  const index = characters.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Character not found' },
      { status: 404 }
    );
  }

  // Remove the character
  const deletedCharacter = characters[index];
  characters.splice(index, 1);
  
  return NextResponse.json({ success: true, deletedCharacter });
} 