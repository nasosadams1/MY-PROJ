import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BookOpen, Code, FolderOpen, Trophy, User as UserIcon, Zap, Heart, ShoppingCart, Store, LogOut, Loader2, Clock, Swords, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { avatars } from '../data/avatars';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  openAuthModal: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  setCurrentSection, 
  openAuthModal, 
  isOpen = true, 
  onClose 
}) => {
  const { user: authUser, signOut } = useAuth();
  const { user, resetHeartsIfNeeded, getActiveBoosts } = useUser();
  const [signingOut, setSigningOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second to show accurate boost timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ALWAYS call useEffect - don't conditionally call hooks
  useEffect(() => {
    if (authUser && resetHeartsIfNeeded) {
      resetHeartsIfNeeded();
    }
  }, [authUser, resetHeartsIfNeeded]);

  // Handle sign out
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const handleNavigation = (sectionId: string) => {
    setCurrentSection(sectionId);
    if (onClose) onClose(); // Close mobile sidebar after navigation
  };
  const navItems = [
    { id: 'duels', label: 'Code Duels', icon: Swords },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  // Get current avatar (with fallback)
  const currentAvatar = authUser && user ? 
    (avatars.find((a) => a.id === user.currentAvatar) || avatars[0]) : 
    null;

  const activeBoosts = authUser && user ? getActiveBoosts() : {};

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - currentTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-4 lg:mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Codhak</h1>
        </div>

        {/* User Profile Section */}
        <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
          {authUser && user ? (
            // Authenticated User
            <>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg">
                  {currentAvatar?.emoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500">Level {user.level}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 flex-wrap gap-1">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                  {user.coins} coins
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-1" />
                  {user.xp} XP
                </span>
              </div>

              <div className="flex items-center justify-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      activeBoosts.unlimitedHearts 
                        ? 'text-pink-500 fill-current animate-pulse' 
                        : i < user.hearts 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  {activeBoosts.unlimitedHearts ? '∞' : `${user.hearts}/5`}
                </span>
              </div>
              
              {/* Active Boosts Display */}
              {(activeBoosts.xpBoost || activeBoosts.unlimitedHearts) && (
                <div className="mt-2 space-y-1">
                  {activeBoosts.xpBoost && (
                    <div className="flex items-center justify-between text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex-wrap">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{activeBoosts.xpBoost.multiplier}x XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeRemaining(activeBoosts.xpBoost.expiresAt)}</span>
                      </div>
                    </div>
                  )}
                  {activeBoosts.unlimitedHearts && (
                    <div className="flex items-center justify-between text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded flex-wrap">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>Unlimited ❤️</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeRemaining(activeBoosts.unlimitedHearts.expiresAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Guest User
            <>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg">?</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Guest</p>
                  <p className="text-xs text-gray-500">Not signed in</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 flex-wrap gap-1">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                  0 coins
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-1" />
                  0 XP
                </span>
              </div>

              <div className="flex items-center justify-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Heart key={i} className="w-4 h-4 text-gray-300" />
                ))}
                <span className="text-xs text-gray-600 ml-1">0/5</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {authUser && user ? (
          // Authenticated User Actions
          <div className="mt-4 space-y-2">
           
            
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // Guest User Actions
          <div className="mt-4 text-center">
            <button
              onClick={openAuthModal}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Sign In / Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">Keep coding, keep growing! 🚀</p>
      </div>
    </div>
  );
};

export default Sidebar;
