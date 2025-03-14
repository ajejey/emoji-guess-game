import { createContext, useContext, useState, useEffect } from 'react';
import {  initializeSocket } from '../services/socketService';

// Create the game context
const GameContext = createContext();

// Custom hook to use the game context
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

  // Initialize socket connection
  useEffect(() => {
    console.log('GameContext: Initializing socket connection');
    const socketInstance = initializeSocket();
    setSocket(socketInstance);

    // Set up connection status listener
    socketInstance.on('connect', () => {
      console.log('GameContext: Socket connected with ID:', socketInstance.id);
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      console.log('GameContext: Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('GameContext: Socket connection error:', err);
      setIsConnected(false);
      setError('Failed to connect to the server. Please try again.');
    });

    // Clean up on unmount
    return () => {
      console.log('GameContext: Cleaning up socket connection');
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

  // Reset game state
  const resetGame = () => {
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
          setGameId(gameId);
          setPlayer({ id: response.playerId, name: playerName, isHost: response.isHost });
          setGameState(response.gameState);
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
    resetGame,
    joinGame: joinGameHandler,
    sendMessage: sendMessageHandler,
    endRound: endRoundHandler,
    startNextRound: startNextRoundHandler
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
