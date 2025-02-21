import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        {isLoggedIn && (
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
        )}
      </div>
      <div className="nav-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
              Login
            </Link>
            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
