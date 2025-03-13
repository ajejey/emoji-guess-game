import { useEffect, useState } from 'react';

const EmojiDisplay = ({ emojis, size = 'large' }) => {
  const [emojiArray, setEmojiArray] = useState([]);
  
  useEffect(() => {
    if (emojis) {
      setEmojiArray(emojis.split(' '));
    }
  }, [emojis]);
  
  const sizeClasses = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-3xl md:text-4xl lg:text-5xl',
    large: 'text-4xl md:text-6xl lg:text-7xl',
    xlarge: 'text-5xl md:text-7xl lg:text-8xl'
  };
  
  if (!emojis) {
    return null;
  }
  
  return (
    <div className={`flex justify-center items-center space-x-3 my-6 ${sizeClasses[size]}`}>
      {emojiArray.map((emoji, index) => (
        <div 
          key={index} 
          className="transform transition-transform hover:scale-110 duration-200"
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default EmojiDisplay;
