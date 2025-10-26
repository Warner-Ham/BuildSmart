import React, { useState, useEffect } from 'react';
import RequestManagement from './RequestManagement';

// Enhanced color palette
const COLORS = {
  green: '#27ae60',
  greenDark: '#205c20',
  greenLight: '#eaf7ea',
  greenGradient: 'linear-gradient(135deg, #336504 0%, #369A06 100%)',
  blue: '#3498db',
  blueDark: '#2980b9',
  blueLight: '#ebf3fd',
  yellow: '#f7c948',
  red: '#e74c3c',
  gray: '#888888',
  grayLight: '#fafafa',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  text: '#222',
  textLight: '#666',
  shadow: '0 4px 20px rgba(39, 174, 96, 0.1)',
  shadowHover: '0 8px 25px rgba(39, 174, 96, 0.15)',
};

// Project Edit Form Component
function ProjectEditForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    client: project.client || '',
    location: project.location || '',
    description: project.description || '',
    startDate: project.start_date || '',
    endDate: project.end_date || '',
    budget: project.curr_budget || '',
    status: project.status || 'planning',
    projectType: project.project_type || '',
    assignedStaff: project.assigned_staff || '',
    priority: project.priority || 'medium',
    notes: project.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Infrastructure',
    'Renovation',
    'New Construction',
    'Steel Work',
    'Bridge Construction',
    'Road Development',
    'Roofing Solutions',
    'Drainage Systems',
    'Boundary Installations'
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.client.trim()) newErrors.client = 'Client is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        curr_budget: formData.budget ? parseFloat(formData.budget) : 0,
        start_date: formData.startDate,
        end_date: formData.endDate,
        project_type: formData.projectType,
        assigned_staff: formData.assignedStaff
      };

      await onSubmit(projectData);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: COLORS.shadow,
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <h2 style={{
        marginBottom: '1.5rem',
        color: COLORS.greenDark,
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        Edit Project
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.name ? COLORS.red : COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {errors.name && <div style={{ color: COLORS.red, fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Client *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.client ? COLORS.red : COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {errors.client && <div style={{ color: COLORS.red, fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.client}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.location ? COLORS.red : COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {errors.location && <div style={{ color: COLORS.red, fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.location}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.startDate ? COLORS.red : COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {errors.startDate && <div style={{ color: COLORS.red, fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.startDate}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Budget
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.budget ? COLORS.red : COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            {errors.budget && <div style={{ color: COLORS.red, fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.budget}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              {priorityLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
            Project Type
          </label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            <option value="">Select project type</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: COLORS.text }}>
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              background: 'white',
              color: COLORS.text,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              background: COLORS.greenGradient,
              color: 'white',
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Project Detail View Component
function ProjectDetailView({ project, onClose }) {
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return COLORS.green;
      case 'in_progress': return COLORS.blue;
      case 'on_hold': return COLORS.yellow;
      case 'cancelled': return COLORS.red;
      default: return COLORS.gray;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return COLORS.red;
      case 'medium': return COLORS.yellow;
      case 'low': return COLORS.green;
      default: return COLORS.gray;
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: COLORS.shadow,
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          margin: 0,
          color: COLORS.greenDark,
          fontSize: '1.75rem',
          fontWeight: '600'
        }}>
          {project.name}
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: '0.5rem',
            border: 'none',
            borderRadius: '50%',
            background: COLORS.grayLight,
            color: COLORS.text,
            cursor: 'pointer',
            fontSize: '1.25rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ color: COLORS.greenDark, marginBottom: '1rem', fontSize: '1.25rem' }}>Project Information</h3>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Client:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{project.client || 'N/A'}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Location:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{project.location || 'N/A'}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Status:</strong>
            <div style={{
              marginTop: '0.25rem',
              color: 'white',
              background: getStatusColor(project.status),
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              display: 'inline-block',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {project.status || 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Priority:</strong>
            <div style={{
              marginTop: '0.25rem',
              color: 'white',
              background: getPriorityColor(project.priority),
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              display: 'inline-block',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {project.priority || 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Project Type:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{project.project_type || 'N/A'}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Assigned Staff:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{project.assigned_staff || 'N/A'}</div>
          </div>
        </div>

        <div>
          <h3 style={{ color: COLORS.greenDark, marginBottom: '1rem', fontSize: '1.25rem' }}>Timeline & Budget</h3>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Start Date:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{formatDate(project.start_date)}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>End Date:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{formatDate(project.end_date)}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Current Budget:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight, fontSize: '1.125rem', fontWeight: '600' }}>
              {formatCurrency(project.curr_budget)}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: COLORS.text }}>Previous Budget:</strong>
            <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>
              {formatCurrency(project.pre_budget)}
            </div>
          </div>

          {project.budget_date && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: COLORS.text }}>Budget Date:</strong>
              <div style={{ marginTop: '0.25rem', color: COLORS.textLight }}>{formatDate(project.budget_date)}</div>
            </div>
          )}
        </div>
      </div>

      {(project.description || project.notes) && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: COLORS.greenDark, marginBottom: '1rem', fontSize: '1.25rem' }}>Additional Information</h3>

          {project.description && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: COLORS.text }}>Description:</strong>
              <div style={{
                marginTop: '0.5rem',
                color: COLORS.textLight,
                lineHeight: '1.6',
                padding: '1rem',
                background: COLORS.grayLight,
                borderRadius: '6px'
              }}>
                {project.description}
              </div>
            </div>
          )}

          {project.notes && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: COLORS.text }}>Notes:</strong>
              <div style={{
                marginTop: '0.5rem',
                color: COLORS.textLight,
                lineHeight: '1.6',
                padding: '1rem',
                background: COLORS.grayLight,
                borderRadius: '6px'
              }}>
                {project.notes}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
            background: COLORS.greenGradient,
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Project Creation Form Component
function ProjectCreationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    projectType: '',
    assignedStaff: '',
    priority: 'medium',
    notes: '',
    selectedRequestId: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const projectTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Infrastructure',
    'Renovation',
    'New Construction',
    'Steel Work',
    'Bridge Construction',
    'Road Development',
    'Roofing Solutions',
    'Drainage Systems',
    'Boundary Installations'
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Fetch approved project requests on component mount
  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await fetch('http://localhost:8080/api/project-requests?includeDeleted=false');
      if (response.ok) {
        const data = await response.json();
        // Filter only approved requests that haven't been converted to projects yet
        const approved = data.filter(request => request.status === 'Accepted' && !request.projectCreated);
        setApprovedRequests(approved);
      } else {
        console.error('Failed to fetch approved requests');
      }
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRequestSelection = (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({ ...prev, selectedRequestId: selectedId }));

    if (selectedId) {
      const selectedRequest = approvedRequests.find(req => req.id.toString() === selectedId);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          client: selectedRequest.client,
          location: selectedRequest.location,
          description: selectedRequest.description,
          name: `${selectedRequest.client} - ${selectedRequest.location} Project`
        }));
      }
    } else {
      // Clear form if no request selected
      setFormData(prev => ({
        ...prev,
        name: '',
        client: '',
        location: '',
        description: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedRequestId) newErrors.selectedRequestId = 'You must select an approved project request';
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        createdDate: new Date().toISOString().split('T')[0]
      };

      await onSubmit(projectData);

      // Reset form
      setFormData({
        name: '',
        client: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'planning',
        projectType: '',
        assignedStaff: '',
        priority: 'medium',
        notes: '',
        selectedRequestId: ''
      });

      // Refresh the approved requests list
      fetchApprovedRequests();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: COLORS.shadow,
      border: `1px solid ${COLORS.borderLight}`,
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: COLORS.greenDark,
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: 600
      }}>
        Create New Project
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Project Request Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
            Select Approved Project Request *
          </label>
          {loadingRequests ? (
            <div style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.textLight }}>
              Loading approved requests...
            </div>
          ) : (
            <select
              name="selectedRequestId"
              value={formData.selectedRequestId}
              onChange={handleRequestSelection}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.selectedRequestId ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              <option value="">-- Select a project request --</option>
              {approvedRequests.map(request => (
                <option key={request.id} value={request.id}>
                  {request.client} - {request.location} ({new Date(request.requestDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
          {errors.selectedRequestId && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.selectedRequestId}</div>}
          {!loadingRequests && approvedRequests.length === 0 && (
            <div style={{ color: COLORS.textLight, fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
              No approved project requests available. Please check the Request Management section to approve requests first.
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.name ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
              placeholder="Enter project name"
            />
            {errors.name && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Client Name *
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.client ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
              placeholder="Enter client name"
            />
            {errors.client && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.client}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.location ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
              placeholder="City, District, Sri Lanka"
            />
            {errors.location && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.location}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Project Type
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              <option value="">Select project type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.startDate ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            />
            {errors.startDate && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.startDate}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Budget (LKR) *
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.budget ? COLORS.red : COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
              placeholder="Enter budget amount"
            />
            {errors.budget && <div style={{ color: COLORS.red, fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.budget}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              {priorityLevels.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
            Assigned Staff
          </label>
          <input
            type="text"
            name="assignedStaff"
            value={formData.assignedStaff}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'white'
            }}
            placeholder="Staff member name or ID"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
            Project Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'white',
              resize: 'vertical'
            }}
            placeholder="Detailed project description, requirements, and specifications..."
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              fontSize: '0.9rem',
              background: 'white',
              resize: 'vertical'
            }}
            placeholder="Any additional notes or special instructions..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
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
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              background: COLORS.greenGradient,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Project List Component
function ProjectList({ projects, onEdit, onDelete, onView }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesPriority = !priorityFilter || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return COLORS.blue;
      case 'in_progress': return COLORS.green;
      case 'on_hold': return COLORS.yellow;
      case 'completed': return COLORS.gray;
      case 'cancelled': return COLORS.red;
      default: return COLORS.gray;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return COLORS.green;
      case 'medium': return COLORS.yellow;
      case 'high': return COLORS.red;
      case 'urgent': return COLORS.red;
      default: return COLORS.gray;
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: COLORS.shadow,
      border: `1px solid ${COLORS.borderLight}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{
          color: COLORS.greenDark,
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: 600
        }}>
          Projects ({filteredProjects.length})
        </h2>
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            fontSize: '0.9rem',
            background: 'white'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            fontSize: '0.9rem',
            background: 'white'
          }}
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            fontSize: '0.9rem',
            background: 'white'
          }}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Projects Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.grayLight }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Client</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Priority</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Budget</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{project.name || 'Unnamed Project'}</td>
                <td style={{ padding: '12px 16px' }}>{project.client || 'No Client'}</td>
                <td style={{ padding: '12px 16px' }}>{project.location || 'No Location'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    background: getStatusColor(project.status),
                    color: 'white'
                  }}>
                    {project.status ? project.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    background: getPriorityColor(project.priority),
                    color: 'white'
                  }}>
                    {project.priority ? project.priority.toUpperCase() : 'UNKNOWN'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {project.budget ? `Rs. ${Number(project.budget).toLocaleString()}` : 'Not set'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => onView(project)}
                      style={{
                        padding: '4px 8px',
                        background: COLORS.blue,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      style={{
                        padding: '4px 8px',
                        background: COLORS.green,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      style={{
                        padding: '4px 8px',
                        background: COLORS.red,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
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

      {filteredProjects.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: COLORS.textLight
        }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No projects found</div>
          <div style={{ fontSize: '0.9rem' }}>Try adjusting your search filters or create a new project</div>
        </div>
      )}
    </div>
  );
}

// Main Project Management Component
export default function ProjectManagement({ loggedInRole }) {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'requests'

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [...prev, newProject]);

        // Mark the project request as used (if selectedRequestId exists)
        if (projectData.selectedRequestId) {
          try {
            await fetch(`http://localhost:8080/api/project-requests/${projectData.selectedRequestId}/mark-used`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (err) {
            console.warn('Failed to mark request as used:', err);
            // Don't fail the whole operation for this
          }
        }

        setShowCreateForm(false);
        setError('');
      } else {
        setError('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setEditingProject(null);
        setError('');
      } else {
        setError('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setError('');
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  // Check if user has permission to manage projects
  const canManageProjects = ["Project Manager", 'Admin', 'Site Manager', 'Document Control Manager'].includes(loggedInRole);

  if (!canManageProjects) {
    return (
      <div style={{
        maxWidth: 800,
        margin: '2rem auto',
        padding: '2rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: '12px',
        boxShadow: COLORS.shadow
      }}>
        <h2 style={{ color: COLORS.red, marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: COLORS.textLight }}>
          You don't have permission to access project management features.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: '"Segoe UI", Arial, sans-serif',
      color: COLORS.text
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.greenGradient,
        padding: '2rem',
        borderRadius: '20px 20px 0 0',
        color: 'white',
        textAlign: 'center',
        boxShadow: COLORS.shadow
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Project Management
        </h1>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          Create, manage, and track construction projects
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        background: 'white',
        borderRadius: '0 0 20px 20px',
        boxShadow: COLORS.shadow,
        minHeight: '600px'
      }}>
        {/* Tabs */}
        <div style={{
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex'
        }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: activeTab === 'projects' ? COLORS.greenLight : 'transparent',
              color: activeTab === 'projects' ? COLORS.greenDark : COLORS.textLight,
              cursor: 'pointer',
              fontWeight: 600,
              borderBottom: activeTab === 'projects' ? `3px solid ${COLORS.green}` : 'none',
              transition: 'all 0.2s'
            }}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: activeTab === 'requests' ? COLORS.greenLight : 'transparent',
              color: activeTab === 'requests' ? COLORS.greenDark : COLORS.textLight,
              cursor: 'pointer',
              fontWeight: 600,
              borderBottom: activeTab === 'requests' ? `3px solid ${COLORS.green}` : 'none',
              transition: 'all 0.2s'
            }}
          >
            Project Requests
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'projects' && (
          <div>
            {/* Projects Action Bar */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: 0, color: COLORS.greenDark }}>Projects</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: COLORS.textLight }}>
                  Manage your construction projects
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
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
              >
                + Create Project
              </button>
            </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: COLORS.red,
            margin: '1rem 2rem',
            fontWeight: 500,
            background: '#fee',
            padding: '12px 16px',
            borderRadius: '8px',
            border: `1px solid ${COLORS.red}`,
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: COLORS.textLight
                }}>
                  <div style={{ fontSize: '1.1rem' }}>Loading projects...</div>
                </div>
              ) : (
                <ProjectList
                  projects={projects}
                  onEdit={setEditingProject}
                  onDelete={handleDeleteProject}
                  onView={setViewingProject}
                />
              )}
            </div>
          </div>
        )}

        {/* Requests Tab Content */}
        {activeTab === 'requests' && (
          <div style={{ padding: '1rem' }}>
            <RequestManagement />
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ProjectCreationForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {editingProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ProjectEditForm
            project={editingProject}
            onSubmit={handleEditProject}
            onCancel={() => setEditingProject(null)}
          />
        </div>
      )}

      {viewingProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ProjectDetailView
            project={viewingProject}
            onClose={() => setViewingProject(null)}
          />
        </div>
      )}
    </div>
  );
}

