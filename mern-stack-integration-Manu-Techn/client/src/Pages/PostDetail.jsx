import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/Api';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const result = await postService.getPost(id);
        if (result.success) {
          setPost(result.data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Error loading post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By {post.author}</p>
      <p>Category: {post.category?.name}</p>
      <div>{post.content}</div>
    </div>
  );
}