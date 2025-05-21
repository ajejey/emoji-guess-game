import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router

const BlogPostCard = ({ title, excerpt, link }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white flex flex-col">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4 leading-relaxed">{excerpt}</p>
      <Link to={link} className="text-blue-500 hover:underline">
        Read More
      </Link>
    </div>
  );
};

export default BlogPostCard;
