import React, { useState, useEffect } from 'react';
import { Swords, Loader2, Trophy, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface MatchmakingQueueProps {
  socket: any;
  userId: string;
  username: string;
  rating: number;
  onMatchFound: (matchData: any) => void;
}

export default function MatchmakingQueue({
  socket,
  userId,
  username,
  rating,
  onMatchFound
}: MatchmakingQueueProps) {
  const [inQueue, setInQueue] = useState(false);
  const [matchType, setMatchType] = useState<'ranked' | 'casual'>('ranked');
  const [queueTime, setQueueTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let queueTimer: any = null;

    if (inQueue) {
      queueTimer = setInterval(() => {
        setQueueTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (queueTimer) clearInterval(queueTimer);
    };
  }, [inQueue]);

  useEffect(() => {
    socket.on('queue_joined', (data: any) => {
      toast.success(data.message);
      setInQueue(true);
      setQueueTime(0);
    });

    socket.on('queue_left', (data: any) => {
      toast(data.message);
      setInQueue(false);
      setQueueTime(0);
    });

    socket.on('match_found', (data: any) => {
      toast.success(`Match found! Opponent: ${data.opponent.username}`);
      setInQueue(false);
      setCountdown(data.countdown);

      let timeLeft = data.countdown;
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          onMatchFound(data);
        }
      }, 1000);
    });

    socket.on('error', (data: any) => {
      toast.error(data.message);
      setInQueue(false);
    });

    return () => {
      socket.off('queue_joined');
      socket.off('queue_left');
      socket.off('match_found');
      socket.off('error');
    };
  }, [socket, onMatchFound]);

  const handleJoinQueue = () => {
    socket.emit('register_player', { userId, username, rating });

    setTimeout(() => {
      socket.emit('join_matchmaking', {
        userId,
        rating,
        matchType
      });
    }, 100);
  };

  const handleLeaveQueue = () => {
    socket.emit('leave_matchmaking');
  };

  const formatQueueTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (countdown !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="mb-8">
            <Swords className="w-24 h-24 mx-auto text-blue-600 animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Match Starting!</h2>
          <div className="text-8xl font-bold text-blue-600 mb-4">{countdown}</div>
          <p className="text-gray-600">Prepare yourself...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Swords className="w-12 h-12" />
              <h1 className="text-4xl font-bold">Code Duels</h1>
            </div>
            <p className="text-center text-blue-100">
              Face off against opponents in real-time coding challenges
            </p>
          </div>

          <div className="p-8">
            {!inQueue ? (
              <>
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold text-gray-800">{rating}</div>
                      <div className="text-sm text-gray-600">Your Rating</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold text-gray-800">1v1</div>
                      <div className="text-sm text-gray-600">Duel Mode</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold text-gray-800">15:00</div>
                      <div className="text-sm text-gray-600">Time Limit</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Match Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setMatchType('ranked')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          matchType === 'ranked'
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Trophy className={`w-6 h-6 mx-auto mb-2 ${
                          matchType === 'ranked' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="font-semibold text-gray-800">Ranked</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Affects your rating
                        </div>
                      </button>
                      <button
                        onClick={() => setMatchType('casual')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          matchType === 'casual'
                            ? 'border-green-600 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Users className={`w-6 h-6 mx-auto mb-2 ${
                          matchType === 'casual' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div className="font-semibold text-gray-800">Casual</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Just for practice
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleJoinQueue}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Find Match
                </button>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-sm text-yellow-800 mb-2">How it Works:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• You'll be matched with an opponent of similar skill</li>
                    <li>• Both players solve the same coding problem</li>
                    <li>• First to pass all tests wins (or highest score at timeout)</li>
                    <li>• Your rating changes based on the match result</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 mx-auto mb-6 text-blue-600 animate-spin" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Searching for opponent...
                </h2>
                <p className="text-gray-600 mb-6">
                  This may take a moment
                </p>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="text-sm text-gray-600 mb-2">Queue Time</div>
                  <div className="text-4xl font-mono font-bold text-blue-600">
                    {formatQueueTime(queueTime)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Rating range: {Math.max(0, rating - 100)} - {rating + 100}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Range expands every 5 seconds
                  </div>
                </div>

                <button
                  onClick={handleLeaveQueue}
                  className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Cancel Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
