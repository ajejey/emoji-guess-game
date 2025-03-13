const gameConfig = require('../config/gameConfig');

/**
 * Generate a random room code of specified length
 * @param {number} length - Length of the room code
 * @returns {string} - Random alphanumeric room code
 */
function generateRoomCode(length = 6) {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Calculate score based on time left and whether it's the first correct answer
 * @param {Object} options - Scoring options
 * @param {boolean} options.isFirstCorrect - Whether this is the first correct answer
 * @param {number} options.timeLeft - Time left in seconds
 * @param {number} options.roundTime - Total round time in seconds
 * @returns {number} - Calculated score
 */
function calculateScore({ isFirstCorrect, timeLeft, roundTime }) {
  // Base points for correct answer
  let score = isFirstCorrect 
    ? gameConfig.POINTS_FIRST_CORRECT 
    : gameConfig.POINTS_CORRECT;
  
  // Time bonus (more time left = more points)
  const timeBonus = Math.floor(timeLeft * gameConfig.POINTS_TIME_BONUS_FACTOR);
  
  return score + timeBonus;
}

/**
 * Check if a guess is correct (with some flexibility)
 * @param {string} guess - Player's guess
 * @param {string} answer - Correct answer
 * @returns {boolean} - Whether the guess is correct
 */
function isCorrectGuess(guess, answer) {
  // Normalize both strings: lowercase, trim, and remove extra spaces
  const normalizedGuess = guess.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalizedAnswer = answer.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Exact match
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }
  
  // Check for close matches (could be expanded with more sophisticated matching)
  // For example, "The Batman" vs "Batman" could be considered correct
  const guessWords = normalizedGuess.split(' ');
  const answerWords = normalizedAnswer.split(' ');
  
  // If answer has articles like "the", "a", "an" at the beginning, check without them
  if (answerWords[0] === 'the' || answerWords[0] === 'a' || answerWords[0] === 'an') {
    const answerWithoutArticle = answerWords.slice(1).join(' ');
    if (normalizedGuess === answerWithoutArticle) {
      return true;
    }
  }
  
  // Same for guess
  if (guessWords[0] === 'the' || guessWords[0] === 'a' || guessWords[0] === 'an') {
    const guessWithoutArticle = guessWords.slice(1).join(' ');
    if (guessWithoutArticle === normalizedAnswer) {
      return true;
    }
  }
  
  return false;
}

/**
 * Filter sensitive information from game state for clients
 * @param {Object} game - Game object
 * @returns {Object} - Filtered game state
 */
function sanitizeGameState(game) {
  // Create a copy of the game state without sensitive information like answers
  const { rounds, ...rest } = game;
  
  // Only include necessary round information
  const sanitizedRounds = rounds.map(round => {
    const { answer, ...roundData } = round;
    return roundData;
  });
  
  return {
    ...rest,
    rounds: sanitizedRounds
  };
}

module.exports = {
  generateRoomCode,
  calculateScore,
  isCorrectGuess,
  sanitizeGameState
};
