import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [adding, setAdding] = useState(false);

  // Fetch health status
  const fetchHealthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      setHealthStatus(response.data);
    } catch (err) {
      setHealthStatus({ status: 'unhealthy', error: err.message });
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setError('Name and email are required');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '' });
    } catch (err) {
      setError('Failed to add user: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>Automation Web UI</h1>
        <p>API Management Dashboard</p>
      </div>

      <div className="container">
        {/* Health Status */}
        <div className="card">
          <h2>API Health Status</h2>
          {healthStatus && (
            <div>
              <span 
                className={`status-indicator ${
                  healthStatus.status === 'healthy' ? 'status-healthy' : 'status-unhealthy'
                }`}
              ></span>
              Status: {healthStatus.status}
              {healthStatus.uptime && (
                <p>Uptime: {Math.floor(healthStatus.uptime)} seconds</p>
              )}
              {healthStatus.timestamp && (
                <p>Last checked: {new Date(healthStatus.timestamp).toLocaleString()}</p>
              )}
            </div>
          )}
          <button className="button" onClick={fetchHealthStatus}>
            Refresh Status
          </button>
        </div>

        {/* Add User Form */}
        <div className="card">
          <h2>Add New User</h2>
          <form onSubmit={addUser}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                disabled={adding}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                disabled={adding}
              />
            </div>
            <button type="submit" className="button" disabled={adding}>
              {adding ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="card">
          <h2>Users</h2>
          <button className="button" onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
          
          {error && <div className="error">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                users.map(user => (
                  <div key={user.id} className="user-item">
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>ID: {user.id}</p>
                    {user.createdAt && (
                      <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
