import React, { useState, useMemo } from 'react';
import { Trophy, Play, Lock, BookOpen, Code, Database, Globe } from 'lucide-react';
import { useUser } from '../context/UserContext';
import LessonModal from './LessonModal';
import { allLessons, getLessonsByLanguage, getTotalLessonsByLanguage, getCompletedLessonsByLanguage } from '../data/lessons';

type Language = 'python' | 'javascript' | 'cpp' | 'java';

interface LearnProps {
  setCurrentSection?: (section: string) => void; // Add this prop to handle navigation
}

const Learn: React.FC<LearnProps> = ({ setCurrentSection }) => {
  const { user, isUnlimitedHeartsActive } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [filter, setFilter] = useState('All Lessons');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const languages = [
    { id: 'python' as Language, name: 'Python', icon: Code, color: 'from-blue-400 to-green-500', description: '50 comprehensive Python lessons' },
    { id: 'javascript' as Language, name: 'Javascript', icon: Database, color: 'from-purple-400 to-blue-500', description: '50 database and SQL lessons' },
    { id: 'cpp' as Language, name: 'C++', icon: Globe, color: 'from-orange-400 to-red-500', description: '50 in depth C++ lessons' },
    { id: 'java' as Language, name: 'Java', icon: Globe, color: 'from-orange-400 to-red-500', description: '50 web development lessons' },
  ];

  // Memoize the current lessons to prevent recalculation on every render
  const currentLessons = useMemo(() => {
    return getLessonsByLanguage(selectedLanguage).map(lesson => ({
      ...lesson,
      isLocked: false, // all lessons unlocked
    }));
  }, [selectedLanguage]);

  const filters = ['All Lessons', 'Available', 'Completed', 'Beginner', 'Intermediate', 'Advanced'];

  // FIXED: Updated filtered lessons logic
  const filteredLessons = useMemo(() => {
    return currentLessons.filter(lesson => {
      if (filter === 'All Lessons') return true;
      // FIXED: Available should only show lessons that are NOT completed
      if (filter === 'Available') return !user.completedLessons.includes(lesson.id);
      if (filter === 'Completed') return user.completedLessons.includes(lesson.id);
      // For difficulty filters, ensure exact match
      if (filter === 'Beginner' || filter === 'Intermediate' || filter === 'Advanced') {
        return lesson.difficulty === filter;
      }
      return true;
    });
  }, [currentLessons, filter, user.completedLessons]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Memoize language statistics to prevent recalculation
  const languageStats = useMemo(() => {
    return languages.map(language => {
      const totalLessons = getTotalLessonsByLanguage(language.id);
      const completedCount = getCompletedLessonsByLanguage(language.id, user.completedLessons);
      return {
        ...language,
        totalLessons,
        completedCount,
      };
    });
  }, [user.completedLessons]);

  // UPDATED: Handle redirect to learn page
  const handleRedirectToLearn = () => {
    setSelectedLesson(null);
    if (setCurrentSection) {
      setCurrentSection('learn');
    }
    // Optionally scroll to top or show a message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Learn Programming</h1>
        <p className="text-gray-600">Master coding fundamentals with interactive lessons</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {languageStats.map((language) => {
          const Icon = language.icon;
          
          return (
            <button
              key={language.id}
              onClick={() => setSelectedLanguage(language.id)}
              className={`p-6 rounded-xl text-left transition-all duration-300 ${
                selectedLanguage === language.id
                  ? `bg-gradient-to-r ${language.color} text-white shadow-lg transform scale-105`
                  : 'bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 mb-3 text-center sm:text-left">
                <Icon className={`w-8 h-8 ${selectedLanguage === language.id ? 'text-white' : 'text-gray-600'}`} />
                <div>
                  <h3 className={`text-lg lg:text-xl font-bold ${selectedLanguage === language.id ? 'text-white' : 'text-gray-900'}`}>
                    {language.name}
                  </h3>
                  <p className={`text-sm ${selectedLanguage === language.id ? 'text-white/80' : 'text-gray-600'}`}>
                    {language.description}
                  </p>
                </div>
              </div>
              <div className={`text-sm ${selectedLanguage === language.id ? 'text-white/90' : 'text-gray-500'}`}>
                Progress: {language.completedCount}/{language.totalLessons} lessons completed
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    selectedLanguage === language.id ? 'bg-white/40' : 'bg-gray-300'
                  }`}
                  style={{ width: `${(language.completedCount / language.totalLessons) * 100}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2">
        {filters.map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              filter === filterOption
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-xl lg:text-2xl font-bold mb-1">
            {currentLessons.filter(lesson => user.completedLessons.includes(lesson.id)).length}/{currentLessons.length}
          </div>
          <div className="text-sm lg:text-base text-white/80">{selectedLanguage.toUpperCase()} Lessons Completed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = user.completedLessons.includes(lesson.id);
          // UPDATED: Check if user can start lesson (considering unlimited hearts)
          const canStartLesson = user.hearts > 0 || isUnlimitedHeartsActive();
          
          return (
            <div
              key={`${lesson.id}-${selectedLanguage}`} // More specific key to prevent React reconciliation issues
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                    {lesson.baseXP}+ XP
                  </div>
                </div>

                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{lesson.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span>Est. time: {lesson.baselineTime} min</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {lesson.category}
                  </span>
                  
                  {isCompleted ? (
                    <button className="w-full sm:w-auto px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium cursor-default">
                      Completed
                    </button>
                  ) : lesson.isLocked ? (
                    <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center space-x-1">
                      <Lock className="w-4 h-4" />
                      <span>Locked</span>
                    </button>
                  ) : (
                    // UPDATED: Consider unlimited hearts when checking if user can start lesson
                    !canStartLesson ? (
                      <div className="tooltip">
                        <button
                          disabled
                          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 bg-gray-300 text-gray-600 cursor-not-allowed"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </button>
                        <span className="tooltiptext">You have no hearts left</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onHeartLoss={() => {
            setSelectedLesson(null); // close modal just in case
          }}
          onRedirectToLearn={handleRedirectToLearn} // UPDATED: Pass redirect function
        />
      )}
    </div>
  );
};

export default Learn;
