import React, { useState } from 'react';
import './RequestForm.css';

function RequestForm() {
    const [formData, setFormData] = useState({
        client: '',
        email: '',
        location: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/project-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Project request submitted successfully!');
                // Reset form
                setFormData({
                    client: '',
                    email: '',
                    location: '',
                    description: ''
                });
            } else {
                const error = await response.json();
                alert(`Error submitting request: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the request.');
        }
    };

    return (
        <div className="request-form-container">
            <form onSubmit={handleSubmit} className="request-form">
                <h2>Project Request Form</h2>
                
                <div className="form-group">
                    <label htmlFor="client">Client:</label>
                    <input
                        type="text"
                        id="client"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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
                    <label htmlFor="description">Project Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default RequestForm;
