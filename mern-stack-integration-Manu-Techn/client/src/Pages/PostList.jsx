import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/Api';

export default function PostList() {
  // State management
  const [posts, setPosts] = useState([]); // Store fetched posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error message
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pagination, setPagination] = useState({}); // Pagination data
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering posts

  // Fetch posts when currentPage or searchTerm changes
  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]); // Added searchTerm to dependencies

  // Fetch posts from the API
  const fetchPosts = async (page, search) => {
    try {
      setLoading(true); // Set loading state
      // Construct query parameters for pagination and search
      const query = `?page=${page}&limit=5${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const result = await postService.searchPosts(searchTerm); // Fetch posts
      
      if (result.success) {
        setPosts(result.data); // Set posts state
      } else {
        setError(result.message || 'Failed to fetch posts'); // Handle API error
      }
    } catch (err) {
      setError(`Error fetching posts: ${err.message}`); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    setCurrentPage(1); // Reset to first page
    fetchPosts(1, searchTerm); // Fetch posts with search term
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    const originalPosts = [...posts]; // Keep a copy of original posts
    
    // Optimistic update: remove post from UI
    setPosts(posts.filter(post => post._id !== postId));
    
    try {
      const response = await fetch(`/api/posts/${postId}`, { 
        method: 'DELETE' // Send DELETE request
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post'); // Throw error if response is not ok
      }
    } catch (error) {
      // Revert to original posts if deletion fails
      setPosts(originalPosts);
      setError('Failed to delete post: ' + error.message); // Set error message
    }
  };

  // Loading and error handling
  if (loading) return <div>Loading posts...</div>; // Show loading message
  if (error) return <div>Error: {error}</div>; // Show error message

  // Render posts
  return (
    <div>
      <h1>Blog Posts ({pagination.total || 0})</h1>
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <button type="submit">Search</button>
        {searchTerm && (
          <button 
            type="button" 
            onClick={() => { 
              setSearchTerm(''); // Clear search term
              fetchPosts(1, ''); // Fetch posts without search term
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Render posts or message if no posts found */}
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <Link to={`/posts/${post._id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>By {post.author}</p>
            <p>Category: {post.category?.name}</p>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div>
        {pagination.total > 0 && (
          <div>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span> Page {currentPage} of {Math.ceil(pagination.total / 5)} </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(pagination.total / 5)))} 
              disabled={currentPage === Math.ceil(pagination.total / 5)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}