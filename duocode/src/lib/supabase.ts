import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

if (!supabaseUrl.includes('supabase.co')) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error('Invalid Supabase URL. Should be in format: https://your-project-id.supabase.co')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

export interface UserProfile {
  id: string
  name: string
  email: string
  coins: number
  total_coins_earned: number
  xp: number
  completed_lessons: string[]
  level: number
  hearts: number
  max_hearts: number
  last_heart_reset: string
  current_avatar: string
  owned_avatars: string[]
  unlocked_achievements: string[]
  current_streak: number
  last_login_date: string
  total_lessons_completed: number
  email_verified: boolean
  created_at?: string
  updated_at?: string
  xp_boost_multiplier?: number;
  xp_boost_expires_at?: number;
  unlimited_hearts_expires_at?: number;
}

export interface LeaderboardEntry {
  user_id: string
  xp: number
  total_lessons_completed: number
  achievements_count: number
  current_streak: number
  level: number
  user_profiles: {
    name: string
    current_avatar: string
  }
}

// UPDATED: Helper function to get display name from Supabase auth (PRIMARY source)
export const getDisplayName = async (userId: string) => {
  try {
    // Get current auth user
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user || user.id !== userId) {
      console.error('Error fetching auth user or user mismatch:', error)
      return null
    }

    // UPDATED: display_name is the PRIMARY source - this is what users set in their profile
    const displayName = 
      user.user_metadata?.display_name ||  // PRIMARY: User's chosen display name
      user.user_metadata?.full_name ||     // Fallback to full name
      user.user_metadata?.name ||          // Fallback to name
      user.user_metadata?.username ||      // Fallback to username
      'Unknown User'                       // Don't fall back to email prefix

    console.log('Display name from auth metadata:', {
      display_name: user.user_metadata?.display_name,
      full_name: user.user_metadata?.full_name,
      name: user.user_metadata?.name,
      username: user.user_metadata?.username,
      email: user.email,
      final_display_name: displayName
    })
    
    return displayName
  } catch (error) {
    console.error('Exception getting display name:', error)
    return null
  }
}

// NEW: Function to update display name in Supabase auth
export const updateDisplayName = async (newDisplayName: string) => {
  try {
    console.log('🔄 Updating display name in Supabase auth to:', newDisplayName)
    
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        display_name: newDisplayName,
        full_name: newDisplayName, // Also update full_name as backup
        name: newDisplayName       // Also update name as backup
      }
    })

    if (error) {
      console.error('❌ Error updating display name in auth:', error)
      return { data: null, error }
    }

    console.log('✅ Display name updated in Supabase auth:', data.user?.user_metadata?.display_name)
    return { data, error: null }
  } catch (error) {
    console.error('❌ Exception updating display name:', error)
    return { data: null, error }
  }
}

export const updateLoginStreak = async (userId: string) => {
  try {
    const today = new Date().toDateString()
    
    // FIXED: Use maybeSingle() instead of single()
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('current_streak, last_login_date')
      .eq('id', userId)
      .maybeSingle() // CHANGED: This handles null results without throwing PGRST116

    if (fetchError) {
      console.error('Error fetching user profile for streak:', fetchError)
      return { data: null, error: fetchError }
    }

    if (!profile) {
      console.error('No profile found for user:', userId)
      return { data: null, error: new Error('Profile not found') }
    }

    let newStreak = 0
    const lastLoginDate = profile.last_login_date
    
    if (lastLoginDate) {
      const lastLogin = new Date(lastLoginDate)
      const todayDate = new Date(today)
      const timeDiff = todayDate.getTime() - lastLogin.getTime()
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
      
      if (daysDiff === 0) {
        newStreak = profile.current_streak
      } else if (daysDiff === 1) {
        newStreak = profile.current_streak + 1
      } else {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    // FIXED: Use maybeSingle() for update as well
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        current_streak: newStreak,
        last_login_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle() // CHANGED: Consistent with fetch

    if (error) {
      console.error('Error updating streak:', error)
      return { data: null, error }
    }

    console.log(`Streak updated for user ${userId}: ${newStreak} days`)
    return { 
      data: { 
        ...data, 
        streak_message: getStreakMessage(newStreak, profile.current_streak) 
      }, 
      error: null 
    }

  } catch (error) {
    console.error('Exception updating login streak:', error)
    return { data: null, error }
  }
}

const getStreakMessage = (newStreak: number, oldStreak: number): string => {
  if (newStreak === 1 && oldStreak > 1) {
    return `Streak reset! Starting fresh with day 1. Keep it up! 🔥`
  } else if (newStreak === 1 && oldStreak <= 1) {
    return `Welcome back! Starting your streak journey! 🌟`
  } else if (newStreak > oldStreak) {
    return `Awesome! ${newStreak} day streak! Keep the momentum going! 🔥`
  } else {
    return `${newStreak} day streak continues! 🔥`
  }
}

export const getStreakInfo = async (userId: string) => {
  try {
    // FIXED: Use maybeSingle() instead of single()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('current_streak, last_login_date')
      .eq('id', userId)
      .maybeSingle() // CHANGED: Handles null results gracefully

    if (error) {
      console.error('Error fetching streak info:', error)
      return { data: null, error }
    }

    if (!data) {
      console.warn('No profile found for streak info:', userId)
      return { data: null, error: new Error('Profile not found') }
    }

    const today = new Date().toDateString()
    const isLoggedInToday = data.last_login_date === today

    return {
      data: {
        current_streak: data.current_streak,
        last_login_date: data.last_login_date,
        is_logged_in_today: isLoggedInToday
      },
      error: null
    }
  } catch (error) {
    console.error('Exception getting streak info:', error)
    return { data: null, error }
  }
}

export const handleOAuthLoginStreak = async (userId: string) => {
  return await updateLoginStreak(userId)
}

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Connection test result:', { data: !!data, error })
    return !error
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}

// UPDATED: Enhanced createUserProfile to use display name from auth
export const createUserProfile = async (userId: string, userData: Partial<UserProfile>) => {
  try {
    console.log('Creating user profile with data:', { userId, name: userData.name })
    
    // Get display name from auth user (PRIMARY source)
    const displayName = await getDisplayName(userId)
    
    const profileData = {
      id: userId,
      ...userData,
      name: displayName || userData.name || 'Unknown User' // Prioritize auth display name
    }
    
    console.log('Creating profile with auth display name:', profileData.name)
    
    // FIXED: Use maybeSingle() for consistency
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .maybeSingle() // CHANGED: Consistent error handling

    if (error) {
      console.error('Database error creating profile:', error)
      return { data: null, error }
    }

    console.log('Profile created successfully in database with auth display name:', data?.name)
    return { data, error: null }
  } catch (error) {
    console.error('Exception creating profile:', error)
    return { data: null, error }
  }
}

// UPDATED: Enhanced getUserProfile with CRITICAL FIX for PGRST116 error
export const getUserProfile = async (userId: string) => {
  try {
    // CRITICAL FIX: Use maybeSingle() instead of single() to handle null results
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // CHANGED: This prevents PGRST116 error when no results found

    // Handle specific error cases, but PGRST116 should now be resolved
    if (error && error.code !== 'PGRST116') {
      console.error('Database error getting profile:', error)
      return { data: null, error }
    }

    // If profile exists, always sync display name from auth
    if (data) {
      const displayName = await getDisplayName(userId)
      
      // Always update profile if we have a valid display name from auth
      if (displayName && displayName !== 'Unknown User') {
        console.log('🔄 Syncing auth display name:', displayName, '(stored:', data.name, ')')
        
        // Only update if different to avoid unnecessary writes
        if (displayName !== data.name) {
          const { data: updatedData } = await supabase
            .from('user_profiles')
            .update({ name: displayName, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .maybeSingle() // CHANGED: Consistent with other queries
          
          return { data: updatedData || { ...data, name: displayName }, error: null }
        }
      }
    }

    return { data, error }
  } catch (error) {
    console.error('Exception getting profile:', error)
    return { data: null, error }
  }
}

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
  setProfile?: (profile: UserProfile) => void
) => {
  try {
    if (!userId) throw new Error('No user ID provided')
    if (!updates || Object.keys(updates).length === 0) {
      console.warn('No updates provided for user:', userId)
      return { data: null, error: null }
    }

    console.log('Updating profile for user:', userId, 'with updates:', updates)

    // If name is being updated, also update it in Supabase auth
    let finalUpdates = { ...updates }
    if (updates.name) {
      console.log('🔄 Updating display name in auth:', updates.name)
      const { error: authError } = await updateDisplayName(updates.name)
      if (authError) {
        console.error('❌ Failed to update display name in auth:', authError)
      }
    } else {
      // If no name update, sync from auth
      const displayName = await getDisplayName(userId)
      if (displayName && displayName !== 'Unknown User') {
        finalUpdates.name = displayName
        console.log('🔄 Auto-syncing auth display name during update:', displayName)
      }
    }

    const updatesWithTimestamp = {
      ...finalUpdates,
      updated_at: new Date().toISOString()
    }

    // FIXED: Use maybeSingle() for update consistency
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updatesWithTimestamp)
      .eq('id', userId)
      .select()
      .maybeSingle() // CHANGED: Consistent error handling

    if (error) {
      console.error('Database error updating profile:', error)
      return { data: null, error }
    }

    console.log('Profile updated successfully in database with auth display name:', data?.name)

    if (setProfile && data) {
      setProfile(data)
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception updating profile:', err)
    return { data: null, error: err }
  }
}

export const getLeaderboardData = async (
  limit: number = 100, 
  offset: number = 0, 
  sortBy: 'xp' | 'lessons' | 'achievements' = 'xp'
) => {
  try {
    console.log('📊 Fetching leaderboard with auth display names:', { limit, offset, sortBy });

    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        xp,
        total_lessons_completed,
        unlocked_achievements,
        current_streak,
        level,
        name,
        current_avatar
      `);

    switch (sortBy) {
      case 'lessons':
        query = query.order('total_lessons_completed', { ascending: false });
        break;
      case 'achievements':
        query = query.order('unlocked_achievements', { ascending: false });
        break;
      default:
        query = query.order('xp', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Database error getting leaderboard:', error);
      return { data: null, error };
    }

    // Transform data - the names are now synced auth display names
    const transformedData = data?.map((profile, index) => ({
      user_id: profile.id,
      xp: profile.xp || 0,
      total_lessons_completed: profile.total_lessons_completed || 0,
      achievements_count: Array.isArray(profile.unlocked_achievements) 
        ? profile.unlocked_achievements.length 
        : 0,
      current_streak: profile.current_streak || 0,
      level: profile.level || 1,
      rank: offset + index + 1,
      user_profiles: {
        name: profile.name || 'Unknown Player', // This is now the auth display name
        current_avatar: profile.current_avatar || '👤'
      }
    })) || [];

    console.log('✅ Leaderboard data fetched with auth display names:', transformedData.slice(0, 3));
    return { data: transformedData, error: null };

  } catch (error) {
    console.error('Exception getting leaderboard:', error);
    return { data: null, error };
  }
};

export const getUserRank = async (userId: string, sortBy: 'xp' | 'lessons' | 'achievements' = 'xp') => {
  try {
    // FIXED: Use maybeSingle() for user profile fetch
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('xp, total_lessons_completed, unlocked_achievements')
      .eq('id', userId)
      .maybeSingle(); // CHANGED: Prevents PGRST116 error

    if (userError || !userProfile) {
      return { data: null, error: userError };
    }

    let userValue: number;
    let compareColumn: string;

    switch (sortBy) {
      case 'lessons':
        userValue = userProfile.total_lessons_completed || 0;
        compareColumn = 'total_lessons_completed';
        break;
      case 'achievements':
        userValue = Array.isArray(userProfile.unlocked_achievements) 
          ? userProfile.unlocked_achievements.length 
          : 0;
        const { data: allProfiles } = await supabase
          .from('user_profiles')
          .select('unlocked_achievements');
        
        if (allProfiles) {
          const usersWithMoreAchievements = allProfiles.filter(p => {
            const count = Array.isArray(p.unlocked_achievements) ? p.unlocked_achievements.length : 0;
            return count > userValue;
          });
          return { data: usersWithMoreAchievements.length + 1, error: null };
        }
        return { data: 1, error: null };
      default:
        userValue = userProfile.xp || 0;
        compareColumn = 'xp';
    }

    const { data: betterUsers, error: rankError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .gt(compareColumn, userValue);

    if (rankError) {
      return { data: null, error: rankError };
    }

    const rank = (betterUsers?.length || 0) + 1;
    return { data: rank, error: null };

  } catch (error) {
    console.error('Exception getting user rank:', error);
    return { data: null, error };
  }
};

export const subscribeToLeaderboardUpdates = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('leaderboard_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_profiles'
      },
      callback
    )
    .subscribe();

  return subscription;
};

// UPDATED: Enhanced signup with proper display name setting
export const signUpWithEmail = async (email: string, password: string, username: string) => {
  try {
    console.log('🔄 Starting signup process for:', email, 'with username:', username)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          username: username,
          display_name: username,  // PRIMARY: Set the display_name to the chosen username
          full_name: username,     // Backup
          name: username          // Backup
        }
      }
    })

    if (error) {
      console.error('❌ Supabase signup error:', error)
      return { data: null, error }
    }

    console.log('✅ Signup response with auth display_name set:', {
      user: data.user?.id,
      display_name: data.user?.user_metadata?.display_name,
      full_name: data.user?.user_metadata?.full_name,
      username: data.user?.user_metadata?.username,
      session: !!data.session,
      needsConfirmation: !data.session && data.user && !data.user.email_confirmed_at
    })

    // Only create profile if user is confirmed or we have a session
    if (data.user && (data.session || data.user.email_confirmed_at)) {
      console.log('📝 Creating user profile with auth display name...')
      
      const profileResult = await supabase.from('user_profiles').upsert({
        id: data.user.id,
        name: data.user.user_metadata?.display_name || username, // Use auth display_name
        email: email,
        xp: 0,
        level: 1,
        coins: 0, // UPDATED: Changed from 100 to 0
        total_coins_earned: 0, // UPDATED: Changed from 100 to 0
        completed_lessons: [],
        hearts: 5,
        max_hearts: 5,
        last_heart_reset: new Date().toDateString(),
        current_avatar: 'default',
        owned_avatars: ['default'],
        unlocked_achievements: [],
        current_streak: 0,
        last_login_date: '',
        total_lessons_completed: 0,
        email_verified: !!data.user.email_confirmed_at,
        xp_boost_multiplier: 1,
        xp_boost_expires_at: 0,
        unlimited_hearts_expires_at: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (profileResult.error) {
        console.error('❌ Error creating profile:', profileResult.error)
      } else {
        console.log('✅ Profile created successfully with auth display name:', data.user.user_metadata?.display_name)
      }
    } else if (data.user && !data.session) {
      console.log('📧 User created but needs email confirmation')
    }

    return { data, error: null }
  } catch (err) {
    console.error('❌ Exception during signup:', err)
    return { data: null, error: err }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (data?.user && !error) {
      const streakResult = await updateLoginStreak(data.user.id)
      if (streakResult.data) {
        console.log('Streak updated:', streakResult.data.streak_message)
        return { data, error, streakData: streakResult.data }
      }
    }

    return { data, error }
  } catch (error) {
    console.error('Sign in exception:', error)
    return { data: null, error }
  }
}

// UPDATED: Enhanced Google sign-in for better display name handling
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://codhak.vercel.app`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    return { data, error }
  } catch (error) {
    console.error('Google sign in exception:', error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `https://codhak.vercel.app/auth/reset-password`
  })

  return { data, error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const isMockClient = false
export const getClientInfo = () => ({
  type: 'real',
  hasEnvVars: !!(supabaseUrl && supabaseAnonKey),
  isDevelopment: import.meta.env.DEV,
  supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
  supabaseKey: supabaseAnonKey ? '✅ Set' : '❌ Missing'
})

console.log('🔧 Supabase Client Info:', getClientInfo())
testConnection()
