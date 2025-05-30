const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { initializeSocketHandlers } = require('./socket/socketHandler');

// Initialize Express app
const app = express();

// Configure CORS with specific options
app.use(cors());

app.use(express.json());

// Import game config to access categories
const gameConfig = require('./config/gameConfig');

// API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  // Count puzzles for each category
  const categoryCounts = {};
  
  // Initialize counts for all categories
  gameConfig.CATEGORIES.forEach(category => {
    categoryCounts[category] = 0;
  });
  
  // Count puzzles in each category
  gameConfig.PUZZLE_LIBRARY.forEach(puzzle => {
    if (categoryCounts[puzzle.category] !== undefined) {
      categoryCounts[puzzle.category]++;
    }
  });
  
  // Create array of category objects with name and count
  const categoriesWithCounts = gameConfig.CATEGORIES.map(category => ({
    name: category,
    count: categoryCounts[category] || 0
  }));
  
  res.status(200).json({ categories: categoriesWithCounts });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend Vite default port
    methods: ["GET", "POST"]
  }
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready for connections`);
});
