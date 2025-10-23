import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <nav style={{
      backgroundColor: 'black',
      padding: '1rem',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
      <Link to="/create-post" style={{ color: 'white' }}>New Post</Link>

      {/* Authentication Buttons */}
      {isAuthenticated ? (
        <div>
          <span>Hello, {user?.name}</span>
          <button onClick={() => logout()}>Log Out</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </nav>
  );
}
