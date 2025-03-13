# Emoji Puzzle Game - Project Guidelines

## Project Overview
Emoji Puzzle Game is a multiplayer online game where players guess movie titles, phrases, or concepts based on emoji combinations. The game is designed for parties, family gatherings, and team-building activities, with a focus on providing a seamless experience for both players and hosts.

## Technology Stack
- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Styling**: Tailwind CSS (to be added)

## Project Structure

### Backend Structure
```
backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── models/            # Data models and game logic
├── routes/            # API routes
├── socket/            # Socket.IO event handlers
├── utils/             # Utility functions
└── app.js             # Main application file
```

### Frontend Structure
```
frontend/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts for state management
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API and socket service
│   ├── styles/        # Global styles and Tailwind config
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main App component
│   └── main.jsx       # Entry point
└── index.html         # HTML template
```

## Game Features
1. **Room Creation and Management**
   - Create game rooms with custom settings
   - Join rooms with a room code
   - Room admin controls

2. **User Experience**
   - Simple name entry to join games (no login required)
   - Real-time updates for all players
   - Mobile-responsive design

3. **Game Mechanics**
   - Multiple rounds with different emoji puzzles
   - Scoring system based on speed and accuracy
   - Timer for each round
   - Chat functionality for players

4. **Admin Features**
   - Custom puzzle creation
   - Game settings control (time limits, scoring, etc.)
   - Player management

## Development Guidelines
1. **Code Style**
   - Use ESLint for code linting
   - Follow React best practices
   - Use functional components with hooks

2. **State Management**
   - Use React Context API for global state
   - Socket.IO for real-time updates

3. **Testing**
   - Write unit tests for critical functionality
   - Test socket connections and game logic

4. **Deployment**
   - Prepare for deployment on platforms like Vercel, Netlify, or Heroku

## Development Phases
1. **Phase 1: Basic Setup**
   - Set up project structure
   - Implement basic Socket.IO connection
   - Create room creation and joining functionality

2. **Phase 2: Core Game Mechanics**
   - Implement game rounds and puzzle display
   - Add guessing functionality and scoring
   - Create basic admin controls

3. **Phase 3: Enhanced Features**
   - Add chat functionality
   - Implement custom puzzle creation
   - Add additional game settings

4. **Phase 4: Polish and Optimization**
   - Improve UI/UX
   - Optimize performance
   - Add animations and sound effects
