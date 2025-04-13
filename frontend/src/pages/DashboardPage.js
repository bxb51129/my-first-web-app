import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '' });
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleSave = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const TaskCard = ({ task }) => {
    const [editForm, setEditForm] = useState({
      title: task.title,
      description: task.description
    });

    if (editingTask && editingTask.id === task.id) {
      return (
        <div className="task-card">
          <div className="edit-form">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              placeholder="Task Title"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              placeholder="Task Description"
            />
            <div className="edit-actions">
              <button 
                className="save-button"
                onClick={() => handleSave(task.id, editForm)}
              >
                Save
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="task-card">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-actions">
          <button 
            className="edit-button"
            onClick={() => handleEdit(task)}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={() => handleDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
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
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
