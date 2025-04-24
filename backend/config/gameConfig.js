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
    { emojis: "🍪", answer: "Cookie", category: "Food" },
    { emojis: "🌧️ + 🎀", answer: "Rainbow", category: "Nature" },
    { emojis: "Hi + 👨‍🍼", answer: "Hi Nanna", category: "Telugu movie" },
    { emojis: "🐝+🐝+👀 ", answer: "BBC", category: "Media" },
    { emojis: "🤝", answer: "Shake Hand", category: "Actions" },
    { emojis: "🤼", answer: "Dangal", category: "Hindi Movie" },
    { emojis: "🔵🖨️", answer: "Blue Print", category: "Design" },
    { emojis: "🔐 + 👨‍🏫", answer: "Keyboard", category: "Technology" },
    { emojis: "👘 +🎨 ", answer: "Asian Paints", category: "Business" },
    { emojis: "🐙 + 🎮 +² ² ²", answer: "Squid Game 2", category: "Entertainment" },
    { emojis: "👩🏻‍💻 + 𝟏𝟏:𝟏𝟏", answer: "Face Time", category: "Technology" },
    { emojis: "MI + 🔑 + 🐭", answer: "Mickey Mouse", category: "Entertainment" },
    { emojis: "🍳 + 🧸", answer: "Panda", category: "Animals" },
    { emojis: "❤️ + 🍹", answer: "love mocktail", category: "Kannada movie" },
    { emojis: "🥅 +⚾ +🗝️", answer: "Hockey", category: "Sports" },
    { emojis: "💔", answer: "Heart Break", category: "Emotions" },
    { emojis: "🌌 + 🚢 ", answer: "Spaceship", category: "Space" },
    { emojis: "👋+😁+👖", answer: "Elephant", category: "Animals" },
    { emojis: "❤️ +👩‍🍼", answer: "Premam", category: "Malayalam movie" },
    { emojis: "👽", answer: "Ayalaan", category: "Tamil movie" }
  ]

  // SAMPLE_PUZZLES: [
  //   { 
  //     emojis: "🦇 👨", 
  //     answer: "Batman",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🧙‍♂️ 💍", 
  //     answer: "Lord of the Rings",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "👸 ❄️", 
  //     answer: "Frozen",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "😈 👠", 
  //     answer: "The Devil Wears Prada",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🕷️ 👨", 
  //     answer: "Spider Man",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🦖 🏝️", 
  //     answer: "Jurassic Park",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🚢 💔", 
  //     answer: "Titanic",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "👻 👨‍👩‍👧", 
  //     answer: "Ghostbusters",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🤖 👮", 
  //     answer: "Robocop",
  //     category: "Movies"
  //   },
  //   { 
  //     emojis: "🧠 🍽️", 
  //     answer: "Food for Thought",
  //     category: "Phrases"
  //   },
  //   { 
  //     emojis: "🔥 🧊", 
  //     answer: "Fire and Ice",
  //     category: "Phrases"
  //   },
  //   { 
  //     emojis: "🌧️ ☀️", 
  //     answer: "Rainbow",
  //     category: "Nature"
  //   }
  // ]
};
