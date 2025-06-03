import React from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { Link } from 'react-router-dom'; // Assuming you use React Router
import SEO from '../components/SEO';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      slug: 'the-ultimate-guide-to-emoji-guess-games',
      title: 'The Ultimate Guide to Emoji Guess Games',
      excerpt: 'Emoji guess games are a fantastically fun and versatile way to engage with friends, family, colleagues, or even as a solo brain-teaser....'
    },
    {
      id: 2,
      slug: 'top-online-games-to-play-with-friends',
      title: 'Top Online Games to Play with Friends',
      excerpt: 'Online games offer a unique way to bond, collaborate, compete, and create lasting memories with friends, whether separated by distance or just busy schedules...'
    },
    {
      id: 3,
      slug: 'fun-team-building-games-for-remote-teams',
      title: 'Fun Team Building Games for Remote Teams',
      excerpt: 'Fun team building games for remote teams are a fantastic way to bond, collaborate, and create lasting memories with friends, whether separated by distance or just busy schedules...'
    },
    {
      id: 4,
      slug: 'how-to-host-a-virtual-game-night',
      title: 'How to Host a Virtual Game Night',
      excerpt: 'In a world where digital connection often takes center stage, virtual game nights have emerged as a shining beacon of shared joy, laughter, and genuine camaraderie.'
    },
    {
      id: 5,
      slug: 'the-surprising-benefits-of-playing-online-games',
      title: 'The Surprising Benefits of Playing Online Games',
      excerpt: 'For decades, video games, particularly online games, have often been painted with a broad, and sometimes unflattering, brush...'
    },
    {
      id: 6,
      slug: 'emojis-in-marketing-connecting-with-your-audience-visually',
      title: "Emojis in Marketing: Connecting with Your Audience Visually",
      excerpt: "Discover how brands are leveraging the power of emojis to create more engaging and relatable marketing campaigns..."
    },
    {
      id: 7,
      slug: 'the-psychology-of-emojis-why-we-love-these-little-icons',
      title: "The Psychology of Emojis: Why We Love These Little Icons",
      excerpt: "Delve into the psychological reasons behind our affection for emojis and how they enhance digital communication..."
    },
    {
      id: 8,
      slug: 'emoji-challenges-test-your-skills-with-these-brain-teasers',
      title: "Emoji Challenges: Test Your Skills with These Brain Teasers",
      excerpt: "Put your emoji knowledge to the test with these fun and challenging brain teasers! Can you solve them all?..."
    },
    {
      id: 9,
      slug: 'the-evolution-of-emoji-from-simple-smileys-to-diverse-icons',
      title: "The Evolution of Emoji: From Simple Smileys to Diverse Icons",
      excerpt: "Explore the fascinating journey of emojis, from their humble beginnings as simple emoticons to the diverse and inclusive icons we use today..."
    },
    {
      id: 10,
      slug: 'emojis-across-cultures-meanings-that-get-lost-in-translation',
      title: "Emojis Across Cultures: Meanings That Get Lost in Translation",
      excerpt: "Learn about the surprising ways emoji meanings can change across different cultures and how to navigate these differences..."
    },
    {
      id: 11,
      slug: 'crafting-perfect-emoji-puzzles-guide',
      title: "The Art of Crafting Perfect Emoji Puzzles: A Creator's Guide",
      excerpt: "Learn the secrets to creating engaging and solvable emoji puzzles that will delight your audience..."
    },
    {
      id: 12,
      slug: 'emojis-in-professional-communication',
      title: "Emoji Use in Professional Communication: Dos and Don'ts",
      excerpt: "Navigate the nuances of using emojis in the workplace to enhance communication while maintaining professionalism..."
    },
    {
      id: 13,
      slug: 'animated-emojis-next-level-expression',
      title: "Animated Emojis: The Next Level of Digital Expression",
      excerpt: "Explore how animated emojis are taking digital expression to new heights, adding more emotion and fun..."
    },
    {
      id: 14,
      slug: 'emojis-improve-customer-engagement',
      title: "How Emojis Can Improve Customer Engagement: A Business Perspective",
      excerpt: "Discover strategies for leveraging emojis to boost customer engagement and build stronger brand loyalty..."
    },
    {
      id: 15,
      slug: 'emojis-mental-health-online-well-being',
      title: "The Role of Emojis in Mental Health and Online Well-being",
      excerpt: "Understand the subtle but significant role emojis play in online emotional expression and mental well-being..."
    },
    {
      id: 16,
      slug: 'emoji-storytelling-crafting-narratives',
      title: "Emoji Storytelling: Crafting Narratives with Visual Icons",
      excerpt: "Discover the art of telling compelling stories using only emojis, from simple tales to complex narratives..."
    },
    {
      id: 17,
      slug: 'emojis-in-education-and-learning',
      title: "The Use of Emojis in Education and Learning",
      excerpt: "Explore how emojis are being used in educational settings to engage students and simplify learning..."
    },
    {
      id: 18,
      slug: 'emojis-and-branding-visual-identity',
      title: "Emojis and Branding: Creating a Recognizable Visual Identity",
      excerpt: "Learn how to leverage emojis to build a unique and memorable brand identity that resonates with your audience..."
    },
    {
      id: 19,
      slug: 'accessibility-and-emojis-inclusive-communication',
      title: "Accessibility and Emojis: Ensuring Inclusive Digital Communication",
      excerpt: "Understand the importance of emoji accessibility and how to ensure your digital communications are inclusive for all..."
    },
    {
      id: 20,
      slug: 'emoji-trend-predictions-whats-next',
      title: "Emoji Trend Predictions: What’s Next for Our Favorite Icons?",
      excerpt: "Peek into the future of emojis! Discover upcoming trends, from hyper-personalization to AR integration..."
    },
  ];

  return (
    <>
      <SEO
        title="Our Blog"
        description="Read the latest articles and updates on emoji games, online gaming, and team fun activities."
      />
      <div className="container mx-auto py-12 px-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
        {posts.map(post => (
          <BlogPostCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            link={`/blog/${post.slug}`}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default BlogPage;
