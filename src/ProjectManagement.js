import React, { useState, useEffect } from 'react';
import './App.scss';

// ProjectManagement component: Comprehensive CRUD interface for project requests
// This component allows anyone to view, edit, delete, and approve project requests
function ProjectManagement({ loggedInRole, loggedInUser }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleted, setShowDeleted] = useState(true); // Show deleted requests by default
  const [editFormData, setEditFormData] = useState({
    client: '',
    email: '',
    location: '',
    description: '',
    status: ''
  });

  // Fetch all project requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/project-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setError('Failed to fetch project requests');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setEditFormData({
      client: request.client,
      email: request.email,
      location: request.location,
      description: request.description,
      status: request.status || 'Pending'
    });
    setShowEditModal(true);
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/project-requests/${editingRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        // Update the request in the local state immediately
        setRequests(requests.map(req => 
          req.id === editingRequest.id ? { ...req, ...editFormData } : req
        ));
        setShowEditModal(false);
        setEditingRequest(null);
        alert('Project request updated successfully!');
      } else {
        alert('Failed to update project request');
      }
    } catch (err) {
      alert('Error updating project request');
    }
  };

  const handleCreateProject = async (request) => {
    if (window.confirm(`Create a new project for ${request.client}?`)) {
      try {
        // Get project name from user
        const projectName = prompt('Enter project name:', `${request.client} Project`);
        if (!projectName) return;

        // Get budget from user
        const budget = prompt('Enter initial budget (Rs.):', '');
        if (!budget) return;

        const projectData = {
          name: projectName,
          client: request.client,
          location: request.location,
          status: 'In Progress',
          pre_budget: parseFloat(budget),
          curr_budget: parseFloat(budget),
          start_date: new Date().toISOString().split('T')[0]
        };

        const response = await fetch('http://localhost:8080/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });

        if (response.ok) {
          alert('Project created successfully!');
          // Optionally update status to reflect project creation
          const updateResponse = await fetch(`http://localhost:8080/api/project-requests/${request.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...request, status: 'Accepted' })
          });
          
          if (updateResponse.ok) {
            setRequests(requests.map(req => 
              req.id === request.id ? { ...req, status: 'Accepted' } : req
            ));
          }
        } else {
          alert('Failed to create project');
        }
      } catch (err) {
        alert('Error creating project');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project request?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/project-requests/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Update the request in local state to mark as deleted
          setRequests(requests.map(req => 
            req.id === id ? { ...req, deleted: true } : req
          ));
          alert('Project request deleted successfully!');
        } else {
          alert('Failed to delete project request');
        }
      } catch (err) {
        alert('Error deleting project request');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/project-requests/${id}/restore`, {
        method: 'PUT'
      });

      if (response.ok) {
        // Update the request in local state to mark as not deleted
        setRequests(requests.map(req => 
          req.id === id ? { ...req, deleted: false } : req
        ));
        alert('Project request restored successfully!');
      } else {
        alert('Failed to restore project request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error restoring project request');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted':
        return '#27ae60';
      case 'Reject':
        return '#e74c3c';
      case 'Pending':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading project requests...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: '#e74c3c' }}>Error: {error}</h2>
        <button onClick={fetchRequests} className="cta-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#205c20', marginBottom: '1rem' }}>Project Management</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          View and manage project requests from clients. You can edit, delete, or view details.
        </p>
        <button onClick={fetchRequests} className="cta-btn" style={{ marginTop: '1rem' }}>
          Refresh List
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#666' }}>No project requests found</h3>
          <p>No requests have been submitted yet.</p>
        </div>
      ) : (
        <div>
          {/* Filter Toggle */}
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: '500' }}>Show deleted requests</span>
            </label>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              ({requests.filter(r => r.deleted).length} deleted, {requests.filter(r => !r.deleted).length} active)
            </span>
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#205c20', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Client</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Description</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.filter(request => showDeleted || !request.deleted).map((request, index) => (
                <tr key={request.id} className={request.deleted ? 'deleted-request' : ''} style={{ 
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <td style={{ 
                    padding: '1rem',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }}>{request.id}</td>
                  <td style={{ 
                    padding: '1rem', 
                    fontWeight: '500',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }}>{request.client}</td>
                  <td style={{ 
                    padding: '1rem',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }}>{request.email}</td>
                  <td style={{ 
                    padding: '1rem',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }}>{request.location}</td>
                  <td style={{ 
                    padding: '1rem', 
                    maxWidth: '300px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }} title={request.description}>{request.description}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      backgroundColor: request.deleted ? '#95a5a6' : getStatusColor(request.status || 'Pending'),
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {request.deleted ? 'Deleted' : (request.status || 'Pending')}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '1rem',
                    textDecoration: request.deleted ? 'line-through' : 'none'
                  }}>{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {request.deleted ? (
                      <>
                        <button
                          onClick={() => handleEdit(request)}
                          className="action-btn edit-btn"
                          style={{ marginRight: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestore(request.id)}
                          className="restore-btn"
                        >
                          Restore
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(request)}
                          className="action-btn edit-btn"
                          style={{ marginRight: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        {(request.status === 'Accepted') && (
                          <button
                            onClick={() => handleCreateProject(request)}
                            className="action-btn approve-btn"
                            style={{ marginRight: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                          >
                            Create Project
                          </button>
                        )}
                        {(request.status === 'Reject' || request.status === 'Rejected') && (
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="action-btn delete-btn"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRequest && (
        <EditRequestModal
          request={editingRequest}
          formData={editFormData}
          setFormData={setEditFormData}
          onClose={() => {
            setShowEditModal(false);
            setEditingRequest(null);
          }}
          onSave={handleUpdateRequest}
        />
      )}
    </div>
  );
}

// EditRequestModal component: Modal for editing project requests
function EditRequestModal({ request, formData, setFormData, onClose, onSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Project Request</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={onSave} className="modal-form">
          <div className="form-group">
            <label>Client Name:</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectManagement;
