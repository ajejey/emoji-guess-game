import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { startGame } from '../services/socketService';
import SEO from '../components/SEO';

const LobbyPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { 
    gameState, 
    player, 
    error, 
    setError 
  } = useGame();
  
  const [isStarting, setIsStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect to game page if game is already in progress
  useEffect(() => {
    if (gameState?.status === 'playing') {
      navigate(`/game/${gameId}`);
    }
  }, [gameState, gameId, navigate]);

  // Handle start game (host only)
  const handleStartGame = async () => {
    if (!player?.isHost) return;
    
    try {
      setIsStarting(true);
      await startGame(gameId);
      // Navigation will happen automatically via the useEffect above
      // when the game_started event is received
    } catch (error) {
      setError(error.message);
      setIsStarting(false);
    }
  };

  // Copy game code to clipboard
  const copyGameCode = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If no game state, show loading
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO 
        title={`Game Lobby | Guess the Emoji: Multiplayer Party Game`}
        description="Join the lobby and invite friends to play Guess the Emoji together! A fun multiplayer party game for friends, family, and team building."
        keywords="emoji game lobby, guess the emoji multiplayer, emoji quiz party, online game room, virtual party game"
        canonicalUrl={`/lobby/${gameId}`}
      />
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Game Lobby</h1>
            <div className="flex flex-col items-end">
              <div className="text-gray-600 mb-1 text-sm">Game Code (click to copy):</div>
              <button 
                onClick={copyGameCode}
                className="bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg flex items-center border-2 border-indigo-300"
              >
                <span className="font-mono font-bold text-lg tracking-wider">{gameId}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 text-indigo-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
              </button>
              {copied && (
                <span className="text-green-500 mt-1 text-sm font-medium">✓ Copied to clipboard!</span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium mb-2">Game Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Round Time:</span>
                <p>{gameState.roundTimeLimit} seconds</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Rounds:</span>
                <p>{gameState.totalRounds}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Host:</span>
                <p>{gameState.players.find(p => p.isHost)?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Players ({gameState.players.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {gameState.players.map(player => (
                <div 
                  key={player.id} 
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    {player.isHost && (
                      <span className="text-xs text-primary">Host</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {player?.isHost ? (
            <div className="flex flex-col items-center">
              <button
                onClick={handleStartGame}
                disabled={isStarting || gameState.players.length < 2}
                className={`bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg py-2 px-4 w-full max-w-md ${
                  gameState.players.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isStarting 
                  ? 'Starting Game...' 
                  : gameState.players.length < 2 
                    ? 'Need at least 2 players to start' 
                    : 'Start Game'}
              </button>
              {gameState.players.length < 2 && (
                <div className="mt-4 text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="font-medium">Share the game code with others to join:</p>
                  <div className="mt-2 flex justify-center">
                    <div className="bg-white border-2 border-yellow-300 rounded-lg px-4 py-2 font-mono font-bold text-lg tracking-wider">
                      {gameId}
                    </div>
                  </div>
                  <p className="mt-2 text-xs">Make sure to copy the code exactly as shown (case-sensitive)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">
                Waiting for the host to start the game...
              </p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
