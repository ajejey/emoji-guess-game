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
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.emit('create_game', { playerName, gameSettings }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.message || 'Failed to create game'));
      }
    });
  });
};

// Join an existing game
export const joinGame = (gameId, playerName) => {
  console.log('socketService: Joining game', { gameId, playerName });
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket.connected) {
      console.warn('socketService: Socket not connected when trying to join game');
    }
    
    socket.emit('join_game', { gameId, playerName }, (response) => {
      console.log('socketService: Join game response received', response);
      if (response && response.success) {
        resolve(response);
      } else {
        const errorMsg = response?.message || 'Failed to join game';
        console.error('socketService: Join game error', errorMsg);
        reject(new Error(errorMsg));
      }
    });
    
    // Add a timeout in case the server doesn't respond
    setTimeout(() => {
      console.warn('socketService: Join game timeout after 5 seconds');
      reject(new Error('Server did not respond in time'));
    }, 5000);
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
