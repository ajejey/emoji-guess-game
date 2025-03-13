import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { submitGuess } from '../services/socketService';
import EmojiDisplay from '../components/EmojiDisplay';
import PlayerList from '../components/PlayerList';
import ChatBox from '../components/ChatBox';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { 
    gameState, 
    player, 
    currentRound,
    roundResults,
    gameResults,
    messages,
    error, 
    setError,
    socket,
    joinGame,
    sendMessage
  } = useGame();
  
  console.log('GamePage: Component initialized', { gameId });
  
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Redirect to home if no game state
  useEffect(() => {
    console.log('GamePage: Checking game state and gameId', { gameState, gameId });
    if (!gameState && !gameId) {
      console.log('GamePage: No game state or gameId, redirecting to home');
      navigate('/');
    }
  }, [gameState, gameId, navigate]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Timer effect
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing' || !gameState.roundEndTime) {
      console.log('GamePage: Timer not started', { 
        hasGameState: !!gameState,
        status: gameState?.status,
        hasRoundEndTime: !!gameState?.roundEndTime
      });
      return;
    }
    console.log('GamePage: Starting timer with end time', gameState.roundEndTime);
    
    const calculateTimeLeft = () => {
      const now = Date.now();
      const endTime = gameState.roundEndTime;
      return Math.max(0, Math.floor((endTime - now) / 1000));
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState]);
  
  // Show results when round ends
  useEffect(() => {
    console.log('GamePage: Round results updated', roundResults);
    if (roundResults) {
      console.log('GamePage: Setting showResults to true');
      setShowResults(true);
    }
  }, [roundResults]);
  
  // Add socket event listener for game state updates
  useEffect(() => {
    if (!socket || !gameId) return;
    
    console.log('GamePage: Setting up socket listeners for gameId:', gameId);
    
    // Join the game when component mounts
    joinGame(gameId, player?.name);
    console.log('GamePage: Joining game with player name:', player?.name);
    
    socket.on('gameState', (updatedGameState) => {
      console.log('GamePage: Received gameState update:', updatedGameState);
    });
    
    socket.on('connect', () => {
      console.log('GamePage: Socket connected, socket id:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('GamePage: Socket connection error:', error);
    });
    
    return () => {
      console.log('GamePage: Cleaning up game state socket listeners');
      socket.off('gameState');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [socket, gameId, player, joinGame]);
  
  // Handle submitting a guess
  const handleSubmitGuess = async (e) => {
    e.preventDefault();
    
    if (!guess.trim() || correctGuess) return;
    
    try {
      const response = await submitGuess(gameId, guess);
      
      if (response.isCorrect) {
        setCorrectGuess(true);
      }
      
      setGuess('');
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Handle sending a chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendMessage(gameId, message);
    setMessage('');
  };
  
  // If no game state, show loading
  if (!gameState) {
    console.log('GamePage: No gameState yet, showing loading screen', { gameId, player });
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game...</p>
          <p className="mt-2 text-sm text-gray-500">Game ID: {gameId || 'Unknown'}</p>
          <p className="text-sm text-gray-500">Player: {player?.name || 'Unknown'}</p>
        </div>
      </div>
    );
  } else {
    console.log('GamePage: Loaded gameState:', { 
      status: gameState.status,
      players: gameState.players?.length,
      currentRound: gameState.currentRound
    });
  }
  
  // If game is finished, show final results
  if (gameState.status === 'finished' || gameResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold text-center mb-8">Game Over!</h1>
            
            <div className="bg-primary/10 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-center mb-4">Final Standings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left">Rank</th>
                      <th className="py-2 text-left">Player</th>
                      <th className="py-2 text-right">Score</th>
                      <th className="py-2 text-right">Correct Guesses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameResults?.gameResults.playerRankings.map((player, index) => (
                      <tr 
                        key={player.id} 
                        className={`border-b border-gray-100 ${index === 0 ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="py-3">
                          {index === 0 ? '🏆' : `#${player.rank}`}
                        </td>
                        <td className="py-3 font-medium">{player.name}</td>
                        <td className="py-3 text-right">{player.score}</td>
                        <td className="py-3 text-right">{player.correctGuesses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Round results screen
  if (showResults && roundResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h1 className="text-2xl font-bold text-center mb-6">Round {roundResults.roundNumber} Results</h1>
            
            <EmojiDisplay emojis={roundResults.emojis} size="large" />
            
            <div className="text-center mb-8">
              <p className="text-gray-600">The answer was:</p>
              <h2 className="text-3xl font-bold mt-2">{roundResults.answer}</h2>
              <p className="text-sm text-gray-500 mt-1">Category: {roundResults.category}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-medium mb-3">Correct Guesses</h3>
              {roundResults.correctGuesses.length > 0 ? (
                <div className="space-y-2">
                  {roundResults.correctGuesses.map((guess, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{guess.playerName}</span>
                        {guess.isFirst && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            First!
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-primary">+{guess.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No one guessed correctly this round!</p>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-medium mb-3">Current Standings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left">Player</th>
                      <th className="py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.players
                      .sort((a, b) => b.score - a.score)
                      .map(player => (
                        <tr key={player.id} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{player.name}</td>
                          <td className="py-3 text-right">{player.score}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-center text-gray-600">
              {gameState.currentRound <= gameState.totalRounds ? (
                <p>Next round starting soon...</p>
              ) : (
                <p>Calculating final results...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Active game screen
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main game area */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-xl font-bold">Round {gameState.currentRound}/{gameState.totalRounds}</h1>
                  <p className="text-sm text-gray-600">
                    Category: {currentRound?.category || 'Unknown'}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                    {timeLeft}
                  </div>
                  <p className="text-xs text-gray-500">seconds left</p>
                </div>
              </div>
              
              {/* Emoji display */}
              <EmojiDisplay emojis={currentRound?.emojis} size="large" />
              
              {/* Guess form */}
              <form onSubmit={handleSubmitGuess} className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    disabled={correctGuess}
                    placeholder={correctGuess ? "You guessed correctly!" : "Type your guess here..."}
                    className={`input-field pr-24 ${correctGuess ? 'bg-green-50 border-green-300' : ''}`}
                  />
                  <button
                    type="submit"
                    disabled={!guess.trim() || correctGuess}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Guess
                  </button>
                </div>
                {correctGuess && (
                  <p className="mt-2 text-green-600 text-sm">
                    Great job! Wait for others to guess or for the round to end.
                  </p>
                )}
              </form>
            </div>
            
            {/* Scoreboard */}
            <div className="card">
              <PlayerList players={gameState.players} currentPlayerId={player?.id} />
            </div>
          </div>
          
          {/* Chat area */}
          <div className="lg:col-span-1">
            <ChatBox 
              messages={messages} 
              gameId={gameId} 
              currentPlayerId={player?.id} 
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
