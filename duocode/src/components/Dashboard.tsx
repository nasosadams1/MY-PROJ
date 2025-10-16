import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import Profile from './Profile'
import Leaderboard from './Leaderboard'
import { User, Trophy, LogOut, Home, Target, Award } from 'lucide-react'

type View = 'home' | 'profile' | 'leaderboard'

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home')
  const { signOut, profile } = useAuth()
  const { user } = useUser()

  const handleSignOut = async () => {
    await signOut()
  }

  const navigation = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy }
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <Profile />
      case 'leaderboard':
        return <Leaderboard currentUserId={profile?.id} />
      default:
        return (
          <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600 text-xl">Ready to continue your coding journey?</p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🪙</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.coins}</h3>
                  <p className="text-gray-600 text-sm">Coins</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.xp}</h3>
                  <p className="text-gray-600 text-sm">XP</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.level}</h3>
                  <p className="text-gray-600 text-sm">Level</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.currentStreak}</h3>
                  <p className="text-gray-600 text-sm">Day Streak</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button className="p-6 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-left">
                    <div className="text-4xl mb-3">🐍</div>
                    <h3 className="font-bold text-gray-900 mb-2">Python Basics</h3>
                    <p className="text-gray-600 text-sm">Continue with variables and data types</p>
                  </button>
                  
                  <button className="p-6 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors text-left">
                    <div className="text-4xl mb-3">🗄️</div>
                    <h3 className="font-bold text-gray-900 mb-2">SQL Queries</h3>
                    <p className="text-gray-600 text-sm">Learn advanced database operations</p>
                  </button>
                  
                  <button className="p-6 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors text-left">
                    <div className="text-4xl mb-3">🌐</div>
                    <h3 className="font-bold text-gray-900 mb-2">HTML & CSS</h3>
                    <p className="text-gray-600 text-sm">Build responsive web layouts</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">CodeLingo</span>
              </div>
              
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Level {user.level}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg">
                {user.currentAvatar === 'default' ? '👤' : 
                 user.currentAvatar === 'cool' ? '😎' : '🚀'}
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>Q
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 py-3 px-2 text-center transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}

export default Dashboard