import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import API_URL from '../config/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ email, password })
      });

      console.log('Login response:', response);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful:', data);

      // 保存 token
      localStorage.setItem('token', `Bearer ${data.token}`);
      
      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Enter your password"
            />
          </label>
        </div>
        <button type="submit">Login</button>
        {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
        <div className="auth-links">
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <Link to="/register" className="register-link">Need an account? Register</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
