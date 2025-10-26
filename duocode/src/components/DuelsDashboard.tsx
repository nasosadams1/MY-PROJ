import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MatchmakingQueue from './MatchmakingQueue';
import DuelArena from './DuelArena';
import MatchResults from './MatchResults';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function DuelsDashboard() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<any>(null);
  const [duelUser, setDuelUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'queue' | 'arena' | 'results'>('queue');
  const [matchData, setMatchData] = useState<any>(null);
  const [matchResults, setMatchResults] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const initializeDuelUser = async () => {
      const { data: existingUser, error: fetchError } = await supabase
        .from('duel_users')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (existingUser) {
        setDuelUser(existingUser);
      } else {
        const { data: newUser, error: createError } = await supabase
          .from('duel_users')
          .insert({
            username: user.email?.split('@')[0] || 'Player',
            email: user.email || '',
            auth_user_id: user.id,
            rating: 1200
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating duel user:', createError);
          toast.error('Failed to initialize user profile');
        } else {
          setDuelUser(newUser);
        }
      }
    };

    initializeDuelUser();
  }, [user]);

  useEffect(() => {
    if (!duelUser) return;

    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Connected to duel server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from duel server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [duelUser]);

  const handleMatchFound = (data: any) => {
    setMatchData(data);
    setCurrentView('arena');
  };

  const handleMatchEnd = (results: any) => {
    setMatchResults(results);
    setCurrentView('results');
  };

  const handleCloseResults = () => {
    setCurrentView('queue');
    setMatchData(null);
    setMatchResults(null);
  };

  if (!user || !duelUser || !socket) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'queue' && (
        <MatchmakingQueue
          socket={socket}
          userId={duelUser.id}
          username={duelUser.username}
          rating={duelUser.rating}
          onMatchFound={handleMatchFound}
        />
      )}

      {currentView === 'arena' && matchData && (
        <DuelArena
          matchId={matchData.matchId}
          problem={matchData.problem}
          opponent={matchData.opponent}
          socket={socket}
          userId={duelUser.id}
          onMatchEnd={handleMatchEnd}
        />
      )}

      {currentView === 'results' && matchResults && (
        <MatchResults
          matchData={matchResults}
          userId={duelUser.id}
          onClose={handleCloseResults}
        />
      )}
    </>
  );
}
