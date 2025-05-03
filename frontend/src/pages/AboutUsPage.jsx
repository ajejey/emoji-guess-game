import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO 
        title="About Us | Guess the Emoji: Multiplayer Party Game"
        description="Learn about the team behind Guess the Emoji, the most fun multiplayer emoji guessing game for parties and team building activities."
        keywords="about guess the emoji, emoji game developers, emoji game story, multiplayer game team"
        canonicalUrl="/about-us"
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
        
        <div className="prose prose-indigo max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Welcome to Guess the Emoji, a multiplayer party game that brings people together through the universal language of emojis. Our journey began in 2023 when our founder, Ajey Nagarkatti, noticed how emojis had become an integral part of our daily communication.
          </p>
          <p>
            What started as a simple game played among friends during gatherings evolved into a full-fledged online platform that allows people from around the world to connect, compete, and have fun together. We believe that games have the power to bridge gaps, create memories, and foster connections.
          </p>
          
          <div className="my-8 flex justify-center">
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 max-w-lg">
              <blockquote className="italic text-indigo-800">
                "I created Guess the Emoji because I wanted to build something that brings joy and connection in our increasingly digital world. Emojis transcend language barriers and allow us to express emotions universally - making them the perfect foundation for a game that everyone can enjoy."
              </blockquote>
              <p className="text-right mt-4 font-medium text-indigo-700">— Ajey Nagarkatti, Founder</p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            At Guess the Emoji, our mission is to create engaging, accessible, and fun multiplayer experiences that bring people together. We believe in:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Connection:</strong> Building games that help people connect across distances</li>
            <li><strong>Inclusivity:</strong> Creating experiences that anyone can enjoy, regardless of age or background</li>
            <li><strong>Innovation:</strong> Continuously improving our platform with new features and puzzles</li>
            <li><strong>Fun:</strong> Above all, ensuring our games bring joy and laughter to players</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">How It Works</h2>
          <p>
            Guess the Emoji is a multiplayer game where players try to guess phrases, movie titles, songs, and concepts based on emoji combinations. The game is perfect for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Virtual team building activities</li>
            <li>Family game nights</li>
            <li>Party entertainment</li>
            <li>Classroom activities</li>
            <li>Ice breakers for meetings</li>
          </ul>
          <p>
            Our platform offers a variety of categories and difficulty levels, ensuring there's something for everyone. The game is designed to be easy to join and play - no downloads or accounts required!
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-6">
            <div className="flex flex-col items-center md:items-start md:flex-row">
              <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ajey Nagarkatti</h3>
                <p className="text-indigo-600 mb-2">Founder & Developer</p>
                <p className="text-gray-600">
                  Ajey is a full stack developer and a person who loves developing apps. With a passion for
                  creating interactive experiences that bring people together, he built Guess the Emoji as a
                  fun way for friends and families to connect. When not coding, Ajey enjoys exploring new
                  technologies, playing board games, and discovering creative ways to solve problems.
                </p>
                <div className="mt-3">
                  <a 
                    href="https://www.linkedin.com/in/ajey-nagarkatti-28273856/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-700 mr-4"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-10 mb-4">Join Our Community</h2>
          <p>
            We're more than just a game - we're a community of emoji enthusiasts and puzzle lovers! Connect with us on social media to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Get updates on new features and categories</li>
            <li>Share your favorite emoji puzzles</li>
            <li>Participate in special events and competitions</li>
            <li>Connect with other players</li>
          </ul>
          <p>
            Have questions or suggestions? We'd love to hear from you! Visit our <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">Contact page</Link> to get in touch.
          </p>
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

export default AboutUsPage;
