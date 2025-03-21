const Game = require('../models/Game');
const { sanitizeGameState } = require('../utils/gameUtils');

// Store active games in memory
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
        
        // If game not found but we have saved state from host, restore it
        if (!game && savedGameState) {
          console.log('Restoring game from host saved state:', gameId);
          game = new Game(savedGameState.hostId, savedGameState.settings);
          // Restore game state
          Object.assign(game, {
            ...savedGameState,
            players: {}, // Reset players since they'll rejoin
            disconnectedPlayers: {} // Reset disconnected players
          });
          activeGames[gameId] = game;
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
        
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: game.getPublicGameState()
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
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
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
        
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: game.getPublicGameState()
        });
        
        console.log(`Player ${playerName} joined game: ${gameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
        callback({ success: false, message: 'Failed to join game' });
      }
    });
    
    // Create a new game room
    socket.on('create_game', ({ playerName, gameSettings }, callback) => {
      try {
        console.log('Creating game with settings:', gameSettings);
        const game = new Game(socket.id, gameSettings);
        game.addPlayer(socket.id, playerName);
        
        // Store game in memory
        activeGames[game.id] = game;
        
        // Join socket room
        socket.join(game.id);
        
        // Send game info back to client
        callback({ 
          success: true, 
          gameId: game.id,
          playerId: socket.id,
          gameState: game.getPublicGameState()
        });
        
        console.log(`Game created: ${game.id} by ${playerName}`);
      } catch (error) {
        console.error('Error creating game:', error);
        callback({ success: false, message: 'Failed to create game' });
      }
    });
    
    // Start the game
    socket.on('start_game', ({ gameId }, callback) => {
      try {
        console.log(`Starting game: ${gameId}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (socket.id !== game.hostId) {
          console.log(`Non-host tried to start game: ${gameId}`);
          return callback({ success: false, message: 'Only the host can start the game' });
        }
        
        const result = game.startGame();
        
        if (!result.success) {
          console.log(`Failed to start game: ${gameId}, reason: ${result.message}`);
          return callback(result);
        }
        
        // Notify all players that the game has started
        io.to(gameId).emit('game_started', {
          round: result.round,
          gameState: game.getPublicGameState()
        });
        
        callback({ success: true });
        
        console.log(`Game started: ${gameId}`);
      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, message: 'Failed to start game' });
      }
    });
    
    // Submit a guess
    socket.on('submit_guess', ({ gameId, guess }, callback) => {
      try {
        console.log(`Player ${socket.id} submitted guess in game ${gameId}: ${guess}`);
        const game = activeGames[gameId];
        
        if (!game) {
          console.log(`Game not found: ${gameId}`);
          return callback({ success: false, message: 'Game not found' });
        }
        
        const result = game.submitGuess(socket.id, guess);
        
        // Send result back to the player who made the guess
        callback(result);
        
        // If the guess was correct, notify all players
        if (result.success && result.isCorrect) {
          const player = game.players[socket.id];
          
          // Send updated game state to all players to reflect the new answer count
          io.to(gameId).emit('correct_guess', {
            playerId: socket.id,
            playerName: player.name,
            isFirstCorrect: result.isFirstCorrect,
            score: result.score,
            gameState: game.getPublicGameState()
          });
          
          console.log(`Player ${socket.id} guessed correctly: ${guess}. Score: ${result.score}`);
          console.log(`Updated player count: ${game.getPublicGameState().playersAnswered}/${game.getPublicGameState().totalPlayers}`);
        } else if (result.success) {
          // Even for incorrect guesses, update the UI for the player
          socket.emit('guess_result', {
            correct: false,
            message: "Incorrect guess, try again!",
            gameState: game.getPublicGameState()
          });
          console.log(`Player ${socket.id} guessed incorrectly: ${guess}`);
        }
        
        // Always update the game state for all players
        io.to(gameId).emit('game_state_update', {
          gameState: game.getPublicGameState()
        });
        
        console.log(`Updated game state for all players in game ${gameId}`);
      } catch (error) {
        console.error('Error submitting guess:', error);
        callback({ success: false, message: 'Failed to submit guess' });
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
  });
}

module.exports = { initializeSocketHandlers };
