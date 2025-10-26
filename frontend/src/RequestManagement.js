import React, { useState, useEffect } from 'react';

// Add CSS animations
const styles = document.createElement('style');
styles.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .table-row:hover {
    background-color: #f8f9fa !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.1);
    transition: all 0.2s ease;
  }
`;
document.head.appendChild(styles);

// Enhanced color palette
const COLORS = {
  green: '#27ae60',
  greenDark: '#205c20',
  greenLight: '#eaf7ea',
  greenGradient: 'linear-gradient(135deg, #336504 0%, #369A06 100%)',
  blue: '#3498db',
  blueDark: '#2980b9',
  blueLight: '#ebf3fd',
  yellow: '#f39c12',
  red: '#e74c3c',
  redLight: '#fdebeb',
  gray: '#f4f4f4',
  grayLight: '#fafafa',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  text: '#222',
  textLight: '#666',
  shadow: '0 4px 20px rgba(39, 174, 96, 0.1)',
  shadowHover: '0 8px 25px rgba(39, 174, 96, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.5)'
};

// Custom Modal Components
function NotificationModal({ show, title, message, type = 'info', onClose }) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: COLORS.greenLight, text: COLORS.greenDark, border: COLORS.green };
      case 'error':
        return { bg: COLORS.redLight, text: COLORS.red, border: COLORS.red };
      case 'warning':
        return { bg: '#fff3cd', text: '#856404', border: COLORS.yellow };
      default:
        return { bg: COLORS.blueLight, text: COLORS.blueDark, border: COLORS.blue };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: COLORS.overlay,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: colors.bg,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginRight: '1rem',
            border: `2px solid ${colors.border}`
          }}>
            {getIcon()}
          </div>
          <h3 style={{ margin: 0, color: COLORS.text, fontSize: '1.3rem' }}>{title}</h3>
        </div>
        <p style={{ color: COLORS.textLight, marginBottom: '2rem', lineHeight: '1.5' }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: COLORS.greenGradient,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function ConfirmationModal({ show, title, message, onConfirm, onCancel, type = 'warning' }) {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: COLORS.overlay,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: type === 'danger' ? COLORS.redLight : '#fff3cd',
            color: type === 'danger' ? COLORS.red : '#856404',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginRight: '1rem',
            border: `2px solid ${type === 'danger' ? COLORS.red : COLORS.yellow}`
          }}>
            {type === 'danger' ? '⚠' : '?'}
          </div>
          <h3 style={{ margin: 0, color: COLORS.text, fontSize: '1.3rem' }}>{title}</h3>
        </div>
        <p style={{ color: COLORS.textLight, marginBottom: '2rem', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: COLORS.gray,
              color: COLORS.text,
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = COLORS.border}
            onMouseOut={(e) => e.target.style.background = COLORS.gray}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: type === 'danger' ? COLORS.red : COLORS.yellow,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// RequestManagement component: Manages project requests with full CRUD operations
function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeletedRequests, setShowDeletedRequests] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Modal states
  const [notification, setNotification] = useState({ show: false, title: '', message: '', type: 'info' });
  const [confirmation, setConfirmation] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'warning' });

  const [editFormData, setEditFormData] = useState({
    client: '',
    email: '',
    location: '',
    description: '',
    status: ''
  });
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    preBudget: '',
    endDate: ''
  });

  // Helper functions for modals
  const showNotification = (title, message, type = 'info') => {
    setNotification({ show: true, title, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, title: '', message: '', type: 'info' });
  };

  const showConfirmation = (title, message, onConfirm, type = 'warning') => {
    setConfirmation({ show: true, title, message, onConfirm, type });
  };

  const hideConfirmation = () => {
    setConfirmation({ show: false, title: '', message: '', onConfirm: null, type: 'warning' });
  };

  useEffect(() => {
    fetchRequests();
  }, [showDeletedRequests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/project-requests?includeDeleted=${showDeletedRequests}`);
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

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/project-requests/${editingRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        await fetchRequests();
        setShowEditModal(false);
        setEditingRequest(null);
        showNotification('Success!', 'Project request updated successfully!', 'success');
      } else {
        showNotification('Error', 'Failed to update project request. Please try again.', 'error');
      }
    } catch (err) {
      showNotification('Error', 'Error updating project request. Please check your connection.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirmation(
      'Move to Bin',
      'Are you sure you want to move this request to the bin? You can restore it later if needed.',
      async () => {
        hideConfirmation();
        try {
          const response = await fetch(`http://localhost:8080/api/project-requests/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchRequests();
            showNotification('Success!', 'Project request moved to bin successfully!', 'success');
          } else {
            showNotification('Error', 'Failed to delete project request. Please try again.', 'error');
          }
        } catch (err) {
          showNotification('Error', 'Error deleting project request. Please check your connection.', 'error');
        }
      },
      'warning'
    );
  };

  const handleRestore = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/project-requests/${id}/restore`, {
        method: 'PUT'
      });

      if (response.ok) {
        await fetchRequests();
        showNotification('Success!', 'Project request restored successfully!', 'success');
      } else {
        showNotification('Error', 'Failed to restore project request. Please try again.', 'error');
      }
    } catch (error) {
      showNotification('Error', 'Error restoring project request. Please check your connection.', 'error');
    }
  };

  const handlePermanentDelete = async (id) => {
    showConfirmation(
      'Permanent Delete',
      'Are you sure you want to permanently delete this request? This action cannot be undone and the data will be lost forever!',
      async () => {
        hideConfirmation();
        try {
          const response = await fetch(`http://localhost:8080/api/project-requests/${id}/permanent`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchRequests();
            showNotification('Deleted', 'Project request permanently deleted!', 'success');
          } else {
            showNotification('Error', 'Failed to permanently delete project request. Please try again.', 'error');
          }
        } catch (err) {
          showNotification('Error', 'Error permanently deleting project request. Please check your connection.', 'error');
        }
      },
      'danger'
    );
  };

  const handleCreateProjectClick = (request) => {
    setSelectedRequest(request);
    setProjectFormData({
      name: `${request.client} Project`,
      preBudget: '',
      endDate: ''
    });
    setShowCreateProjectModal(true);
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/project-requests/${selectedRequest.id}/create-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectFormData)
      });

      if (response.ok) {
        showNotification('Success!', 'Project created successfully! The request has been marked as used.', 'success');
        setShowCreateProjectModal(false);
        setSelectedRequest(null);
        await fetchRequests();
      } else {
        const errorText = await response.text();
        showNotification('Error', `Failed to create project: ${errorText}`, 'error');
      }
    } catch (err) {
      showNotification('Error', 'Error creating project. Please check your connection.', 'error');
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

  const filteredRequests = showDeletedRequests
    ? requests.filter(r => r.deleted)
    : requests.filter(r => !r.deleted);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading project requests...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: '#e74c3c' }}>Error: {error}</h2>
        <button onClick={fetchRequests} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">Retry</button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '"Segoe UI", Arial, sans-serif',
      background: COLORS.grayLight,
      minHeight: '100vh'
    }}>
      {/* Enhanced Header */}
      <div style={{
        background: 'white',
        borderRadius: '20px 20px 0 0',
        padding: '2.5rem',
        boxShadow: COLORS.shadow,
        marginBottom: '0'
      }}>
        <div style={{
          background: COLORS.greenGradient,
          borderRadius: '15px',
          padding: '2rem',
          color: 'white',
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <h1 style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 1
          }}>
            Request Management
          </h1>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '1.2rem',
            opacity: 0.9,
            position: 'relative',
            zIndex: 1
          }}>
            Manage project requests from clients with ease
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={fetchRequests}
              style={{
                padding: '12px 24px',
                background: COLORS.greenGradient,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: COLORS.shadow,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = COLORS.shadowHover;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = COLORS.shadow;
              }}
            >
              Refresh List
            </button>

            <button
              onClick={() => setShowDeletedRequests(!showDeletedRequests)}
              style={{
                padding: '12px 24px',
                background: showDeletedRequests ?
                  `linear-gradient(135deg, ${COLORS.red} 0%, #c0392b 100%)` :
                  `linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: COLORS.shadow,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = COLORS.shadowHover;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = COLORS.shadow;
              }}
            >
              {showDeletedRequests ? 'Show Active Requests' : 'Show Bin'}
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '12px 20px',
            background: COLORS.greenLight,
            borderRadius: '25px',
            border: `2px solid ${COLORS.green}`,
            color: COLORS.greenDark,
            fontWeight: 600
          }}>
            <span>Total: {filteredRequests.length}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Content Area */}
      <div style={{
        background: 'white',
        borderRadius: '0 0 20px 20px',
        boxShadow: COLORS.shadow,
        minHeight: '500px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            color: COLORS.textLight
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: `4px solid ${COLORS.borderLight}`,
              borderTop: `4px solid ${COLORS.green}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600 }}>Loading Requests...</h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.7 }}>Please wait while we fetch the data</p>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            color: COLORS.red
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: COLORS.redLight,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
              border: `3px solid ${COLORS.red}`
            }}>
              !
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Error Loading Data</h3>
            <p style={{ margin: '0.5rem 0 1rem 0', opacity: 0.8, textAlign: 'center' }}>{error}</p>
            <button
              onClick={fetchRequests}
              style={{
                padding: '12px 24px',
                background: COLORS.red,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
            color: COLORS.textLight
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: COLORS.grayLight,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '2rem',
              border: `3px solid ${COLORS.border}`
            }}>
              {showDeletedRequests ? 'X' : '□'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: COLORS.text }}>
              {showDeletedRequests ? 'No Deleted Requests' : 'No Active Requests Found'}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.7, textAlign: 'center' }}>
              {showDeletedRequests ? 'The bin is empty.' : 'No requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            background: 'white',
            borderRadius: '0 0 20px 20px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.95rem'
            }}>
              <thead>
                <tr style={{
                  background: COLORS.greenGradient,
                  color: 'white'
                }}>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>ID</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Client</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Email</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Location</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Description</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Status</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Date</th>
                  <th style={{
                    padding: '1.2rem 1rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    borderBottom: `3px solid ${COLORS.greenDark}`
                  }}>Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr
                  key={request.id}
                  className="table-row"
                  style={{
                    borderBottom: `1px solid ${COLORS.borderLight}`,
                    transition: 'all 0.2s ease',
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: COLORS.greenDark,
                    fontSize: '0.9rem'
                  }}>{request.id}</td>

                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: COLORS.text
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(request.status || 'Pending')
                      }}></div>
                      {request.client}
                    </div>
                  </td>

                  <td style={{
                    padding: '1rem',
                    color: COLORS.textLight,
                    fontSize: '0.9rem'
                  }}>
                    <a href={`mailto:${request.email}`} style={{
                      color: COLORS.blue,
                      textDecoration: 'none'
                    }}>
                      {request.email}
                    </a>
                  </td>

                  <td style={{
                    padding: '1rem',
                    color: COLORS.text,
                    fontWeight: 500
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {request.location}
                    </div>
                  </td>

                  <td style={{
                    padding: '1rem',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: COLORS.textLight,
                    fontSize: '0.9rem'
                  }} title={request.description}>
                    {request.description}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: getStatusColor(request.status || 'Pending'),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {request.status || 'Pending'}
                    </span>
                  </td>

                  <td style={{
                    padding: '1rem',
                    color: COLORS.textLight,
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}>
                    {new Date(request.requestDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {showDeletedRequests ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleRestore(request.id)}
                          style={{
                            padding: '8px 16px',
                            background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
                          }}
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(request.id)}
                          style={{
                            padding: '8px 16px',
                            background: `linear-gradient(135deg, ${COLORS.red} 0%, #c0392b 100%)`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
                          }}
                        >
                          Delete Forever
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleEdit(request)}
                          style={{
                            padding: '8px 16px',
                            background: `linear-gradient(135deg, ${COLORS.yellow} 0%, #e67e22 100%)`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(243, 156, 18, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(243, 156, 18, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(243, 156, 18, 0.3)';
                          }}
                        >
                          Edit
                        </button>
                        {request.status === 'Accepted' && (
                          <button
                            onClick={() => handleCreateProjectClick(request)}
                            style={{
                              padding: '8px 16px',
                              background: COLORS.greenGradient,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 8px rgba(39, 174, 96, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(39, 174, 96, 0.3)';
                            }}
                          >
                            Create Project
                          </button>
                        )}
                        {request.status === 'Reject' && (
                          <button
                            onClick={() => handleDelete(request.id)}
                            style={{
                              padding: '8px 16px',
                              background: `linear-gradient(135deg, ${COLORS.red} 0%, #c0392b 100%)`,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
                            }}
                          >
                            Move to Bin
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modals */}
      <NotificationModal
        show={notification.show}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />

      <ConfirmationModal
        show={confirmation.show}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={() => {
          confirmation.onConfirm && confirmation.onConfirm();
          hideConfirmation();
        }}
        onCancel={hideConfirmation}
        type={confirmation.type}
      />

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

      {showCreateProjectModal && selectedRequest && (
        <CreateProjectModal
          request={selectedRequest}
          formData={projectFormData}
          setFormData={setProjectFormData}
          onClose={() => {
            setShowCreateProjectModal(false);
            setSelectedRequest(null);
          }}
          onSave={handleCreateProject}
        />
      )}
    </div>
  );
}

function EditRequestModal({ request, formData, setFormData, onClose, onSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: COLORS.overlay,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        animation: 'slideIn 0.4s ease-out'
      }}>
        {/* Enhanced Header */}
        <div style={{
          background: COLORS.greenGradient,
          color: 'white',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>Edit Project Request</h3>
              <p style={{
                margin: '0.5rem 0 0 0',
                opacity: 0.9,
                fontSize: '1rem'
              }}>Update request details</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Enhanced Form */}
        <div style={{
          padding: '2rem',
          maxHeight: 'calc(90vh - 200px)',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Client Name:</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.green;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.greenLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.green;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.greenLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.green;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.greenLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight,
                resize: 'vertical',
                minHeight: '100px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.green;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.greenLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight,
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.green;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.greenLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Reject">Rejected</option>
            </select>
          </div>

          {/* Enhanced Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${COLORS.borderLight}`,
            marginTop: '2rem'
          }}>
            <button
              onClick={onSave}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: COLORS.greenGradient,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(39, 174, 96, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.3)';
              }}
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: COLORS.gray,
                color: COLORS.text,
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = COLORS.border;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = COLORS.gray;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateProjectModal({ request, formData, setFormData, onClose, onSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Enhanced Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 2rem 1rem 2rem',
          background: COLORS.blueGradient,
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Create New Project
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'rotate(90deg)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'rotate(0deg)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Enhanced Client Info Section */}
        <div style={{
          padding: '1.5rem 2rem',
          background: `linear-gradient(135deg, ${COLORS.blueLight} 0%, ${COLORS.greenLight} 100%)`,
          borderBottom: `1px solid ${COLORS.borderLight}`
        }}>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: COLORS.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Client Information
          </h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              <span style={{ color: COLORS.blue, fontWeight: 600 }}>Name:</span>
              <span style={{ color: COLORS.text }}>{request.client}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              <span style={{ color: COLORS.blue, fontWeight: 600 }}>Email:</span>
              <span style={{ color: COLORS.text }}>{request.email}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}>
              <span style={{ color: COLORS.blue, fontWeight: 600 }}>Location:</span>
              <span style={{ color: COLORS.text }}>{request.location}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Form Section */}
        <div style={{
          padding: '2rem',
          background: 'white'
        }}>
          {/* Project Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Project Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.blue;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.blueLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter project name..."
            />
          </div>

          {/* Budget Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>Budget:</label>
            <input
              type="number"
              name="preBudget"
              value={formData.preBudget}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.blue;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.blueLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
              placeholder="0.00"
            />
          </div>

          {/* End Date Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: '0.5rem'
            }}>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${COLORS.borderLight}`,
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.2s',
                background: COLORS.grayLight,
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.blue;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.blueLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.borderLight;
                e.target.style.background = COLORS.grayLight;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Enhanced Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${COLORS.borderLight}`,
            marginTop: '2rem'
          }}>
            <button
              onClick={onSave}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: COLORS.blueGradient,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(52, 152, 219, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
              }}
            >
              Create Project
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: COLORS.gray,
                color: COLORS.text,
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = COLORS.border;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = COLORS.gray;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestManagement;