import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

// Define post details here for SEO. In a real app, this might come from an API or a shared module.
const blogPostSeoDetails = {
  '1': { title: "The Ultimate Guide to Emoji Guess Games", description: "Become an emoji guessing champion! Learn how to play, create puzzles, and have fun." },
  '2': { title: "Top Online Games to Play with Friends", description: "Discover a curated list of top online games perfect for playing with friends, from social deduction to cooperative adventures." },
  '3': { title: "Fun Team Building Games for Remote Teams", description: "Boost morale and cohesion with virtual escape rooms, online trivia, and other fun games for remote teams." },
  '4': { title: "How to Host a Virtual Game Night", description: "Learn how to choose games, set up communication, and host an engaging virtual game night for friends and family." },
  '5': { title: "The Surprising Benefits of Playing Online Games", description: "Explore the cognitive, social, and emotional benefits of online gaming, from problem-solving to stress relief." }
};

const loadBlogPost = (postId) => {
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
  // Fallback for unknown post ID, or you can redirect to a 404 page
  return () => <div>Post not found</div>;
};

const BlogPostPage = () => {
  const { postId } = useParams();
  const [postSeo, setPostSeo] = useState({ title: 'Blog Post', description: 'Read our latest blog post.' });
  const PostComponent = loadBlogPost(postId);

  useEffect(() => {
    if (blogPostSeoDetails[postId]) {
      setPostSeo(blogPostSeoDetails[postId]);
    }
  }, [postId]);

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
