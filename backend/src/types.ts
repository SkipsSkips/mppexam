export interface Character {
  id: number;
  name: string;
  stats: {
    [key: string]: number;
  };
} 