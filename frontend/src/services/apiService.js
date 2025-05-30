/**
 * API Service for making HTTP requests to the backend
 */

// Get the API base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Fetch categories from the backend
 * @returns {Promise<Array<{name: string, count: number}>>} Array of category objects with name and count
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
      { name: 'Entertainment', count: 2 },
      { name: 'Technology', count: 2 },
      { name: 'Animals', count: 2 },
      { name: 'Hindi movie', count: 5 },
      { name: 'Hollywood movie', count: 28 },
      { name: 'TV Shows', count: 27 },
      { name: 'Music', count: 28 }
    ];
  }
};
