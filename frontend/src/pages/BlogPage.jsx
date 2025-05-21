import React from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { Link } from 'react-router-dom'; // Assuming you use React Router
import SEO from '../components/SEO';

const BlogPage = () => {
  const posts = [
    { id: 1, title: 'Blog Post 1 Title', excerpt: 'A short summary of blog post 1...' },
    { id: 2, title: 'Blog Post 2 Title', excerpt: 'A short summary of blog post 2...' },
    { id: 3, title: 'Blog Post 3 Title', excerpt: 'A short summary of blog post 3...' },
    { id: 4, title: 'Blog Post 4 Title', excerpt: 'A short summary of blog post 4...' },
    { id: 5, title: 'Blog Post 5 Title', excerpt: 'A short summary of blog post 5...' },
  ];

  return (
    <div>
      <SEO
        title="Our Blog"
        description="Read the latest articles and updates on emoji games, online gaming, and team fun activities."
      />
      <div className="container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );
};

export default BlogPage;
