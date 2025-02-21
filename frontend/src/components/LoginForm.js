import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      alert('Login successful');
      localStorage.setItem('token', response.data.token);
    } catch (err) {
      if (err.response) {
        alert(`Login failed: ${err.response.data.error || 'Invalid credentials'}`);
      } else {
        alert('Network error. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
}

export default LoginForm;
