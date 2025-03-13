/**
 * Game configuration settings
 */
module.exports = {
  // Game settings
  DEFAULT_ROUND_TIME: 60, // seconds
  DEFAULT_ROUNDS_PER_GAME: 5,
  MIN_PLAYERS_TO_START: 2,
  
  // Scoring settings
  POINTS_FIRST_CORRECT: 100,
  POINTS_CORRECT: 50,
  POINTS_TIME_BONUS_FACTOR: 0.5, // bonus points per second left
  
  // Room settings
  ROOM_CODE_LENGTH: 6,
  ROOM_IDLE_TIMEOUT: 3600000, // 1 hour in milliseconds
  
  // Sample emoji puzzles (for testing)
  SAMPLE_PUZZLES: [
    { 
      emojis: "🦇 👨", 
      answer: "Batman",
      category: "Movies"
    },
    { 
      emojis: "🧙‍♂️ 💍", 
      answer: "Lord of the Rings",
      category: "Movies"
    },
    { 
      emojis: "👸 ❄️", 
      answer: "Frozen",
      category: "Movies"
    },
    { 
      emojis: "😈 👠", 
      answer: "The Devil Wears Prada",
      category: "Movies"
    },
    { 
      emojis: "🕷️ 👨", 
      answer: "Spider-Man",
      category: "Movies"
    },
    { 
      emojis: "🦖 🏝️", 
      answer: "Jurassic Park",
      category: "Movies"
    },
    { 
      emojis: "🚢 💔", 
      answer: "Titanic",
      category: "Movies"
    },
    { 
      emojis: "👻 👨‍👩‍👧", 
      answer: "Ghostbusters",
      category: "Movies"
    },
    { 
      emojis: "🤖 👮", 
      answer: "Robocop",
      category: "Movies"
    },
    { 
      emojis: "🧠 🍽️", 
      answer: "Food for Thought",
      category: "Phrases"
    },
    { 
      emojis: "🔥 🧊", 
      answer: "Fire and Ice",
      category: "Phrases"
    },
    { 
      emojis: "🌧️ ☀️", 
      answer: "Rainbow",
      category: "Nature"
    }
  ]
};
