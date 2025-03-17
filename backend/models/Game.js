const gameConfig = require('../config/gameConfig');
const { generateRoomCode, calculateScore } = require('../utils/gameUtils');

class Game {
  constructor(hostId, settings = {}) {
    this.id = generateRoomCode(gameConfig.ROOM_CODE_LENGTH);
    this.hostId = hostId;
    this.players = {};
    this.disconnectedPlayers = {}; // Store disconnected players for reconnection
    this.status = 'waiting'; // waiting, playing, finished
    this.currentRound = 0;
    this.rounds = [];
    this.settings = {
      roundTime: settings.roundTime || gameConfig.DEFAULT_ROUND_TIME,
      roundsPerGame: settings.roundsPerGame || gameConfig.DEFAULT_ROUNDS_PER_GAME,
      categories: settings.categories || ['Movies', 'Phrases', 'Nature'],
      customPuzzles: settings.customPuzzles || [],
    };
    this.messages = [];
    this.roundStartTime = null;
    this.roundEndTime = null;
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
    
    // Initialize rounds with puzzles
    this._initializeRounds();
  }

  _initializeRounds() {
    // Use custom puzzles if provided, otherwise use samples
    const puzzlePool = this.settings.customPuzzles.length > 0 
      ? this.settings.customPuzzles 
      : gameConfig.SAMPLE_PUZZLES.filter(puzzle => 
          this.settings.categories.includes(puzzle.category)
        );
    
    // Shuffle and select puzzles for the game
    const shuffled = [...puzzlePool].sort(() => 0.5 - Math.random());
    const selectedPuzzles = shuffled.slice(0, this.settings.roundsPerGame);
    
    this.rounds = selectedPuzzles.map((puzzle, index) => ({
      roundNumber: index + 1,
      emojis: puzzle.emojis,
      answer: puzzle.answer.toLowerCase(),
      category: puzzle.category,
      startTime: null,
      endTime: null,
      correctGuesses: [],
      allGuesses: [], // Track all guesses, not just correct ones
      status: 'pending', // pending, active, completed
    }));
  }

  // Handle player disconnection
  handleDisconnect(playerId) {
    const player = this.players[playerId];
    if (player) {
      // Store player data for potential reconnection
      this.disconnectedPlayers[player.name] = {
        ...player,
        disconnectedAt: Date.now()
      };
      // Mark player as inactive but don't remove
      player.isActive = false;
      this.lastActivity = Date.now();
    }
  }

  // Check if a player can reconnect
  canReconnect(playerName) {
    // Allow reconnection if:
    // 1. Player is in disconnected players list
    // 2. Player is still in active game
    // 3. Disconnection was less than 5 minutes ago
    const disconnectedPlayer = this.disconnectedPlayers[playerName];
    const activePlayer = Object.values(this.players).find(p => p.name === playerName);
    
    if (disconnectedPlayer) {
      const disconnectDuration = Date.now() - disconnectedPlayer.disconnectedAt;
      return disconnectDuration < 5 * 60 * 1000; // 5 minutes
    }
    
    return !!activePlayer;
  }

  // Add or reconnect a player
  addPlayer(playerId, playerName, isReconnecting = false) {
    // Check for existing player with same name
    const existingPlayer = Object.values(this.players).find(p => p.name === playerName);
    
    if (existingPlayer) {
      // Update existing player's socket and status
      const oldId = existingPlayer.id;
      this.players[playerId] = {
        ...existingPlayer,
        id: playerId,
        isActive: true
      };
      if (oldId !== playerId && this.players[oldId]) {
        delete this.players[oldId];
      }
      // Clear from disconnected players if present
      delete this.disconnectedPlayers[playerName];
    } else {
      // Create new player
      this.players[playerId] = {
        id: playerId,
        name: playerName,
        score: 0,
        isHost: playerId === this.hostId,
        joinedAt: Date.now(),
        correctGuesses: [],
        isActive: true,
      };
    }

    this.lastActivity = Date.now();
    return this.players[playerId];
  }

  removePlayer(playerId) {
    if (this.players[playerId]) {
      const player = this.players[playerId];
      // Store in disconnected players before removing
      this.disconnectedPlayers[player.name] = {
        ...player,
        disconnectedAt: Date.now()
      };
      delete this.players[playerId];
      this.lastActivity = Date.now();
      
      // If host leaves, assign a new host from active players
      if (playerId === this.hostId) {
        const activePlayer = Object.entries(this.players).find(([_, p]) => p.isActive);
        if (activePlayer) {
          const [newHostId] = activePlayer;
          this.hostId = newHostId;
          this.players[newHostId].isHost = true;
        }
      }
      
      return true;
    }
    return false;
  }

  startGame() {
    if (Object.keys(this.players).length < gameConfig.MIN_PLAYERS_TO_START) {
      return { success: false, message: `Need at least ${gameConfig.MIN_PLAYERS_TO_START} players to start` };
    }
    
    this.status = 'playing';
    this.currentRound = 1;
    this.lastActivity = Date.now();
    return this.startRound();
  }

  startRound() {
    if (this.currentRound > this.settings.roundsPerGame) {
      return this.endGame();
    }
    
    const round = this.rounds[this.currentRound - 1];
    round.status = 'active';
    round.startTime = Date.now();
    round.endTime = round.startTime + (this.settings.roundTime * 1000);
    this.roundStartTime = round.startTime;
    this.roundEndTime = round.endTime;
    this.lastActivity = Date.now();
    
    return { 
      success: true, 
      round: {
        roundNumber: round.roundNumber,
        emojis: round.emojis,
        category: round.category,
        timeLimit: this.settings.roundTime,
      }
    };
  }

  endRound() {
    const round = this.rounds[this.currentRound - 1];
    round.status = 'completed';
    this.currentRound++;
    this.lastActivity = Date.now();
    
    return { 
      success: true, 
      roundResults: {
        roundNumber: round.roundNumber,
        emojis: round.emojis,
        answer: round.answer,
        category: round.category,
        correctGuesses: round.correctGuesses,
        allGuesses: round.allGuesses
      },
      isGameOver: this.currentRound > this.settings.roundsPerGame
    };
  }

  endGame() {
    this.status = 'finished';
    this.lastActivity = Date.now();
    
    // Calculate final scores and rankings
    const playerRankings = Object.values(this.players)
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        id: player.id,
        name: player.name,
        score: player.score,
        rank: index + 1,
        correctGuesses: player.correctGuesses.length
      }));
    
    return { 
      success: true, 
      gameResults: {
        gameId: this.id,
        rounds: this.rounds.length,
        playerRankings
      }
    };
  }

  submitGuess(playerId, guess) {
    if (this.status !== 'playing') {
      return { success: false, message: 'Game is not in progress' };
    }
    
    const round = this.rounds[this.currentRound - 1];
    if (round.status !== 'active') {
      return { success: false, message: 'Round is not active' };
    }
    
    const player = this.players[playerId];
    if (!player) {
      return { success: false, message: 'Player not found' };
    }
    
    // Check if player already guessed correctly
    if (round.correctGuesses.some(g => g.playerId === playerId)) {
      return { success: false, message: 'You already guessed correctly' };
    }
    
    const normalizedGuess = guess.toLowerCase().trim();
    const isCorrect = normalizedGuess === round.answer.toLowerCase();
    
    if (isCorrect) {
      const timeLeft = Math.max(0, (round.endTime - Date.now()) / 1000);
      const isFirstCorrect = round.correctGuesses.length === 0;
      
      // Calculate score
      const score = calculateScore({
        isFirstCorrect,
        timeLeft,
        roundTime: this.settings.roundTime
      });
      
      // Update player score
      player.score += score;
      player.correctGuesses.push({
        roundNumber: round.roundNumber,
        score,
        timestamp: Date.now()
      });
      
      // Update round data
      round.correctGuesses.push({
        playerId,
        playerName: player.name,
        timestamp: Date.now(),
        score,
        isFirst: isFirstCorrect
      });
      
      round.allGuesses.push({
        playerId,
        playerName: player.name,
        guess: normalizedGuess,
        timestamp: Date.now(),
        isCorrect,
        score // Add score for correct guesses
      });
      
      this.lastActivity = Date.now();
      
      return { 
        success: true, 
        isCorrect: true,
        score,
        isFirstCorrect
      };
    }
    
    round.allGuesses.push({
      playerId,
      playerName: player.name,
      guess: normalizedGuess,
      timestamp: Date.now(),
      isCorrect: false,
      score: 0 // Zero score for incorrect guesses
    });
    
    return { 
      success: true, 
      isCorrect: false
    };
  }

  addMessage(playerId, message) {
    const player = this.players[playerId];
    if (!player) return false;
    
    this.messages.push({
      playerId,
      playerName: player.name,
      message,
      timestamp: Date.now()
    });
    
    this.lastActivity = Date.now();
    return true;
  }

  getGameState() {
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.players,
      status: this.status,
      currentRound: this.currentRound,
      settings: this.settings,
      roundStartTime: this.roundStartTime,
      roundEndTime: this.roundEndTime,
      lastActivity: this.lastActivity
    };
  }

  getPublicGameState() {
    // Return a sanitized version of the game state without answers
    const currentRound = this.rounds[this.currentRound - 1];
    
    // Count players who have answered this round (including incorrect guesses)
    let playersAnswered = 0;
    if (currentRound && currentRound.status === 'active') {
      // Get unique player IDs from allGuesses array
      const playersWhoAnswered = new Set();
      currentRound.allGuesses.forEach(guess => {
        playersWhoAnswered.add(guess.playerId);
      });
      playersAnswered = playersWhoAnswered.size;
    }
    
    return {
      id: this.id,
      hostId: this.hostId,
      players: Object.values(this.players).map(player => ({
        id: player.id,
        name: player.name,
        score: player.score,
        isHost: player.isHost,
        isActive: player.isActive,
        hasAnswered: currentRound?.allGuesses.some(g => g.playerId === player.id) || false
      })),
      status: this.status,
      currentRound: this.currentRound,
      totalRounds: this.settings.roundsPerGame,
      roundTimeLimit: this.settings.roundTime,
      roundStartTime: this.roundStartTime,
      roundEndTime: this.roundEndTime,
      currentEmojis: currentRound?.status === 'active' ? currentRound.emojis : null,
      currentCategory: currentRound?.status === 'active' ? currentRound.category : null,
      playersAnswered: playersAnswered,
      totalPlayers: Object.keys(this.players).length,
      allGuesses: currentRound?.status === 'completed' ? currentRound.allGuesses : null
    };
  }

  /**
   * Update a player's socket ID
   * @param {string} oldSocketId - Previous socket ID
   * @param {string} newSocketId - New socket ID
   */
  updatePlayerSocket(oldSocketId, newSocketId) {
    if (this.players[oldSocketId]) {
      // Copy player data to new socket ID
      this.players[newSocketId] = {
        ...this.players[oldSocketId],
        id: newSocketId
      };
      
      // Update host ID if needed
      if (this.hostId === oldSocketId) {
        this.hostId = newSocketId;
      }
      
      // Update current player if needed
      if (this.currentPlayerId === oldSocketId) {
        this.currentPlayerId = newSocketId;
      }
      
      // Update players who have answered
      if (this.playersAnswered.includes(oldSocketId)) {
        this.playersAnswered = this.playersAnswered.map(id => 
          id === oldSocketId ? newSocketId : id
        );
      }
      
      // Delete old socket entry
      delete this.players[oldSocketId];
    }
  }
}

module.exports = Game;
