import React, { useState, useEffect } from 'react';

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
  gray: '#f4f4f4',
  grayLight: '#fafafa',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  text: '#222',
  textLight: '#666',
  shadow: '0 4px 20px rgba(39, 174, 96, 0.1)',
  shadowHover: '0 8px 25px rgba(39, 174, 96, 0.15)',
};

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
    notes: ''
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
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
        notes: ''
      });
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
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
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
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{project.name}</td>
                <td style={{ padding: '12px 16px' }}>{project.client}</td>
                <td style={{ padding: '12px 16px' }}>{project.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    background: getStatusColor(project.status),
                    color: 'white'
                  }}>
                    {project.status.replace('_', ' ').toUpperCase()}
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
                    {project.priority.toUpperCase()}
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
  const canManageProjects = ['Admin', 'Site Manager', 'Document Control Manager'].includes(loggedInRole);

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
        {/* Action Bar */}
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
          {showCreateForm && (
            <div style={{ marginBottom: '2rem' }}>
              <ProjectCreationForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {editingProject && (
            <div style={{ marginBottom: '2rem' }}>
              <ProjectCreationForm
                onSubmit={handleEditProject}
                onCancel={() => setEditingProject(null)}
                initialData={editingProject}
              />
            </div>
          )}

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
    </div>
  );
}