// src/hooks/levelSystem.ts

export type LevelTier = {
  tier: string;
  color: string;
  bgColor: string;
  icon: string;
};

// Calculate total XP required for a given level
export const calculateXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return 25 * (level - 1) * level;
};

// Calculate level based on current XP
export const calculateLevelFromXP = (xp: number): number => {
  if (xp < 0) return 1;
  return Math.floor((1 + Math.sqrt(1 + 4 * (xp / 25))) / 2);
};

// XP needed for the next level
export const calculateXPForNextLevel = (level: number): number => {
  return calculateXPForLevel(level + 1);
};

// Get detailed level progress info
export const getLevelProgress = (currentXP: number) => {
  const currentLevel = calculateLevelFromXP(currentXP);
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForNextLevel(currentLevel);
  
  const progressToNext = Math.max(0, currentXP - currentLevelXP);
  const totalXpForLevel = nextLevelXP - currentLevelXP;

  const progressPercentage = totalXpForLevel > 0 
    ? Math.min(100, (progressToNext / totalXpForLevel) * 100)
    : 100;

  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    progressToNext,
    progressPercentage,
  };
};

// Get level tier based on current level
export const getLevelTier = (level: number): LevelTier => {
  if (level >= 50) return { tier: 'Master', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '👑' };
  if (level >= 40) return { tier: 'Expert', color: 'text-red-600', bgColor: 'bg-red-100', icon: '🔥' };
  if (level >= 30) return { tier: 'Advanced', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '⭐' };
  if (level >= 20) return { tier: 'Proficient', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '💎' };
  if (level >= 10) return { tier: 'Intermediate', color: 'text-green-600', bgColor: 'bg-green-100', icon: '🚀' };
  if (level >= 5) return { tier: 'Novice', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🌟' };
  return { tier: 'Beginner', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🌱' };
};

// Add XP to current XP and calculate new level
export const addXP = (currentXP: number, xpToAdd: number) => {
  const newXP = Math.max(0, currentXP + xpToAdd);
  const oldLevel = calculateLevelFromXP(currentXP);
  const newLevel = calculateLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  return {
    newXP,
    newLevel,
    leveledUp,
    progress: getLevelProgress(newXP),
    tier: getLevelTier(newLevel),
  };
};
