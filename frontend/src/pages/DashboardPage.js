import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError('Error loading tasks');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(newItem)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      setItems([data, ...items]);
      setNewItem({ title: '', description: '' });
      setError('');
    } catch (error) {
      setError(error.message || 'Error creating task');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      setError('Error deleting task');
    }
  };

  const handleEdit = (item) => {
    setEditingItem({
      id: item._id,
      title: item.title,
      description: item.description
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/items/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          title: editingItem.title,
          description: editingItem.description
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedItem = await response.json();
      setItems(items.map(item => 
        item._id === editingItem.id ? updatedItem : item
      ));
      setEditingItem(null);
    } catch (error) {
      setError('Error updating task');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Task Management</h1>
        <p>Welcome back, {user.email}!</p>
      </header>

      <section className="task-form-section">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={newItem.title}
            onChange={e => setNewItem({...newItem, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newItem.description}
            onChange={e => setNewItem({...newItem, description: e.target.value})}
          />
          <button type="submit">Add Task</button>
        </form>
      </section>

      <section className="tasks-section">
        <h2>Your Tasks</h2>
        {error && <p className="error">{error}</p>}

        <div className="tasks-grid">
          {items.map(item => (
            <div key={item._id} className="task-card">
              {editingItem && editingItem.id === item._id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={e => setEditingItem({
                      ...editingItem,
                      title: e.target.value
                    })}
                    required
                  />
                  <textarea
                    value={editingItem.description}
                    onChange={e => setEditingItem({
                      ...editingItem,
                      description: e.target.value
                    })}
                  />
                  <div className="edit-actions">
                    <button type="submit" className="save-button">
                      Save
                    </button>
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="task-actions">
                    <div className="button-group">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
