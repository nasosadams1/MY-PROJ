import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Medal,
  Flame,
  Trophy,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Target,
  TrendingUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Award,
  BookOpen
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { 
  supabase,
  getLeaderboardData, 
  getUserRank, 
  subscribeToLeaderboardUpdates
} from "../lib/supabase";

// Types
type PeriodKey = "all" | "month" | "week";
type RankingCategory = "xp" | "lessons" | "achievements";

// Updated LeaderboardEntry interface to match actual data structure
interface LeaderboardEntry {
  user_id: string;
  xp: number;
  total_lessons_completed: number;
  achievements_count: number;
  current_streak: number;
  level: number;
  rank: number;
  user_profiles: {
    name: string;
    current_avatar: string;
  };
}

type Player = {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  level: number;
  xp: number;
  lessons: number;
  projects: number;
  streak: number;
  achievements: number;
  globalRank?: number;
  lessonsRank?: number;
  achievementsRank?: number;
  isYou?: boolean;
  user_id?: string;
};

type LeaderboardData = {
  players: Player[];
  totalPlayers: number;
  yourRank: number;
  yourLessonsRank: number;
  yourAchievementsRank: number;
  yourStats: Player | null;
};

// Avatar mapping function
const getAvatarEmoji = (avatarId: string): string => {
  const avatarMap: { [key: string]: string } = {
    'default': '👤',
    'coder': '👨‍💻',
    'scientist': '👩‍🔬',
    'wizard': '🧙‍♂️',
    'ninja': '🥷',
    'robot': '🤖',
    'alien': '👽',
    'superhero': '🦸‍♂️',
    'dragon': '🐉',
    'crown': '👑',
    'master': '🏆'
  };
  
  return avatarMap[avatarId] || '👤'; // Default fallback
};

// Enhanced Live Data Hook with Direct Supabase Integration using Foreign Keys
export function useLiveLeaderboard(period: PeriodKey, page: number = 1, userId?: string) {
  const [data, setData] = useState<LeaderboardData>({
    players: [],
    totalPlayers: 0,
    yourRank: 0,
    yourLessonsRank: 0,
    yourAchievementsRank: 0,
    yourStats: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (targetPage: number, sortBy: RankingCategory = 'xp') => {
    if (targetPage < 1) return;

    setLoading(true);
    setError(null);

    try {
      console.log('📊 Fetching leaderboard with foreign key relationships:', {
        page: targetPage,
        userId: userId,
        sortBy: sortBy
      });

      const limit = 100;
      const offset = (targetPage - 1) * limit;

      // Fetch leaderboard data using the enhanced function
      const { data: leaderboardData, error: leaderboardError } = await getLeaderboardData(limit, offset, sortBy);

      

      if (!leaderboardData || !Array.isArray(leaderboardData)) {
        throw new Error('Invalid leaderboard data received');
      }

      // Transform the data to match our Player interface
      const processedPlayers: Player[] = leaderboardData.map((entry: LeaderboardEntry, index: number) => ({
        id: entry.user_id,
        user_id: entry.user_id,
        name: entry.user_profiles?.name || 'Unknown Player', // Safe access with fallback
        xp: entry.xp || 0,
        lessons: entry.total_lessons_completed || 0,
        achievements: entry.achievements_count || 0,
        streak: entry.current_streak || 0,
        level: entry.level || 1,
        projects: 0, // Static for now
        avatar: entry.user_profiles?.current_avatar || 'default',
        globalRank: entry.rank || (offset + index + 1),
        lessonsRank: entry.rank || (offset + index + 1), // Will be different based on sort
        achievementsRank: entry.rank || (offset + index + 1), // Will be different based on sort
      }));

      // Get total count
      const { count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const totalPlayers = count || 0;

      // Get user's stats and ranks if userId is provided
      let yourStats: Player | null = null;
      let yourRank = 0;
      let yourLessonsRank = 0;
      let yourAchievementsRank = 0;

      if (userId && userId !== 'guest') {
        // Get user's current stats
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userProfile) {
          const userAchievementsCount = Array.isArray(userProfile.unlocked_achievements) 
            ? userProfile.unlocked_achievements.length 
            : 0;

          yourStats = {
            id: userProfile.id,
            user_id: userProfile.id,
            name: userProfile.name || 'You', // Always current from database
            xp: userProfile.xp || 0,
            lessons: userProfile.total_lessons_completed || 0,
            achievements: userAchievementsCount,
            streak: userProfile.current_streak || 0,
            level: userProfile.level || 1,
            projects: 0,
            avatar: userProfile.current_avatar || 'default',
          };

          // Get ranks for each category
          const [xpRankResult, lessonsRankResult, achievementsRankResult] = await Promise.all([
            getUserRank(userId, 'xp'),
            getUserRank(userId, 'lessons'),
            getUserRank(userId, 'achievements')
          ]);

          yourRank = xpRankResult.data || 0;
          yourLessonsRank = lessonsRankResult.data || 0;
          yourAchievementsRank = achievementsRankResult.data || 0;
        }
      }

      setData({
        players: processedPlayers,
        totalPlayers,
        yourRank,
        yourLessonsRank,
        yourAchievementsRank,
        yourStats
      });

      console.log('✅ Leaderboard data processed with foreign key names:', {
        playersCount: processedPlayers.length,
        sampleNames: processedPlayers.slice(0, 3).map(p => p.name),
        yourStats: yourStats?.name
      });
      
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error);
      setError(error.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Set up real-time subscription for profile changes
    const subscription = subscribeToLeaderboardUpdates((payload) => {
      console.log('Real-time profile update received:', payload);
      
      // Debounce the refresh to avoid too many updates
      setTimeout(() => {
        fetchLeaderboard(page, 'xp');
      }, 100);
    });

    // Initial fetch
    fetchLeaderboard(page, 'xp');

    return () => {
      console.log('Cleaning up leaderboard subscription');
      subscription.unsubscribe();
    };
  }, [period, page, fetchLeaderboard]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchLeaderboard
  };
}

// UI Helper Components
const medalForIndex = (globalRank: number) => {
  if (globalRank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (globalRank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (globalRank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-semibold text-gray-500">#{globalRank}</span>;
};

const Tab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
      active
        ? "bg-blue-600 text-white border-blue-600 shadow-md"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
    }`}
  >
    {children}
  </button>
);

const StatPill: React.FC<{ label: string; value: number; tone: "green" | "blue" | "orange" | "purple" }> = ({
  label,
  value,
  tone,
}) => (
  <div className="flex items-center space-x-1 text-xs text-gray-600">
    <span
      className={`w-2 h-2 rounded-full \${
        tone === "green" ? "bg-green-500" :
        tone === "blue" ? "bg-blue-500" :
        tone === "purple" ? "bg-purple-500" :
        "bg-orange-500"
      }`}
    />
    <span className="font-semibold text-gray-800">{value.toLocaleString()}</span>
    <span>{label}</span>
  </div>
);

const Row = React.forwardRef<
  HTMLDivElement,
  {
    player: Player;
    isYou: boolean;
    isHighlighted?: boolean;
    sortBy: RankingCategory;
  }
>(({ player, isYou, isHighlighted = false, sortBy }, ref) => {
  const rank = sortBy === "lessons" ? (player.lessonsRank ?? 0) :
               sortBy === "achievements" ? (player.achievementsRank ?? 0) :
               (player.globalRank ?? 0);

  const rowTone = rank === 1
    ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
    : rank === 2
    ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
    : rank === 3
    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
    : isYou || isHighlighted
    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 ring-2 ring-blue-200"
    : "bg-white border-gray-200";

  const ringTone = rank === 1
    ? "ring-yellow-300"
    : rank === 2
    ? "ring-gray-300"
    : rank === 3
    ? "ring-amber-300"
    : isYou || isHighlighted
    ? "ring-blue-400"
    : "ring-gray-200";

  const primaryValue = sortBy === "lessons" ? (player.lessons ?? 0) :
                      sortBy === "achievements" ? (player.achievements ?? 0) :
                      (player.xp ?? 0);

  const primaryLabel = sortBy === "lessons" ? "Lessons" :
                      sortBy === "achievements" ? "Achievements" :
                      "Total XP";

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-xl ${rowTone} border p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 ${
        isHighlighted ? 'border-t-4 border-t-blue-500' : ''
      }`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 flex justify-center">{medalForIndex(rank)}</div>
        <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ring-2 ${ringTone} text-lg`}>
          {getAvatarEmoji(player.avatar || 'default')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 truncate text-base">
              {player.name} {/* This now always shows the latest name from the database */}
              {(isYou || isHighlighted) && <span className="ml-2 text-blue-600 font-bold">(You)</span>}
            </p>
            {player.title && (
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 whitespace-nowrap font-medium">
                {player.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-500">Level {player.level ?? 1}</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">
                {(player.xp ?? 0).toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{primaryValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{primaryLabel}</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <StatPill label="Lessons" value={player.lessons ?? 0} tone="green" />
          <StatPill label="Achievements" value={player.achievements ?? 0} tone="purple" />
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-gray-800">{player.streak ?? 0}</span>
            <span>Streak</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

Row.displayName = 'Row';

// Enhanced Ranking Dropdown
const RankingDropdown: React.FC<{
  data: LeaderboardData;
  period: PeriodKey;
  currentCategory: RankingCategory;
  onCategoryChange: (category: RankingCategory) => void;
}> = ({ data, period, currentCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const periodLabel = period === "all" ? "All Time" : period === "month" ? "This Month" : "This Week";

  const categories = [
    {
      id: "xp" as RankingCategory,
      label: "Total XP",
      icon: Trophy,
      rank: data.yourRank ?? 0,
      color: "text-yellow-500"
    },
    {
      id: "lessons" as RankingCategory,
      label: "Lessons Completed",
      icon: BookOpen,
      rank: data.yourLessonsRank ?? 0,
      color: "text-green-500"
    },
    {
      id: "achievements" as RankingCategory,
      label: "Achievements",
      icon: Award,
      rank: data.yourAchievementsRank ?? 0,
      color: "text-purple-500"
    },
  ];

  const currentCategoryData = categories.find(cat => cat.id === currentCategory);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Your Rankings</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{periodLabel}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            {currentCategoryData && (
              <>
                <currentCategoryData.icon className={`w-4 h-4 ${currentCategoryData.color}`} />
                <span className="font-medium text-gray-900">{currentCategoryData.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600 text-lg">
              #{currentCategoryData?.rank || 0}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentCategory === category.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${category.color}`} />
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                  <span className="font-bold text-gray-700">#{category.rank}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Avatar icons are now displayed properly from your profile!
        </p>
      </div>
    </div>
  );
};

const YourStats: React.FC<{ data: LeaderboardData; period: PeriodKey }> = ({ data, period }) => {
  const periodLabel = period === "all" ? "All Time" : period === "month" ? "This Month" : "This Week";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-900">Your Stats</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{periodLabel}</span>
      </div>
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total XP</p>
            <p className="font-bold text-gray-900">{data?.yourStats?.xp?.toLocaleString() ?? 0}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Level</p>
            <p className="font-bold text-gray-900">{data?.yourStats?.level ?? 1}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Lessons</p>
            <p className="font-bold text-gray-900">{data?.yourStats?.lessons ?? 0}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Achievements</p>
            <p className="font-bold text-gray-900">{data?.yourStats?.achievements ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalPlayers: number;
  loading: boolean;
}> = ({ currentPage, totalPages, onPageChange, totalPlayers, loading }) => {
  const startRange = (currentPage - 1) * 100 + 1;
  const endRange = Math.min(currentPage * 100, totalPlayers);

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>
          Showing {startRange}-{endRange} of {totalPlayers.toLocaleString()} players
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
          First
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Last
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <div className="text-red-500 mb-4">
      <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p className="text-lg font-medium">Unable to load leaderboard</p>
      <p className="text-sm text-gray-600 mt-1">{error}</p>
    </div>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Main Component
export default function RealTimeLeaderboard({
  serverUrl = "http://localhost:4000",
  currentUserId,
}: {
  serverUrl?: string;
  currentUserId?: string;
}) {
  const { user } = useUser();
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Player>("xp");
  const [descending, setDescending] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>("xp");

  // Determine the effective user ID for leaderboard queries
  const effectiveUserId = currentUserId || user?.id || profile?.id;

  // Use the enhanced live leaderboard hook
  const { data, loading, error, refetch } = useLiveLeaderboard(period, currentPage, effectiveUserId);

  const filteredPlayers = useMemo(() => {
    if (!data?.players || !Array.isArray(data.players)) return [];

    let players = data.players.filter((p) => {
      if (!p || typeof p !== 'object') return false;
      const name = p.name || '';
      return name.toLowerCase().includes(query.toLowerCase());
    });

    // Sort based on ranking category
    if (rankingCategory === "lessons") {
      players.sort((a, b) => {
        const aLessons = a.lessons ?? 0;
        const bLessons = b.lessons ?? 0;
        return descending ? bLessons - aLessons : aLessons - bLessons;
      });
    } else if (rankingCategory === "achievements") {
      players.sort((a, b) => {
        const aAchievements = a.achievements ?? 0;
        const bAchievements = b.achievements ?? 0;
        return descending ? bAchievements - aAchievements : aAchievements - bAchievements;
      });
    } else {
      players.sort((a, b) => {
        const aXp = a.xp ?? 0;
        const bXp = b.xp ?? 0;
        return descending ? bXp - aXp : aXp - bXp;
      });
    }

    return players;
  }, [data?.players, query, rankingCategory, descending]);

  const totalPages = Math.max(1, Math.ceil((data?.totalPlayers ?? 0) / 100));

  const userInCurrentPage = useMemo(() => {
    if (!effectiveUserId) return false;

    const currentRank = rankingCategory === "lessons" ? (data?.yourLessonsRank ?? 0) :
                       rankingCategory === "achievements" ? (data?.yourAchievementsRank ?? 0) :
                       (data?.yourRank ?? 0);

    if (!currentRank) return false;

    const startRank = (currentPage - 1) * 100 + 1;
    const endRank = currentPage * 100;
    return currentRank >= startRank && currentRank <= endRank
  }, [effectiveUserId, data?.yourRank, data?.yourLessonsRank, data?.yourAchievementsRank, currentPage, rankingCategory]);

  const showUserAtBottom = useMemo(() => {
    return !query && !userInCurrentPage && data?.yourStats && effectiveUserId !== 'guest';
  }, [query, userInCurrentPage, data?.yourStats, effectiveUserId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setQuery("");
      refetch(newPage, rankingCategory);
    }
  };

  const handlePeriodChange = (newPeriod: PeriodKey) => {
    setPeriod(newPeriod);
    setCurrentPage(1);
    setQuery("");
  };

  const handleCategoryChange = (newCategory: RankingCategory) => {
    setRankingCategory(newCategory);
    setCurrentPage(1);
    setQuery("");
    refetch(1, newCategory);
  };

  const handleRetry = () => {
    refetch(currentPage, rankingCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 xl:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
          <p className="text-gray-600">Compete with learners worldwide and track your progress</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              {/* Period Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(["all", "month", "week"] as PeriodKey[]).map((p) => (
                  <Tab
                    key={p}
                    active={p === period}
                    onClick={() => handlePeriodChange(p)}
                  >
                    {p === "all" ? "All Time" : p === "month" ? "This Month" : "This Week"}
                  </Tab>
                ))}
              </div>

              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                <div className="flex items-center border rounded-full px-4 py-2 flex-1 bg-gray-50">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm w-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setDescending(!descending)}
                  className="flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm gap-2 hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{descending ? "High to Low" : "Low to High"}</span>
                  <span className="sm:hidden">{descending ? "↓" : "↑"}</span>
                </button>
              </div>

              {/* Ranking Category Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: "xp" as RankingCategory, label: "Total XP", icon: Trophy, color: "bg-yellow-100 text-yellow-700" },
                  { id: "lessons" as RankingCategory, label: "Lessons", icon: BookOpen, color: "bg-green-100 text-green-700" },
                  { id: "achievements" as RankingCategory, label: "Achievements", icon: Award, color: "bg-purple-100 text-purple-700" }
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        rankingCategory === category.id
                          ? category.color
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 lg:p-6">
              {/* Error State */}
              {error && !loading && (
                <ErrorDisplay error={error} onRetry={handleRetry} />
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              )}

              {/* Leaderboard Rows */}
              {!loading && !error && (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {filteredPlayers.map((player) => {
                      const isYou = player.id === effectiveUserId || player.user_id === effectiveUserId;
                      return (
                        <Row
                          key={`${player.id || player.user_id}-${period}-${currentPage}-${rankingCategory}`}
                          player={player}
                          isYou={isYou}
                          sortBy={rankingCategory}
                        />
                      );
                    })}
                  </AnimatePresence>

                  {/* Show user at bottom if not in current page */}
                  {showUserAtBottom && data.yourStats && (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-700 font-medium text-center">
                          Your position in the leaderboard (avatar now displays properly!)
                        </p>
                      </div>
                      <Row
                        key={`user-highlight-${data.yourStats.id || data.yourStats.user_id}`}
                        player={{
                          ...data.yourStats,
                          globalRank: data.yourRank,
                          lessonsRank: data.yourLessonsRank,
                          achievementsRank: data.yourAchievementsRank
                        }}
                        isYou={true}
                        isHighlighted={true}
                        sortBy={rankingCategory}
                      />
                    </>
                  )}

                  {filteredPlayers.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {query ? 'No players found matching your search' : 'No players available'}
                      </p>
                      {query && (
                        <button
                          onClick={() => setQuery("")}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!query && !loading && !error && (data?.totalPlayers ?? 0) > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalPlayers={data?.totalPlayers ?? 0}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            {/* Ranking Dropdown */}
            <RankingDropdown
              data={data}
              period={period}
              currentCategory={rankingCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Your Stats Sidebar */}
            <div className="mt-6">
              <YourStats data={data} period={period} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
