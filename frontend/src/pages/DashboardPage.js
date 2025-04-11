import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 创建新任务
    const task = {
      id: Date.now(), // 临时ID
      title: newTask.title,
      description: newTask.description
    };
    
    // 添加到任务列表
    setTasks([...tasks, task]);
    
    // 清空表单
    setNewTask({ title: '', description: '' });
    
    console.log('Task added:', task);
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    console.log('Task deleted:', taskId);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {userEmail}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="task-form-section">
        <h2>Add New Task</h2>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="tasks-section">
        <h2>Your Tasks</h2>
        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <p>No tasks yet. Add your first task above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-actions">
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
