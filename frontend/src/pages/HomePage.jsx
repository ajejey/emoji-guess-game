import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, joinGame } from '../services/socketService';
import { useGame } from '../contexts/GameContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { setPlayer, setGameId, setGameState, setError } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  
  // Game settings for creating a new game
  const [gameSettings, setGameSettings] = useState({
    roundTime: 60,
    roundsPerGame: 5,
    categories: ['Movies', 'Phrases', 'Nature']
  });

  const handleCreateGame = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    try {
      setIsCreating(true);
      const response = await createGame(playerName, gameSettings);
      
      // Save game info
      setPlayer({
        id: response.playerId,
        name: playerName,
        isHost: true
      });
      setGameId(response.gameId);
      setGameState(response.gameState);
      
      // Navigate to lobby
      navigate(`/lobby/${response.gameId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }
    
    try {
      setIsJoining(true);
      const response = await joinGame(gameCode, playerName);
      
      // Save game info
      setPlayer({
        id: response.playerId,
        name: playerName,
        isHost: false
      });
      setGameId(response.gameId);
      setGameState(response.gameState);
      
      // Navigate to lobby
      navigate(`/lobby/${response.gameId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setGameSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Emoji Puzzle Game</h1>
          <p className="text-gray-600">Guess the movie, phrase, or concept from emojis!</p>
        </div>
        
        <div className="card bg-white shadow-lg rounded-xl p-6">
          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button 
              className={`flex-1 py-2 font-medium ${activeTab === 'join' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('join')}
            >
              Join Game
            </button>
            <button 
              className={`flex-1 py-2 font-medium ${activeTab === 'create' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('create')}
            >
              Create Game
            </button>
          </div>
          
          {/* Join Game Form */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Game Code
                </label>
                <input
                  id="gameCode"
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="Enter game code"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isJoining}
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </form>
          )}
          
          {/* Create Game Form */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div>
                <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="hostName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Round Time (seconds)
                </label>
                <select
                  value={gameSettings.roundTime}
                  onChange={(e) => handleSettingChange('roundTime', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                  <option value={120}>120 seconds</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rounds
                </label>
                <select
                  value={gameSettings.roundsPerGame}
                  onChange={(e) => handleSettingChange('roundsPerGame', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={3}>3 rounds</option>
                  <option value={5}>5 rounds</option>
                  <option value={7}>7 rounds</option>
                  <option value={10}>10 rounds</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Game'}
              </button>
            </form>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>No account needed! Just enter your name and play.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
