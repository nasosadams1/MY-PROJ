import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import {
  supabase,
  UserProfile,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  getUserProfile,
  createUserProfile,
  updateUserProfile as supabaseUpdateUserProfile,
  updateLoginStreak,
  handleOAuthLoginStreak,
  testConnection,
  getDisplayName // NEW: Import display name function
} from '../lib/supabase'

interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error: any; needsConfirmation?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: any; streakData?: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refetchProfile: () => Promise<void>
  setNavigationCallback: (callback: () => void) => void
  confirmUser: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const navigationCallbackRef = useRef<(() => void) | null>(null)
  const leaderboardSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncDataRef = useRef<string>('')

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection()
      if (!isConnected) {
        console.error('❌ Supabase connection failed. Please check your environment variables.')
      } else {
        console.log('✅ Supabase connection successful')
      }
    }
    checkConnection()
  }, [])

  // CRITICAL FIX: Clear corrupted session function
  const clearCorruptedSession = async () => {
    try {
      console.log('🧹 Clearing potentially corrupted session...')
      
      // Clear localStorage and sessionStorage
      localStorage.clear()
      sessionStorage.clear()
      
      // Sign out to clear any server-side session
      await supabase.auth.signOut()
      
      // Force reload the page to start fresh
      window.location.reload()
    } catch (error) {
      console.error('Error clearing session:', error)
      // Force reload anyway
      window.location.reload()
    }
  }

  // Enhanced leaderboard sync with proper data mapping and change detection
  const syncProfileToLeaderboard = useCallback(async (profileData: UserProfile) => {
    if (!profileData || !profileData.id || profileData.id === 'guest') {
      console.warn('⚠️ AuthContext: Skipping leaderboard sync due to invalid profile data or guest user.')
      return
    }

    // Calculate achievements count safely
    const achievementsCount = Array.isArray(profileData.unlocked_achievements)
      ? profileData.unlocked_achievements.length
      : 0

    const payload = {
      name: profileData.name || 'Unknown User', // This is now the display name
      userId: profileData.id,
      avatar: profileData.current_avatar || '👤',
      badge: 'Learner',
      xp: Math.max(0, profileData.xp || 0),
      level: Math.max(1, profileData.level || 1),
      completedLessons: Math.max(0, profileData.total_lessons_completed || 0),
      projects: 0, // Static for now
      streak: Math.max(0, profileData.current_streak || 0),
      achievements: Math.max(0, achievementsCount),
      xpDelta: 0 // Will be calculated by backend based on previous state
    }

    // Check if data has actually changed to avoid unnecessary syncs
    const currentDataHash = JSON.stringify(payload)
    if (currentDataHash === lastSyncDataRef.current) {
      console.log('📊 AuthContext: No changes detected, skipping leaderboard sync')
      return
    }
    lastSyncDataRef.current = currentDataHash

    if (leaderboardSyncTimeoutRef.current) {
      clearTimeout(leaderboardSyncTimeoutRef.current)
    }

    leaderboardSyncTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('🔄 AuthContext: Syncing profile to leaderboard with display name:', {
          name: payload.name,
          userId: payload.userId,
          xp: payload.xp,
          lessons: payload.completedLessons,
          achievements: payload.achievements,
          streak: payload.streak
        })

        const response = await fetch('http://localhost:4000/submit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const result = await response.json()
        console.log('✅ AuthContext: Profile successfully synced to leaderboard with display name:', result)
      } catch (error) {
        console.error('❌ AuthContext: Failed to sync profile to leaderboard:', error)
        // Reset the hash so we can retry on next change
        lastSyncDataRef.current = ''
      }
    }, 500)
  }, [])

  // CRITICAL FIX: Updated fetchProfile function with proper error handling
  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`🔄 AuthContext: Fetching profile for user: ${userId} (attempt ${retryCount + 1})`)

      // Add a small delay to prevent rapid retries
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // CRITICAL FIX: Use the updated getUserProfile function which now uses maybeSingle()
      const { data, error } = await getUserProfile(userId)

      
      // CRITICAL FIX: Handle null data from maybeSingle()
      if (!data) {
        console.log('No profile data returned, creating new profile...')
        await createProfileManually(userId)
        return
      }

      if (data) {
        console.log('✅ AuthContext: Profile found in database with display name:', {
          name: data.name, // This is now the display name from auth
          xp: data.xp,
          lessons: data.total_lessons_completed,
          coins: data.coins,
          achievements: data.unlocked_achievements?.length || 0
        })
        setProfile(data)
        await syncProfileToLeaderboard(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      setLoading(false)
    }
  }

  const refetchProfile = useCallback(async () => {
    if (user?.id) {
      console.log('🔄 AuthContext: Refetching profile from database...')
      setLoading(true)
      await fetchProfile(user.id)
    }
  }, [user?.id])

  // CRITICAL FIX: Enhanced profile creation with JWT corruption handling
  const createProfileManually = async (userId: string, preferredUsername?: string) => {
    try {
      console.log('Creating profile manually for user:', userId, 'with preferred username:', preferredUsername)

      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('Error getting current user:', userError)
        
        // CRITICAL FIX: If user doesn't exist in JWT, clear the corrupted session
        if (userError.message?.includes('User from sub claim in JWT does not exist')) {
          console.log('🚨 Detected corrupted JWT, clearing session...')
          await clearCorruptedSession()
          return
        }
        
        setLoading(false)
        return
      }

      if (!currentUser) {
        console.error('No current user found')
        setLoading(false)
        return
      }

      const userEmail = currentUser.email || ''
      
      // UPDATED: Use display name from auth metadata with priority order
      let userName = preferredUsername ||
                     currentUser.user_metadata?.display_name ||
                     currentUser.user_metadata?.full_name ||
                     currentUser.user_metadata?.name ||
                     currentUser.user_metadata?.username

      // If no good name found, use email prefix but make it more user-friendly
      if (!userName || userName.length < 2) {
        const emailPrefix = userEmail.split('@')[0]
        if (emailPrefix && emailPrefix.length >= 2) {
          userName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).toLowerCase()
        } else {
          userName = 'User'
        }
      }

      // Clean up the name
      userName = userName.trim()
      
      // Generate unique name if it's still problematic
      if (!userName || 
          userName.length < 2 || 
          ['master', 'default', 'admin', 'root', 'user', 'test'].includes(userName.toLowerCase())) {
        
        const timestamp = Date.now().toString().slice(-6)
        const randomSuffix = Math.random().toString(36).substring(2, 5)
        userName = `User_${timestamp}_${randomSuffix}`
        
        console.log(`🔧 Generated safe username: ${userName} (rejected: ${preferredUsername || 'undefined'})`)
      }

      console.log('Creating profile with display name:', userName)

      const newProfile: Omit<UserProfile, 'created_at' | 'updated_at'> = {
        id: userId,
        name: userName, // This will be the display name from auth
        email: userEmail,
        coins: 0, // UPDATED: Changed from 100 to 0
        total_coins_earned: 0, // UPDATED: Changed from 100 to 0
        xp: 0,
        completed_lessons: [],
        level: 1,
        hearts: 5,
        max_hearts: 5,
        last_heart_reset: new Date().toDateString(),
        current_avatar: 'default',
        owned_avatars: ['default'],
        unlocked_achievements: [],
        current_streak: 0,
        last_login_date: '',
        total_lessons_completed: 0,
        email_verified: !!currentUser.email_confirmed_at,
        xp_boost_multiplier: 1,
        xp_boost_expires_at: 0,
        unlimited_hearts_expires_at: 0
      }

      const { data, error } = await createUserProfile(userId, newProfile) // This uses display name

      if (error) {
        console.error('Error creating profile manually:', error)
        setLoading(false)
        return
      }

      if (data) {
        console.log('✅ Profile created manually with display name:', data.name)
        setProfile(data)
        await syncProfileToLeaderboard(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Unexpected error creating profile manually:', error)
      setLoading(false)
    }
  }

  // NEW: Function to sync display name periodically
  const syncDisplayName = useCallback(async () => {
    if (!user?.id || user.id === 'guest' || !profile) return

    try {
      const displayName = await getDisplayName(user.id)
      
      // Update profile if display name is different and valid
      if (displayName && displayName !== profile.name && displayName !== 'Unknown User') {
        console.log('🔄 AuthContext: Syncing display name from auth:', displayName, '(was:', profile.name, ')')
        
        await updateProfile({ name: displayName })
      }
    } catch (error) {
      console.error('Error syncing display name:', error)
    }
  }, [user?.id, profile?.name])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔄 AuthContext: Initial session:', !!session)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log('🔄 AuthContext: Initial session found, fetching profile for user:', session.user.id)
        fetchProfile(session.user.id)
      } else {
        console.log('🔄 AuthContext: No initial session found')
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthContext: Auth state change:', event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔄 AuthContext: User signed in, fetching fresh profile...')
        
        // Handle OAuth login streak update
        if (session.user.app_metadata?.provider === 'google') {
          const streakResult = await handleOAuthLoginStreak(session.user.id)
          if (streakResult.data) {
            console.log('OAuth streak updated:', streakResult.data.streak_message)
          }
        }
        
        fetchProfile(session.user.id)

        setTimeout(() => {
          if (navigationCallbackRef.current) {
            navigationCallbackRef.current()
          }
        }, 1000)

      } else if (event === 'SIGNED_OUT') {
        console.log('🔄 AuthContext: User signed out, clearing profile')
        setProfile(null)
        lastSyncDataRef.current = '' // Reset sync data
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (leaderboardSyncTimeoutRef.current) {
        clearTimeout(leaderboardSyncTimeoutRef.current)
      }
    }
  }, [])

  // NEW: Sync display name when user or profile changes
  useEffect(() => {
    if (user?.id && profile) {
      syncDisplayName()
    }
  }, [user?.id, profile?.id, syncDisplayName])

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('name', username.trim())

      if (error) {
        console.error('Error checking username:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Error checking username:', error)
      return false
    }
  }

  // UPDATED: Enhanced signup with display name handling
  const signUp = async (email: string, password: string, username: string) => {
    console.log('Starting signup process with username:', username)

    try {
      const usernameExists = await checkUsernameExists(username.trim())
      if (usernameExists) {
        return { error: { message: 'Username already taken' } }
      }

      console.log('Calling signUpWithEmail with username:', username.trim())
      const { data, error } = await signUpWithEmail(email.trim(), password, username.trim())

    
      // Check if email confirmation is needed
      const needsConfirmation = data?.user && !data?.session && !data?.user?.email_confirmed_at
      
      console.log('Signup successful with display name:', {
        username: username.trim(),
        userId: data?.user?.id,
        display_name: data?.user?.user_metadata?.display_name,
        needsConfirmation
      })

      return { 
        error: null, 
        needsConfirmation: !!needsConfirmation
      }
    } catch (err: any) {
      console.error('Signup catch error:', err)
      return { error: { message: 'Network connection failed. Please check your internet connection and try again.' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email.trim())

      const { data, error, streakData } = await signInWithEmail(email.trim(), password)

      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      console.log('Sign in successful for:', data?.user?.id)
      
      // Return streak data if available
      if (streakData) {
        return { error: null, streakData }
      }
      
      return { error: null }
    } catch (err: any) {
      console.error('Sign in catch error:', err)
      return { error: { message: 'An unexpected error occurred during sign in' } }
    }
  }

  const confirmUser = async (email: string) => {
    try {
      console.log('Manual confirmation needed for:', email)
      return { error: { message: 'Manual confirmation required' } }
    } catch (error) {
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabaseSignInWithGoogle()
    return { error }
  }

  const signOut = async () => {
    console.log('Signing out...')
    await supabaseSignOut()
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabaseResetPassword(email)
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.warn('❌ AuthContext: Cannot update profile - no authenticated user')
      return
    }

    console.log('🔄 AuthContext: updateProfile called with:', updates)

    try {
      // Update database first (this will also sync display name if needed)
      const { data, error } = await supabaseUpdateUserProfile(user.id, updates)

      if (error) {
        console.error('❌ AuthContext: Error updating profile in database:', error)
        throw error
      }

      if (data) {
        console.log('✅ AuthContext: Profile updated in database with display name:', {
          name: data.name, // This is now the display name
          xp: data.xp,
          totalLessons: data.total_lessons_completed,
          coins: data.coins,
          achievements: data.unlocked_achievements?.length || 0
        })
        
        // Update local state with fresh data from database
        setProfile(data)
        
        // Sync to leaderboard with updated data
        await syncProfileToLeaderboard(data)
      }
    } catch (error) {
      console.error('❌ AuthContext: Unexpected error updating profile:', error)
      throw error
    }
  }

  const setNavigationCallback = (callback: () => void) => {
    navigationCallbackRef.current = callback
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      refetchProfile,
      setNavigationCallback,
      confirmUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Simplified AuthUserSync without complex logic
const AuthUserSync: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}

export const AuthProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthUserSync>
        {children}
      </AuthUserSync>
    </AuthProvider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
