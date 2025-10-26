import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Clock, Trophy, Target, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface DuelArenaProps {
  matchId: string;
  problem: {
    id: string;
    title: string;
    statement: string;
    difficulty: string;
    timeLimit: number;
    supportedLanguages: string[];
  };
  opponent: {
    username: string;
    rating: number;
  };
  socket: any;
  userId: string;
  onMatchEnd: (result: any) => void;
}

export default function DuelArena({
  matchId,
  problem,
  opponent,
  socket,
  userId,
  onMatchEnd
}: DuelArenaProps) {
  const [code, setCode] = useState('// Write your solution here\nfunction solution(input) {\n  \n}');
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(problem.timeLimit);
  const [testResults, setTestResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opponentStatus, setOpponentStatus] = useState<any>(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const snapshotIntervalRef = useRef<any>(null);

  useEffect(() => {
    socket.on('duel_started', (data: any) => {
      if (data.matchId === matchId) {
        setMatchStarted(true);
        toast.success('Duel started! Good luck!');
      }
    });

    socket.on('submission_result', (data: any) => {
      setTestResults(data);
      setIsSubmitting(false);

      if (data.result === 'accepted') {
        toast.success(`All tests passed! (${data.passed}/${data.total})`);
      } else {
        toast.error(`${data.result.replace(/_/g, ' ')} - ${data.passed}/${data.total} tests passed`);
      }
    });

    socket.on('opponent_submitted', (data: any) => {
      setOpponentStatus(data);

      if (data.result === 'accepted') {
        toast.error('Opponent passed all tests!');
      } else {
        toast(`Opponent submitted: ${data.passed}/${data.total} tests passed`, {
          icon: '⚔️'
        });
      }
    });

    socket.on('match_end', (data: any) => {
      clearInterval(snapshotIntervalRef.current);
      onMatchEnd(data);
    });

    socket.on('submission_error', (data: any) => {
      toast.error(data.message);
      setIsSubmitting(false);
    });

    return () => {
      socket.off('duel_started');
      socket.off('submission_result');
      socket.off('opponent_submitted');
      socket.off('match_end');
      socket.off('submission_error');
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
      }
    };
  }, [matchId, socket, onMatchEnd]);

  useEffect(() => {
    if (!matchStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    snapshotIntervalRef.current = setInterval(() => {
      socket.emit('code_snapshot', {
        matchId,
        userId,
        code
      });
    }, 30000);

    return () => {
      clearInterval(timer);
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
      }
    };
  }, [matchStarted, matchId, userId, code, socket]);

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setIsSubmitting(true);
    socket.emit('submit_code', {
      matchId,
      userId,
      language,
      code
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">{problem.title}</h2>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <div className="text-sm">
                    <div className="font-semibold">vs {opponent.username}</div>
                    <div className="text-blue-200 text-xs">Rating: {opponent.rating}</div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded ${timeRemaining < 60 ? 'bg-red-500' : 'bg-blue-800'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-mono font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Problem Statement</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{problem.statement}</p>
                </div>
              </div>

              {testResults && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Test Results</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        testResults.result === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {testResults.result.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tests Passed:</span>
                      <span className="text-sm">{testResults.passed}/{testResults.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score:</span>
                      <span className="text-sm font-bold">{testResults.score.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Runtime:</span>
                      <span className="text-sm">{testResults.runtimeMs}ms</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {testResults.testResults?.map((test: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-xs ${
                          test.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Test {test.testNumber}:</span>
                          <span className={test.passed ? 'text-green-600' : 'text-red-600'}>
                            {test.passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                        {test.error && (
                          <div className="mt-1 text-red-600">Error: {test.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opponentStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-sm">Opponent Status</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Tests Passed: {opponentStatus.passed}/{opponentStatus.total}</div>
                    <div>Score: {opponentStatus.score.toFixed(1)}%</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {problem.supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || timeRemaining === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  <Play className="w-4 h-4" />
                  {isSubmitting ? 'Running...' : 'Submit Solution'}
                </button>
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
