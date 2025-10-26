import React, { useState, useEffect } from 'react';
import './ProjectsTable.css';

function ProjectsTable({ projects, setProjects }) {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingProject, setEditingProject] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        client: '',
        location: '',
        status: '',
        pre_budget: '',
        curr_budget: '',
        start_date: '',
        end_date: ''
    });

    // No need to fetch from API - using frontend data
    const fetchProjects = () => {
        // This function is kept for compatibility but doesn't make API calls
        setLoading(false);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setEditFormData({
            name: project.name || '',
            client: project.client || '',
            location: project.location || '',
            status: project.status || '',
            pre_budget: project.pre_budget || '',
            curr_budget: project.curr_budget || '',
            start_date: project.start_date ? project.start_date.split('T')[0] : '',
            end_date: project.end_date ? project.end_date.split('T')[0] : ''
        });
        setShowEditModal(true);
    };

    const handleUpdateProject = (e) => {
        e.preventDefault();
        // Update project in frontend data
        setProjects(projects.map(project => 
            project.id === editingProject.id 
                ? { ...project, ...editFormData }
                : project
        ));
        alert('Project updated successfully!');
        setShowEditModal(false);
        setEditingProject(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            // Mark project as deleted instead of removing it
            setProjects(projects.map(project => 
                project.id === id ? { ...project, deleted: true } : project
            ));
            alert('Project deleted successfully!');
        }
    };

    const handleRestore = (id) => {
        // Restore deleted project
        setProjects(projects.map(project => 
            project.id === id ? { ...project, deleted: false } : project
        ));
        alert('Project restored successfully!');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed':
                return '#27ae60';
            case 'In Progress':
                return '#f39c12';
            case 'On Hold':
                return '#e74c3c';
            case 'Planning':
                return '#3498db';
            default:
                return '#95a5a6';
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="projects-container">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-container">
                <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>Error: {error}</p>
                    <button onClick={fetchProjects} className="retry-btn">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h1>Project Management</h1>
                <p>View and manage all created projects</p>
                <button onClick={fetchProjects} className="refresh-btn">
                    Refresh Projects
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="no-projects">
                    <h3>No projects found</h3>
                    <p>No projects have been created yet.</p>
                </div>
            ) : (
                <div>
                    {/* Active Projects Section */}
                    <div className="projects-section">
                        <div className="section-header">
                            <h2>Active Projects</h2>
                            <span className="project-count">({projects.filter(p => !p.deleted).length} projects)</span>
                        </div>
                        
                        {projects.filter(p => !p.deleted).length === 0 ? (
                            <div className="empty-section">
                                <p>No active projects</p>
                            </div>
                        ) : (
                            <div className="projects-table-container">
                                <table className="projects-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Project Name</th>
                                            <th>Client</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Pre Budget</th>
                                            <th>Current Budget</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.filter(project => !project.deleted).map((project) => (
                                            <tr key={project.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td>{project.id}</td>
                                                <td className="project-name">{project.name}</td>
                                                <td>{project.client}</td>
                                                <td>{project.location}</td>
                                                <td>
                                                    <span 
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(project.status) }}
                                                    >
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(project.start_date)}</td>
                                                <td>{formatDate(project.end_date)}</td>
                                                <td className="budget">{formatCurrency(project.pre_budget)}</td>
                                                <td className="budget">{formatCurrency(project.curr_budget)}</td>
                                                <td className="actions">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="action-btn edit-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="action-btn delete-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Deleted Projects Bin Section */}
                    {projects.filter(p => p.deleted).length > 0 && (
                        <div className="bin-section">
                            <div className="section-header bin-header">
                                <h2>🗑️ Project Bin</h2>
                                <span className="project-count">({projects.filter(p => p.deleted).length} deleted projects)</span>
                            </div>
                            
                            <div className="projects-table-container bin-table-container">
                                <table className="projects-table bin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Project Name</th>
                                            <th>Client</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Pre Budget</th>
                                            <th>Current Budget</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.filter(project => project.deleted).map((project) => (
                                            <tr key={project.id} className="deleted-project" style={{ 
                                                borderBottom: '1px solid #e0e0e0',
                                                opacity: 0.6
                                            }}>
                                                <td style={{ textDecoration: 'line-through' }}>{project.id}</td>
                                                <td className="project-name" style={{ textDecoration: 'line-through' }}>{project.name}</td>
                                                <td style={{ textDecoration: 'line-through' }}>{project.client}</td>
                                                <td style={{ textDecoration: 'line-through' }}>{project.location}</td>
                                                <td>
                                                    <span 
                                                        className="status-badge deleted-badge"
                                                        style={{ backgroundColor: '#95a5a6' }}
                                                    >
                                                        Deleted
                                                    </span>
                                                </td>
                                                <td style={{ textDecoration: 'line-through' }}>{formatDate(project.start_date)}</td>
                                                <td style={{ textDecoration: 'line-through' }}>{formatDate(project.end_date)}</td>
                                                <td className="budget" style={{ textDecoration: 'line-through' }}>{formatCurrency(project.pre_budget)}</td>
                                                <td className="budget" style={{ textDecoration: 'line-through' }}>{formatCurrency(project.curr_budget)}</td>
                                                <td className="actions">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="action-btn edit-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRestore(project.id)}
                                                        className="restore-btn"
                                                    >
                                                        Restore
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingProject && (
                <EditProjectModal
                    project={editingProject}
                    formData={editFormData}
                    setFormData={setEditFormData}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingProject(null);
                    }}
                    onSave={handleUpdateProject}
                />
            )}
        </div>
    );
}

// Edit Project Modal Component
function EditProjectModal({ project, formData, setFormData, onClose, onSave }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Project</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={onSave} className="modal-form">
                    <div className="form-group">
                        <label>Project Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Client:</label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
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
                        <label>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Pre Budget (Rs.):</label>
                        <input
                            type="number"
                            name="pre_budget"
                            value={formData.pre_budget}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Current Budget (Rs.):</label>
                        <input
                            type="number"
                            name="curr_budget"
                            value={formData.curr_budget}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date:</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                        />
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

export default ProjectsTable;
