import { useState, useEffect, useRef, useCallback } from 'react';
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
    sendMessage,
    endRound,
    startNextRound,
    isReconnecting,
    isConnected
  } = useGame();

  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [previousRound, setPreviousRound] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle page initialization and reconnection
  useEffect(() => {
    const savedSession = localStorage.getItem('emojiGameSession');
    const session = savedSession ? JSON.parse(savedSession) : null;
    
    // First time initialization
    if (!initialLoadComplete) {
      setInitialLoadComplete(true);
      
      if (!gameId) {
        console.log('GamePage: No gameId, redirecting to home');
        navigate('/');
        return;
      }

      // If we have a matching session, wait for reconnection
      if (session && session.gameId === gameId) {
        console.log('GamePage: Found matching session, waiting for reconnection');
        setLoading(true);
        return;
      }
    }

    // Handle subsequent state changes
    if (initialLoadComplete) {
      // Only redirect if:
      // 1. We're not reconnecting
      // 2. We're connected (socket connection established)
      // 3. There's no game state
      // 4. There's no valid session OR session doesn't match gameId
      if (!isReconnecting && isConnected && !gameState && (!session || session.gameId !== gameId)) {
        console.log('GamePage: No valid game state or session after connection, redirecting to home');
        navigate('/');
        return;
      }

      // Update loading state
      setLoading(!gameState || isReconnecting);
    }
  }, [gameState, gameId, isReconnecting, isConnected, navigate, initialLoadComplete]);

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

  // Timer effect (just for display, not for game logic)
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
  }, [gameState?.roundEndTime]);

  // Show results when round ends
  useEffect(() => {
    console.log('GamePage: Round results updated', roundResults);
    if (roundResults) {
      console.log('GamePage: Setting showResults to true');
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [roundResults]);

  // Join the game when component mounts or when socket changes
  useEffect(() => {
    if (!socket || !gameId || !player?.name) return;

    console.log('GamePage: Joining game', { gameId, playerName: player.name });

    // Only join if not already in game
    if (!gameState) {
      joinGame(gameId, player.name).catch(error => {
        console.error('GamePage: Error joining game:', error);
        setError(error.message);
      });
    }
  }, [socket, gameId, player?.name, joinGame, gameState, setError]);

  // Reset correctGuess state when a new round starts
  useEffect(() => {
    if (gameState?.currentRound !== previousRound) {
      console.log('GamePage: Round changed, resetting correctGuess state', {
        previous: previousRound,
        current: gameState?.currentRound
      });
      setCorrectGuess(false);
      setPreviousRound(gameState?.currentRound);
    }
  }, [gameState?.currentRound, previousRound]);

  // Check if player has already guessed correctly in this round
  useEffect(() => {
    if (gameState?.players && player?.id) {
      const playerObj = gameState.players.find(p => p.id === player.id);
      if (playerObj?.hasAnswered) {
        console.log('GamePage: Player has already answered correctly this round');
        setCorrectGuess(true);
      }
    }
  }, [gameState?.players, player?.id]);

  // Handle submitting a guess
  const handleSubmitGuess = useCallback(async (e) => {
    e.preventDefault();

    if (!guess.trim() || correctGuess) return;

    try {
      setLoading(true);
      console.log('GamePage: Submitting guess', { gameId, guess });
      const response = await submitGuess(gameId, guess);
      console.log('GamePage: Guess submission response', response);

      if (response.isCorrect) {
        setCorrectGuess(true);
      }

      setGuess('');
    } catch (error) {
      console.error('GamePage: Error submitting guess:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [gameId, guess, correctGuess, setError]);

  // Handle sending a chat message
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log('GamePage: Sending message', { gameId, message });
    sendMessage(gameId, message);
    setMessage('');
  }, [gameId, message, sendMessage]);

  // Host controls for ending round
  const handleEndRound = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GamePage: Host ending round', { gameId });
      await endRound(gameId);
    } catch (error) {
      console.error('GamePage: Error ending round:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [gameId, endRound, setError]);

  // Host controls for starting next round
  const handleStartNextRound = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GamePage: Host starting next round', { gameId });
      await startNextRound(gameId);
    } catch (error) {
      console.error('GamePage: Error starting next round:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [gameId, startNextRound, setError]);

  // If loading or reconnecting, show loading screen
  if (loading || isReconnecting || !gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isReconnecting ? 'Reconnecting to game...' : 'Loading game...'}
          </p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-2 text-sm text-gray-500">Game ID: {gameId || 'Unknown'}</p>
          <p className="text-sm text-gray-500">Player: {player?.name || 'Unknown'}</p>
        </div>
      </div>
    );
  }

  // Log game state after confirming it exists
  console.log('GamePage: Loaded gameState:', {
    status: gameState?.status,
    players: gameState?.players?.length,
    currentRound: gameState?.currentRound,
    playersAnswered: gameState?.playersAnswered,
    totalPlayers: gameState?.totalPlayers
  });

  // Results for finished game
  if (gameState?.status === 'finished' || gameResults) {
    console.log('GamePage: Showing game results', {
      gameStatus: gameState?.status,
      hasGameResults: !!gameResults,
      gameResults
    });

    // Add fallback for missing gameResults
    const finalResults = gameResults?.gameResults || {
      playerRankings: gameState?.players?.sort((a, b) => b.score - a.score).map((player, index) => ({
        ...player,
        rank: index + 1,
        correctGuesses: player.correctGuesses || 0
      })) || []
    };

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
                    {finalResults.playerRankings.map((player, index) => (
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
              <h3 className="text-lg font-medium mb-3">All Guesses</h3>
              {roundResults.allGuesses && roundResults.allGuesses.length > 0 ? (
                <div className="space-y-2">
                  {roundResults.allGuesses
                    .sort((a, b) => (b.isCorrect ? 1 : 0) - (a.isCorrect ? 1 : 0))
                    .map((guess, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-3 rounded-lg border ${guess.isCorrect ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'
                          }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{guess.playerName}</span>
                          <span className="ml-2 text-gray-600">
                            "{guess.guess}"
                          </span>
                          {guess.isCorrect && guess.isFirst && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              First!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {guess.isCorrect ? (
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-lg font-medium">
                                +{guess.score || 0} pts
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-500 font-medium">✗</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">No guesses made this round!</p>
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

            {player?.isHost && gameState.currentRound <= gameState.totalRounds && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleStartNextRound}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full mr-2"></span>
                      Starting next round...
                    </span>
                  ) : 'Start Next Round'}
                </button>
              </div>
            )}

            {!player?.isHost && (
              <div className="text-center text-gray-600">
                {gameState.currentRound <= gameState.totalRounds ? (
                  <p>Waiting for host to start the next round...</p>
                ) : (
                  <p>Calculating final results...</p>
                )}
              </div>
            )}
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
                  <p className="text-xs text-gray-500 mt-1">seconds left</p>
                </div>
              </div>

              {/* Emoji display */}
              <EmojiDisplay emojis={currentRound?.emojis} size="xlarge" />

              {/* Guess form */}
              <form onSubmit={handleSubmitGuess} className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    disabled={correctGuess || loading}
                    placeholder={correctGuess ? "Your answer was submitted" : "Type your guess here..."}
                    className={`w-full px-4 py-2.5 rounded-lg border ${correctGuess ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'} outline-none transition duration-200 pr-24 shadow-sm`}
                  />
                  <button
                    type="submit"
                    disabled={!guess.trim() || correctGuess || loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        Submitting
                      </span>
                    ) : 'Submit Guess'}
                  </button>
                </div>
                {correctGuess && (
                  <p className="mt-2 text-sm text-gray-600">
                    Answer submitted. Waiting for other players...
                  </p>
                )}
              </form>
            </div>
            {/* Players who answered indicator */}
            <div className="mb-4 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Players answered:</span>
                <span className="font-medium">{gameState.playersAnswered} / {gameState.totalPlayers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(gameState.playersAnswered / gameState.totalPlayers) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Host controls */}
            {player?.isHost && (
              <div className="mb-4 flex flex-col items-center">
                <button
                  onClick={handleEndRound}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Ending round...
                    </span>
                  ) : 'End Round'}
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">Click to end the current round manually</p>
              </div>
            )}

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
