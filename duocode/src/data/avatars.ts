export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlocked: boolean;
}

// Exponential pricing: each avatar is double the price of the previous one
export const avatars: Avatar[] = [
  {
    id: 'default',
    name: 'Default Avatar',
    emoji: '👤', // No trailing semicolon
    price: 0,
    description: 'Your starting avatar',
    rarity: 'Common',
    unlocked: true,
  },
  {
    id: 'coder',
    name: 'The Coder',
    emoji: '👨‍💻', // No trailing semicolon
    price: 10, // Starting price
    description: 'For the dedicated programmer',
    rarity: 'Common',
    unlocked: false,
  },
  {
    id: 'scientist',
    name: 'Data Scientist',
    emoji: '👩‍🔬', // No trailing semicolon
    price: 20, // 2x previous
    description: 'Master of algorithms and data',
    rarity: 'Common',
    unlocked: false,
  },
  {
    id: 'wizard',
    name: 'Code Wizard',
    emoji: '🧙‍♂️', // No trailing semicolon
    price: 40, // 2x previous
    description: 'Magical coding abilities',
    rarity: 'Rare',
    unlocked: false,
  },
  {
    id: 'ninja',
    name: 'Code Ninja',
    emoji: '🥷', // No trailing semicolon
    price: 80, // 2x previous
    description: 'Silent but deadly with code',
    rarity: 'Rare',
    unlocked: false,
  },
  {
    id: 'robot',
    name: 'Cyber Bot',
    emoji: '🤖', // No trailing semicolon
    price: 160, // 2x previous
    description: 'AI-powered coding machine',
    rarity: 'Rare',
    unlocked: false,
  },
  {
    id: 'alien',
    name: 'Code Alien',
    emoji: '👽', // No trailing semicolon
    price: 320, // 2x previous
    description: 'Out-of-this-world programming',
    rarity: 'Epic',
    unlocked: false,
  },
  {
    id: 'superhero',
    name: 'Code Hero',
    emoji: '🦸‍♂️', // No trailing semicolon
    price: 640, // 2x previous
    description: 'Saving the world with code',
    rarity: 'Epic',
    unlocked: false,
  },
  {
    id: 'dragon',
    name: 'Code Dragon',
    emoji: '🐉', // No trailing semicolon
    price: 1280, // 2x previous
    description: 'Legendary programming beast',
    rarity: 'Epic',
    unlocked: false,
  },
  {
    id: 'crown',
    name: 'Code Royalty',
    emoji: '👑', // No trailing semicolon
    price: 2560, // 2x previous
    description: 'Rule the coding kingdom',
    rarity: 'Legendary',
    unlocked: false,
  },
  {
    id: 'master',
    name: 'Grand Master',
    emoji: '🏆', // No trailing semicolon
    price: 5120, // 2x previous
    description: 'The ultimate coding achievement',
    rarity: 'Legendary',
    unlocked: false,
  },
];

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'text-gray-600 bg-gray-100';
    case 'Rare': return 'text-blue-600 bg-blue-100';
    case 'Epic': return 'text-purple-600 bg-purple-100';
    case 'Legendary': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
