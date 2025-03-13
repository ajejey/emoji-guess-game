import React from 'react';

const PlayerList = ({ players, currentPlayerId }) => {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-3">Players ({players.length})</h3>
      
      {sortedPlayers.map(player => (
        <div 
          key={player.id} 
          className={`flex items-center p-3 rounded-lg ${
            player.id === currentPlayerId 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-white border border-gray-100'
          }`}
        >
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
            {player.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <p className="font-medium">
                {player.name} 
                {player.id === currentPlayerId && <span className="text-xs ml-2">(You)</span>}
              </p>
              {player.isHost && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Host
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className="font-bold">{player.score}</span>
            <span className="text-gray-500 text-sm ml-1">pts</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
