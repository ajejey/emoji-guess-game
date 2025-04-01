import { createContext, useContext, useState, useEffect } from 'react';
import { initializeSocket } from '../services/socketService';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

// Game provider component
export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roundResults, setRoundResults] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Save game session and state to localStorage
  const saveGameSession = () => {
    if (gameId && player) {
      // Save basic session info
      const gameSession = {
        gameId,
        playerId: player.id,
        playerName: player.name,
        isHost: player.isHost || isHost || player.id === gameState?.hostId,
        timestamp: Date.now()
      };
      
      console.log(`GameContext: Saving game session. Player ${player.name} isHost: ${gameSession.isHost}`);
      localStorage.setItem('emojiGameSession', JSON.stringify(gameSession));

      // Always save the game state for all players
      // This ensures redundancy and makes localStorage the source of truth
      if (gameState) {
        // If this player is the host, make sure the hostId in the saved state matches
        const stateToSave = gameSession.isHost ? {
          ...gameState,
          hostId: player.id // Ensure host ID is correct
        } : gameState;
        
        saveGameState(stateToSave);
      }
    }
  };

  // Save full game state
  const saveGameState = (state) => {
    if (state && state.id) {
      console.log('GameContext: Saving game state to localStorage - source of truth');
      localStorage.setItem(`emojiGame_${state.id}`, JSON.stringify({
        gameState: state,
        timestamp: Date.now()
      }));
    }
  };

  // Effect to save game state whenever it changes
  // Now saving for all players, not just the host
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
      saveGameSession();
    }
  }, [gameState, player]);

  // Initialize socket connection and handle reconnection
  useEffect(() => {
    let reconnectionTimer = null;
    
    const initializeConnection = () => {
      console.log('GameContext: Initializing socket connection');
      const socketInstance = initializeSocket();
      setSocket(socketInstance);

      socketInstance.on('connect', async () => {
        console.log('GameContext: Socket connected with ID:', socketInstance.id);
        setIsConnected(true);
        setError(null);

        // Clear any pending reconnection timer
        if (reconnectionTimer) {
          clearTimeout(reconnectionTimer);
          reconnectionTimer = null;
        }

        // Attempt reconnection if there's a saved session
        const savedSession = localStorage.getItem('emojiGameSession');
        if (savedSession) {
          try {
            const session = JSON.parse(savedSession);
            // Check if session is not too old (30 minutes)
            if (Date.now() - session.timestamp < 30 * 60 * 1000) {
              setIsReconnecting(true);
              console.log('GameContext: Attempting to rejoin game:', session.gameId);
              
              // Get the saved game state from any player
              // This makes localStorage the source of truth
              let savedGameState = null;
              const savedData = localStorage.getItem(`emojiGame_${session.gameId}`);
              if (savedData) {
                const data = JSON.parse(savedData);
                if (Date.now() - data.timestamp < 30 * 60 * 1000) {
                  savedGameState = data.gameState;
                  console.log('GameContext: Found saved game state in localStorage');
                }
              }

              socketInstance.emit('rejoin_game', {
                gameId: session.gameId,
                playerName: session.playerName,
                previousPlayerId: session.playerId,
                savedGameState
              }, (response) => {
                if (response.success) {
                  console.log('GameContext: Successfully rejoined game');
                  
                  // Check if this player is the host directly from the response
                  // This ensures host status is correctly restored
                  const isPlayerHost = response.isHost || 
                    (response.gameState && response.gameState.hostId === response.playerId) || 
                    session.isHost;
                  
                  console.log(`GameContext: Player host status: ${isPlayerHost}`);
                  
                  setGameId(session.gameId);
                  setPlayer({ 
                    id: response.playerId, 
                    name: session.playerName,
                    isHost: isPlayerHost
                  });
                  setGameState(response.gameState);
                  setIsHost(isPlayerHost);
                  saveGameSession();
                } else {
                  console.log('GameContext: Failed to rejoin game:', response.message);
                  localStorage.removeItem('emojiGameSession');
                  localStorage.removeItem(`emojiGame_${session.gameId}`);
                  setError('Failed to rejoin the game. Please try again.');
                }
                setIsReconnecting(false);
              });
            } else {
              console.log('GameContext: Session expired');
              localStorage.removeItem('emojiGameSession');
              localStorage.removeItem(`emojiGame_${session.gameId}`);
            }
          } catch (error) {
            console.error('GameContext: Error processing saved session:', error);
            localStorage.removeItem('emojiGameSession');
            setIsReconnecting(false);
          }
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('GameContext: Socket disconnected');
        setIsConnected(false);
        setError('Connection lost. Attempting to reconnect...');
        
        // Set a timer to attempt reconnection
        if (!reconnectionTimer) {
          reconnectionTimer = setTimeout(() => {
            console.log('GameContext: Attempting to reconnect...');
            socketInstance.connect();
          }, 2000);
        }
      });

      socketInstance.on('connect_error', (err) => {
        console.error('GameContext: Socket connection error:', err);
        setIsConnected(false);
        setError('Failed to connect to the server. Please try again.');
      });

      return socketInstance;
    };

    const socketInstance = initializeConnection();

    return () => {
      console.log('GameContext: Cleaning up socket connection');
      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer);
      }
      socketInstance.disconnect();
    };
  }, []);

  // Set up game event listeners
  useEffect(() => {
    if (!socket) {
      console.log('GameContext: No socket available for event listeners');
      return;
    }
    
    console.log('GameContext: Setting up game event listeners');

    // Game state update event
    socket.on('game_state_update', ({ gameState }) => {
      console.log('GameContext: Game state update event', { 
        playersAnswered: gameState.playersAnswered,
        totalPlayers: gameState.totalPlayers
      });
      setGameState(gameState);
    });

    // Guess result event
    socket.on('guess_result', ({ correct, message, gameState }) => {
      console.log('GameContext: Guess result event', { correct, message });
      setGameState(gameState);
    });

    // Player joined event
    socket.on('player_joined', ({ playerId, playerName, gameState }) => {
      console.log('GameContext: Player joined event', { playerId, playerName });
      setGameState(gameState);
    });

    // Player left event
    socket.on('player_left', ({ playerId, playerName, gameState }) => {
      console.log('GameContext: Player left event', { playerId, playerName });
      setGameState(gameState);
    });

    // Game started event
    socket.on('game_started', ({ round, gameState }) => {
      console.log('GameContext: Game started event', { round });
      setGameState(gameState);
      setCurrentRound(round);
      setRoundResults(null);
    });

    // Round started event
    socket.on('round_started', ({ round, gameState }) => {
      console.log('GameContext: Round started event', { round });
      setGameState(gameState);
      setCurrentRound(round);
      setRoundResults(null);
    });

    // Round ended event
    socket.on('round_ended', ({ roundResults, gameState }) => {
      console.log('GameContext: Round ended event', { roundNumber: roundResults?.roundNumber });
      setGameState(gameState);
      setRoundResults(roundResults);
    });

    // Game ended event
    socket.on('game_ended', ({ gameResults, gameState }) => {
      console.log('GameContext: Game ended event', gameResults);
      setGameState(gameState);
      setGameResults(gameResults);
      setCurrentRound(null);
      
      // Schedule localStorage cleanup after players have seen the results
      // This delay ensures players can still see the final game state
      setTimeout(() => {
        if (gameState && gameState.id) {
          console.log('GameContext: Cleaning up localStorage after game end');
          clearGameStorage(gameState.id);
        }
      }, 5 * 60 * 1000); // Clean up after 5 minutes
    });

    // Correct guess event
    socket.on('correct_guess', ({ playerId, playerName, isFirstCorrect, score, gameState }) => {
      console.log('GameContext: Correct guess event', { playerId, playerName, isFirstCorrect, score });
      setGameState(gameState);
    });

    // New message event
    socket.on('new_message', (message) => {
      console.log('GameContext: New message event', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    // Game state update event
    socket.on('gameState', (updatedGameState) => {
      console.log('GameContext: Game state update received', updatedGameState);
      setGameState(updatedGameState);
    });

    // Clean up listeners on unmount
    return () => {
      console.log('GameContext: Cleaning up game event listeners');
      socket.off('game_state_update');
      socket.off('guess_result');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_started');
      socket.off('round_started');
      socket.off('round_ended');
      socket.off('game_ended');
      socket.off('correct_guess');
      socket.off('new_message');
      socket.off('gameState');
    };
  }, [socket]);

  // Clear localStorage for a specific game
  const clearGameStorage = (gameIdToClear) => {
    if (gameIdToClear) {
      console.log('GameContext: Clearing localStorage for game', gameIdToClear);
      localStorage.removeItem(`emojiGame_${gameIdToClear}`);
      
      // Also clear session if it matches this game
      const savedSession = localStorage.getItem('emojiGameSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.gameId === gameIdToClear) {
          localStorage.removeItem('emojiGameSession');
        }
      }
    }
  };
  
  // Reset game state and clear localStorage
  const resetGame = () => {
    // Clear localStorage for the current game if applicable
    if (gameId) {
      clearGameStorage(gameId);
    }
    
    // Reset state
    setGameState(null);
    setPlayer(null);
    setGameId(null);
    setCurrentRound(null);
    setMessages([]);
    setRoundResults(null);
    setGameResults(null);
    setError(null);
  };

  // Create functions to expose to components
  const joinGameHandler = (gameId, playerName) => {
    console.log('GameContext: Joining game', { gameId, playerName });
    if (!socket) {
      console.error('GameContext: Cannot join game - socket not initialized');
      return Promise.reject(new Error('Socket not initialized'));
    }
    return new Promise((resolve, reject) => {
      socket.emit('join_game', { gameId, playerName }, (response) => {
        console.log('GameContext: Join game response', response);
        if (response.success) {
          // Check if this player is the host directly from the response
          const isPlayerHost = response.isHost || 
            (response.gameState && response.gameState.hostId === response.playerId);
          
          console.log(`GameContext: Player ${playerName} joining as host: ${isPlayerHost}`);
          
          setGameId(gameId);
          setPlayer({ id: response.playerId, name: playerName, isHost: isPlayerHost });
          setGameState(response.gameState);
          setIsHost(isPlayerHost);
          
          // Save session immediately to persist host status
          setTimeout(() => saveGameSession(), 100);
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to join game'));
        }
      });
    });
  };
  
  const sendMessageHandler = (gameId, message) => {
    console.log('GameContext: Sending message', { gameId, message });
    if (!socket) {
      console.error('GameContext: Cannot send message - socket not initialized');
      return;
    }
    socket.emit('send_message', { gameId, message });
  };

  // End current round (host only)
  const endRoundHandler = (gameId) => {
    console.log('GameContext: Host ending round', { gameId });
    if (!socket) {
      console.error('GameContext: Cannot end round - socket not initialized');
      return Promise.reject(new Error('Socket not initialized'));
    }
    return new Promise((resolve, reject) => {
      socket.emit('end_round', { gameId }, (response) => {
        console.log('GameContext: End round response', response);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to end round'));
        }
      });
    });
  };
  
  // Start next round (host only)
  const startNextRoundHandler = (gameId) => {
    console.log('GameContext: Host starting next round', { gameId });
    if (!socket) {
      console.error('GameContext: Cannot start next round - socket not initialized');
      return Promise.reject(new Error('Socket not initialized'));
    }
    return new Promise((resolve, reject) => {
      socket.emit('start_next_round', { gameId }, (response) => {
        console.log('GameContext: Start next round response', response);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to start next round'));
        }
      });
    });
  };

  // Provide the context value
  const value = {
    socket,
    gameState,
    setGameState,
    player,
    setPlayer,
    gameId,
    setGameId,
    currentRound,
    messages,
    roundResults,
    gameResults,
    error,
    setError,
    isConnected,
    isHost,
    resetGame,
    clearGameStorage,
    joinGame: joinGameHandler,
    sendMessage: sendMessageHandler,
    endRound: endRoundHandler,
    startNextRound: startNextRoundHandler
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
