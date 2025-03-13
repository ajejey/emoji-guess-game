import { useState } from 'react';
import { startGame, endGame, nextRound } from '../services/socketService';

const GameControls = ({ gameId, isHost, gameState }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  if (!isHost) return null;
  
  const handleStartGame = () => {
    startGame(gameId);
  };
  
  const handleNextRound = () => {
    nextRound(gameId);
  };
  
  const handleEndGame = () => {
    if (showConfirm) {
      endGame(gameId);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">Game Controls</h3>
      
      <div className="space-y-3">
        {gameState.status === 'waiting' && (
          <button 
            onClick={handleStartGame}
            className="btn-primary w-full"
            disabled={gameState.players.length < 2}
          >
            Start Game
            {gameState.players.length < 2 && (
              <span className="block text-xs mt-1">
                Need at least 2 players
              </span>
            )}
          </button>
        )}
        
        {gameState.status === 'roundEnd' && (
          <button 
            onClick={handleNextRound}
            className="btn-primary w-full"
          >
            Next Round
          </button>
        )}
        
        {gameState.status !== 'gameOver' && (
          <button 
            onClick={handleEndGame}
            className={`w-full ${
              showConfirm 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } font-medium py-2 px-4 rounded-lg transition-colors`}
          >
            {showConfirm ? 'Confirm End Game' : 'End Game'}
          </button>
        )}
        
        {showConfirm && (
          <button 
            onClick={() => setShowConfirm(false)}
            className="w-full bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default GameControls;
