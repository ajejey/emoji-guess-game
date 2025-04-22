import { io } from 'socket.io-client';

// Create a socket instance
let socket;

// Initialize the socket connection
export const initializeSocket = () => {
  // console.log('socketService: Initializing socket connection to http://localhost:3000');
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  console.log(`socketService: Initializing socket connection to ${VITE_BACKEND_URL}`);
  socket = io(VITE_BACKEND_URL, {
    transports: ['websocket'],
    autoConnect: true
  });

  // Set up event listeners for connection events
  socket.on('connect', () => {
    console.log('socketService: Connected to server with ID:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('socketService: Connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('socketService: Disconnected from server:', reason);
  });
  
  socket.on('error', (error) => {
    console.error('socketService: Socket error:', error);
  });

  return socket;
};

// Get the socket instance
export const getSocket = () => {
  if (!socket) {
    console.log('socketService: No socket instance found, initializing new one');
    return initializeSocket();
  }
  console.log('socketService: Returning existing socket instance with ID:', socket.id);
  return socket;
};

// Create a game room
export const createGame = (playerName, gameSettings) => {
  // Clear any existing game session data from localStorage
  // This ensures we don't have stale data when creating a new game
  const clearExistingGameData = () => {
    console.log('socketService: Clearing existing game data from localStorage');
    
    // Clear session data
    localStorage.removeItem('emojiGameSession');
    
    // Find and clear any game state data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('emojiGame_')) {
        console.log('socketService: Removing stored game data:', key);
        localStorage.removeItem(key);
      }
    }
  };
  
  // Clear existing data before creating a new game
  clearExistingGameData();
  
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    
    // Ensure socket is connected before attempting to create a game
    const ensureConnected = () => {
      return new Promise((connectResolve) => {
        if (socket.connected) {
          console.log('socketService: Socket already connected, proceeding with create');
          connectResolve();
          return;
        }
        
        console.log('socketService: Socket not connected, waiting for connection...');
        
        // Set up a one-time connect event handler
        const onConnect = () => {
          console.log('socketService: Socket connected, now proceeding with create');
          socket.off('connect', onConnect);
          connectResolve();
        };
        
        socket.once('connect', onConnect);
        
        // If not connected after 3 seconds, proceed anyway (might still work)
        setTimeout(() => {
          socket.off('connect', onConnect);
          console.warn('socketService: Proceeding with create despite connection uncertainty');
          connectResolve();
        }, 3000);
      });
    };
    
    // Wait for connection, then attempt to create
    ensureConnected().then(() => {
      console.log('socketService: Emitting create_game event', { playerName });
      
      socket.emit('create_game', { playerName, settings: gameSettings }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to create game'));
        }
      });
      
      // Add a timeout in case the server doesn't respond
      setTimeout(() => {
        console.warn('socketService: Create game timeout after 5 seconds');
        reject(new Error('Server did not respond in time'));
      }, 5000);
    });
  });
};

// Join an existing game
export const joinGame = (gameId, playerName) => {
  console.log('socketService: Joining game', { gameId, playerName });
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    
    // Ensure socket is connected before attempting to join
    const ensureConnected = () => {
      return new Promise((connectResolve) => {
        if (socket.connected) {
          console.log('socketService: Socket already connected, proceeding with join');
          connectResolve();
          return;
        }
        
        console.log('socketService: Socket not connected, waiting for connection...');
        
        // Set up a one-time connect event handler
        const onConnect = () => {
          console.log('socketService: Socket connected, now proceeding with join');
          socket.off('connect', onConnect);
          connectResolve();
        };
        
        socket.once('connect', onConnect);
        
        // If not connected after 3 seconds, proceed anyway (might still work)
        setTimeout(() => {
          socket.off('connect', onConnect);
          console.warn('socketService: Proceeding with join despite connection uncertainty');
          connectResolve();
        }, 3000);
      });
    };
    
    // Wait for connection, then attempt to join
    ensureConnected().then(() => {
      console.log('socketService: Emitting join_game event', { gameId, playerName });
      
      // Normalize game ID to prevent case sensitivity issues
      const normalizedGameId = gameId.trim();
      
      console.log(`socketService: Attempting to join game with ID: "${normalizedGameId}"`);
      
      socket.emit('join_game', { gameId: normalizedGameId, playerName }, (response) => {
        console.log('socketService: Join game response received', response);
        if (response && response.success) {
          console.log(`socketService: Successfully joined game ${normalizedGameId}`);
          resolve(response);
        } else {
          const errorMsg = response?.message || 'Failed to join game';
          console.error(`socketService: Join game error for game "${normalizedGameId}": ${errorMsg}`);
          
          // Provide more helpful error message
          if (errorMsg.includes('not found')) {
            reject(new Error(`Game with ID "${normalizedGameId}" not found. Please check the game code and try again.`));
          } else {
            reject(new Error(errorMsg));
          }
        }
      });
      
      // Add a timeout in case the server doesn't respond
      setTimeout(() => {
        console.warn('socketService: Join game timeout after 5 seconds');
        reject(new Error('Server did not respond in time'));
      }, 5000);
    });
  });
};

// Start the game (host only)
export const startGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.emit('start_game', { gameId }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.message || 'Failed to start game'));
      }
    });
  });
};

// Submit a guess
export const submitGuess = (gameId, guess) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.emit('submit_guess', { gameId, guess }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.message || 'Failed to submit guess'));
      }
    });
  });
};

// Send a chat message
export const sendMessage = (gameId, message) => {
  const socket = getSocket();
  socket.emit('send_message', { gameId, message });
};

// End current round (host only)
export const endRound = (gameId) => {
  console.log('socketService: Host ending round', { gameId });
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.emit('end_round', { gameId }, (response) => {
      console.log('socketService: End round response', response);
      if (response && response.success) {
        resolve(response);
      } else {
        const errorMsg = response?.message || 'Failed to end round';
        console.error('socketService: End round error', errorMsg);
        reject(new Error(errorMsg));
      }
    });
    
    // Add a timeout in case the server doesn't respond
    setTimeout(() => {
      console.warn('socketService: End round timeout after 5 seconds');
      reject(new Error('Server did not respond in time'));
    }, 5000);
  });
};

// Start next round (host only)
export const startNextRound = (gameId) => {
  console.log('socketService: Host starting next round', { gameId });
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.emit('start_next_round', { gameId }, (response) => {
      console.log('socketService: Start next round response', response);
      if (response && response.success) {
        resolve(response);
      } else {
        const errorMsg = response?.message || 'Failed to start next round';
        console.error('socketService: Start next round error', errorMsg);
        reject(new Error(errorMsg));
      }
    });
    
    // Add a timeout in case the server doesn't respond
    setTimeout(() => {
      console.warn('socketService: Start next round timeout after 5 seconds');
      reject(new Error('Server did not respond in time'));
    }, 5000);
  });
};

// Disconnect from the server
export const disconnect = () => {
  if (socket) {
    socket.disconnect();
  }
};
