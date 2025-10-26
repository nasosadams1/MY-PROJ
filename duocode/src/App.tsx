import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AuthContainer from './components/auth/AuthContainer';
import Sidebar from './components/Sidebar';
import Learn from './components/Learn';
import Store from './components/Store';
import RealTimeLeaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import DuelsDashboard from './components/DuelsDashboard';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/auth/LoadingScreen';
import { Menu, X } from 'lucide-react';
import AuthConfirm from './components/AuthConfirm';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('duels');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  const renderSection = () => {
    switch (currentSection) {
      case 'duels':
        return <DuelsDashboard />;
      case 'learn':
        return <Learn setCurrentSection={setCurrentSection} />;
      case 'store':
        return <Store />;
      case 'leaderboard':
        return (
          <div className="p-2 sm:p-4">
            <RealTimeLeaderboard
              currentUserId={user?.id || 'guest'}
              serverUrl="http://localhost:4000"
            />
          </div>
        );
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <DuelsDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        openAuthModal={() => setShowAuthModal(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">{renderSection()}</main>

      <AuthContainer
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
