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
    console.log('Attempting login with:', { email });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || 'Login failed');
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      // 保存完整的 token，包括 Bearer 前缀
      if (data.token) {
        localStorage.setItem('token', `Bearer ${data.token}`);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setMessage('Login successful!');
      
      // 延迟一下再跳转，让用户看到成功消息
      setTimeout(() => {
        navigate('/dashboard');  // 跳转到仪表板页面
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'Network error. Please try again later.');
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
