# RPG Character Manager Backend

This is the backend server for the RPG Character Manager application. It provides a RESTful API for managing RPG characters with dynamic stats.

## Features

- CRUD operations for RPG characters
- Dynamic stat management
- Character generation with random stats
- Real-time character updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

For development with hot reloading:
```bash
npm run dev
```

## API Endpoints

### Characters

- `GET /api/characters` - Get all characters
- `POST /api/characters` - Create a new character
- `PUT /api/characters` - Update an existing character
- `DELETE /api/characters?id=<character_id>` - Delete a character

### Character Generation

- `POST /api/generate/start` - Start generating random characters
- `POST /api/generate/stop` - Stop character generation
- `GET /api/generate/status` - Get generation status

## Character Structure

```typescript
interface Character {
  id: number;
  name: string;
  stats: {
    [key: string]: number;
  };
}
```

## Development

The server is built with:
- Express.js for the web server
- TypeScript for type safety
- Faker.js for generating random character data
- CORS for cross-origin resource sharing

## License

MIT 