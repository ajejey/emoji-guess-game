import React from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { Link } from 'react-router-dom'; // Assuming you use React Router
import SEO from '../components/SEO';

const BlogPage = () => {
  const posts = [
    { id: 1, title: 'The Ultimate Guide to Emoji Guess Games', excerpt: 'Emoji guess games are a fantastically fun and versatile way to engage with friends, family, colleagues, or even as a solo brain-teaser....' },
    { id: 2, title: 'Top Online Games to Play with Friends', excerpt: 'Online games offer a unique way to bond, collaborate, compete, and create lasting memories with friends, whether separated by distance or just busy schedules...' },
    { id: 3, title: 'Fun Team Building Games for Remote Teams', excerpt: 'Fun team building games for remote teams are a fantastic way to bond, collaborate, and create lasting memories with friends, whether separated by distance or just busy schedules...' },
    { id: 4, title: 'How to Host a Virtual Game Night', excerpt: 'In a world where digital connection often takes center stage, virtual game nights have emerged as a shining beacon of shared joy, laughter, and genuine camaraderie.' },
    { id: 5, title: 'The Surprising Benefits of Playing Online Games', excerpt: 'For decades, video games, particularly online games, have often been painted with a broad, and sometimes unflattering, brush...' },
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
            link={`/blog/${post.id}`}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default BlogPage;
