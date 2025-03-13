const Game = require('../models/Game');
const { sanitizeGameState } = require('../utils/gameUtils');

// Store active games in memory
const activeGames = {};

/**
 * Initialize socket.io event handlers
 * @param {Object} io - Socket.io server instance
 */
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Create a new game room
    socket.on('create_game', ({ playerName, gameSettings }, callback) => {
      try {
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
    
    // Join an existing game
    socket.on('join_game', ({ gameId, playerName }, callback) => {
      try {
        const game = activeGames[gameId];
        
        if (!game) {
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (game.status === 'playing' && !game.players[socket.id]) {
          return callback({ success: false, message: 'Cannot join a game in progress' });
        }
        
        // Add player to game
        game.addPlayer(socket.id, playerName);
        
        // Join socket room
        socket.join(gameId);
        
        // Notify all players about the new player
        io.to(gameId).emit('player_joined', {
          playerId: socket.id,
          playerName,
          gameState: game.getPublicGameState()
        });
        
        // Send game info back to client
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
    
    // Start the game
    socket.on('start_game', ({ gameId }, callback) => {
      try {
        const game = activeGames[gameId];
        
        if (!game) {
          return callback({ success: false, message: 'Game not found' });
        }
        
        if (socket.id !== game.hostId) {
          return callback({ success: false, message: 'Only the host can start the game' });
        }
        
        const result = game.startGame();
        
        if (!result.success) {
          return callback(result);
        }
        
        // Notify all players that the game has started
        io.to(gameId).emit('game_started', {
          round: result.round,
          gameState: game.getPublicGameState()
        });
        
        callback({ success: true });
        
        // Set timer for round end
        setTimeout(() => {
          if (activeGames[gameId] && activeGames[gameId].status === 'playing') {
            const roundEndResult = game.endRound();
            
            // Notify all players that the round has ended
            io.to(gameId).emit('round_ended', {
              roundResults: roundEndResult.roundResults,
              gameState: game.getPublicGameState()
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
            } else {
              // Start next round after a delay
              setTimeout(() => {
                if (activeGames[gameId] && activeGames[gameId].status === 'playing') {
                  const nextRoundResult = game.startRound();
                  
                  // Notify all players about the new round
                  io.to(gameId).emit('round_started', {
                    round: nextRoundResult.round,
                    gameState: game.getPublicGameState()
                  });
                  
                  // Set timer for next round end
                  setTimeout(() => {
                    if (activeGames[gameId] && activeGames[gameId].status === 'playing') {
                      const roundEndResult = game.endRound();
                      
                      // Notify all players that the round has ended
                      io.to(gameId).emit('round_ended', {
                        roundResults: roundEndResult.roundResults,
                        gameState: game.getPublicGameState()
                      });
                      
                      // Continue with game flow...
                      // This is simplified - in a real implementation you'd use a more robust
                      // approach to handle round timing rather than nested setTimeout calls
                    }
                  }, game.settings.roundTime * 1000);
                }
              }, 5000); // 5 second delay between rounds
            }
          }
        }, game.settings.roundTime * 1000);
        
        console.log(`Game started: ${gameId}`);
      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, message: 'Failed to start game' });
      }
    });
    
    // Submit a guess
    socket.on('submit_guess', ({ gameId, guess }, callback) => {
      try {
        const game = activeGames[gameId];
        
        if (!game) {
          return callback({ success: false, message: 'Game not found' });
        }
        
        const result = game.submitGuess(socket.id, guess);
        
        // Send result back to the player who made the guess
        callback(result);
        
        // If the guess was correct, notify all players
        if (result.success && result.isCorrect) {
          const player = game.players[socket.id];
          
          io.to(gameId).emit('correct_guess', {
            playerId: socket.id,
            playerName: player.name,
            isFirstCorrect: result.isFirstCorrect,
            score: result.score,
            gameState: game.getPublicGameState()
          });
          
          console.log(`Player ${player.name} guessed correctly in game ${gameId}`);
        }
      } catch (error) {
        console.error('Error submitting guess:', error);
        callback({ success: false, message: 'Failed to submit guess' });
      }
    });
    
    // Send a chat message
    socket.on('send_message', ({ gameId, message }) => {
      try {
        const game = activeGames[gameId];
        
        if (!game) {
          return;
        }
        
        const player = game.players[socket.id];
        
        if (!player) {
          return;
        }
        
        // Add message to game
        game.addMessage(socket.id, message);
        
        // Broadcast message to all players in the room
        io.to(gameId).emit('new_message', {
          playerId: socket.id,
          playerName: player.name,
          message,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Find games where this player is participating
      Object.values(activeGames).forEach(game => {
        if (game.players[socket.id]) {
          // Remove player from game
          game.removePlayer(socket.id);
          
          // Notify other players
          socket.to(game.id).emit('player_left', {
            playerId: socket.id,
            gameState: game.getPublicGameState()
          });
          
          // If no players left, remove the game
          if (Object.keys(game.players).length === 0) {
            delete activeGames[game.id];
            console.log(`Game removed: ${game.id} (no players left)`);
          }
        }
      });
    });
  });
}

module.exports = { initializeSocketHandlers };
