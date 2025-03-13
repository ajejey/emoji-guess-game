import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../services/socketService';

const ChatBox = ({ messages, gameId, currentPlayerId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessage(gameId, newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="card h-full flex flex-col">
      <h2 className="text-lg font-medium mb-3">Chat</h2>
      
      <div className="flex-grow overflow-y-auto mb-4 space-y-3 max-h-[400px] min-h-[200px]">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg max-w-[85%] ${
                msg.playerId === currentPlayerId 
                  ? 'bg-primary/10 ml-auto' 
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">
                {msg.playerId === currentPlayerId ? 'You' : msg.playerName}
              </p>
              <p className="break-words">{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No messages yet. Be the first to say something!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field pr-12"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary disabled:text-gray-400"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
