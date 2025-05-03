import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    {
      question: "What is Guess the Emoji?",
      answer: "Guess the Emoji is a multiplayer online game where players try to guess movie titles, phrases, brands, and concepts based on emoji combinations. It's perfect for parties, family gatherings, team-building activities, and virtual hangouts."
    },
    {
      question: "How do I play the game?",
      answer: "Playing is simple! Create a game room or join an existing one with a game code. Each round, you'll see a set of emojis representing a phrase, movie, or concept. Type your guess in the chat as quickly as possible. The faster you guess correctly, the more points you earn!"
    },
    {
      question: "How many players can join a game?",
      answer: "The game requires a minimum of 2 players to start. There's no strict upper limit, but we recommend 2-10 players for the best experience. With more players, the competition gets more exciting!"
    },
    {
      question: "Do I need to create an account to play?",
      answer: "No! Guess the Emoji is designed to be quick and easy to join. No account creation or downloads are required. Simply enter your display name and you're ready to play."
    },
    {
      question: "Is the game free to play?",
      answer: "Yes, Guess the Emoji is completely free to play. We may display non-intrusive advertisements to support the development and maintenance of the game."
    },
    {
      question: "What devices can I play on?",
      answer: "Guess the Emoji works on any device with a modern web browser, including desktops, laptops, tablets, and smartphones. The game is responsive and adapts to different screen sizes."
    },
    {
      question: "How are points calculated?",
      answer: "Points are awarded based on speed and accuracy. The first player to guess correctly receives bonus points. Additional points are awarded based on how quickly you answer correctly. Incorrect guesses do not receive points."
    },
    {
      question: "Can I create custom emoji puzzles?",
      answer: "Yes! Game hosts can create custom puzzles for their games. When creating a game, you'll have the option to add your own emoji combinations and answers."
    },
    {
      question: "What categories are available?",
      answer: "We offer a wide range of categories including Movies (Hollywood, Bollywood, and regional cinema), TV Shows, Music, Books, Brands, Places, Food, Sports, Technology, and many more. Game hosts can select which categories to include in their game."
    },
    {
      question: "How do I share a game with friends?",
      answer: "When you create a game, you'll receive a unique game code. Share this code with your friends, and they can enter it on the homepage to join your game. The code is case-sensitive, so make sure to share it exactly as shown."
    },
    {
      question: "What happens if I lose connection during a game?",
      answer: "Don't worry! If you lose connection, you can rejoin the game using the same game code and display name. Your score will be preserved as long as you rejoin within a reasonable time frame."
    },
    {
      question: "Can I play on different networks?",
      answer: "Yes! Players can join from any network or location as long as they have internet access. This makes it perfect for virtual gatherings with friends and family across different locations."
    },
    {
      question: "How do I report inappropriate content or bugs?",
      answer: "If you encounter any issues or inappropriate content, please contact us through our Contact page. We take all reports seriously and will address them promptly."
    },
    {
      question: "Is there a time limit for guessing?",
      answer: "Yes, each round has a time limit that can be set by the host when creating the game. The default is 60 seconds per round, but this can be adjusted to make the game more challenging or relaxed."
    },
    {
      question: "How many rounds are in a game?",
      answer: "The number of rounds can be customized by the host when creating a game. The default is 5 rounds, but you can choose between 3 to 20 rounds depending on how long you want to play."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO 
        title="Frequently Asked Questions | Guess the Emoji: Multiplayer Party Game"
        description="Find answers to common questions about Guess the Emoji, the multiplayer party game where you guess phrases and concepts from emoji combinations."
        keywords="emoji game FAQ, how to play emoji game, emoji game rules, emoji game help, guess the emoji questions"
        canonicalUrl="/faq"
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
        
        <div className="prose prose-indigo max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Find answers to the most common questions about Guess the Emoji. If you can't find what you're looking for, feel free to <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">contact us</Link>.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Still have questions?</h2>
            <p className="text-indigo-700 mb-4">
              We're here to help! If you couldn't find the answer to your question, please reach out to us.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
