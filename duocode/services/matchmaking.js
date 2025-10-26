export class MatchmakingService {
  constructor(supabase) {
    this.supabase = supabase;
    this.queue = [];
    this.matchmakingInterval = null;
    this.startMatchmaking();
  }

  startMatchmaking() {
    this.matchmakingInterval = setInterval(() => {
      this.processQueue();
    }, 2000);
  }

  async addToQueue(player) {
    const existingIndex = this.queue.findIndex(p => p.userId === player.userId);
    if (existingIndex !== -1) {
      this.queue[existingIndex] = { ...player, joinedAt: Date.now() };
      return null;
    }

    this.queue.push({
      ...player,
      joinedAt: Date.now(),
      ratingRange: 100
    });

    console.log(`Queue size: ${this.queue.length}`);

    const match = await this.tryMatch(player);
    return match;
  }

  removeFromQueue(userId) {
    const index = this.queue.findIndex(p => p.userId === userId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log(`Player removed from queue. Queue size: ${this.queue.length}`);
    }
  }

  async processQueue() {
    if (this.queue.length < 2) return;

    const now = Date.now();
    this.queue.forEach(player => {
      const waitTime = (now - player.joinedAt) / 1000;
      player.ratingRange = 100 + Math.floor(waitTime / 5) * 50;
    });

    const sortedQueue = [...this.queue].sort((a, b) => a.rating - b.rating);

    for (let i = 0; i < sortedQueue.length - 1; i++) {
      const playerA = sortedQueue[i];
      const playerB = sortedQueue[i + 1];

      const ratingDiff = Math.abs(playerA.rating - playerB.rating);
      const maxRange = Math.max(playerA.ratingRange, playerB.ratingRange);

      if (ratingDiff <= maxRange) {
        this.removeFromQueue(playerA.userId);
        this.removeFromQueue(playerB.userId);

        const match = await this.createMatch(playerA, playerB);
        return match;
      }
    }
  }

  async tryMatch(newPlayer) {
    const candidates = this.queue.filter(p =>
      p.userId !== newPlayer.userId &&
      Math.abs(p.rating - newPlayer.rating) <= Math.max(p.ratingRange, newPlayer.ratingRange)
    );

    if (candidates.length === 0) return null;

    const opponent = candidates[0];
    this.removeFromQueue(newPlayer.userId);
    this.removeFromQueue(opponent.userId);

    return await this.createMatch(newPlayer, opponent);
  }

  async createMatch(playerA, playerB) {
    try {
      const problem = await this.selectProblem();

      const { data: userA, error: errorA } = await this.supabase
        .from('duel_users')
        .select('*')
        .eq('id', playerA.userId)
        .single();

      const { data: userB, error: errorB } = await this.supabase
        .from('duel_users')
        .select('*')
        .eq('id', playerB.userId)
        .single();

      if (errorA || errorB) {
        throw new Error('Failed to fetch user data');
      }

      const { data: match, error: matchError } = await this.supabase
        .from('matches')
        .insert({
          player_a_id: playerA.userId,
          player_b_id: playerB.userId,
          problem_id: problem.id,
          match_type: playerA.matchType || 'ranked',
          status: 'waiting',
          player_a_rating_before: userA.rating,
          player_b_rating_before: userB.rating
        })
        .select()
        .single();

      if (matchError) throw matchError;

      console.log(`Match created: ${match.id} - ${playerA.username} vs ${playerB.username}`);

      return {
        matchId: match.id,
        playerA,
        playerB,
        problem
      };
    } catch (error) {
      console.error('Error creating match:', error);
      this.queue.push(playerA, playerB);
      throw error;
    }
  }

  async selectProblem() {
    const { data: problems, error } = await this.supabase
      .from('problems')
      .select('*')
      .eq('is_active', true);

    if (error || !problems || problems.length === 0) {
      throw new Error('No active problems available');
    }

    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
  }

  getQueueSize() {
    return this.queue.length;
  }

  cleanup() {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
    }
  }
}
