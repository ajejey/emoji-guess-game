import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router

const BlogPostCard = ({ title, excerpt, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 px-6 pt-6">{title}</h2>
      <p className="text-gray-700 leading-relaxed mb-4 px-6 text-sm">{excerpt}</p>
      <Link to={link} className="mt-auto px-6 pb-6 text-teal-600 hover:text-teal-700 font-medium text-sm">
        Read More
      </Link>
    </div>
  );
};

export default BlogPostCard;
