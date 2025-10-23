const API_BASE = '/api';

const fetchWithRetry = async (url, options = {}, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying API call to ${url}, ${retries} attempts left`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export const postAPI = {
    getPosts: async (query = '') => {
        // FIX: %{query} → ${query} and use fetchWithRetry
        return fetchWithRetry(`${API_BASE}/posts${query}`);
    },

    getPost: async (id) => {
        // FIX: Add return statement
        return fetchWithRetry(`${API_BASE}/posts/${id}`);
    }
};

export const categoryAPI = {
    getCategories: async () => {
        return fetchWithRetry(`${API_BASE}/categories`);
    }
};