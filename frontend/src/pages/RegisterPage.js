import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import API_URL from '../config/api';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting registration...');
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password 
        })
      });

      console.log('Response received:', response);
      
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Server response was not valid JSON');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Registration successful:', data);
      setMessage('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
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
        <button type="submit">Register</button>
        {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
