import React, { useState } from 'react';
import './App.css';

// Main Login Manager Component - Staff Login Only
export default function LoginManager({ open, onLogin, onClose }) {
  if (!open) return null;

  return (
    <div className="login-manager-overlay">
      <div className="login-manager-container">
        <div className="login-manager-header">
          <h2>Staff Login</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <StaffLoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}

// Staff Login Form (original staff login with Staff ID)
function StaffLoginForm({ onLogin }) {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try the new authentication endpoint first
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user.username, data.user.role, data.user);
        setId('');
        setUsername('');
        setPassword('');
      } else {
        // Fallback to original method if new endpoint fails
        const res = await fetch('http://localhost:8080/api/staff');
        const staffData = await res.json();
        const found = staffData.find(
          (staff) => staff.id === id && staff.username === username && staff.password === password
        );
        if (found) {
          onLogin(username, found.role);
          setId('');
          setUsername('');
          setPassword('');
        } else {
          setError('Invalid credentials.');
        }
      }
    } catch (error) {
      setError('Unable to connect to staff API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label>Staff ID:</label>
        <input
          type="text"
          placeholder="Staff ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={loading} className="staff-login-btn">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

