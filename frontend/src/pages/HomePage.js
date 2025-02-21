import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Task Manager</h1>
        <p>Please see my 631/1 assignment</p>
        <div className="auth-buttons">
          <Link to="/login" className="auth-button login">
            Login
          </Link>
          <Link to="/register" className="auth-button register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
