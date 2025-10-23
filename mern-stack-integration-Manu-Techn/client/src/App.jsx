import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import PostList from './Pages/PostList';
import PostDetail from './Pages/PostDetail';
import PostForm from './Pages/PostForm';

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testServerConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        setServerMessage(data.message);
        setError('');
      } catch (err) {
        setError(`Failed to connect to server: ${err.message}`);
        setServerMessage('');
      } finally {
        setLoading(false);
      }
    };

    testServerConnection();
  }, []);


  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Hello, MERN!</h1>
      <p>Your frontend is running successfully!</p>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        <h3>Server Connection Test</h3>
        {loading && <p>Testing Connection to Server...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {serverMessage && <p style={{ color: 'green' }}>Server says: {serverMessage}</p>}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Title</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>Have a catchy title that draws attention!</li>
          <li>Keep it concise and relevant to your content.</li>
          <li>Use keywords that resonate with your audience.</li>
          <li>Make it unique to stand out from the crowd.</li>
        </ul>
      </div>
    </div>
      }
      />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/create-post" element={<PostForm />} />
      <Route path="/edit/:id" element={<PostForm />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
