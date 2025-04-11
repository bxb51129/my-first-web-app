import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: localStorage.getItem('userEmail') || ''
  });

  const [stats, setStats] = useState({
    totalItems: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    // 这里可以添加获取用户数据和统计信息的逻辑
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome Back! 👋</h1>
          <p>{userData.email}</p>
        </div>
        <div className="dashboard-actions">
          <button className="action-button primary-button">Settings</button>
          <button className="action-button secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-content">
            <p>No recent activity</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <button className="action-button primary-button">Add New Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
