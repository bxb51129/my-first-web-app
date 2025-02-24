import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    try {
      console.log('Checking email:', email);
      console.log('API URL:', `${API_URL}/auth/check-email`);
      
      const response = await fetch(`${API_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Email not found');
      }

      setShowPasswordReset(true);
      setMessage('');
    } catch (error) {
      console.error('Check email error:', error);
      setMessage(error.message || 'Email not found');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting password reset for:', email);
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();
      console.log('Reset password response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setMessage('Password reset successful! Please login with your new password.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage(error.message || 'Failed to reset password');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={showPasswordReset ? handleResetPassword : handleCheckEmail}>
        <h2>Reset Password</h2>
        {!showPasswordReset ? (
          <>
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
            <button type="submit">Check Email</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <p className="email-confirmed">Email confirmed: {email}</p>
              <label>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  placeholder="At least 6 characters"
                />
              </label>
            </div>
            <button type="submit">Reset Password</button>
          </>
        )}
        {message && (
          <p className={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </p>
        )}
        <div className="auth-links">
          <Link to="/login" className="back-to-login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage; 