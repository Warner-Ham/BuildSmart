import React, { useState } from 'react';
import './ProjectCreation.css';

function ProjectCreationForm({ projects, setProjects }) {
    const [formData, setFormData] = useState({
        requestId: '',
        projectName: '',
        location: '',
        customerDetails: '',
        startDate: '',
        endDate: '',
        prePlannedBudget: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form data:', formData);
        console.log('Projects array:', projects);
        
        // Validate required fields
        if (!formData.projectName || !formData.customerDetails || !formData.location) {
            alert('Please fill in all required fields (Project Name, Customer Details, Location)');
            return;
        }

        // Validate budget (make it optional)
        const budget = formData.prePlannedBudget ? parseFloat(formData.prePlannedBudget) : 0;
        console.log('Budget value:', budget);
        
        if (formData.prePlannedBudget && (isNaN(budget) || budget < 0)) {
            alert('Please enter a valid budget amount');
            return;
        }
        
        try {
            // Generate new ID safely
            const maxId = projects && projects.length > 0 ? Math.max(...projects.map(p => p.id || 0)) : 0;
            const newId = maxId + 1;
            
            // Create new project object
            const newProject = {
                id: newId,
                name: formData.projectName.trim(),
                client: formData.customerDetails.trim(),
                location: formData.location.trim(),
                status: 'Planning',
                pre_budget: budget,
                curr_budget: budget,
                start_date: formData.startDate || new Date().toISOString().split('T')[0],
                end_date: formData.endDate || '',
                images: '',
                deleted: false
            };

            // Add to projects array
            setProjects(prevProjects => [...(prevProjects || []), newProject]);
            
            alert('Project created successfully!');
            
            // Clear form
            setFormData({
                requestId: '',
                projectName: '',
                location: '',
                customerDetails: '',
                startDate: '',
                endDate: '',
                prePlannedBudget: ''
            });
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        }
    };

    return (
        <div className="project-form-container">
            <form onSubmit={handleSubmit} className="project-form">
                <h2>Project Creation Form</h2>
                
                <div className="form-group">
                    <label htmlFor="requestId">Request ID:</label>
                    <input
                        type="number"
                        id="requestId"
                        name="requestId"
                        value={formData.requestId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerDetails">Customer Details:</label>
                    <textarea
                        id="customerDetails"
                        name="customerDetails"
                        value={formData.customerDetails}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prePlannedBudget">Pre-planned Budget:</label>
                    <input
                        type="number"
                        id="prePlannedBudget"
                        name="prePlannedBudget"
                        value={formData.prePlannedBudget}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="Enter budget amount (optional)"
                    />
                </div>

                <button type="submit" className="submit-button">Create Project</button>
            </form>
        </div>
    );
}

export default ProjectCreationForm;
