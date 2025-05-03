/**
 * API Service for making HTTP requests to the backend
 */

// Get the API base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Fetch categories from the backend
 * @returns {Promise<string[]>} Array of category names
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories as fallback
    return [
      'Food',
      'Media',
      'Nature',
      'Actions',
      'Entertainment',
      'Technology',
      'Sports'
    ];
  }
};
