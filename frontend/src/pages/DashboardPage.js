import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import './DashboardPage.css';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/items`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const title = e.target.title.value;
      const description = e.target.description.value;

      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ title, description })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      e.target.reset();
    } catch (error) {
      console.error('Add task error:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Your Tasks</h1>
      
      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          required
        />
        <textarea
          name="description"
          placeholder="Task description"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first task!</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-status">
                Status: {task.completed ? 'Completed' : 'Pending'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
