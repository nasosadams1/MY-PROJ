# Code Duels - Realtime 1v1 Coding Platform

A competitive coding platform where two players face the same programming problem in real-time. The faster and more correct solution wins!

## Features

### Core Functionality
- **Ranked 1v1 Matches**: ELO-based matchmaking pairs players of similar skill levels
- **Real-time Code Execution**: Secure sandboxed code judge evaluates submissions instantly
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Live Match Updates**: WebSocket-powered real-time match events
- **ELO Rating System**: Dynamic rating adjustments based on match outcomes
- **Match Replays**: Review code timelines and submission history
- **Global Leaderboard**: Track top performers and seasonal rankings

### Technical Highlights
- **Matchmaking Service**: Automated pairing with expanding rating ranges
- **Code Judge**: VM2-based sandboxed execution for JavaScript/Python
- **Anti-cheat**: AST-based code similarity detection
- **Admin Panel**: Problem management with test case configuration
- **Match Controller**: Authoritative game flow and timer management

## Architecture

### Backend Services
- **Duel Server** (Port 5000): WebSocket server for real-time matches
- **Matchmaking Service**: Queue management and player pairing
- **Judge Service**: Code execution and test evaluation
- **Match Controller**: Game state management and result processing
- **ELO Rating Service**: Rating calculations and updates

### Frontend Components
- **DuelsDashboard**: Main entry point and state management
- **MatchmakingQueue**: Search interface and queue status
- **DuelArena**: Live coding interface with Monaco editor
- **MatchResults**: Post-match statistics and rating changes
- **AdminPanel**: Problem creation and management

### Database Schema
- `duel_users`: User profiles with ratings and stats
- `matches`: Match records with ratings before/after
- `submissions`: Code submissions with results
- `problems`: Coding problems with test cases
- `code_snapshots`: Code history for replays
- `leaderboard_entries`: Seasonal rankings
- `match_replays`: Complete match history

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (already configured)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Database is already set up with:
# - Schema migrations applied
# - Sample problems seeded
# - RLS policies configured

# Start all services
npm run dev
```

This starts:
- Frontend (Vite): http://localhost:5173
- Duel Server (WebSocket): http://localhost:5000
- Original Server: http://localhost:4000
- Stripe Server: http://localhost:3001

### Quick Start

1. **Sign up/Login**: Create an account or log in
2. **Navigate to Code Duels**: Click "Code Duels" in the sidebar
3. **Select Match Type**: Choose Ranked or Casual
4. **Find Match**: Click "Find Match" to enter matchmaking queue
5. **Code Your Solution**: When matched, solve the problem faster than your opponent
6. **Submit**: Click "Submit Solution" to run tests
7. **Win**: First to pass all tests wins (or highest score at timeout)

## Match Flow

1. **Queue**: Player joins matchmaking queue
2. **Pairing**: System matches players by rating (±100, expanding over time)
3. **Match Found**: 3-second countdown before match starts
4. **Duel Started**: 15-minute timer begins, players code simultaneously
5. **Submission**: Players submit code, tests run in sandbox
6. **Results**: Real-time test results shown to both players
7. **Match End**: Winner determined by:
   - First correct submission wins immediately
   - If both correct: earlier submission wins
   - If neither: highest test score wins
   - If timeout with no submissions: draw
8. **Rating Update**: ELO ratings adjusted based on outcome

## Win Conditions

- **Immediate Win**: First player to pass all test cases
- **Score Win**: Higher test coverage percentage at timeout
- **Time Win**: Earlier submission time when both pass all tests
- **Draw**: No submissions or equal scores

## ELO Rating System

- **Starting Rating**: 1200
- **K-Factor**:
  - First 10 games: K=48 (rapid adjustment)
  - Games 10-30: K=40
  - Games 30-50: K=32
  - After 50 games: K gradually decreases to minimum of 16
- **Expected Score**: Calculated based on rating difference
- **Rating Change**: K × (Actual Score - Expected Score)

### Rating Tiers
- Bronze: < 1000
- Silver: 1000-1199
- Gold: 1200-1399
- Platinum: 1400-1599
- Diamond: 1600-1799
- Master: 1800-1999
- Grandmaster: 2000+

## Problem Format

Problems include:
- **Title**: Problem name
- **Statement**: Full problem description with examples
- **Difficulty**: Easy, Medium, or Hard
- **Time Limit**: Match duration (default 15 minutes)
- **Test Cases**: Mix of visible and hidden tests
- **Supported Languages**: JavaScript, Python (extensible)

### Test Cases
- **Input**: Test input as string
- **Expected Output**: Correct result
- **Weight**: Points awarded (allows weighted scoring)
- **Hidden**: Whether test is visible to players

## Admin Features

Access the Admin Panel from the sidebar to:
- Create new coding problems
- Edit existing problems
- Configure test cases (visible/hidden)
- Set difficulty and time limits
- Activate/deactivate problems
- Manage supported languages

## API Endpoints

### REST API
- `GET /health`: Health check
- `GET /api/leaderboard`: Global leaderboard
- `GET /api/match/:matchId`: Match details
- `GET /api/user/:userId/stats`: User statistics

### WebSocket Events

**Client → Server**:
- `register_player`: Register for matchmaking
- `join_matchmaking`: Enter queue
- `leave_matchmaking`: Exit queue
- `submit_code`: Submit solution
- `code_snapshot`: Save code snapshot (auto every 30s)

**Server → Client**:
- `queue_joined`: Confirmed in queue
- `match_found`: Match paired
- `duel_started`: Match begins
- `submission_result`: Your test results
- `opponent_submitted`: Opponent's submission update
- `match_end`: Match complete with results

## Security

### Code Execution
- VM2 sandboxing prevents malicious code
- CPU and memory limits enforced
- 5-second execution timeout per test
- No network access
- No file system access (read/write blocked)

### Anti-cheat
- AST-based similarity detection between submissions
- Rate limiting on submissions
- Server-authoritative timing and results
- Code snapshots for replay verification

### RLS Policies
- Users can only view their own data
- Match results public after completion
- Submissions restricted to match participants
- Admin operations require special privileges

## Development

### Adding New Languages

1. Update `supported_languages` in problem
2. Add language executor in `judge.js`
3. Update Monaco editor language options
4. Test with sample problems

### Adding New Problems

Use the Admin Panel or execute SQL:

```sql
INSERT INTO problems (title, statement, difficulty, time_limit_seconds, test_cases, ...)
VALUES (...);
```

### Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_anon_key
DUEL_SERVER_PORT=5000
```

## Troubleshooting

### Matchmaking Issues
- Check Duel Server is running on port 5000
- Verify WebSocket connection in browser console
- Ensure user is registered (check `duel_users` table)

### Code Execution Errors
- VM2 sandboxing may have language limitations
- Check timeout settings (default 5s per test)
- Verify test case format matches expected structure

### Rating Not Updating
- Confirm match completed successfully
- Check `matches` table for rating_after values
- Verify ELO service calculations in logs

## Performance

### Scaling Considerations
- Matchmaking queue runs every 2 seconds
- WebSocket connections scale horizontally with sticky sessions
- Code execution is CPU-intensive (consider worker pool)
- Database indexes optimize matchmaking and leaderboard queries

### Optimization Tips
- Use Redis for matchmaking queue in production
- Implement connection pooling for database
- Cache leaderboard with TTL
- Use CDN for static assets

## Future Enhancements

- Tournament mode with brackets
- Team battles (2v2, 3v3)
- Spectator mode for live matches
- More programming languages (Java, C++, Go, Rust)
- AI opponent for practice
- Daily challenges
- Achievement system
- Match history and statistics dashboard
- Mobile app support

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Editor**: Monaco Editor (VS Code engine)
- **Real-time**: Socket.io (WebSocket)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Code Execution**: VM2 (sandboxed JavaScript)
- **Testing**: Jest (future implementation)

## License

Proprietary - All rights reserved

## Credits

Built with inspiration from competitive coding platforms like LeetCode, Codeforces, and CodeWars.
