// In Profile.tsx, add display name refresh functionality
import React, { useState, useEffect } from 'react';
import { getLevelProgress, getLevelTier } from '../hooks/levelSystem';
import {
  User,
  Settings,
  Trophy,
  Calendar,
  Target,
  BookOpen,
  Code,
  Award,
  Heart,
  ShoppingCart,
  Star,
  Crown,
  Zap,
  Lock,
  CheckCircle,
  RefreshCw, // NEW: Import refresh icon
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { avatars, getRarityColor } from '../data/avatars';
import { achievements } from '../data/achievements';
import { getTotalLessonsByLanguage, getCompletedLessonsByLanguage } from '../data/lessons';

const Profile: React.FC = () => {
  // Destructure refreshDisplayName from useUser
  const { 
    user, 
    updateUser, 
    buyHearts, 
    buyAvatar, 
    setAvatar, 
    getLanguageProgress, 
    unlockAchievement, 
    checkAndUnlockAchievements,
    isAuthenticated,
    getActiveBoosts,
    refreshDisplayName // NEW: Get refresh display name function
  } = useUser();
  
  const { updateProfile: updateAuthProfile, refetchProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [showStore, setShowStore] = useState(false);
  const [showAvatarStore, setShowAvatarStore] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements' | 'activity'>('overview');
  const [isRefreshingName, setIsRefreshingName] = useState(false); // NEW: Loading state for name refresh

  // Update current time every second for boost timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user?.name]);

  // NEW: Handle display name refresh
  const handleRefreshDisplayName = async () => {
    if (!user || user.id === 'guest') return;
    
    setIsRefreshingName(true);
    try {
      await refreshDisplayName();
      console.log('✅ Display name refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh display name:', error);
    } finally {
      setIsRefreshingName(false);
    }
  };

  // UPDATED: Manual sync function with name sync capability
  const handleManualSync = async () => {
    if (user && user.id !== 'guest') {
      console.log('Manual sync triggered from Profile.tsx');
      // Trigger AuthContext's updateProfile with current user data to force a sync
      await updateAuthProfile({
        xp: user.xp,
        level: user.level,
        total_lessons_completed: user.totalLessonsCompleted,
        unlocked_achievements: user.unlockedAchievements,
        current_streak: user.currentStreak,
        current_avatar: user.currentAvatar,
        name: user.name, // This preserves the display name
        coins: user.coins,
        total_coins_earned: user.totalCoinsEarned,
        hearts: user.hearts,
        last_heart_reset: user.lastHeartReset,
        owned_avatars: user.ownedAvatars,
      });
    }
  };

  // UPDATED: Handle name changes with 16 character limit
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow up to 16 characters
    if (value.length <= 16) {
      setEditName(value);
    }
  };

  // UPDATED: Save profile with validation and leaderboard sync (NO ALERT)
  const handleSaveProfile = async () => {
    if (!user) return;
    
    // Trim the name and limit to 16 characters
    const trimmedName = editName.trim();
    if (trimmedName.length === 0) {
      return;
    }
    if (trimmedName.length > 16) {
      return;
    }
    
    try {
      // Step 1: Update the user context first
      // This will also trigger AuthContext's updateProfile internally via UserContext's processTransactionQueue
      await updateUser({ name: trimmedName });
      
      // Step 2: CRITICAL FIX: Explicitly refetch the profile from the database
      // This ensures AuthContext's `profile` state is definitively up-to-date.
      // More importantly, `fetchProfile` (which `refetchProfile` calls)
      // will call `syncProfileToLeaderboard` with this absolutely fresh data.
      if (user.id !== 'guest') { // Only refetch if authenticated
        console.log('🔄 Profile name changed, forcing AuthContext profile refetch and leaderboard sync...');
        await refetchProfile(); 
        console.log('✅ Profile name updated and leaderboard sync re-triggered.');
      } else {
        console.log('Guest user, skipping leaderboard sync for name change.');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
    }
  };

  const handleBuyHearts = async (amount: number) => {
    if (!user) return;
    try {
      const success = await buyHearts(amount);
      if (success) {
        alert(`Successfully bought ${amount} heart${amount > 1 ? 's' : ''}!`);
      } else {
        alert('Not enough coins or hearts are already full!');
      }
    } catch (error) {
      console.error('Failed to buy hearts:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleBuyAvatar = async (avatarId: string) => {
    if (!user) return;
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar) return;

    try {
      const success = await buyAvatar(avatarId);
      if (success) {
        alert(`Avatar "${avatar.name}" purchased successfully!`);
        // Check for achievements after purchase
        setTimeout(() => checkAndUnlockAchievements(), 500);
      } else {
        if (user.ownedAvatars.includes(avatarId)) {
          alert('You already own this avatar!');
        } else {
          alert(`Not enough coins! You need ${avatar.price} coins but only have ${user.coins}.`);
        }
      }
    } catch (error) {
      console.error('Failed to buy avatar:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleSetAvatar = (avatarId: string) => {
    setAvatar(avatarId); // This will trigger UserContext.updateUser
  };

  // Manual achievement checking (for testing)
  const handleCheckAchievements = () => {
    if (isAuthenticated()) {
      checkAndUnlockAchievements();
    } else {
      alert('Sign in to unlock achievements!');
    }
  };

  if (!user) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CodeLingo</h1>
            <p className="text-gray-600">Sign up or sign in to track your progress, earn coins, and unlock achievements.</p>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            You can continue to browse, but progress won't be saved until you sign in.
          </p>
        </div>
      </div>
    );
  }

  const currentAvatar = avatars.find((a) => a.id === user.currentAvatar) || avatars[0];
  
  // Calculate dynamic stats for all 4 languages using robust methods
  const pythonProgress = React.useMemo(() => {
    const total = getTotalLessonsByLanguage('python');
    const completed = getCompletedLessonsByLanguage('python', user.completedLessons);
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [user.completedLessons]);

  const javascriptProgress = React.useMemo(() => {
    const total = getTotalLessonsByLanguage('javascript');
    const completed = getCompletedLessonsByLanguage('javascript', user.completedLessons);
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [user.completedLessons]);

  const cppProgress = React.useMemo(() => {
    const total = getTotalLessonsByLanguage('cpp');
    const completed = getCompletedLessonsByLanguage('cpp', user.completedLessons);
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [user.completedLessons]);

  const javaProgress = React.useMemo(() => {
    const total = getTotalLessonsByLanguage('java');
    const completed = getCompletedLessonsByLanguage('java', user.completedLessons);
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [user.completedLessons]);

  // Calculate overall progress across all languages
  const overallProgress = React.useMemo(() => {
    const totalLessonsAcrossLanguages = pythonProgress.total + javascriptProgress.total + cppProgress.total + javaProgress.total;
    const completedLessonsAcrossLanguages = pythonProgress.completed + javascriptProgress.completed + cppProgress.completed + javaProgress.completed;
    
    if (totalLessonsAcrossLanguages === 0) return 0;
    return Math.round((completedLessonsAcrossLanguages / totalLessonsAcrossLanguages) * 100);
  }, [pythonProgress, javascriptProgress, cppProgress, javaProgress]);

  // Verify that our calculated total matches the user's stored total
  const calculatedTotalCompleted = React.useMemo(() => {
    return pythonProgress.completed + javascriptProgress.completed + cppProgress.completed + javaProgress.completed;
  }, [pythonProgress, javascriptProgress, cppProgress, javaProgress]);

  // Debug information (can be removed in production)
  React.useEffect(() => {
    console.log('📊 Profile Progress Debug:', {
      userStoredTotal: user.totalLessonsCompleted,
      calculatedTotal: calculatedTotalCompleted,
      completedLessonsArray: user.completedLessons.length,
      match: user.totalLessonsCompleted === calculatedTotalCompleted,
      breakdown: {
        python: pythonProgress,
        javascript: javascriptProgress,
        cpp: cppProgress,
        java: javaProgress
      },
      overallProgress
    });
  }, [user.totalLessonsCompleted, calculatedTotalCompleted, user.completedLessons.length, pythonProgress, javascriptProgress, cppProgress, javaProgress, overallProgress]);

  const levelProgress = getLevelProgress(user.xp);
  const levelTier = getLevelTier(levelProgress.currentLevel);

  const totalXpForCurrentLevelSegment = levelProgress.nextLevelXP - levelProgress.currentLevelXP;

  const stats = [
    { label: 'Total XP', value: user.xp.toLocaleString(), icon: Trophy, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { label: 'Current Level', value: levelProgress.currentLevel, icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Lessons Completed', value: user.totalLessonsCompleted, icon: BookOpen, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Current Streak', value: `${user.currentStreak} days`, icon: Zap, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  ];

  const languageStats = [
    { name: 'Python', progress: pythonProgress, color: 'bg-blue-500', icon: '🐍' },
    { name: 'JavaScript', progress: javascriptProgress, color: 'bg-yellow-500', icon: '🟨' },
    { name: 'C++', progress: cppProgress, color: 'bg-purple-500', icon: '⚡' },
    { name: 'Java', progress: javaProgress, color: 'bg-red-500', icon: '☕' },
  ];

  const userAchievements = achievements.map((achievement) => ({
    ...achievement,
    isUnlocked: user.unlockedAchievements.includes(achievement.id),
  }));

  const unlockedCount = userAchievements.filter((a) => a.isUnlocked).length;
  const activeBoosts = getActiveBoosts();

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - currentTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const recentActivity = [
    ...user.completedLessons.slice(-5).reverse().map((lessonId: string) => ({
      action: 'Completed lesson',
      item: lessonId.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase()),
      xp: 50,
      time: 'Recently',
      icon: '📚',
    })),
    ...user.unlockedAchievements.slice(-3).reverse().map((achievementId: string) => {
      const achievement = achievements.find((a) => a.id === achievementId);
      return {
        action: 'Unlocked achievement',
        item: achievement?.name || 'Unknown Achievement',
        xp: achievement?.reward.xp || 0,
        time: 'Recently',
        icon: achievement?.icon || '🏆',
      };
    }),
  ].slice(0, 6);

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Player Profile</h1>
            <p className="text-gray-600">Track your coding journey and achievements</p>
          </div>
          {/* Manual Sync Button and Achievement Check (Optional, primarily for debugging/testing) */}
          <div className="flex gap-2">
            
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 lg:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="text-center lg:text-left">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl lg:text-6xl shadow-lg">
                {currentAvatar.emoji}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 lg:w-12 lg:h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm lg:text-lg font-bold text-yellow-900">{levelProgress.currentLevel}</span>
              </div>
              {/* Level Tier Badge */}
              <div className={`absolute -top-2 -left-2 px-1 lg:px-2 py-1 ${levelTier.bgColor} ${levelTier.color} rounded-full text-xs font-bold flex items-center space-x-1`}>
                <span>{levelTier.icon}</span>
                <span className="hidden lg:inline">{levelTier.tier}</span>
              </div>
            </div>

            {/* UPDATED: Name editing section with display name refresh */}
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold text-lg lg:text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    maxLength={16}
                    placeholder="Enter your name"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    <span className={editName.length > 14 ? 'text-orange-500' : editName.length === 16 ? 'text-red-500' : ''}>
                      {editName.length}/16 characters
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={editName.trim().length === 0 || editName.trim().length > 16}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{user.name}</h2>
                  {/* NEW: Display name refresh button */}
                  {user.id !== 'guest' && (
                    <button
                      onClick={handleRefreshDisplayName}
                      disabled={isRefreshingName}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                      title="Refresh display name from account"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshingName ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
                <p className="text-lg lg:text-xl text-gray-600 mb-2">{currentAvatar.name}</p>
                <p className={`text-sm font-medium ${levelTier.color} mb-4`}>
                  Level {levelProgress.currentLevel} {levelTier.tier}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm lg:text-base"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setShowAvatarStore(true)}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm lg:text-base"
                  >
                    <User className="w-4 h-4" />
                    <span>Change Avatar</span>
                  </button>
                </div>
                {/* NEW: Display name info */}
                {user.id !== 'guest' && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 text-center">
                      Display name synced from your account
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rest of the component remains the same... */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${stat.bgColor} rounded-xl p-3 lg:p-4 text-center`}>
                    <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color} mx-auto mb-2`} />
                    <div className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base lg:text-lg font-semibold text-gray-700">Level Progress</span>
                <span className="text-sm text-gray-600">
                  {levelProgress.progressToNext} / {totalXpForCurrentLevelSegment} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${levelProgress.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Level {levelProgress.currentLevel}</span>
                <span>Level {levelProgress.currentLevel + 1}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="text-lg lg:text-2xl font-bold text-yellow-700">{user.coins}</div>
                <div className="text-xs text-yellow-600">Coins</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                <div className="flex justify-center space-x-1 mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Heart
                      key={i}
                      className={`w-3 h-3 lg:w-4 lg:h-4 ${
                        activeBoosts.unlimitedHearts 
                          ? 'text-pink-500 fill-pink-500 animate-pulse' 
                          : i < user.hearts 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-300 fill-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-red-600">
                  {activeBoosts.unlimitedHearts ? 'Unlimited' : 'Hearts'}
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-lg lg:text-2xl font-bold text-green-700">{overallProgress}%</div>
                <div className="text-xs text-green-600">Complete</div>
              </div>
            </div>

            {/* Active Boosts Display */}
            {(activeBoosts.xpBoost || activeBoosts.unlimitedHearts) && (
              <div className="mt-4 p-3 lg:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Active Boosts
                </h4>
                <div className="space-y-2">
                  {activeBoosts.xpBoost && (
                    <div className="flex flex-col sm:flex-row items-center justify-between text-sm bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg gap-1">
                      <span className="font-medium">{activeBoosts.xpBoost.multiplier}x XP Boost</span>
                      <span className="text-xs">{formatTimeRemaining(activeBoosts.xpBoost.expiresAt)}</span>
                    </div>
                  )}
                  {activeBoosts.unlimitedHearts && (
                    <div className="flex flex-col sm:flex-row items-center justify-between text-sm bg-pink-100 text-pink-800 px-3 py-2 rounded-lg gap-1">
                      <span className="font-medium">Unlimited Hearts</span>
                      <span className="text-xs">{formatTimeRemaining(activeBoosts.unlimitedHearts.expiresAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Leaderboard Sync Status (Visual only, sync handled by AuthContext) */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Leaderboard Status</span>
                </div>
                <div className="text-xs text-blue-600 text-center sm:text-right">
                  Display Name: {user.name} | XP: {user.xp} | Lessons: {user.totalLessonsCompleted} | Achievements: {unlockedCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-white rounded-xl p-2 shadow-md overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Trophy },
          { id: 'progress', label: 'Progress', icon: Target },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'activity', label: 'Activity', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 lg:px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm lg:text-base \${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Code className="w-6 h-6 mr-2 text-blue-500" />
              Language Mastery
            </h3>
            <div className="space-y-6">
              {languageStats.map((lang, index) => (
                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.icon}</span>
                      <div>
                        <span className="font-semibold text-gray-900">{lang.name}</span>
                        <div className="text-sm text-gray-600">
                          {lang.progress.completed}/{lang.progress.total} lessons
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{lang.progress.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${lang.color} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${lang.progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">{unlockedCount}</div>
                <div className="text-sm text-blue-600">Achievements</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-700">{user.totalCoinsEarned}</div>
                <div className="text-sm text-green-600">Total Coins Earned</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-700">{user.ownedAvatars.length}</div>
                <div className="text-sm text-purple-600">Avatars Owned</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-700">{user.currentStreak}</div>
                <div className="text-sm text-orange-600">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the tab content remains the same... */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Target className="w-7 h-7 mr-3 text-blue-500" />
            Learning Progress
          </h3>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Overall Progress</h4>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
                <div className="text-xs text-gray-500">
                  {calculatedTotalCompleted} / {pythonProgress.total + javascriptProgress.total + cppProgress.total + javaProgress.total} lessons
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                style={{ width: `${overallProgress}%` }}
              >
                {overallProgress > 10 && <span className="text-white text-sm font-medium">{overallProgress}%</span>}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Progress across all languages</span>
              <span className={calculatedTotalCompleted !== user.totalLessonsCompleted ? 'text-orange-600 font-medium' : ''}>
                {calculatedTotalCompleted !== user.totalLessonsCompleted ? 
                  `Syncing... (${calculatedTotalCompleted} calculated vs ${user.totalLessonsCompleted} stored)` : 
                  'All data synchronized'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {languageStats.map((lang, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{lang.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{lang.name}</h4>
                </div>

                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={lang.color.replace('bg-', '#')}
                      strokeWidth="2"
                      strokeDasharray={`${lang.progress.percentage}, 100`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{lang.progress.percentage}%</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{lang.progress.completed} / {lang.progress.total}</p>
                  <p className="text-sm text-gray-600">Lessons Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Award className="w-7 h-7 mr-3 text-yellow-500" />
              Achievements
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">{unlockedCount}/{achievements.length}</div>
              <div className="text-sm text-gray-600">Unlocked</div>
              {!isAuthenticated() && (
                <div className="text-xs text-red-500 mt-1">Sign in to unlock achievements!</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userAchievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg'
                    : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl p-2 rounded-lg ${achievement.isUnlocked ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {achievement.isUnlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`font-bold ${achievement.isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.name}
                      </h4>
                      {achievement.isUnlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <p className={`text-sm mb-3 ${achievement.isUnlocked ? 'text-green-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        achievement.category === 'learning' ? 'bg-blue-100 text-blue-700' :
                        achievement.category === 'practice' ? 'bg-purple-100 text-purple-700' :
                        achievement.category === 'social' ? 'bg-pink-100 text-pink-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {achievement.category}
                      </span>
                      {achievement.isUnlocked && (
                        <span className="text-green-600 font-medium">
                          +{achievement.reward.xp} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Calendar className="w-7 h-7 mr-3 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.action}: <span className="text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                {activity.xp > 0 && (
                  <div className="text-green-600 font-bold text-lg">+{activity.xp} XP</div>
                )}
              </div>
            )) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No recent activity</p>
                <p className="text-gray-400">Complete some lessons to see your progress here!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heart Store Modal */}
      {showStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Heart className="w-6 h-6 text-red-500 fill-red-500 mr-2" />
                Heart Store
              </h3>
              <button onClick={() => setShowStore(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm mb-2">Current hearts: <span className="font-semibold">{user.hearts}/5</span></p>
              <p className="text-gray-700 text-sm">Your coins: <span className="font-semibold text-yellow-600">{user.coins}</span></p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleBuyHearts(1)}
                disabled={user.hearts >= 5 || user.coins < 20}
                className="w-full p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <span className="font-medium">1 Heart</span>
                </div>
                <span className="font-bold text-yellow-600">20 coins</span>
              </button>

              <button
                onClick={() => handleBuyHearts(5 - user.hearts)}
                disabled={user.hearts >= 5 || user.coins < (5 - user.hearts) * 20}
                className="w-full p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  {Array.from({ length: Math.max(0, 5 - user.hearts) }, (_, i) => (
                    <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
                  ))}
                  {/* Ensure there's a space if hearts are bought, but not if 0 hearts are needed */}
                  {Math.max(0, 5 - user.hearts) > 0 && <span className="font-medium ml-3">Fill Hearts</span>}
                </div>
                <span className="font-bold text-yellow-600">{(5 - user.hearts) * 20} coins</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">Hearts reset daily at midnight</p>
          </div>
        </div>
      )}

      {/* Avatar Store Modal */}
      {showAvatarStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
            {/* Header section - now always at the top */}
            <div className="p-6 border-b border-gray-200 bg-white z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Crown className="w-7 h-7 text-yellow-500 mr-3" />
                  Avatar Collection
                </h3>
                <button onClick={() => setShowAvatarStore(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <p className="text-gray-600 mt-2">Your coins: <span className="font-bold text-yellow-600">{user.coins}</span></p>
            </div>

            {/* Scrollable content area */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {avatars.map((avatar) => {
                  const isOwned = user.ownedAvatars.includes(avatar.id);
                  const isCurrent = user.currentAvatar === avatar.id;
                  const canAfford = user.coins >= avatar.price;

                  return (
                    <div
                      key={avatar.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : isOwned
                          ? 'border-green-200 bg-green-50 hover:shadow-md'
                          : canAfford
                          ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50 opacity-75'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2 relative">
                          {avatar.emoji}
                          {isCurrent && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{avatar.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{avatar.description}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(avatar.rarity)}`}>
                          {avatar.rarity}
                        </span>

                        <div className="mt-3">
                          {isCurrent ? (
                            <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Current</div>
                          ) : isOwned ? (
                            <button
                              onClick={() => handleSetAvatar(avatar.id)}
                              className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Equip
                            </button>
                          ) : avatar.price === 0 ? (
                            <div className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Free</div>
                          ) : (
                            <button
                              onClick={() => handleBuyAvatar(avatar.id)}
                              disabled={!canAfford}
                              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                canAfford ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {canAfford ? `Buy ${avatar.price}` : `${avatar.price}`} 🪙
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
