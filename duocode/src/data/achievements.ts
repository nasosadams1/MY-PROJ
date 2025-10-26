import { allLessons, getLessonsByLanguage } from './lessons'; // Import allLessons and getLessonsByLanguage
import { Lesson } from './lessons'; // Import Lesson interface from lessons.ts

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'practice' | 'social' | 'special';
  requirement: {
    type: 'lessons_completed' | 'xp_earned' | 'streak_days' | 'languages_tried' | 'projects_completed' | 'level_reached';
    value: number;
    language?: string;
  };
  reward: {
    xp: number;
  };
}

export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1 },
    reward: { xp: 10 }
  },
  
  // Python Achievements
  {
    id: 'python_beginner',
    name: 'Python Padawan',
    description: 'Complete 5 Python lessons',
    icon: '🐍',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 5, language: 'python' },
    reward: { xp: 50 }
  },
  {
    id: 'python_intermediate',
    name: 'Python Warrior',
    description: 'Complete 15 Python lessons',
    icon: '🐍',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 15, language: 'python' },
    reward: { xp: 100 }
  },
  {
    id: 'python_advanced',
    name: 'Python Expert',
    description: 'Complete 30 Python lessons',
    icon: '🐍',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 30, language: 'python' },
    reward: { xp: 250 }
  },
  {
    id: 'python_master',
    name: 'Python Master',
    description: 'Complete all 50 Python lessons',
    icon: '🐍',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 50, language: 'python' },
    reward: { xp: 500 }
  },

  // JavaScript Achievements
  {
    id: 'javascript_beginner',
    name: 'JS Apprentice',
    description: 'Complete 5 JavaScript lessons',
    icon: '🟨',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 5, language: 'javascript' },
    reward: { xp: 50 }
  },
  {
    id: 'javascript_intermediate',
    name: 'JS Developer',
    description: 'Complete 15 JavaScript lessons',
    icon: '🟨',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 15, language: 'javascript' },
    reward: { xp: 100 }
  },
  {
    id: 'javascript_advanced',
    name: 'JS Expert',
    description: 'Complete 30 JavaScript lessons',
    icon: '🟨',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 30, language: 'javascript' },
    reward: { xp: 250 }
  },
  {
    id: 'javascript_master',
    name: 'JavaScript Master',
    description: 'Complete all 50 JavaScript lessons',
    icon: '🟨',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 50, language: 'javascript' },
    reward: { xp: 500 }
  },

  // C++ Achievements
  {
    id: 'cpp_beginner',
    name: 'C++ Novice',
    description: 'Complete 5 C++ lessons',
    icon: '⚡',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 5, language: 'cpp' },
    reward: { xp: 50 }
  },
  {
    id: 'cpp_intermediate',
    name: 'C++ Programmer',
    description: 'Complete 15 C++ lessons',
    icon: '⚡',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 15, language: 'cpp' },
    reward: { xp: 100 }
  },
  {
    id: 'cpp_advanced',
    name: 'C++ Expert',
    description: 'Complete 30 C++ lessons',
    icon: '⚡',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 30, language: 'cpp' },
    reward: { xp: 250 }
  },
  {
    id: 'cpp_master',
    name: 'C++ Master',
    description: 'Complete all 50 C++ lessons',
    icon: '⚡',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 50, language: 'cpp' },
    reward: { xp: 500 }
  },

  // Java Achievements
  {
    id: 'java_beginner',
    name: 'Java Apprentice',
    description: 'Complete 5 Java lessons',
    icon: '☕',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 5, language: 'java' },
    reward: { xp: 50 }
  },
  {
    id: 'java_intermediate',
    name: 'Java Developer',
    description: 'Complete 15 Java lessons',
    icon: '☕',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 15, language: 'java' },
    reward: { xp: 100 }
  },
  {
    id: 'java_advanced',
    name: 'Java Expert',
    description: 'Complete 30 Java lessons',
    icon: '☕',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 30, language: 'java' },
    reward: { xp: 250 }
  },
  {
    id: 'java_master',
    name: 'Java Master',
    description: 'Complete all 50 Java lessons',
    icon: '☕',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 50, language: 'java' },
    reward: { xp: 500 }
  },

  // Multi-Language Achievements
  {
    id: 'polyglot_beginner',
    name: 'Code Explorer',
    description: 'Try 2 different programming languages',
    icon: '🌟',
    category: 'learning',
    requirement: { type: 'languages_tried', value: 2 },
    reward: { xp: 75 }
  },
  {
    id: 'polyglot_intermediate',
    name: 'Code Polyglot',
    description: 'Try 3 different programming languages',
    icon: '🌟',
    category: 'learning',
    requirement: { type: 'languages_tried', value: 3 },
    reward: { xp: 150 }
  },
  {
    id: 'polyglot_master',
    name: 'Language Master',
    description: 'Try all 4 programming languages',
    icon: '🌟',
    category: 'learning',
    requirement: { type: 'languages_tried', value: 4 },
    reward: { xp: 300 }
  },

  // Cross-Language Mastery
  {
    id: 'dual_language_master',
    name: 'Dual Master',
    description: 'Master 2 programming languages (50 lessons each)',
    icon: '🏆',
    category: 'special',
    requirement: { type: 'lessons_completed', value: 100 },
    reward: { xp: 750 }
  },
  {
    id: 'triple_language_master',
    name: 'Triple Threat',
    description: 'Master 3 programming languages (50 lessons each)',
    icon: '🏆',
    category: 'special',
    requirement: { type: 'lessons_completed', value: 150 },
    reward: { xp: 1000 }
  },
  {
    id: 'quad_language_master',
    name: 'Ultimate Polyglot',
    description: 'Master all 4 programming languages (50 lessons each)',
    icon: '👑',
    category: 'special',
    requirement: { type: 'lessons_completed', value: 200 },
    reward: { xp: 1500 }
  },

  // Practice Achievements
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day coding streak',
    icon: '🔥',
    category: 'practice',
    requirement: { type: 'streak_days', value: 3 },
    reward: { xp: 50 }
  },
  {
    id: 'streak_keeper',
    name: 'Streak Keeper',
    description: 'Maintain a 7-day coding streak',
    icon: '🔥',
    category: 'practice',
    requirement: { type: 'streak_days', value: 7 },
    reward: { xp: 150 }
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Maintain a 30-day coding streak',
    icon: '🔥',
    category: 'practice',
    requirement: { type: 'streak_days', value: 30 },
    reward: { xp: 500 }
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Getting Started',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'special',
    requirement: { type: 'level_reached', value: 5 },
    reward: { xp: 50 }
  },
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'special',
    requirement: { type: 'level_reached', value: 10 },
    reward: { xp: 200 }
  },
  {
    id: 'level_25',
    name: 'Code Veteran',
    description: 'Reach level 25',
    icon: '🎖️',
    category: 'special',
    requirement: { type: 'level_reached', value: 25 },
    reward: { xp: 500 }
  },
  {
    id: 'level_50',
    name: 'Code Legend',
    description: 'Reach level 50',
    icon: '👑',
    category: 'special',
    requirement: { type: 'level_reached', value: 50 },
    reward: { xp: 1000 }
  },

  // XP Achievements
  {
    id: 'xp_500',
    name: 'XP Starter',
    description: 'Earn 500 total XP',
    icon: '💎',
    category: 'special',
    requirement: { type: 'xp_earned', value: 500 },
    reward: { xp: 50 }
  },
  {
    id: 'xp_1000',
    name: 'XP Collector',
    description: 'Earn 1000 total XP',
    icon: '💎',
    category: 'special',
    requirement: { type: 'xp_earned', value: 1000 },
    reward: { xp: 100 }
  },
  {
    id: 'xp_5000',
    name: 'XP Hoarder',
    description: 'Earn 5000 total XP',
    icon: '💎',
    category: 'special',
    requirement: { type: 'xp_earned', value: 5000 },
    reward: { xp: 250 }
  },
];

export const checkAchievements = (user: {
  unlockedAchievements?: string[];
  level: number;
  xp: number;
  currentStreak: number;
  completedLessons: string[];
  projects?: number;
}, completedLessons: string[]): Achievement[] => {
  const newAchievements: Achievement[] = [];
  
  const userUnlockedAchievements = user.unlockedAchievements || [];

  // Filter completed lessons to only include those that exist in our allLessons data
  // Explicitly assert `lesson` as `Lesson` type after the find operation
  const validCompletedLessonObjects = completedLessons
    .map(lessonId => allLessons.find(lesson => lesson.id === lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson)); // Type guard to ensure 'lesson' is 'Lesson'

  // Count completed lessons per language based on valid lesson objects
  // Now 'lesson' is guaranteed to be of type 'Lesson' here
  const pythonCompletedCount = validCompletedLessonObjects.filter(lesson => lesson.language === 'python').length;
  const javascriptCompletedCount = validCompletedLessonObjects.filter(lesson => lesson.language === 'javascript').length;
  const cppCompletedCount = validCompletedLessonObjects.filter(lesson => lesson.language === 'cpp').length;
  const javaCompletedCount = validCompletedLessonObjects.filter(lesson => lesson.language === 'java').length;

  // Get total lessons available for each language from the lessons data
  const totalPythonLessons = getLessonsByLanguage('python').length;
  const totalJavascriptLessons = getLessonsByLanguage('javascript').length;
  const totalCppLessons = getLessonsByLanguage('cpp').length;
  const totalJavaLessons = getLessonsByLanguage('java').length;
  
  // Count unique languages the user has started lessons in (at least one lesson completed)
  const languagesTried = new Set<string>();
  if (pythonCompletedCount > 0) languagesTried.add('python');
  if (javascriptCompletedCount > 0) languagesTried.add('javascript');
  if (cppCompletedCount > 0) languagesTried.add('cpp');
  if (javaCompletedCount > 0) languagesTried.add('java');
  
  // Identify mastered languages (completed ALL available lessons for that language)
  const masteredLanguages: string[] = [];
  if (pythonCompletedCount === totalPythonLessons && totalPythonLessons > 0) masteredLanguages.push('python');
  if (javascriptCompletedCount === totalJavascriptLessons && totalJavascriptLessons > 0) masteredLanguages.push('javascript');
  if (cppCompletedCount === totalCppLessons && totalCppLessons > 0) masteredLanguages.push('cpp');
  if (javaCompletedCount === totalJavaLessons && totalJavaLessons > 0) masteredLanguages.push('java');
  
  achievements.forEach(achievement => {
    // Skip if achievement is already unlocked
    if (userUnlockedAchievements.includes(achievement.id)) {
      return;
    }
    
    let isUnlocked = false;
    
    // Evaluate achievement requirements
    switch (achievement.requirement.type) {
      case 'lessons_completed':
        if (achievement.requirement.language) {
          // Check language-specific lesson completion based on actual counts
          const language = achievement.requirement.language;
          let currentLanguageLessonsCount = 0;
          switch(language) {
            case 'python': currentLanguageLessonsCount = pythonCompletedCount; break;
            case 'javascript': currentLanguageLessonsCount = javascriptCompletedCount; break;
            case 'cpp': currentLanguageLessonsCount = cppCompletedCount; break;
            case 'java': currentLanguageLessonsCount = javaCompletedCount; break;
            default: break; // Should not happen if language is strictly typed
          }
          isUnlocked = currentLanguageLessonsCount >= achievement.requirement.value;
        } else {
          // Handle multi-language mastery achievements specifically
          if (achievement.id === 'dual_language_master') {
            isUnlocked = masteredLanguages.length >= 2;
          } else if (achievement.id === 'triple_language_master') {
            isUnlocked = masteredLanguages.length >= 3;
          } else if (achievement.id === 'quad_language_master') {
            isUnlocked = masteredLanguages.length >= 4;
          } else {
            // For general 'lessons_completed' achievements (e.g., 'first_steps'),
            // check against the total number of completed lessons across all languages.
            isUnlocked = validCompletedLessonObjects.length >= achievement.requirement.value;
          }
        }
        break;
      case 'languages_tried':
        isUnlocked = languagesTried.size >= achievement.requirement.value;
        break;
      case 'level_reached':
        isUnlocked = (user.level || 0) >= achievement.requirement.value;
        break;
      case 'xp_earned':
        isUnlocked = (user.xp || 0) >= achievement.requirement.value;
        break;
      case 'streak_days':
        isUnlocked = (user.currentStreak || 0) >= achievement.requirement.value;
        break;
      case 'projects_completed':
        isUnlocked = (user.projects || 0) >= achievement.requirement.value;
        break;
      default:
        console.warn(`Unhandled achievement requirement type: ${achievement.requirement.type} for achievement ID: ${achievement.id}`);
        break;
    }
    
    if (isUnlocked) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
};
