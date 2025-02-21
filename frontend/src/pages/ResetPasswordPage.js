import React, { useState } from 'react';

function RequestResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetToken(data.resetToken); // 接收 Token（仅调试用）
        setMessage('Reset token generated successfully!'); // 展示成功消息
      } else {
        setMessage(data.error); // 显示错误消息
      }
    } catch (err) {
      setMessage('Failed to send reset request');
    }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleRequestReset}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Request Reset</button>
      </form>
      {message && <p>{message}</p>}
      {resetToken && <p>Your Reset Token (debug only): {resetToken}</p>}
    </div>
  );
}

export default RequestResetPassword;
