import React, { useState, useEffect } from 'react';
import './App.css';

// DailyLogs component - A comprehensive daily log management page
function DailyLogs({ loggedInRole, loggedInUser }) {
  // State management
  const [dailyLogs, setDailyLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLog, setViewingLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  
  // Form states
  const [createForm, setCreateForm] = useState({
    projectId: '',
    logDate: new Date().toISOString().split('T')[0],
    materialsUsed: '',
    laborHours: '',
    machineryHours: '',
    comments: '',
    createdBy: loggedInUser || 'admin' // Use logged in user or fallback to admin
  });

  const [editForm, setEditForm] = useState({
    projectId: '',
    logDate: '',
    materialsUsed: '',
    laborHours: '',
    machineryHours: '',
    comments: '',
    createdBy: ''
  });

  // Filter states
  const [filters, setFilters] = useState({
    projectId: '',
    dateFrom: '',
    dateTo: '',
    createdBy: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadProjects();
    loadDailyLogs();
  }, []);

  // Update createForm when loggedInUser changes
  useEffect(() => {
    if (loggedInUser) {
      setCreateForm(prev => ({
        ...prev,
        createdBy: loggedInUser
      }));
    }
  }, [loggedInUser]);

  // Load projects from backend
  const loadProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    }
  };

  // Load daily logs from backend
  const loadDailyLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/daily-logs');
      const data = await response.json();
      setDailyLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading daily logs:', error);
      setError('Failed to load daily logs');
    } finally {
      setLoading(false);
    }
  };

  // Create new daily log
  const createLog = async () => {
    if (!createForm.projectId || !createForm.logDate) {
      setError('Please select a project and date');
      return;
    }

    // Check if the selected date is in the future
    const today = new Date().toISOString().split('T')[0];
    if (createForm.logDate > today) {
      setError('Cannot create daily logs for future dates. Please select today or a past date.');
      return;
    }

    // Check if a log already exists for this project and date
    const existingLog = dailyLogs.find(log => 
      log.project.id === parseInt(createForm.projectId) && 
      log.logDate === createForm.logDate
    );

    if (existingLog) {
      setError('A daily log already exists for this project and date. Please select a different date or edit the existing log.');
      setShowCreateModal(false);
      setCreateForm({
        projectId: '',
        logDate: new Date().toISOString().split('T')[0],
        materialsUsed: '',
        laborHours: '',
        machineryHours: '',
        comments: '',
        createdBy: loggedInUser || 'admin'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: parseInt(createForm.projectId),
          log_date: createForm.logDate,
          materials_used: createForm.materialsUsed,
          labor_hours: parseFloat(createForm.laborHours) || 0,
          machinery_hours: parseFloat(createForm.machineryHours) || 0,
          comments: createForm.comments,
          created_by: createForm.createdBy
        }),
      });

      if (response.ok) {
        setSuccess('Daily log created successfully!');
        setShowCreateModal(false);
        setCreateForm({
          projectId: '',
          logDate: new Date().toISOString().split('T')[0],
          materialsUsed: '',
          laborHours: '',
          machineryHours: '',
          comments: '',
          createdBy: loggedInUser || 'admin'
        });
        loadDailyLogs(); // Reload logs
      } else {
        const errorData = await response.json();
        // Check if it's a duplicate error from backend
        if (errorData.message && errorData.message.includes('already exists')) {
          setError('A daily log already exists for this project and date. Please select a different date or edit the existing log.');
          setShowCreateModal(false);
          setCreateForm({
            projectId: '',
            logDate: new Date().toISOString().split('T')[0],
            materialsUsed: '',
            laborHours: '',
            machineryHours: '',
            comments: '',
            createdBy: loggedInUser || 'admin'
          });
        } else {
          setError(errorData.message || 'Failed to create daily log');
        }
      }
    } catch (error) {
      console.error('Error creating daily log:', error);
      setError('Failed to create daily log');
    } finally {
      setLoading(false);
    }
  };

  // Update daily log
  const updateLog = async () => {
    if (!editingLog) return;

    // Check if the selected date is in the future
    const today = new Date().toISOString().split('T')[0];
    if (editForm.logDate > today) {
      setError('Cannot update daily logs to future dates. Please select today or a past date.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/daily-logs/${editingLog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'admin', // You might want to get this from logged in user
        },
        body: JSON.stringify({
          project_id: parseInt(editForm.projectId),
          log_date: editForm.logDate,
          materials_used: editForm.materialsUsed,
          labor_hours: parseFloat(editForm.laborHours) || 0,
          machinery_hours: parseFloat(editForm.machineryHours) || 0,
          comments: editForm.comments,
          created_by: editForm.createdBy
        }),
      });

      if (response.ok) {
        setSuccess('Daily log updated successfully!');
        setShowEditModal(false);
        setEditingLog(null);
        loadDailyLogs(); // Reload logs
      } else {
        setError('Failed to update daily log');
      }
    } catch (error) {
      console.error('Error updating daily log:', error);
      setError('Failed to update daily log');
    } finally {
      setLoading(false);
    }
  };

  // Delete daily log
  const deleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this daily log?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/daily-logs/${logId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Daily log deleted successfully!');
        loadDailyLogs();
      } else {
        setError('Failed to delete daily log');
      }
    } catch (error) {
      console.error('Error deleting daily log:', error);
      setError('Failed to delete daily log');
    }
  };

  // View log details
  const viewLog = (log) => {
    setViewingLog(log);
    setShowViewModal(true);
  };

  // Edit log
  const editLog = (log) => {
    setEditingLog(log);
    setEditForm({
      projectId: log.project.id.toString(),
      logDate: log.logDate,
      materialsUsed: log.materialsUsed || '',
      laborHours: log.laborHours?.toString() || '',
      machineryHours: log.machineryHours?.toString() || '',
      comments: log.comments || '',
      createdBy: log.createdBy || ''
    });
    setShowEditModal(true);
  };

  // Filter logs based on current filters
  const filteredLogs = dailyLogs.filter(log => {
    const projectMatch = !filters.projectId || log.project.id === parseInt(filters.projectId);
    const dateFromMatch = !filters.dateFrom || new Date(log.logDate) >= new Date(filters.dateFrom);
    const dateToMatch = !filters.dateTo || new Date(log.logDate) <= new Date(filters.dateTo);
    const createdByMatch = !filters.createdBy || (log.createdBy && log.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()));
    
    return projectMatch && dateFromMatch && dateToMatch && createdByMatch;
  });

  // Get project name from log data
  const getLogProjectName = (log) => {
    return log.project?.name || 'Unknown Project';
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#205c20', 
          marginBottom: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Daily Logs
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          marginBottom: '1rem'
        }}>
          Track daily construction activities and progress
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
          <button 
            onClick={clearMessages}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#721c24',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #c3e6cb'
        }}>
          {success}
          <button 
            onClick={clearMessages}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#155724',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Only show Create New Log button for Document Control Manager and Admin */}
        {loggedInRole !== "Site Manager" && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#229954'}
            onMouseOut={(e) => e.target.style.background = '#27ae60'}
          >
            Create New Log
          </button>
        )}
        
        <button
          onClick={loadDailyLogs}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#2980b9'}
          onMouseOut={(e) => e.target.style.background = '#3498db'}
        >
          Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#205c20' }}>Filters</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Project:
            </label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Date From:
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Date To:
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Created By:
            </label>
            <input
              type="text"
              placeholder="Search by creator..."
              value={filters.createdBy}
              onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          background: '#205c20',
          color: 'white',
          padding: '1rem',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>
          Daily Logs ({filteredLogs.length})
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', color: '#666' }}>Loading logs...</div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', color: '#666' }}>
              No daily logs found matching your criteria.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Project
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Date
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Materials
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Labor Hours
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Machinery Hours
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Created By
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>
                      {getLogProjectName(log)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(log.logDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '200px' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {log.materialsUsed || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {log.laborHours ? `${log.laborHours}h` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {log.machineryHours ? `${log.machineryHours}h` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {log.createdBy || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => viewLog(log)}
                          style={{
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          View
                        </button>
                        
                        <button
                          onClick={() => editLog(log)}
                          style={{
                            background: '#f39c12',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Edit
                        </button>
                        
                        <button
                          onClick={() => deleteLog(log.id)}
                          style={{
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Log Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#205c20' }}>
              Create Daily Log
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Project: *
              </label>
              <select
                value={createForm.projectId}
                onChange={(e) => setCreateForm({ ...createForm, projectId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Date: *
              </label>
              <input
                type="date"
                value={createForm.logDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCreateForm({ ...createForm, logDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Materials Used:
              </label>
              <input
                type="text"
                value={createForm.materialsUsed}
                onChange={(e) => setCreateForm({ ...createForm, materialsUsed: e.target.value })}
                placeholder="e.g., Concrete, Steel bars, Cement"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Labor Hours:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={createForm.laborHours}
                  onChange={(e) => setCreateForm({ ...createForm, laborHours: e.target.value })}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Machinery Hours:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={createForm.machineryHours}
                  onChange={(e) => setCreateForm({ ...createForm, machineryHours: e.target.value })}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Comments:
              </label>
              <textarea
                value={createForm.comments}
                onChange={(e) => setCreateForm({ ...createForm, comments: e.target.value })}
                placeholder="Describe the work done..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createLog}
                disabled={loading}
                style={{
                  background: loading ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Log Modal */}
      {showEditModal && editingLog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#205c20' }}>
              Edit Daily Log
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Project: *
              </label>
              <select
                value={editForm.projectId}
                onChange={(e) => setEditForm({ ...editForm, projectId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Date: *
              </label>
              <input
                type="date"
                value={editForm.logDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setEditForm({ ...editForm, logDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Materials Used:
              </label>
              <input
                type="text"
                value={editForm.materialsUsed}
                onChange={(e) => setEditForm({ ...editForm, materialsUsed: e.target.value })}
                placeholder="e.g., Concrete, Steel bars, Cement"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Labor Hours:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.laborHours}
                  onChange={(e) => setEditForm({ ...editForm, laborHours: e.target.value })}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Machinery Hours:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.machineryHours}
                  onChange={(e) => setEditForm({ ...editForm, machineryHours: e.target.value })}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Comments:
              </label>
              <textarea
                value={editForm.comments}
                onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                placeholder="Describe the work done..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={updateLog}
                disabled={loading}
                style={{
                  background: loading ? '#95a5a6' : '#f39c12',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Updating...' : 'Update Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Log Modal */}
      {showViewModal && viewingLog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#205c20' }}>
              Daily Log Details
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Project:</strong> {getLogProjectName(viewingLog)}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date:</strong> {new Date(viewingLog.logDate).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Materials Used:</strong> {viewingLog.materialsUsed || 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Labor Hours:</strong> {viewingLog.laborHours ? `${viewingLog.laborHours} hours` : 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Machinery Hours:</strong> {viewingLog.machineryHours ? `${viewingLog.machineryHours} hours` : 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Created By:</strong> {viewingLog.createdBy || 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Created At:</strong> {new Date(viewingLog.createdAt).toLocaleString()}
            </div>
            
            {viewingLog.comments && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Comments:</strong>
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingLog.comments}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyLogs;
