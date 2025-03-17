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
              ? 'bg-blue-50 border border-blue-200' 
              : 'bg-white border border-gray-100'
          } transition-all hover:shadow-sm`}
        >
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-medium">
            {player.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <p className="font-medium">
                {player.name} 
                {player.id === currentPlayerId && <span className="text-xs ml-2 text-blue-600">(You)</span>}
              </p>
              {player.isHost && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  Host
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className="font-bold text-blue-700">{player.score}</span>
            <span className="text-gray-500 text-sm ml-1">pts</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
