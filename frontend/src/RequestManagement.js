import React, { useState, useEffect } from 'react';

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
        alert('Project request updated successfully!');
      } else {
        alert('Failed to update project request');
      }
    } catch (err) {
      alert('Error updating project request');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to move this request to the bin?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/project-requests/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchRequests();
          alert('Project request moved to bin successfully!');
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
        await fetchRequests();
        alert('Project request restored successfully!');
      } else {
        alert('Failed to restore project request');
      }
    } catch (error) {
      alert('Error restoring project request');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this request? This action cannot be undone!')) {
      try {
        const response = await fetch(`http://localhost:8080/api/project-requests/${id}/permanent`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchRequests();
          alert('Project request permanently deleted!');
        } else {
          alert('Failed to permanently delete project request');
        }
      } catch (err) {
        alert('Error permanently deleting project request');
      }
    }
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
        alert('Project created successfully!');
        setShowCreateProjectModal(false);
        setSelectedRequest(null);
        await fetchRequests();
      } else {
        const errorText = await response.text();
        alert(`Failed to create project: ${errorText}`);
      }
    } catch (err) {
      alert('Error creating project');
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#205c20' }}>Request Management</h1>
        <p className="text-lg text-gray-600 mb-4">
          View and manage project requests from clients. Update status, create projects, or move to bin.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button onClick={fetchRequests} className="px-4 py-2 text-white rounded hover:opacity-90 font-medium" style={{ background: '#205c20' }}>
            Refresh List
          </button>
          <button 
            onClick={() => setShowDeletedRequests(!showDeletedRequests)} 
            className="px-4 py-2 text-white rounded hover:opacity-90 font-medium"
            style={{ background: showDeletedRequests ? '#e74c3c' : '#95a5a6' }}
          >
            {showDeletedRequests ? 'Show Active Requests' : 'Show Bin'}
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600 mb-2">
            {showDeletedRequests ? 'No deleted requests' : 'No active requests found'}
          </h3>
          <p className="text-gray-500">{showDeletedRequests ? 'The bin is empty.' : 'No requests have been submitted yet.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-white" style={{ background: '#205c20' }}>
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Client</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Location</th>
                <th className="p-4 text-left font-semibold">Description</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{request.id}</td>
                  <td className="p-4 font-medium">{request.client}</td>
                  <td className="p-4">{request.email}</td>
                  <td className="p-4">{request.location}</td>
                  <td className="p-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={request.description}>
                    {request.description}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                      style={{ backgroundColor: getStatusColor(request.status || 'Pending') }}>
                      {request.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {showDeletedRequests ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleRestore(request.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(request.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Delete Forever
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => handleEdit(request)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        {request.status === 'Accepted' && (
                          <button
                            onClick={() => handleCreateProjectClick(request)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Create Project
                          </button>
                        )}
                        {request.status === 'Reject' && (
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">Edit Project Request</h3>
          <button className="text-3xl text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name:</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">Create Project</h3>
          <button className="text-3xl text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-700 mb-2">Client Information:</h4>
          <p className="text-sm text-gray-600"><strong>Name:</strong> {request.client}</p>
          <p className="text-sm text-gray-600"><strong>Email:</strong> {request.email}</p>
          <p className="text-sm text-gray-600"><strong>Location:</strong> {request.location}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget:</label>
            <input
              type="number"
              name="preBudget"
              value={formData.preBudget}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-medium"
            >
              Create Project
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
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