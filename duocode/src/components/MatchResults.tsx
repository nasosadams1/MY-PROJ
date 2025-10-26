import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, ArrowRight, Clock } from 'lucide-react';

interface MatchResultsProps {
  matchData: any;
  userId: string;
  onClose: () => void;
  onViewReplay?: () => void;
}

export default function MatchResults({ matchData, userId, onClose, onViewReplay }: MatchResultsProps) {
  const isWinner = matchData.winnerId === userId;
  const isDraw = !matchData.winnerId;
  const playerData = matchData.playerA.userId === userId ? matchData.playerA : matchData.playerB;
  const opponentData = matchData.playerA.userId === userId ? matchData.playerB : matchData.playerA;

  const getRatingChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className={`p-8 text-white ${
          isWinner ? 'bg-gradient-to-r from-green-600 to-green-700' :
          isDraw ? 'bg-gradient-to-r from-gray-600 to-gray-700' :
          'bg-gradient-to-r from-red-600 to-red-700'
        }`}>
          <div className="text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-2">
              {isWinner ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat'}
            </h2>
            <p className="text-lg opacity-90">
              {isWinner ? 'Well played! You won the duel!' :
               isDraw ? 'Both players tied!' :
               'Better luck next time!'}
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Match Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{Math.floor(matchData.duration / 60)}:{(matchData.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="font-semibold text-gray-800">
                  {matchData.reason.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Rating Changes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`border-2 rounded-lg p-4 ${
                isWinner ? 'border-green-500 bg-green-50' :
                isDraw ? 'border-gray-300 bg-gray-50' :
                'border-red-500 bg-red-50'
              }`}>
                <div className="text-sm text-gray-600 mb-1">You</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">{playerData.ratingBefore}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-800">{playerData.ratingAfter}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getRatingChangeIcon(playerData.ratingChange)}
                  <span className={`font-semibold ${getRatingChangeColor(playerData.ratingChange)}`}>
                    {playerData.ratingChange > 0 ? '+' : ''}{playerData.ratingChange}
                  </span>
                </div>
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">Opponent</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">{opponentData.ratingBefore}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-800">{opponentData.ratingAfter}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getRatingChangeIcon(opponentData.ratingChange)}
                  <span className={`font-semibold ${getRatingChangeColor(opponentData.ratingChange)}`}>
                    {opponentData.ratingChange > 0 ? '+' : ''}{opponentData.ratingChange}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Your Score</div>
                <div className="text-3xl font-bold text-blue-600">
                  {playerData.submission?.score?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {playerData.submission?.passed || 0}/{playerData.submission?.total || 0} tests passed
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Opponent Score</div>
                <div className="text-3xl font-bold text-gray-600">
                  {opponentData.submission?.score?.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {opponentData.submission?.passed || 0}/{opponentData.submission?.total || 0} tests passed
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {onViewReplay && (
              <button
                onClick={onViewReplay}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Replay
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
