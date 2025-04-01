const Game = require('../models/Game');
const { sanitizeGameState } = require('../utils/gameUtils');

// Store active games in memory, but localStorage is the source of truth
const activeGames = {};

// Initialize socket.io event handlers
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Find the game this socket was in
      const game = Object.values(activeGames).find(g => g.players[socket.id]);
      if (game) {
        game.handleDisconnect(socket.id);
        // Notify other players
        socket.to(game.id).emit('player_disconnected', {
          playerId: socket.id,
          gameState: game.getPublicGameState()
        });
      }
    });
    
    // Handle player reconnection
    socket.on('rejoin_game', ({ gameId, playerName, previousPlayerId, savedGameState }, callback) => {
      try {
        console.log(`Player ${playerName} attempting to rejoin game ${gameId}`);
        let game = activeGames[gameId];
        
        // If game not found but we have saved state from localStorage, restore it
        // This is now the primary way to restore games - localStorage is the source of truth
        if (!game && savedGameState) {
          console.log('Restoring game from localStorage (source of truth):', gameId);
          
          // Create a new game with the saved settings and include the saved state
          // Pass the full saved state as settings to preserve important data like rounds
          game = new Game(savedGameState.hostId, {
            ...savedGameState.settings,
            id: savedGameState.id,
            rounds: savedGameState.rounds || []
          });
          
          // Restore other game state properties
          Object.assign(game, {
            ...savedGameState,
            players: {}, // Reset players since they'll rejoin
            disconnectedPlayers: {} // Reset disconnected players
          });
          
          activeGames[gameId] = game;
          console.log(`Game ${gameId} successfully restored from localStorage`);
        }
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }

        // Check if player can reconnect
        if (!game.canReconnect(playerName)) {
          console.log(`Player ${playerName} cannot reconnect to game ${gameId}`);
          return callback({ success: false, message: 'Cannot rejoin this game' });
        }

        // Check if this player was the host in the saved game state
        const wasHostInSavedState = savedGameState && savedGameState.hostId && 
          (savedGameState.hostId === previousPlayerId || 
           Object.values(savedGameState.players || {}).some(p => p.name === playerName && p.isHost));
        
        // If this player was the host in the saved state, update the game's hostId
        if (wasHostInSavedState) {
          console.log(`Player ${playerName} was the host in saved state, restoring host privileges`);
          game.hostId = socket.id;
        }
        
        // Add/update the player
        const player = game.addPlayer(socket.id, playerName, true);
        
        // Join socket room
        socket.join(gameId);
        
        // Notify all players about the reconnection
        io.to(gameId).emit('player_reconnected', {
          playerId: socket.id,
          playerName,
          gameState: game.getPublicGameState()
        });
        
        // Get the updated game state with proper host information
        const updatedGameState = game.getPublicGameState();
        
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: updatedGameState,
          isHost: socket.id === game.hostId
        });
        
        console.log(`Player ${playerName} rejoined game: ${gameId}`);
      } catch (error) {
        console.error('Error rejoining game:', error);
        callback({ success: false, message: 'Failed to rejoin game' });
      }
    });

    // Join an existing game
    socket.on('join_game', ({ gameId, playerName }, callback) => {
      try {
        console.log(`Player ${playerName} attempting to join game ${gameId}`);
        console.log(`Active games: ${Object.keys(activeGames).join(', ')}`);
        
        // Check for case sensitivity issues
        const exactMatch = activeGames[gameId];
        let game = exactMatch;
        
        // If no exact match, try case-insensitive match
        if (!exactMatch) {
          const lowerGameId = gameId.toLowerCase();
          const matchingKey = Object.keys(activeGames).find(key => key.toLowerCase() === lowerGameId);
          
          if (matchingKey) {
            console.log(`Found case-insensitive match for game ID: ${matchingKey}`);
            game = activeGames[matchingKey];
          }
        }
        
        if (!game) {
          console.log(`Game not found: ${gameId}. Available games: ${Object.keys(activeGames).length}`);
          return callback({ success: false, message: 'Game not found' });
        }

        // Check if player is already in the game or can reconnect
        if (game.status === 'playing' && !game.canReconnect(playerName)) {
          console.log(`Cannot join game in progress: ${gameId}`);
          return callback({ success: false, message: 'Cannot join a game in progress' });
        }
        
        // Add/update the player
        const player = game.addPlayer(socket.id, playerName);
        
        // Join socket room
        socket.join(gameId);
        
        // Notify all players
        io.to(gameId).emit('player_joined', {
          playerId: socket.id,
          playerName,
          gameState: game.getPublicGameState()
        });
        
        // Get the updated game state with proper host information
        const updatedGameState = game.getPublicGameState();
        
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: updatedGameState,
          isHost: socket.id === game.hostId
        });
        
        console.log(`Player ${playerName} joined game: ${gameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
        callback({ success: false, message: 'Failed to join game' });
      }
    });
    
    // Create a new game
    socket.on('create_game', ({ playerName, settings }, callback) => {
      try {
        console.log(`Player ${playerName} creating a new game with settings:`, settings);
        const game = new Game(socket.id, settings);
        activeGames[game.id] = game;
        
        // Add the host player
        game.addPlayer(socket.id, playerName, false, true);
        
        // Join socket room
        socket.join(game.id);
        
        // Send game state to client which will save to localStorage
        const publicGameState = game.getPublicGameState();
        
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: publicGameState
        });
        
        console.log(`Game created: ${game.id}`);
      } catch (error) {
        console.error('Error creating game:', error);
        callback({ success: false, message: 'Failed to create game' });
      }
    });
    
    // Start the game (host only)
    socket.on('start_game', ({ gameId }, callback) => {
      try {
        console.log(`Starting game ${gameId}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (socket.id !== game.hostId) {
          console.log(`Non-host tried to start game: ${gameId}`);
          return callback({ success: false, message: 'Only the host can start the game' });
        }
        
        if (game.status !== 'waiting') {
          console.log(`Cannot start game ${gameId}: already in progress`);
          return callback({ success: false, message: 'Game is already in progress' });
        }
        
        // Start the game
        game.startGame();
        
        // Start the first round
        const roundResult = game.startRound();
        
        // Get updated game state to send to clients
        const updatedGameState = game.getPublicGameState();
        
        // Notify all players
        io.to(gameId).emit('game_started', {
          gameState: updatedGameState,
          round: roundResult.round
        });
        
        callback({ success: true });
        
        console.log(`Game started: ${gameId}`);
      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, message: 'Failed to start game' });
      }
    });
    
    // End current round (host only)
    socket.on('end_round', ({ gameId }, callback) => {
      try {
        console.log(`Ending round in game ${gameId}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (socket.id !== game.hostId) {
          console.log(`Non-host tried to end round: ${gameId}`);
          return callback({ success: false, message: 'Only the host can end the round' });
        }
        
        if (game.status !== 'playing') {
          console.log(`Cannot end round: game ${gameId} is not in playing state`);
          return callback({ success: false, message: 'Game is not in progress' });
        }
        
        const roundEndResult = game.endRound();
        
        // Notify all players that the round has ended
        io.to(gameId).emit('round_ended', {
          roundResults: roundEndResult.roundResults,
          gameState: game.getPublicGameState()
        });
        
        callback({ 
          success: true, 
          isGameOver: roundEndResult.isGameOver 
        });
        
        // If game is over, notify players
        if (roundEndResult.isGameOver) {
          const gameEndResult = game.endGame();
          io.to(gameId).emit('game_ended', {
            gameResults: gameEndResult.gameResults,
            gameState: game.getPublicGameState()
          });
          
          // Keep the game active for a while so players can see results
          setTimeout(() => {
            if (activeGames[gameId]) {
              delete activeGames[gameId];
            }
          }, 3600000); // 1 hour
        }
        
        console.log(`Round ended in game ${gameId}`);
      } catch (error) {
        console.error('Error ending round:', error);
        callback({ success: false, message: 'Failed to end round' });
      }
    });
    
    // Start next round (host only)
    socket.on('start_next_round', ({ gameId }, callback) => {
      try {
        console.log(`Starting next round in game ${gameId}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (socket.id !== game.hostId) {
          console.log(`Non-host tried to start next round: ${gameId}`);
          return callback({ success: false, message: 'Only the host can start the next round' });
        }
        
        if (game.status !== 'playing') {
          console.log(`Cannot start next round: game ${gameId} is not in playing state`);
          return callback({ success: false, message: 'Game is not in progress' });
        }
        
        const nextRoundResult = game.startRound();
        
        // Notify all players about the new round
        io.to(gameId).emit('round_started', {
          round: nextRoundResult.round,
          gameState: game.getPublicGameState()
        });
        
        callback({ success: true });
        
        console.log(`Next round started in game ${gameId}`);
      } catch (error) {
        console.error('Error starting next round:', error);
        callback({ success: false, message: 'Failed to start next round' });
      }
    });
    
    // Send a chat message
    socket.on('send_message', ({ gameId, message }) => {
      try {
        const game = activeGames[gameId];
        
        if (!game) {
          return;
        }
        
        const result = game.addMessage(socket.id, message);
        
        if (result) {
          const messages = game.messages;
          const latestMessage = messages[messages.length - 1];
          
          io.to(gameId).emit('new_message', latestMessage);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    
    // Process a player's guess
    socket.on('submit_guess', ({ gameId, guess }, callback) => {
      try {
        console.log(`Player ${socket.id} submitted guess in game ${gameId}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (game.status !== 'playing') {
          console.log(`Cannot submit guess: game ${gameId} is not in playing state`);
          return callback({ success: false, message: 'Game is not in progress' });
        }
        
        const result = game.submitGuess(socket.id, guess);
        
        callback(result);
        
        // Get the updated game state with the new player answer count
        const updatedGameState = game.getPublicGameState();
        
        // If the guess was correct, notify all players with a specific event
        if (result.isCorrect) {
          const player = game.players[socket.id];
          
          io.to(gameId).emit('correct_guess', {
            playerId: socket.id,
            playerName: player.name,
            isFirstCorrect: result.isFirstCorrect,
            gameState: updatedGameState
          });
        }
        
        // Always broadcast a game state update for all guesses (correct or incorrect)
        // This ensures the player count updates for everyone
        io.to(gameId).emit('game_state_update', {
          gameState: updatedGameState
        });
      } catch (error) {
        console.error('Error submitting guess:', error);
        callback({ success: false, message: 'Failed to submit guess' });
      }
    });
  });
}

module.exports = { initializeSocketHandlers };
