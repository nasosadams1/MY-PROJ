import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { calculateLevelFromXP } from '../hooks/levelSystem';
import { useAuth } from './AuthContext';
import { UserProfile, getUserProfile, getDisplayName } from '../lib/supabase'; // NEW: Import getDisplayName
import { checkAchievements, Achievement } from '../data/achievements';
import { avatars } from '../data/avatars';
import { getLessonsByLanguage, getLessonById } from '../data/lessons';

// Assuming NotificationDisplay is in a 'components' folder
import NotificationDisplay from '../components/NotificationDisplay.tsx';

export interface User {
  id?: string;
  name: string;
  coins: number;
  totalCoinsEarned: number;
  xp: number;
  completedLessons: string[];
  level: number;
  hearts: number;
  maxHearts: number;
  lastHeartReset: string;
  currentAvatar: string;
  ownedAvatars: string[];
  unlockedAchievements: string[];
  currentStreak: number;
  lastLoginDate: string;
  totalLessonsCompleted: number;
  unlimitedHeartsActive?: boolean;
  xpBoostMultiplier?: number;
  xpBoostExpiresAt?: number;
  unlimitedHeartsExpiresAt?: number;
  projects?: number;
}

// Define Notification interface
interface Notification {
  id: string;
  message: string;
  icon?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Transaction queue for atomic operations
interface Transaction {
  id: string;
  updates: Partial<User>;
  timestamp: number;
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
}

interface UserContextType {
  user: User;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeLesson: (lessonId: string, xpReward: number, coinsReward: number) => Promise<void>;
  loseHeart: () => void;
  buyHearts: (amount: number) => Promise<boolean>;
  buyAvatar: (avatarId: string) => Promise<boolean>;
  setAvatar: (avatarId: string) => void;
  purchaseWithCoins: (amount: number) => Promise<boolean>;
  addCoins: (amount: number) => Promise<void>;
  resetHeartsIfNeeded: () => void;
  resetHeartLoss: () => void;
  getLanguageProgress: (language: string) => { completed: number; total: number; percentage: number };
  setAuthenticatedUser: (userData: Partial<User>) => void;
  resetToGuestUser: () => void;
  isAuthenticated: () => boolean;
  unlockAchievement: (achievementId: string, xpReward: number) => Promise<void>;
  debugUserState: () => void;
  verifyDatabaseSync: () => Promise<void>;
  forceRefreshFromDatabase: () => Promise<void>;
  checkAndUnlockAchievements: () => Promise<void>;
  activateXPBoost: (multiplier: number, durationHours: number) => Promise<void>;
  activateUnlimitedHearts: (durationHours: number) => Promise<void>;
  refillHearts: () => Promise<void>;
  isXPBoostActive: () => boolean;
  isUnlimitedHeartsActive: () => boolean;
  getActiveBoosts: () => { xpBoost?: { multiplier: number; expiresAt: number }; unlimitedHearts?: { expiresAt: number } };
  addNotification: (notification: { message: string; type: 'success' | 'info' | 'warning' | 'error'; icon?: string }) => void;
  refreshDisplayName: () => Promise<void>; // NEW: Function to refresh display name
}

const defaultGuestUser: User = {
  id: 'guest',
  name: 'Guest User',
  coins: 0, // Changed from 100 to 0
  totalCoinsEarned: 0, // Changed from 100 to 0
  xp: 0,
  completedLessons: [],
  level: 1,
  hearts: 5,
  maxHearts: 5,
  lastHeartReset: new Date().toDateString(),
  currentAvatar: 'default',
  ownedAvatars: ['default'],
  unlockedAchievements: [],
  currentStreak: 1,
  lastLoginDate: new Date().toDateString(),
  totalLessonsCompleted: 0,
  unlimitedHeartsActive: false,
  xpBoostMultiplier: 1,
  xpBoostExpiresAt: 0,
  unlimitedHeartsExpiresAt: 0,
  projects: 0
};


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultGuestUser);
  const [isInitialized, setIsInitialized] = useState(false);
  const { updateProfile: updateSupabaseProfile, user: authUser, profile: authProfile, loading: authLoading } = useAuth();
  const [heartLostThisQuestion, setHeartLostThisQuestion] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Transaction management
  const transactionQueue = useRef<Transaction[]>([]);
  const isProcessingTransaction = useRef(false);
  const lastUpdateTimestamp = useRef(0);
  const pendingUpdates = useRef<Partial<User>>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to add a notification to the state and auto-remove it
  const addNotification = useCallback((message: string, icon?: string, type: Notification['type'] = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, icon, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); 
  }, []);

  // NEW: Function to refresh display name from auth
  const refreshDisplayName = useCallback(async () => {
    if (!user || user.id === 'guest' || !authUser?.id) return

    try {
      console.log('🔄 UserContext: Refreshing display name from auth...')
      const displayName = await getDisplayName(authUser.id)
      
      if (displayName && displayName !== user.name && displayName !== 'Unknown User') {
        console.log('🔄 UserContext: Updating display name:', displayName, '(was:', user.name, ')')
        await updateUser({ name: displayName })
        addNotification('Display name updated!', '👤', 'info')
      }
    } catch (error) {
      console.error('Error refreshing display name:', error)
    }
  }, [user, authUser?.id])

  // Atomic transaction processor
  const processTransactionQueue = useCallback(async () => {
    if (isProcessingTransaction.current || transactionQueue.current.length === 0) {
      return;
    }

    isProcessingTransaction.current = true;
    
    try {
      // Process all pending transactions atomically
      const transactions = [...transactionQueue.current];
      transactionQueue.current = [];
      
      if (transactions.length === 0) {
        isProcessingTransaction.current = false;
        return;
      }

      // Merge all updates into a single atomic operation
      const mergedUpdates: Partial<User> = {};
      let currentState = { ...user };
      
      // Apply all updates sequentially to ensure consistency
      for (const transaction of transactions) {
        currentState = { ...currentState, ...transaction.updates };
        Object.assign(mergedUpdates, transaction.updates);
      }

      // Validate the final state
      const finalState = { ...user, ...mergedUpdates };
      
      // Ensure no negative values
      if (finalState.coins < 0) finalState.coins = 0;
      if (finalState.hearts < 0) finalState.hearts = 0;
      if (finalState.xp < 0) finalState.xp = 0;

      // Update local state immediately
      setUser(finalState);
      lastUpdateTimestamp.current = Date.now();

      // Sync to database if authenticated
      const supabaseUserId = authUser?.id;
      const hasSupabaseFunction = typeof updateSupabaseProfile === 'function';
      const isUserAuthenticated = supabaseUserId && supabaseUserId !== 'guest';

      if (isUserAuthenticated && hasSupabaseFunction && Object.keys(mergedUpdates).length > 0) {
        const profileUpdates: Partial<UserProfile> = {};
        
        // Map user updates to profile updates
        if (mergedUpdates.name !== undefined) profileUpdates.name = finalState.name; // This preserves display name
        if (mergedUpdates.coins !== undefined) profileUpdates.coins = finalState.coins;
        if (mergedUpdates.totalCoinsEarned !== undefined) profileUpdates.total_coins_earned = finalState.totalCoinsEarned;
        if (mergedUpdates.xp !== undefined) profileUpdates.xp = finalState.xp;
        if (mergedUpdates.completedLessons !== undefined) profileUpdates.completed_lessons = finalState.completedLessons;
        if (mergedUpdates.level !== undefined) profileUpdates.level = finalState.level;
        if (mergedUpdates.hearts !== undefined) profileUpdates.hearts = finalState.hearts;
        if (mergedUpdates.currentAvatar !== undefined) profileUpdates.current_avatar = finalState.currentAvatar;
        if (mergedUpdates.ownedAvatars !== undefined) profileUpdates.owned_avatars = finalState.ownedAvatars;
        if (mergedUpdates.unlockedAchievements !== undefined) profileUpdates.unlocked_achievements = finalState.unlockedAchievements;
        if (mergedUpdates.currentStreak !== undefined) profileUpdates.current_streak = finalState.currentStreak;
        if (mergedUpdates.lastLoginDate !== undefined) profileUpdates.last_login_date = finalState.lastLoginDate;
        if (mergedUpdates.totalLessonsCompleted !== undefined) profileUpdates.total_lessons_completed = finalState.totalLessonsCompleted;
        if (mergedUpdates.lastHeartReset !== undefined) profileUpdates.last_heart_reset = finalState.lastHeartReset;
        if (mergedUpdates.xpBoostMultiplier !== undefined) profileUpdates.xp_boost_multiplier = finalState.xpBoostMultiplier;
        if (mergedUpdates.xpBoostExpiresAt !== undefined) profileUpdates.xp_boost_expires_at = finalState.xpBoostExpiresAt;
        if (mergedUpdates.unlimitedHeartsExpiresAt !== undefined) profileUpdates.unlimited_hearts_expires_at = finalState.unlimitedHeartsExpiresAt;

        await updateSupabaseProfile(profileUpdates);
      }

      // Resolve all transactions
      transactions.forEach(transaction => transaction.resolve());
      
    } catch (error) {
      console.error('❌ Transaction processing failed:', error);
      
      // Reject all transactions
      const transactions = [...transactionQueue.current];
      transactionQueue.current = [];
      transactions.forEach(transaction => transaction.reject(error));
      
    } finally {
      isProcessingTransaction.current = false;
      
      // Process any new transactions that arrived during processing
      if (transactionQueue.current.length > 0) {
        setTimeout(() => processTransactionQueue(), 0);
      }
    }
  }, [user, updateSupabaseProfile, authUser]);

  // Debounced batch update function
  const queueUpdate = useCallback((updates: Partial<User>): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction: Transaction = {
        id: `${Date.now()}-${Math.random()}`,
        updates,
        timestamp: Date.now(),
        resolve,
        reject
      };

      transactionQueue.current.push(transaction);
      
      // Clear existing timeout and set new one for batching
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        processTransactionQueue();
      }, 50); // 50ms debounce for batching rapid updates
    });
  }, [processTransactionQueue]);

  // UPDATED: Enhanced initialization with display name sync
  useEffect(() => {
    console.log('🔧 UserContext: Initialization effect triggered:', {
      authLoading,
      hasAuthUser: !!authUser,
      hasProfile: !!authProfile,
      isInitialized,
      currentUserId: user?.id
    });

    if (authLoading) {
      console.log('🔧 UserContext: AuthContext still loading, waiting...');
      return;
    }

    if (authUser && authProfile) {
      console.log('🔧 UserContext: INITIALIZING with authenticated user and display name:', authProfile.name);
      
      const authenticatedUser: User = {
        id: authProfile.id,
        name: authProfile.name, // This is now the display name from auth
        coins: authProfile.coins,
        totalCoinsEarned: authProfile.total_coins_earned,
        xp: authProfile.xp,
        completedLessons: authProfile.completed_lessons || [],
        level: authProfile.level,
        hearts: authProfile.hearts,
        maxHearts: authProfile.max_hearts,
        lastHeartReset: authProfile.last_heart_reset,
        currentAvatar: authProfile.current_avatar,
        ownedAvatars: authProfile.owned_avatars || ['default'],
        unlockedAchievements: authProfile.unlocked_achievements || [],
        currentStreak: authProfile.current_streak,
        lastLoginDate: authProfile.last_login_date,
        totalLessonsCompleted: authProfile.total_lessons_completed,
        unlimitedHeartsActive: false,
        xpBoostMultiplier: authProfile.xp_boost_multiplier || 1,
        xpBoostExpiresAt: authProfile.xp_boost_expires_at || 0,
        unlimitedHeartsExpiresAt: authProfile.unlimited_hearts_expires_at || 0,
        projects: 0,
      };

      setUser(authenticatedUser);
      setIsInitialized(true);
    } else if (!authUser && (user.id !== 'guest' || !isInitialized)) {
      console.log('🔧 UserContext: INITIALIZING with guest user');
      setUser(defaultGuestUser);
      setIsInitialized(true);
    } else if (isInitialized && authUser && authProfile && user?.id === authProfile.id) {
      const hasChanges = 
        user.name !== authProfile.name || // Check for display name changes
        user.xp !== authProfile.xp ||
        user.totalLessonsCompleted !== authProfile.total_lessons_completed ||
        user.coins !== authProfile.coins ||
        user.xpBoostMultiplier !== (authProfile.xp_boost_multiplier || 1) ||
        user.xpBoostExpiresAt !== (authProfile.xp_boost_expires_at || 0) ||
        user.unlimitedHeartsExpiresAt !== (authProfile.unlimited_hearts_expires_at || 0);

      if (hasChanges) {
        console.log('🔧 UserContext: Profile updated, syncing changes including display name');
        setUser(prev => ({
          ...prev,
          name: authProfile.name, // Sync display name
          coins: authProfile.coins,
          totalCoinsEarned: authProfile.total_coins_earned,
          xp: authProfile.xp,
          completedLessons: authProfile.completed_lessons || [],
          level: authProfile.level,
          hearts: authProfile.hearts,
          maxHearts: authProfile.max_hearts,
          lastHeartReset: authProfile.last_heart_reset,
          currentAvatar: authProfile.current_avatar,
          ownedAvatars: authProfile.owned_avatars || ['default'],
          unlockedAchievements: authProfile.unlocked_achievements || [],
          currentStreak: authProfile.current_streak,
          lastLoginDate: authProfile.last_login_date,
          totalLessonsCompleted: authProfile.total_lessons_completed,
          xpBoostMultiplier: authProfile.xp_boost_multiplier || 1,
          xpBoostExpiresAt: authProfile.xp_boost_expires_at || 0,
          unlimitedHeartsExpiresAt: authProfile.unlimited_hearts_expires_at || 0,
          projects: 0,
        }));
      }
    }
  }, [authUser, authProfile, authLoading, isInitialized, user?.id, user?.name, user?.xp, user?.totalLessonsCompleted, user?.coins, user?.xpBoostMultiplier, user?.xpBoostExpiresAt, user?.unlimitedHeartsExpiresAt]);

  const isLoading = authLoading && !isInitialized;

  const isXPBoostActive = useCallback((): boolean => {
    return !!(user.xpBoostExpiresAt && user.xpBoostExpiresAt > Date.now());
  }, [user.xpBoostExpiresAt]);

  const isUnlimitedHeartsActive = useCallback((): boolean => {
    const isActive = !!(user.unlimitedHeartsExpiresAt && user.unlimitedHeartsExpiresAt > Date.now());
    return isActive;
  }, [user.unlimitedHeartsExpiresAt]);

  // FIXED: Simplified boost management with proper dependency handling
  useEffect(() => {
    if (!isInitialized || user.id === 'guest') return;

    const checkBoosts = () => {
      const now = Date.now();
      let needsUpdate = false;
      const updates: Partial<User> = {};

      // Check XP boost expiration
      if (user.xpBoostExpiresAt && user.xpBoostExpiresAt <= now && user.xpBoostMultiplier && user.xpBoostMultiplier > 1) {
        console.log('⚡ XP Boost expired');
        updates.xpBoostMultiplier = 1;
        updates.xpBoostExpiresAt = 0;
        needsUpdate = true;
        addNotification('XP Boost expired', '⚡', 'info');
      }

      // Check unlimited hearts expiration
      if (user.unlimitedHeartsExpiresAt && user.unlimitedHeartsExpiresAt <= now) {
        console.log('💖 Unlimited Hearts expired');
        updates.unlimitedHeartsExpiresAt = 0;
        needsUpdate = true;
        addNotification('Unlimited Hearts expired', '💖', 'info');
      }

      // CRITICAL: Maintain unlimited hearts at maximum while active
      const unlimitedActive = user.unlimitedHeartsExpiresAt && user.unlimitedHeartsExpiresAt > now;
      if (unlimitedActive && user.hearts < user.maxHearts) {
        console.log('💖 Maintaining unlimited hearts at maximum');
        updates.hearts = user.maxHearts;
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log('🔄 Applying boost updates:', updates);
        queueUpdate(updates);
      }
    };

    // Check immediately
    checkBoosts();

    // Set up interval for continuous checking
    const interval = setInterval(checkBoosts, 3000);
    
    return () => clearInterval(interval);
  }, [isInitialized, user.id, user.xpBoostExpiresAt, user.unlimitedHeartsExpiresAt, user.xpBoostMultiplier, user.hearts, user.maxHearts, addNotification, queueUpdate]);

  // Updated functions to use the new atomic update system

  const updateUser = useCallback(async (updates: Partial<User>) => {
    return queueUpdate(updates);
  }, [queueUpdate]);

  const buyHearts = useCallback(async (amount: number): Promise<boolean> => {
    const cost = amount * 20;
    
    // Validate purchase atomically
    if (user.coins < cost || user.hearts >= user.maxHearts) {
      return false;
    }
        const heartsToAdd = Math.min(amount, user.maxHearts - user.hearts);
    const actualCost = heartsToAdd * 20;
    
    try {
      await queueUpdate({
        coins: user.coins - actualCost,
        hearts: user.hearts + heartsToAdd,
      });
      
      addNotification(`Purchased ${heartsToAdd} heart${heartsToAdd > 1 ? 's' : ''}!`, '❤️', 'success');
      return true;
    } catch (error) {
      console.error('❌ Heart purchase failed:', error);
      return false;
    }
  }, [user.coins, user.hearts, user.maxHearts, queueUpdate, addNotification]);

  const buyAvatar = useCallback(async (avatarId: string): Promise<boolean> => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar || user.ownedAvatars.includes(avatarId) || user.coins < avatar.price) {
      return false;
    }

    try {
      await queueUpdate({
        coins: user.coins - avatar.price,
        ownedAvatars: [...user.ownedAvatars, avatarId],
      });
      
      addNotification(`Avatar purchased!`, '🎭', 'success');
      return true;
    } catch (error) {
      console.error('❌ Avatar purchase failed:', error);
      return false;
    }
  }, [user.ownedAvatars, user.coins, queueUpdate, addNotification]);

  const purchaseWithCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (user.coins < amount) return false;
    
    try {
      await queueUpdate({ coins: user.coins - amount });
      return true;
    } catch (error) {
      console.error('❌ Coin purchase failed:', error);
      return false;
    }
  }, [user.coins, queueUpdate]);

  const addCoins = useCallback(async (amount: number): Promise<void> => {
    await queueUpdate({
      coins: user.coins + amount,
      totalCoinsEarned: user.totalCoinsEarned + amount,
    });
  }, [user.coins, user.totalCoinsEarned, queueUpdate]);

  const activateXPBoost = useCallback(async (multiplier: number, durationHours: number) => {
    const expiresAt = Date.now() + (durationHours * 60 * 60 * 1000);
    
    console.log(`⚡ ACTIVATING XP BOOST: ${multiplier}x for ${durationHours} hours, expires at:`, new Date(expiresAt));
    
    await queueUpdate({
      xpBoostMultiplier: multiplier,
      xpBoostExpiresAt: expiresAt
    });
    
    addNotification(
      `${multiplier}x XP Boost activated for ${durationHours} hour${durationHours > 1 ? 's' : ''}!`,
      '⚡',
      'success'
    );
  }, [queueUpdate, addNotification]);

  const activateUnlimitedHearts = useCallback(async (durationHours: number) => {
    const expiresAt = Date.now() + (durationHours * 60 * 60 * 1000);
    
    console.log(`💖 ACTIVATING UNLIMITED HEARTS: ${durationHours} hours, expires at:`, new Date(expiresAt));
    
    await queueUpdate({
      unlimitedHeartsExpiresAt: expiresAt,
      hearts: user.maxHearts
    });
    
    addNotification(
      `Unlimited Hearts activated for ${durationHours} hour${durationHours > 1 ? 's' : ''}!`,
      '💖',
      'success'
    );
  }, [queueUpdate, user.maxHearts, addNotification]);

  const refillHearts = useCallback(async () => {
    console.log(`❤️ Refilling hearts from ${user.hearts} to ${user.maxHearts}`);
    await queueUpdate({ hearts: user.maxHearts });
    addNotification('Hearts refilled!', '❤️', 'success');
  }, [queueUpdate, user.maxHearts, user.hearts, addNotification]);

  const debugUserState = useCallback(() => {
    console.log('🔍 FULL DEBUG STATE:', {
      timestamp: new Date().toISOString(),
      userContext: {
        id: user?.id,
        name: user?.name, // This is now the display name
        xp: user?.xp,
        totalLessons: user?.totalLessonsCompleted,
        coins: user?.coins,
        hearts: user?.hearts,
        unlimitedHeartsActive: isUnlimitedHeartsActive(),
        unlimitedHeartsExpiresAt: user?.unlimitedHeartsExpiresAt,
        xpBoostActive: isXPBoostActive(),
        xpBoostExpiresAt: user?.xpBoostExpiresAt,
        isLoading,
        isInitialized
      },
      authContext: {
        userId: authUser?.id,
        profileId: authProfile?.id,
        profileName: authProfile?.name, // This is the display name from auth
        profileXP: authProfile?.xp,
        profileLessons: authProfile?.total_lessons_completed,
        profileCoins: authProfile?.coins,
        authLoading
      },
      transactionSystem: {
        queueLength: transactionQueue.current.length,
        isProcessing: isProcessingTransaction.current,
        lastUpdate: lastUpdateTimestamp.current
      }
    });
  }, [user, authUser, authProfile, isLoading, isInitialized, authLoading, isUnlimitedHeartsActive, isXPBoostActive]);

  const forceRefreshFromDatabase = useCallback(async () => {
    if (!authUser?.id || authUser.id === 'guest') {
      console.log('🔄 Cannot refresh - no authenticated user');
      return;
    }

    try {
      console.log('🔄 FORCING DATABASE REFRESH for user:', authUser.id);
      const { data, error } = await getUserProfile(authUser.id); // This now syncs display name
      
      if (error) {
        console.error('❌ Database refresh failed:', error);
        return;
      }

      if (data) {
        console.log('🔄 FRESH DATABASE DATA with display name:', {
          id: data.id,
          name: data.name, // This is now the display name from auth
          xp: data.xp,
          totalLessons: data.total_lessons_completed,
          coins: data.coins,
          completedLessons: data.completed_lessons?.length || 0,
          xpBoostMultiplier: data.xp_boost_multiplier,
          xpBoostExpiresAt: data.xp_boost_expires_at,
          unlimitedHeartsExpiresAt: data.unlimited_hearts_expires_at
        });

        setUser({
          id: data.id,
          name: data.name, // Display name from auth
          coins: data.coins,
          totalCoinsEarned: data.total_coins_earned,
          xp: data.xp,
          completedLessons: data.completed_lessons || [],
          level: data.level,
          hearts: data.hearts,
          maxHearts: data.max_hearts,
          lastHeartReset: data.last_heart_reset,
          currentAvatar: data.current_avatar,
          ownedAvatars: data.owned_avatars || ['default'],
          unlockedAchievements: data.unlocked_achievements || [],
          currentStreak: data.current_streak,
          lastLoginDate: data.last_login_date,
          totalLessonsCompleted: data.total_lessons_completed,
          unlimitedHeartsActive: false,
          xpBoostMultiplier: data.xp_boost_multiplier || 1,
          xpBoostExpiresAt: data.xp_boost_expires_at || 0,
          unlimitedHeartsExpiresAt: data.unlimited_hearts_expires_at || 0,
          projects: 0,
        });

        console.log('✅ USER STATE FORCE UPDATED FROM DATABASE WITH DISPLAY NAME');
      }
    } catch (error) {
      console.error('❌ Force refresh error:', error);
    }
  }, [authUser?.id]);

  const verifyDatabaseSync = useCallback(async () => {
    if (!authUser?.id || authUser.id === 'guest') return;

    try {
      console.log('🔍 VERIFYING DATABASE SYNC...');
      const { data } = await getUserProfile(authUser.id);
      if (data) {
        const hasDiscrepancy = 
          data.name !== user.name || // Check display name sync
          data.xp !== user.xp ||
          data.total_lessons_completed !== user.totalLessonsCompleted ||
          data.coins !== user.coins ||
          (data.completed_lessons?.length || 0) !== user.completedLessons.length ||
          (data.xp_boost_multiplier || 1) !== (user.xpBoostMultiplier || 1) ||
          (data.xp_boost_expires_at || 0) !== (user.xpBoostExpiresAt || 0) ||
          (data.unlimited_hearts_expires_at || 0) !== (user.unlimitedHeartsExpiresAt || 0);

        if (hasDiscrepancy) {
          console.warn('⚠️ DATABASE MISMATCH DETECTED! Auto-syncing from database...');
          await forceRefreshFromDatabase();
        } else {
          console.log('✅ DATABASE SYNC VERIFIED - All data matches including display name');
        }
      }
    } catch (error) {
      console.error('❌ Database verification failed:', error);
    }
  }, [authUser?.id, user, forceRefreshFromDatabase]);

  const setAuthenticatedUser = useCallback((userData: Partial<User>) => {
    console.warn('⚠️ setAuthenticatedUser is deprecated - initialization is now automatic');
  }, []);

  const resetToGuestUser = useCallback(() => {
    console.log('🔧 RESETTING TO GUEST USER');
    setUser(defaultGuestUser);
    setHeartLostThisQuestion(false);
    // Clear transaction queue
    transactionQueue.current = [];
    isProcessingTransaction.current = false;
  }, []);

  const isAuthenticated = useCallback((): boolean => {
    const authenticated = user.id !== 'guest' && user.id !== undefined && authUser?.id === user.id;
    return authenticated;
  }, [user.id, authUser?.id]);

  const checkAndUnlockAchievements = useCallback(async () => {
    if (!user || user.id === 'guest' || !user.unlockedAchievements) {
      console.log('🏆 Skipping achievement check - user not authenticated or data not ready.');
      return;
    }

    console.log('🏆 Checking achievements for user:', user.name); // This is now display name
    
    const newlyUnlockedAchievements = checkAchievements(user, user.completedLessons);

    if (newlyUnlockedAchievements.length > 0) {
      let totalXPFromAchievements = 0;
      const updatedUnlockedAchievements = [...(user.unlockedAchievements || [])];

      newlyUnlockedAchievements.forEach(achievement => {
        totalXPFromAchievements += achievement.reward.xp;
        updatedUnlockedAchievements.push(achievement.id);

        addNotification(
          `Achievement Unlocked: ${achievement.name}! +${achievement.reward.xp} XP`, 
          achievement.icon, 
          'success'
        );
      });

      await queueUpdate({
        xp: user.xp + totalXPFromAchievements,
        unlockedAchievements: updatedUnlockedAchievements,
        level: calculateLevelFromXP(user.xp + totalXPFromAchievements),
      });

      console.log(`🎉 Awarded ${totalXPFromAchievements} XP for new achievements.`);
    }
  }, [user, queueUpdate, addNotification]);

 const completeLesson = useCallback(async (lessonId: string, xpReward: number, coinsReward: number) => {
  const timestamp = new Date().toISOString();
  console.log('🎓 LESSON COMPLETION STARTED:', {
    timestamp,
    lessonId,
    xpReward,
    coinsReward,
    currentState: {
      xp: user.xp,
      coins: user.coins,
      totalLessons: user.totalLessonsCompleted,
      completedLessons: user.completedLessons.length,
      currentCompletedLessons: user.completedLessons
    }
  });

  if (user.completedLessons.includes(lessonId)) {
    console.warn('⚠️ LESSON ALREADY COMPLETED:', lessonId);
    return;
  }

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const isConsecutiveDay = user.lastLoginDate === yesterday;

  const boostMultiplier = isXPBoostActive() ? (user.xpBoostMultiplier || 1) : 1;
  const boostedXP = Math.floor(xpReward * boostMultiplier);

  const updatedCompletedLessons = [...user.completedLessons, lessonId];
  const newXP = user.xp + boostedXP;
  const newLevel = calculateLevelFromXP(newXP);
  const newCoins = user.coins + coinsReward;
  const newTotalCoins = user.totalCoinsEarned + coinsReward;
  const newTotalLessons = user.totalLessonsCompleted + 1;

  const lessonUpdates = {
    xp: newXP,
    coins: newCoins,
    totalCoinsEarned: newTotalCoins,
    completedLessons: updatedCompletedLessons,
    totalLessonsCompleted: newTotalLessons,
    level: newLevel,
    currentStreak: isConsecutiveDay ? user.currentStreak + 1 : 1,
    lastLoginDate: today,
  };

  console.log('🎓 LESSON COMPLETION UPDATES:', {
    timestamp,
    lessonId,
    lessonUpdates,
    calculations: {
      oldXP: user.xp,
      xpReward,
      boostedXP,
      newXP,
      oldCoins: user.coins,
      coinsReward,
      newCoins,
      oldTotalLessons: user.totalLessonsCompleted,
      newTotalLessons,
      newLevel,
      oldCompletedLessons: user.completedLessons.length,
      newCompletedLessonsCount: updatedCompletedLessons.length
    }
  });

  try {
    // CRITICAL FIX: Update lesson completion first
    await queueUpdate(lessonUpdates);
    console.log('✅ LESSON COMPLETION SUCCESS:', {
      timestamp,
      lessonId,
      newTotalCompleted: newTotalLessons,
      newCompletedLessonsArray: updatedCompletedLessons
    });

    // CRITICAL FIX: Check achievements with the UPDATED user state
    // Create a temporary updated user object for achievement checking
    const updatedUserForAchievements = {
      ...user,
      ...lessonUpdates
    };

    console.log('🏆 Checking achievements with updated state:', {
      xp: updatedUserForAchievements.xp,
      level: updatedUserForAchievements.level,
      totalLessons: updatedUserForAchievements.totalLessonsCompleted,
      completedLessons: updatedUserForAchievements.completedLessons.length
    });

    // Check for newly unlocked achievements using the updated state
    const newlyUnlockedAchievements = checkAchievements(
      updatedUserForAchievements, 
      updatedUserForAchievements.completedLessons
    );

    if (newlyUnlockedAchievements.length > 0) {
      console.log('🎉 NEW ACHIEVEMENTS UNLOCKED:', newlyUnlockedAchievements.map(a => a.name));
      
      let totalAchievementXP = 0;
      const updatedUnlockedAchievements = [...(user.unlockedAchievements || [])];

      newlyUnlockedAchievements.forEach(achievement => {
        totalAchievementXP += achievement.reward.xp;
        updatedUnlockedAchievements.push(achievement.id);

        addNotification(
          `Achievement Unlocked: ${achievement.name}! +${achievement.reward.xp} XP`, 
          achievement.icon, 
          'success'
        );
      });

      // CRITICAL FIX: Add achievement XP on top of lesson XP
      const finalXP = newXP + totalAchievementXP;
      const finalLevel = calculateLevelFromXP(finalXP);

      console.log('🎉 ADDING ACHIEVEMENT XP:', {
        lessonXP: newXP,
        achievementXP: totalAchievementXP,
        finalXP,
        finalLevel
      });

      // Update with achievement rewards
      await queueUpdate({
        xp: finalXP,
        level: finalLevel,
        unlockedAchievements: updatedUnlockedAchievements,
      });

      console.log(`✅ Awarded ${totalAchievementXP} XP for ${newlyUnlockedAchievements.length} achievement(s).`);
    } else {
      console.log('ℹ️ No new achievements unlocked');
    }
    
  } catch (error) {
    console.error('❌ LESSON COMPLETION FAILED:', {
      timestamp,
      error,
      lessonId,
      updates: lessonUpdates
    });
    throw error;
  }
}, [user, queueUpdate, checkAndUnlockAchievements, isXPBoostActive, addNotification]);

  const resetHeartLoss = useCallback(() => {
    setHeartLostThisQuestion(false);
  }, []);

  const resetHeartsIfNeeded = useCallback(async () => {
    const today = new Date().toDateString();
    if (user.lastHeartReset !== today) {
      await queueUpdate({
        hearts: user.maxHearts,
        lastHeartReset: today,
      });
    }
  }, [user.lastHeartReset, user.maxHearts, queueUpdate]);

  const loseHeart = useCallback(() => {
    // CRITICAL: If unlimited hearts is active, maintain hearts at maximum
    if (isUnlimitedHeartsActive()) {
      console.log('💖 Unlimited hearts active - preventing heart loss and maintaining at maximum');
      // Ensure hearts stay at max during unlimited hearts period
      if (user.hearts < user.maxHearts) {
        queueUpdate({ hearts: user.maxHearts });
      }
      return; // Exit early - no heart loss during unlimited hearts
    }
    
    if (heartLostThisQuestion) return; // prevent multiple losses in same question

    console.log('💔 LOSING HEART:', user.hearts);
    setHeartLostThisQuestion(true);
    queueUpdate({ hearts: Math.max(0, user.hearts - 1) });
  }, [heartLostThisQuestion, queueUpdate, isUnlimitedHeartsActive, user.hearts, user.maxHearts]);

  const setAvatar = useCallback((avatarId: string) => {
    if (!user.ownedAvatars.includes(avatarId)) return;
    queueUpdate({ currentAvatar: avatarId });
  }, [user.ownedAvatars, queueUpdate]);

  const unlockAchievement = useCallback(async (achievementId: string, xpReward: number) => { 
    if (user.unlockedAchievements.includes(achievementId)) return;

    const updatedUnlockedAchievements = [...user.unlockedAchievements, achievementId];
    const newXP = user.xp + xpReward;
    const newLevel = calculateLevelFromXP(newXP);

    await queueUpdate({
      xp: newXP,
      unlockedAchievements: updatedUnlockedAchievements,
      level: newLevel,
    });

    // Find the achievement to get its details for the notification
    const unlockedAch = checkAchievements(user, user.completedLessons).find(a => a.id === achievementId);
    if (unlockedAch) {
      addNotification(
        `Achievement Unlocked: ${unlockedAch.name}! +${xpReward} XP`, 
        unlockedAch.icon, 
        'success'
      );
    }
  }, [user, queueUpdate, addNotification, checkAchievements]); 

  const getActiveBoosts = useCallback(() => {
    const boosts: { xpBoost?: { multiplier: number; expiresAt: number }; unlimitedHearts?: { expiresAt: number } } = {};
    
    if (isXPBoostActive()) {
      boosts.xpBoost = {
        multiplier: user.xpBoostMultiplier || 1,
        expiresAt: user.xpBoostExpiresAt || 0
      };
    }
    
    if (isUnlimitedHeartsActive()) {
      boosts.unlimitedHearts = {
        expiresAt: user.unlimitedHeartsExpiresAt || 0
      };
    }
    
    return boosts;
  }, [isXPBoostActive, isUnlimitedHeartsActive, user.xpBoostMultiplier, user.xpBoostExpiresAt, user.unlimitedHeartsExpiresAt]);

  const getLanguageProgress = useCallback((language: string) => {
    // Define valid languages
    const validLanguages = ["python", "javascript", "cpp", "java"] as const;
    type ValidLanguage = typeof validLanguages[number];
    
    // Check if language is valid
    if (!validLanguages.includes(language as ValidLanguage)) {
      console.warn(`Invalid language: ${language}. Returning empty progress.`);
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    const languageLessons = getLessonsByLanguage(language as ValidLanguage);
    const totalLessons = languageLessons.length;
    
    const completed = user.completedLessons.filter(lessonId => {
      const lesson = getLessonById(lessonId);
      return lesson && lesson.language === language;
    }).length;

    return {
      completed,
      total: totalLessons,
      percentage: Math.round((completed / totalLessons) * 100)
    };
  }, [user.completedLessons]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      updateUser,
      completeLesson,
      loseHeart,
      buyHearts,
      buyAvatar,
      setAvatar,
      purchaseWithCoins,
      addCoins,
      resetHeartsIfNeeded,
      resetHeartLoss,
      getLanguageProgress,
      setAuthenticatedUser,
      resetToGuestUser,
      isAuthenticated,
      unlockAchievement,
      debugUserState,
      verifyDatabaseSync,
      forceRefreshFromDatabase,
      checkAndUnlockAchievements,
      activateXPBoost,
      activateUnlimitedHearts,
      refillHearts,
      isXPBoostActive,
      isUnlimitedHeartsActive,
      getActiveBoosts,
      addNotification: (notification: { message: string; type: 'success' | 'info' | 'warning' | 'error'; icon?: string }) => {
        addNotification(notification.message, notification.icon, notification.type);
      },
      refreshDisplayName, // NEW: Expose refresh display name function
    }}>
      {children}
      {/* Render the NotificationDisplay component */}
      <NotificationDisplay notifications={notifications} />
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

