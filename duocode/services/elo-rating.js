export class EloRatingService {
  constructor() {
    this.baseK = 32;
    this.experienceThreshold = 50;
  }

  calculateRatingChange(ratingA, ratingB, scoreA, matchesPlayedA) {
    const expectedA = this.calculateExpectedScore(ratingA, ratingB);
    const expectedB = 1 - expectedA;

    const scoreB = 1 - scoreA;

    const kFactor = this.getKFactor(matchesPlayedA);

    const playerAChange = Math.round(kFactor * (scoreA - expectedA));
    const playerBChange = Math.round(kFactor * (scoreB - expectedB));

    return {
      playerAChange,
      playerBChange,
      expectedA,
      expectedB,
      kFactor
    };
  }

  calculateExpectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  getKFactor(matchesPlayed) {
    if (matchesPlayed < 10) {
      return this.baseK * 1.5;
    } else if (matchesPlayed < 30) {
      return this.baseK * 1.25;
    } else if (matchesPlayed < this.experienceThreshold) {
      return this.baseK;
    } else {
      const decay = Math.min(0.5, (matchesPlayed - this.experienceThreshold) / 200);
      return Math.max(16, this.baseK * (1 - decay));
    }
  }

  getRatingTier(rating) {
    if (rating < 1000) return { name: 'Bronze', color: '#CD7F32' };
    if (rating < 1200) return { name: 'Silver', color: '#C0C0C0' };
    if (rating < 1400) return { name: 'Gold', color: '#FFD700' };
    if (rating < 1600) return { name: 'Platinum', color: '#E5E4E2' };
    if (rating < 1800) return { name: 'Diamond', color: '#B9F2FF' };
    if (rating < 2000) return { name: 'Master', color: '#9370DB' };
    return { name: 'Grandmaster', color: '#FF6347' };
  }
}
