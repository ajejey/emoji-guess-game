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
  
  // Categories available for selection
  CATEGORIES: [
    'Animals',
    'Entertainment',
    'Technology',
    'Kannada movie',
    'Malayalam movie',
    'Tamil movie',
    'Telugu movie',
    'Hindi movie',
    'Hollywood movie',
    'TV Shows',
    'Music',
    'Books',
    'Brands',
    'Places',
    'Phrases'
  ],
  
  // Complete puzzle library for production use
  PUZZLE_LIBRARY: [
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
    { emojis: "🍳 + 👨‍👦‍👦", answer: "Panda", category: "Animals" },
    { emojis: "❤️ + 🍹", answer: "love mocktail", category: "Kannada movie" },
    { emojis: "🥅 +⚾ +🗝️", answer: "Hockey", category: "Sports" },
    { emojis: "💔", answer: "Heart Break", category: "Emotions" },
    { emojis: "🌌 + 🚢 ", answer: "Spaceship", category: "Space" },
    { emojis: "👋+😁+👖", answer: "Elephant", category: "Animals" },
    { emojis: "❤️ +👩‍🍼", answer: "Premam", category: "Malayalam movie" },
    { emojis: "👽", answer: "Ayalaan", category: "Tamil movie" },

    // Hinid movies
    { emojis: "🌟🌍👦🎨", answer: "Taare Zameen Par", category: "Hindi movie" },
  { emojis: "🧑‍🤝‍🧑🌉🌊🛣️", answer: "Dil Chahta Hai", category: "Hindi movie" },
  { emojis: "🔥❤️", answer: "Kabir Singh", category: "Hindi movie" },
  { emojis: "👊🧓", answer: "Bajrangi Bhaijaan", category: "Hindi movie" },
  { emojis: "📚🏫", answer: "Chhichhore", category: "Hindi movie" },
  { emojis: "👴👶", answer: "Paa", category: "Hindi movie" },
  { emojis: "🎸🎤", answer: "Rockstar", category: "Hindi movie" },
  { emojis: "💃🎬", answer: "ABCD", category: "Hindi movie" },
  { emojis: "👰🏃‍♂️🏙️", answer: "Band Baaja Baaraat", category: "Hindi movie" },
  { emojis: "👨‍🎤🎧🎶", answer: "Gully Boy", category: "Hindi movie" },
  { emojis: "🤐🍬🚂", answer: "Barfi", category: "Hindi movie" },
  { emojis: "🧘‍♂️🏞️", answer: "Yeh Jawaani Hai Deewani", category: "Hindi movie" },
  { emojis: "💼💸🤵", answer: "Guru", category: "Hindi movie" },
  { emojis: "🕵️‍♂️💣💥", answer: "Baby", category: "Hindi movie" },
  { emojis: "💃🕺🎉🏆", answer: "Student of the Year", category: "Hindi movie" },
  { emojis: "👑🔫🚬", answer: "Raees", category: "Hindi movie" },
  { emojis: "💃🎭👵", answer: "English Vinglish", category: "Hindi movie" },
  { emojis: "🚶‍♂️📸🏙️", answer: "Wake Up Sid", category: "Hindi movie" },
  { emojis: "🇪🇸🍅🤿🪂", answer: "Zindagi Na Milegi Dobara", category: "Hindi movie" },
  { emojis: "🤖⚡🕹️", answer: "Ra.One", category: "Hindi movie" },

  // Telugu movies:
  { emojis: "🌲🏹🦌👑", answer: "Baahubali", category: "Telugu movie" },
  { emojis: "🔫🌹🪓", answer: "Pushpa", category: "Telugu movie" },
  { emojis: "🏏👨‍👦🏆", answer: "Jersey", category: "Telugu movie" },
  { emojis: "🎤🎸🌟", answer: "Rockstar", category: "Telugu movie" },
  { emojis: "🪙⚖️👨‍⚖️", answer: "Maharshi", category: "Telugu movie" },
  { emojis: "👩‍❤️‍👨💔🎭", answer: "Geetha Govindam", category: "Telugu movie" },
  { emojis: "👨‍🏫📚🎓", answer: "Arjun Reddy", category: "Telugu movie" },
  { emojis: "🚓👊🧑‍⚖️", answer: "Temper", category: "Telugu movie" },
  { emojis: "🚨🦸‍♂️🧠", answer: "Mental Madhilo", category: "Telugu movie" },
  { emojis: "🕵️‍♂️📷🎯", answer: "Goodachari", category: "Telugu movie" },
  { emojis: "🐯🩸🌊", answer: "RRR", category: "Telugu movie" },
  { emojis: "🧠💣🎯", answer: "1 - Nenokkadine", category: "Telugu movie" },
  { emojis: "👩‍❤️‍👨🌦️🧁", answer: "Fidaa", category: "Telugu movie" },
  { emojis: "🎭😵👻", answer: "Evaru", category: "Telugu movie" },
  { emojis: "🕺👑🔥", answer: "Ala Vaikunthapurramuloo", category: "Telugu movie" },
  { emojis: "💍👰🤯", answer: "Kushi", category: "Telugu movie" },
  { emojis: "🚁🔫🧬", answer: "Sahoo", category: "Telugu movie" },
  { emojis: "👨‍⚕️💉😷", answer: "Doctor", category: "Telugu movie" },
  { emojis: "🎤👨‍👩‍👧‍👦💔", answer: "Dear Comrade", category: "Telugu movie" },
  { emojis: "🏞️🌿🦁", answer: "Virata Parvam", category: "Telugu movie" },

  // kannada movies
  { emojis: "👑💣🪓", answer: "K.G.F", category: "Kannada movie" },
  { emojis: "👸🐘🔥", answer: "Kantara", category: "Kannada movie" },
  { emojis: "🎓💼💰", answer: "College Kumar", category: "Kannada movie" },
  { emojis: "💑🎨🎭", answer: "Love Mocktail", category: "Kannada movie" },
  { emojis: "🤖🎮⚡", answer: "Yuvarathnaa", category: "Kannada movie" },
  { emojis: "🚴‍♂️🌄🎧", answer: "777 Charlie", category: "Kannada movie" },
  { emojis: "👮‍♂️🔫🧠", answer: "Tagaru", category: "Kannada movie" },
  { emojis: "🏡👩‍❤️‍👨🌧️", answer: "Gaalipata", category: "Kannada movie" },
  { emojis: "🎭📽️📻", answer: "Bell Bottom", category: "Kannada movie" },
  { emojis: "🏃‍♂️🕰️🎯", answer: "Ugramm", category: "Kannada movie" },
  { emojis: "🧘‍♂️📿🌌", answer: "Avane Srimannarayana", category: "Kannada movie" },
  { emojis: "👨‍👩‍👧👊🔥", answer: "Roberrt", category: "Kannada movie" },
  { emojis: "💍👩‍❤️‍👨👴", answer: "Dia", category: "Kannada movie" },
  { emojis: "🌧️📺🪟", answer: "Rangitaranga", category: "Kannada movie" },
  { emojis: "🧑‍🎓🧗‍♂️🎓", answer: "Sarkari Hi. Pra. Shaale", category: "Kannada movie" },
  { emojis: "🎤🎧🏆", answer: "Just Maath Maathalli", category: "Kannada movie" },
  { emojis: "🏹🗡️👻", answer: "Shivaji Surathkal", category: "Kannada movie" },
  { emojis: "👩‍💼🕵️‍♂️💔", answer: "Gentleman", category: "Kannada movie" },
  { emojis: "🛣️👫🎙️", answer: "Simple Agi Ondh Love Story", category: "Kannada movie" },
  { emojis: "🚔🎭🦹‍♂️", answer: "Inspector Vikram", category: "Kannada movie" },


      // Indian Movies
  { emojis: "3️⃣ + 🥜", answer: "3 Idiots", category: "Hindi movie" },
  { emojis: "👨‍👩‍👧‍👦 + 👨‍👩‍👧‍👦", answer: "Hum Saath Saath Hain", category: "Hindi movie" },
  { emojis: "🏏 + 👨‍👦 + 🏆", answer: "Jersey", category: "Telugu movie" },
  { emojis: "🧠 + 👁️", answer: "Vikram", category: "Tamil movie" },
  { emojis: "🔫 + 🌹", answer: "Pushpa", category: "Telugu movie" },
  { emojis: "👑 + 👑 + 👑", answer: "K.G.F", category: "Kannada movie" },
  { emojis: "2️⃣ + 👦 + 👨", answer: "Drishyam 2", category: "Malayalam movie" },
  { emojis: "🎂 + 📞", answer: "Cake Mixing", category: "Malayalam movie" },
  { emojis: "🐅 + 🔴", answer: "Red", category: "Telugu movie" },
  { emojis: "💍 + 👰‍♀️ + 💔", answer: "Tanu Weds Manu", category: "Hindi movie" },
  { emojis: "👁️ + 👨‍⚕️", answer: "Doctor", category: "Tamil movie" },
  { emojis: "👨‍✈️ + ⭐", answer: "Soorarai Pottru", category: "Tamil movie" },
  { emojis: "🧠 + 🧟", answer: "Bramhastra", category: "Hindi movie" },
  { emojis: "🏃‍♂️ + 🔙 + 👨‍👩‍👧", answer: "Run Baby Run", category: "Malayalam movie" },
  { emojis: "👸 + 🐘", answer: "Kantara", category: "Kannada movie" },


  
    // Hollywood Movie
    { emojis: "👨‍🚀 + ⭐ + ⚔️", answer: "Star Wars", category: "Hollywood movie" },
    { emojis: "🧙‍♂️ + 💍 + 🌋", answer: "Lord of the Rings", category: "Hollywood movie" },
    { emojis: "🏆 + 🧠 + 💭", answer: "Inception", category: "Hollywood movie" },
    { emojis: "🦖 + 🏝️ + 🧬", answer: "Jurassic Park", category: "Hollywood movie" },
    { emojis: "🚢 + 💔 + 🧊", answer: "Titanic", category: "Hollywood movie" },
    { emojis: "👨 + 🦇 + 🃏", answer: "The Dark Knight", category: "Hollywood movie" },
    { emojis: "🤖 + 🕒 + 🔙", answer: "Terminator", category: "Hollywood movie" },
    { emojis: "👽 + 👆 + 🏠", answer: "E.T.", category: "Hollywood movie" },
    { emojis: "🎭 + 🎪 + 👑", answer: "The Greatest Showman", category: "Hollywood movie" },
    { emojis: "☂️ + 🎵 + 🕺", answer: "Singin' in the Rain", category: "Hollywood movie" },
    { emojis: "🧩 + 🎮 + 🌐", answer: "Ready Player One", category: "Hollywood movie" },
    { emojis: "👰‍♀️ + 👻 + 💀", answer: "Corpse Bride", category: "Hollywood movie" },
    { emojis: "🏃‍♂️ + 🍫 + 🪶", answer: "Forrest Gump", category: "Hollywood movie" },
    { emojis: "🧠 + 🔄 + 😭", answer: "Inside Out", category: "Hollywood movie" },
    { emojis: "👨‍👩‍👧 + 🌊 + 👽", answer: "Interstellar", category: "Hollywood movie" },
    { emojis: "🧙‍♀️ + 🧹 + 🏰", answer: "Harry Potter", category: "Hollywood movie" },
    { emojis: "🔴 + 💊 + 🐇", answer: "The Matrix", category: "Hollywood movie" },
    { emojis: "🦁 + 👑 + 🌍", answer: "The Lion King", category: "Hollywood movie" },
    { emojis: "🤡 + 🎈 + 🚲", answer: "IT", category: "Hollywood movie" },
    { emojis: "🎮 + 🏆 + 🎭", answer: "The Hunger Games", category: "Hollywood movie" },
    { emojis: "💎 + 💍 + 👑", answer: "The Lord of the Rings", category: "Hollywood movie" },
    { emojis: "🧟‍♂️ + 🧠 + 💘", answer: "Warm Bodies", category: "Hollywood movie" },
    { emojis: "👨‍🚀 + 🔴 + 🥔", answer: "The Martian", category: "Hollywood movie" },
    { emojis: "🧑‍🔬 + ⚡ + 🧪", answer: "Back to the Future", category: "Hollywood movie" },
    { emojis: "🕷️ + 🕸️ + 🌆", answer: "Spider-Man: Across the Spider-Verse", category: "Hollywood movie" },
    { emojis: "👸 + ❄️ + ⛄", answer: "Frozen", category: "Hollywood movie" },
    { emojis: "🏊‍♀️ + 🦈 + 🌊", answer: "Jaws", category: "Hollywood movie" },
    { emojis: "🔨 + ⚡ + 🌈", answer: "Thor: Ragnarok", category: "Hollywood movie" },
    
    // TV Shows
    { emojis: "👑 + 🐉 + ⚔️", answer: "Game of Thrones", category: "TV Shows" },
    { emojis: "🧪 + 💊 + 👨‍🔬", answer: "Breaking Bad", category: "TV Shows" },
    { emojis: "👽 + 🕵️ + 👓", answer: "The X-Files", category: "TV Shows" },
    { emojis: "🧟‍♂️ + 🏃‍♀️ + 🔫", answer: "The Walking Dead", category: "TV Shows" },
    { emojis: "👨‍⚕️ + 🏠 + 🔍", answer: "House M.D.", category: "TV Shows" },
    { emojis: "👑 + 👸 + 🇬🇧", answer: "The Crown", category: "TV Shows" },
    { emojis: "🧠 + 🔍 + 🧩", answer: "Sherlock", category: "TV Shows" },
    { emojis: "👨‍👩‍👧‍👦 + 🛋️ + ☕", answer: "Friends", category: "TV Shows" },
    { emojis: "🦑 + 🎮 + 💰", answer: "Squid Game", category: "TV Shows" },
    { emojis: "🧙‍♂️ + ⚔️ + 🪙", answer: "The Witcher", category: "TV Shows" },
    { emojis: "🏫 + 🧠 + 👾", answer: "Stranger Things", category: "TV Shows" },
    { emojis: "🔎 + 💵 + 🏦", answer: "Money Heist", category: "TV Shows" },
    { emojis: "👩‍⚕️ + 👨‍⚕️ + 💘", answer: "Grey's Anatomy", category: "TV Shows" },
    { emojis: "👑 + 👨‍👩‍👧‍👦 + 🎲", answer: "Succession", category: "TV Shows" },
    { emojis: "🦸‍♀️ + 📸 + 💪", answer: "Jessica Jones", category: "TV Shows" },
    { emojis: "🧛‍♂️ + 🔪 + 👮‍♂️", answer: "True Blood", category: "TV Shows" },
    { emojis: "🤣 + 🧠 + 🔬", answer: "The Big Bang Theory", category: "TV Shows" },
    { emojis: "📝 + 🏢 + 🤣", answer: "The Office", category: "TV Shows" },
    { emojis: "🦇 + 🧛‍♀️ + 🔪", answer: "Buffy the Vampire Slayer", category: "TV Shows" },
    { emojis: "👩‍⚖️ + 👨‍⚖️ + 🔎", answer: "How to Get Away with Murder", category: "TV Shows" },
    { emojis: "🏝️ + ✈️ + ⏱️", answer: "Lost", category: "TV Shows" },
    { emojis: "🐎 + 👑 + 🏰", answer: "Bridgerton", category: "TV Shows" },
    { emojis: "💊 + 👩‍🦰 + 🟠", answer: "Orange is the New Black", category: "TV Shows" },
    { emojis: "🎭 + 👨‍👩‍👧‍👦 + 🏠", answer: "This Is Us", category: "TV Shows" },
    { emojis: "🦸‍♂️ + ⚡ + 🏃‍♂️", answer: "The Flash", category: "TV Shows" },
    { emojis: "🤖 + 🌐 + 🧠", answer: "Westworld", category: "TV Shows" },
    
    // Music
    { emojis: "👸 + 🎵 + 👑", answer: "Queen", category: "Music" },
    { emojis: "🔄 + 🌊 + 🎸", answer: "Rolling Stone", category: "Music" },
    { emojis: "🤖 + 🎧 + 🎛️", answer: "Daft Punk", category: "Music" },
    { emojis: "🔫 + 🌹", answer: "Guns N' Roses", category: "Music" },
    { emojis: "❄️ + ⛓️", answer: "Coldplay", category: "Music" },
    { emojis: "🐜 + 🧠 + 💪", answer: "Anthrax", category: "Music" },
    { emojis: "🎯 + 👨‍🎤 + 🌧️", answer: "AC/DC", category: "Music" },
    { emojis: "👁️ + 🐅", answer: "Eye of the Tiger", category: "Music" },
    { emojis: "🧠 + 👻 + 💀", answer: "Imagine Dragons", category: "Music" },
    { emojis: "💨 + 👦", answer: "Billie Eilish", category: "Music" },
    { emojis: "🔴 + 🔥 + 🌶️", answer: "Red Hot Chili Peppers", category: "Music" },
    { emojis: "👨‍👨‍👦‍👦 + 👨‍👨‍👦‍👦", answer: "One Direction", category: "Music" },
    { emojis: "👧 + 🎵 + 🔥", answer: "Alicia Keys", category: "Music" },
    { emojis: "🐠 + 🎣 + 🌊", answer: "Phish", category: "Music" },
    { emojis: "🖤 + 🪐 + 👁️", answer: "Black Eyed Peas", category: "Music" },
    { emojis: "👨‍🦱 + 🐻 + 👨‍🎤", answer: "Bruno Mars", category: "Music" },
    { emojis: "🎭 + 👰‍♀️ + 💔", answer: "Panic! At The Disco", category: "Music" },
    { emojis: "🌞 + 📅 + 🌄", answer: "Twenty One Pilots", category: "Music" },
    { emojis: "🎪 + 🐘 + 🎵", answer: "Cage The Elephant", category: "Music" },
    { emojis: "👸 + 🐝", answer: "Queen Bee (Beyoncé)", category: "Music" },
    { emojis: "🏠 + 🧲", answer: "Arctic Monkeys", category: "Music" },
    { emojis: "🌿 + 🌲 + 🎸", answer: "Green Day", category: "Music" },
    { emojis: "🍋 + 😁", answer: "Lemonade", category: "Music" },
    { emojis: "⬛ + 🎵 + 👧", answer: "Blackpink", category: "Music" },
    { emojis: "🎭 + 5️⃣", answer: "Maroon 5", category: "Music" },
    { emojis: "👨‍🎤 + 🌙", answer: "The Weeknd", category: "Music" },
    { emojis: "🔮 + 🎲 + 🐘", answer: "Tame Impala", category: "Music" },
    
    // Books
    { emojis: "🔍 + 👴 + 🌊", answer: "The Old Man and the Sea", category: "Books" },
    { emojis: "🐖 + 👨‍🌾 + 🏛️", answer: "Animal Farm", category: "Books" },
    { emojis: "🦅 + 🔪", answer: "To Kill a Mockingbird", category: "Books" },
    { emojis: "🏝️ + 👑 + 🐷", answer: "Lord of the Flies", category: "Books" },
    { emojis: "🧠 + 🔥 + 📚", answer: "Fahrenheit 451", category: "Books" },
    { emojis: "🌊 + 🐋 + ⚓", answer: "Moby Dick", category: "Books" },
    { emojis: "💯 + 👴 + 🌊", answer: "One Hundred Years of Solitude", category: "Books" },
    { emojis: "1️⃣9️⃣8️⃣4️⃣ + 👁️", answer: "1984", category: "Books" },
    { emojis: "🧙‍♂️ + 💍 + 🌋", answer: "The Lord of the Rings", category: "Books" },
    { emojis: "🧙‍♀️ + 📖 + 🔮", answer: "Harry Potter", category: "Books" },
    { emojis: "⚰️ + 🧛‍♂️ + 🩸", answer: "Dracula", category: "Books" },
    { emojis: "💭 + 🧠 + 🧩", answer: "The Thinker", category: "Books" },
    { emojis: "✨ + ⚔️ + 🌌", answer: "The Hunger Games", category: "Books" },
    { emojis: "🧑‍💻 + 🎮 + 🎯", answer: "Ready Player One", category: "Books" },
    { emojis: "⬅️ + 👨‍💼 + 👩‍💼", answer: "Gone Girl", category: "Books" },
    { emojis: "🌃 + 🦋 + 📊", answer: "The Fault in Our Stars", category: "Books" },
    { emojis: "🐯 + 🛶 + 🌊", answer: "Life of Pi", category: "Books" },
    { emojis: "🤢 + 🧠 + 🧟", answer: "World War Z", category: "Books" },
    { emojis: "🧣 + 🎭 + 👗", answer: "The Handmaid's Tale", category: "Books" },
    { emojis: "🕰️ + 👨‍🔬 + 🦖", answer: "Jurassic Park", category: "Books" },
    { emojis: "👧 + 🐉 + 💉", answer: "Girl with the Dragon Tattoo", category: "Books" },
    { emojis: "📝 + 🏞️ + 🎒", answer: "Wild", category: "Books" },
    { emojis: "🥛 + 🍯 + 🍷", answer: "Milk and Honey", category: "Books" },
    { emojis: "🧹 + 🎃 + 🏮", answer: "The Night Circus", category: "Books" },
    { emojis: "🧰 + 🩺 + 🧬", answer: "The Immortal Life of Henrietta Lacks", category: "Books" },
    { emojis: "🌄 + 👁️ + 👂", answer: "All the Light We Cannot See", category: "Books" },
    { emojis: "☀️ + 🌗 + 👑", answer: "A Song of Ice and Fire", category: "Books" },
  
  // Brands
  { emojis: "🍎 + 💻 + 📱", answer: "Apple", category: "Brands" },
  { emojis: "👟 + ✔️", answer: "Nike", category: "Brands" },
  { emojis: "🚗 + ⚡ + 🚀", answer: "Tesla", category: "Brands" },
  { emojis: "☕ + 💚 + 🧜‍♀️", answer: "Starbucks", category: "Brands" },
  { emojis: "🔴 + ⚪ + 👖", answer: "Levi's", category: "Brands" },
  { emojis: "🐊 + 👕", answer: "Lacoste", category: "Brands" },
  { emojis: "3️⃣ + 🦓", answer: "Adidas", category: "Brands" },
  { emojis: "🏎️ + 🐎", answer: "Ferrari", category: "Brands" },
  
  // Places
  { emojis: "🗽 + 🍎 + 🏙️", answer: "New York", category: "Places" },
  { emojis: "🗼 + 🥖 + 💋", answer: "Paris", category: "Places" },
  { emojis: "🏺 + 🏛️ + 🧿", answer: "Athens", category: "Places" },
  { emojis: "🌉 + 🌁 + 🚊", answer: "San Francisco", category: "Places" },
  { emojis: "🎭 + ☕ + ⛪", answer: "Vienna", category: "Places" },
  { emojis: "🌋 + 🍣 + 🏯", answer: "Tokyo", category: "Places" },
  { emojis: "🏝️ + 🥥 + 🌊", answer: "Maldives", category: "Places" },
  { emojis: "🍺 + ⚽ + 🥨", answer: "Munich", category: "Places" },
  
  // Phrases
  { emojis: "🧵 + 🪡 + ⏱️", answer: "Stitch in Time", category: "Phrases" },
  { emojis: "🐦 + ✋ + 🌳", answer: "Bird in Hand", category: "Phrases" },
  { emojis: "🥚 + 🧺 + 1️⃣", answer: "All Eggs in One Basket", category: "Phrases" },
  { emojis: "🐈 + 😛 + 😶", answer: "Cat Got Your Tongue", category: "Phrases" },
  { emojis: "☔ + 🐱 + 🐶", answer: "Raining Cats and Dogs", category: "Phrases" },
  { emojis: "🎂 + 🍰 + 🍴", answer: "Piece of Cake", category: "Phrases" },
  { emojis: "💰 + 👄", answer: "Money Talks", category: "Phrases" },
  { emojis: "🏠 + 💖", answer: "Home is Where the Heart is", category: "Phrases" }
  ],

  // For testing - a subset of the main library
  SAMPLE_PUZZLES: [
    { emojis: "🍪", answer: "Cookie", category: "Food" },
    { emojis: "🌧️ + 🎀", answer: "Rainbow", category: "Nature" },
    { emojis: "Hi + 👨‍🍼", answer: "Hi Nanna", category: "Telugu movie" },
    { emojis: "🐝+🐝+👀 ", answer: "BBC", category: "Media" },
    { emojis: "🤝", answer: "Shake Hand", category: "Actions" },
    { emojis: "🤼", answer: "Dangal", category: "Hindi movie" },
    { emojis: "🔵🖨️", answer: "Blue Print", category: "Design" },
    { emojis: "🔐 + 👨‍🏫", answer: "Keyboard", category: "Technology" },
    { emojis: "👘 +🎨 ", answer: "Asian Paints", category: "Business" },
    { emojis: "🐙 + 🎮 +² ² ²", answer: "Squid Game 2", category: "Entertainment" },
    { emojis: "👩🏻‍💻 + 𝟏𝟏:𝟏𝟏", answer: "Face Time", category: "Technology" },
    { emojis: "MI + 🔑 + 🐭", answer: "Mickey Mouse", category: "Entertainment" },
    { emojis: "🍳 + 👨‍👦‍👦", answer: "Panda", category: "Animals" },
    { emojis: "❤️ + 🍹", answer: "love mocktail", category: "Kannada movie" },
    { emojis: "🥅 +⚾ +🗝️", answer: "Hockey", category: "Sports" },
    { emojis: "💔", answer: "Heart Break", category: "Emotions" },
    { emojis: "🌌 + 🚢 ", answer: "Spaceship", category: "Space" },
    { emojis: "👋+😁+👖", answer: "Elephant", category: "Animals" },
    { emojis: "❤️ +👩‍🍼", answer: "Premam", category: "Malayalam movie" },
    { emojis: "👽", answer: "Ayalaan", category: "Tamil movie" }
  ]
};
