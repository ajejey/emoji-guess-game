import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

// Map slugs to post IDs
const slugToPostId = {
  'the-ultimate-guide-to-emoji-guess-games': '1',
  'top-online-games-to-play-with-friends': '2',
  'fun-team-building-games-for-remote-teams': '3',
  'how-to-host-a-virtual-game-night': '4',
  'the-surprising-benefits-of-playing-online-games': '5',
  'emojis-in-marketing-connecting-with-your-audience-visually': '6',
  'the-psychology-of-emojis-why-we-love-these-little-icons': '7',
  'emoji-challenges-test-your-skills-with-these-brain-teasers': '8',
  'the-evolution-of-emoji-from-simple-smileys-to-diverse-icons': '9',
  'emojis-across-cultures-meanings-that-get-lost-in-translation': '10',
  'crafting-perfect-emoji-puzzles-guide': '11',
  'emojis-in-professional-communication': '12',
  'animated-emojis-next-level-expression': '13',
  'emojis-improve-customer-engagement': '14',
  'emojis-mental-health-online-well-being': '15',
  'emoji-storytelling-crafting-narratives': '16',
  'emojis-in-education-and-learning': '17',
  'emojis-and-branding-visual-identity': '18',
  'accessibility-and-emojis-inclusive-communication': '19',
  'emoji-trend-predictions-whats-next': '20'
};

// Define post details here for SEO using slugs as keys.
const blogPostSeoDetails = {
  'the-ultimate-guide-to-emoji-guess-games': { title: "The Ultimate Guide to Emoji Guess Games", description: "Become an emoji guessing champion! Learn how to play, create puzzles, and have fun." },
  'top-online-games-to-play-with-friends': { title: "Top Online Games to Play with Friends", description: "Discover a curated list of top online games perfect for playing with friends, from social deduction to cooperative adventures." },
  'fun-team-building-games-for-remote-teams': { title: "Fun Team Building Games for Remote Teams", description: "Boost morale and cohesion with virtual escape rooms, online trivia, and other fun games for remote teams." },
  'how-to-host-a-virtual-game-night': { title: "How to Host a Virtual Game Night", description: "Learn how to choose games, set up communication, and host an engaging virtual game night for friends and family." },
  'the-surprising-benefits-of-playing-online-games': { title: "The Surprising Benefits of Playing Online Games", description: "Explore the cognitive, social, and emotional benefits of online gaming, from problem-solving to stress relief." },
  'emojis-in-marketing-connecting-with-your-audience-visually': { title: "Emojis in Marketing: Connecting with Your Audience Visually", description: "Learn how brands use emojis for impactful marketing and deeper audience connection." },
  'the-psychology-of-emojis-why-we-love-these-little-icons': { title: "The Psychology of Emojis: Why We Love These Little Icons", description: "Explore the psychological reasons behind our fascination with emojis and their role in communication." },
  'emoji-challenges-test-your-skills-with-these-brain-teasers': { title: "Emoji Challenges: Test Your Skills with These Brain Teasers", description: "Challenge yourself with a variety of fun emoji puzzles and see if you can guess them all!" },
  'the-evolution-of-emoji-from-simple-smileys-to-diverse-icons': { title: "The Evolution of Emoji: From Simple Smileys to Diverse Icons", description: "Trace the history of emojis from basic emoticons to the rich and diverse set we use globally." },
  'emojis-across-cultures-meanings-that-get-lost-in-translation': { title: "Emojis Across Cultures: Meanings That Get Lost in Translation", description: "Discover how emoji interpretations can vary across cultures and tips for global communication." },
  'crafting-perfect-emoji-puzzles-guide': { title: "The Art of Crafting Perfect Emoji Puzzles: A Creator's Guide", description: "Become a master puzzle creator with this guide to crafting fun and engaging emoji challenges." },
  'emojis-in-professional-communication': { title: "Emoji Use in Professional Communication: Dos and Don'ts", description: "Learn the dos and don'ts of using emojis effectively in your professional communications." },
  'animated-emojis-next-level-expression': { title: "Animated Emojis: The Next Level of Digital Expression", description: "Dive into the world of animated emojis and see how they're changing digital expression." },
  'emojis-improve-customer-engagement': { title: "How Emojis Can Improve Customer Engagement: A Business Perspective", description: "Discover how businesses can strategically use emojis to boost customer engagement and loyalty." },
  'emojis-mental-health-online-well-being': { title: "The Role of Emojis in Mental Health and Online Well-being", description: "Explore the connection between emoji use, emotional expression, and mental well-being online." },
  'emoji-storytelling-crafting-narratives': { title: "Emoji Storytelling: Crafting Narratives with Visual Icons", description: "Master the art of emoji storytelling and craft compelling visual narratives." },
  'emojis-in-education-and-learning': { title: "The Use of Emojis in Education and Learning", description: "Learn how educators are using emojis to make learning more engaging and fun." },
  'emojis-and-branding-visual-identity': { title: "Emojis and Branding: Creating a Recognizable Visual Identity", description: "Build a strong brand identity with strategic and consistent emoji use." },
  'accessibility-and-emojis-inclusive-communication': { title: "Accessibility and Emojis: Ensuring Inclusive Digital Communication", description: "Ensure your emoji use is accessible and inclusive for all users." },
  'emoji-trend-predictions-whats-next': { title: "Emoji Trend Predictions: What’s Next for Our Favorite Icons?", description: "Explore the future of emojis: What new trends and icons can we expect?" }
};

const loadBlogPost = (slug) => {
  const postId = slugToPostId[slug];
  // Important: The path for lazy import needs to be exact like this for Vite/Webpack to handle it.
  // You might need to adjust if your post components have different naming or path structure.
  // This approach assumes BlogPost1.jsx, BlogPost2.jsx etc.
  if (postId === '1') {
    return lazy(() => import('../blog_posts/BlogPost1'));
  }
  if (postId === '2') {
    return lazy(() => import('../blog_posts/BlogPost2'));
  }
  if (postId === '3') {
    return lazy(() => import('../blog_posts/BlogPost3'));
  }
  if (postId === '4') {
    return lazy(() => import('../blog_posts/BlogPost4'));
  }
  if (postId === '5') {
    return lazy(() => import('../blog_posts/BlogPost5'));
  }
  if (postId === '6') {
    return lazy(() => import('../blog_posts/BlogPost6'));
  }
  if (postId === '7') {
    return lazy(() => import('../blog_posts/BlogPost7'));
  }
  if (postId === '8') {
    return lazy(() => import('../blog_posts/BlogPost8'));
  }
  if (postId === '9') {
    return lazy(() => import('../blog_posts/BlogPost9'));
  }
  if (postId === '10') {
    return lazy(() => import('../blog_posts/BlogPost10'));
  }
  if (postId === '11') {
    return lazy(() => import('../blog_posts/BlogPost11'));
  }
  if (postId === '12') {
    return lazy(() => import('../blog_posts/BlogPost12'));
  }
  if (postId === '13') {
    return lazy(() => import('../blog_posts/BlogPost13'));
  }
  if (postId === '14') {
    return lazy(() => import('../blog_posts/BlogPost14'));
  }
  if (postId === '15') {
    return lazy(() => import('../blog_posts/BlogPost15'));
  }
  if (postId === '16') {
    return lazy(() => import('../blog_posts/BlogPost16'));
  }
  if (postId === '17') {
    return lazy(() => import('../blog_posts/BlogPost17'));
  }
  if (postId === '18') {
    return lazy(() => import('../blog_posts/BlogPost18'));
  }
  if (postId === '19') {
    return lazy(() => import('../blog_posts/BlogPost19'));
  }
  if (postId === '20') {
    return lazy(() => import('../blog_posts/BlogPost20'));
  }
  // Fallback for unknown post ID/slug, or you can redirect to a 404 page
  return () => <div>Post not found</div>;
};

const BlogPostPage = () => {
  const { slug } = useParams(); // Changed from postId to slug
  const [postSeo, setPostSeo] = useState({ title: 'Blog Post', description: 'Read our latest blog post.' });
  const PostComponent = loadBlogPost(slug); // Changed from postId to slug

  useEffect(() => {
    if (blogPostSeoDetails[slug]) { // Changed from postId to slug
      setPostSeo(blogPostSeoDetails[slug]); // Changed from postId to slug
    } else {
      // Optional: Handle case where slug might not be in blogPostSeoDetails
      setPostSeo({ title: 'Blog Post Not Found', description: 'This blog post could not be found.' });
    }
  }, [slug]); // Changed from postId to slug

  return (
    <>
      <SEO title={postSeo.title} description={postSeo.description} />
      <div className="container mx-auto py-12 px-6 bg-white min-h-screen">
        <article className="mx-auto max-w-4xl">
          <Suspense fallback={<div>Loading post...</div>}>
            <PostComponent />
          </Suspense>
        </article>
      </div>
    </>
  );
};

export default BlogPostPage;
