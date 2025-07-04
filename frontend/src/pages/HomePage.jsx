import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGame, joinGame } from '../services/socketService';
import { fetchCategories } from '../services/apiService';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const HomePage = () => {
  const navigate = useNavigate();
  const { setPlayer, setGameId, setGameState, setError, error } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  
  // Available categories for selection
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Game settings for creating a new game
  const [gameSettings, setGameSettings] = useState({
    roundTime: 60,
    roundsPerGame: 5,
    categories: [
      'Animals',
      'Entertainment',
      'Technology',
      'Hindi movie',
      'Hollywood movie',
      'TV Shows',
      'Music'
    ]
  });
  
  // Fetch categories from backend when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categories = await fetchCategories();
        setAvailableCategories(categories);
        
        // Update game settings with default selected categories (first 5-7 categories)
        if (categories.length > 0) {
          // Sort categories by count (descending) and select top categories
          const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
          const defaultSelectedCategories = sortedCategories
            .slice(0, Math.min(7, sortedCategories.length))
            .map(cat => cat.name);
          
          setGameSettings(prev => ({
            ...prev,
            categories: defaultSelectedCategories
          }));
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setError('Failed to load categories. Using default categories instead.');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

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
    
    // Validate and clean up game code
    const cleanGameCode = gameCode.trim().toUpperCase();
    if (!cleanGameCode) {
      setError('Please enter a game code');
      return;
    }
    
    // Update the displayed game code to the cleaned version
    setGameCode(cleanGameCode);
    
    try {
      setIsJoining(true);
      setError(null); // Clear any previous errors
      
      console.log(`Attempting to join game with code: ${cleanGameCode}`);
      const response = await joinGame(cleanGameCode, playerName);
      
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
      console.error('Error joining game:', error);
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
  
  const handleCategoryToggle = (categoryName) => {
    setGameSettings(prev => {
      const updatedCategories = prev.categories.includes(categoryName)
        ? prev.categories.filter(cat => cat !== categoryName) // Remove if already selected
        : [...prev.categories, categoryName]; // Add if not already selected
        
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <SEO 
          title="Guess the Emoji: Multiplayer Party Game | Play Online Free"
          description="Play the best free online emoji guessing game with friends! Guess movies, phrases, brands, and more from emoji combinations. Perfect for parties, team building, and family gatherings."
          keywords="guess the emoji, emoji quiz, emoji puzzle game, emoji riddles, multiplayer game, party game, team building, online game, free emoji game"
          canonicalUrl="/"
        />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2 animate-pulse hover:animate-none transition-all duration-500">
            Guess the Emoji: Multiplayer Party Game
          </h1>
          <p className="text-gray-600 hover:scale-105 transition-transform duration-300">Guess the movie, phrase, or concept from emojis!</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          {/* Tabs */}
          <div className="flex mb-6 border-b relative">
            <button 
              className={`flex-1 py-2 font-medium transition-colors duration-300 ${activeTab === 'join' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('join')}
            >
              Join Game
            </button>
            <button 
              className={`flex-1 py-2 font-medium transition-colors duration-300 ${activeTab === 'create' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('create')}
            >
              Create Game
            </button>
            <motion.div 
              className="absolute bottom-0 h-0.5 bg-indigo-600"
              initial={false}
              animate={{
                left: activeTab === 'join' ? '0%' : '50%',
                width: '50%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          
          {activeTab === 'join' && (
            <div className="space-y-4">
              {/* Join Game Form */}
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
                    className="border border-gray-300 rounded-md p-2 w-full"
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
                    className="border border-gray-300 rounded-md p-2 w-full font-mono font-medium tracking-wider text-center uppercase"
                    placeholder="Enter game code"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Game codes are case-sensitive</p>
                </div>
                
                <button
                  type="submit"
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 hover:scale-105 w-full transition-all duration-300"
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Join Game'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'create' && (
            <div
              className="space-y-4"
            >
              {/* Create Game Form */}
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
                    className="border border-gray-300 rounded-md p-2 w-full"
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
                    className="border border-gray-300 rounded-md p-2 w-full"
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
                    className="border border-gray-300 rounded-md p-2 w-full"
                  >
                    <option value={3}>3 rounds</option>
                    <option value={5}>5 rounds</option>
                    <option value={7}>7 rounds</option>
                    <option value={10}>10 rounds</option>
                    <option value={15}>15 rounds</option>
                    <option value={20}>20 rounds</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories ({gameSettings.categories.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {isLoadingCategories ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {availableCategories.map(category => (
                          <div key={category.name} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category.name}`}
                              checked={gameSettings.categories.includes(category.name)}
                              onChange={() => handleCategoryToggle(category.name)}
                              className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <label htmlFor={`category-${category.name}`} className="ml-2 text-sm text-gray-700 truncate">
                              {category.name} <span className="text-xs text-gray-500">({category.count})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {!isLoadingCategories && gameSettings.categories.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">Please select at least one category</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 hover:scale-105 w-full transition-all duration-300"
                  disabled={isCreating || gameSettings.categories.length === 0}
                >
                  {isCreating ? 'Creating...' : 'Create Game'}
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center text-sm text-gray-600">
          <h3 className="text-base font-medium mb-3">How to Play Emoji Puzzle Game</h3>
          <ul className="text-left max-w-md mx-auto space-y-2 list-disc list-inside">
            <li>Join or create a game room and invite your friends</li>
            <li>Each round shows a series of emojis representing a phrase, movie, or concept</li>
            <li>Type your guess in the chat as fast as you can</li>
            <li>Points are calculated based on the speed of the correct answer</li>
            <li>Wrong answers result in 0 points</li>
            <li>Player with the most points after all rounds wins!</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Play the best free online emoji guessing game! Perfect for family game night, virtual team building, and party games. No account needed!
            #GuessTheEmoji #EmojiQuiz #EmojiPuzzle #OnlineGames #BrainTeasers #FamilyGames #TeamBuilding #PartyGames
          </p>
          <footer className="mt-12 pt-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-gray-400 mb-2 md:mb-0">
                © {new Date().getFullYear()} Guess the Emoji: Multiplayer Party Game | Created by <a href="https://www.linkedin.com/in/ajey-nagarkatti-28273856/" className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">Ajey Nagarkatti</a>
              </p>
              <div className="flex flex-wrap space-x-4">
                <Link to="/privacy-policy" className="text-xs text-gray-400 hover:text-indigo-500">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-xs text-gray-400 hover:text-indigo-500">Terms of Service</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
