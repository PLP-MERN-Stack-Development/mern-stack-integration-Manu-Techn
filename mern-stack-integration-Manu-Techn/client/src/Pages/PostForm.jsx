import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * PostForm Component - Handles creation of new blog posts
 * @returns {JSX.Element} Form component for creating posts
 */
export default function PostForm() {
  // Auth0 hooks
  const { user, isAuthenticated } = useAuth0();
  
  // Navigation hook
  const navigate = useNavigate();

  // State Management
  const [formData, setFormData] = useState({
    title: '', 
    content: '',
    author: user?.name || '',
    category: '68f9ec17c031ff5536cf7e7b' // TODO: Replace with dynamic category selection
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-')
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <div>Please log in to create a post.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Title *"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          disabled={loading}
          className="form-control"
        />
        {validationErrors.title && (
          <div className="validation-error">
            {validationErrors.title}
          </div>
        )}
      </div>

      <div className="form-group">
        <textarea
          placeholder="Content *"
          value={formData.content}
          onChange={e => setFormData({...formData, content: e.target.value})}
          disabled={loading}
          className="form-control"
        />
        {validationErrors.content && (
          <div className="validation-error">
            {validationErrors.content}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}