import React, { useState, useEffect } from 'react';

// Green color palette
const COLORS = {
  green: '#27ae60',
  greenDark: '#205c20',
  greenLight: '#eaf7ea',
  yellow: '#f7c948',
  red: '#e74c3c',
  gray: '#f4f4f4',
  border: '#e0e0e0',
  text: '#222',
};

function ConfirmationModal({ open, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "No" }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999'
          }}
        >&times;</button>
        <h3 style={{ margin: '0 0 1rem 0', color: COLORS.greenDark }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#555', lineHeight: '1.4' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: COLORS.green,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >{confirmText}</button>
          <button
            onClick={onClose}
            style={{
              background: COLORS.red,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >{cancelText}</button>
        </div>
      </div>
    </div>
  );
}

function getBudgetStatusColor(percent) {
  if (percent >= 100) return COLORS.red;
  if (percent >= 90) return COLORS.yellow;
  return COLORS.green;
}

export default function BudgetingTab({ loggedInRole }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [dailyUsage, setDailyUsage] = useState({
    machinery: '', materials: '', labour_general: '', labour_skilled: '', subcontractors: '', other_costs: ''
  });
  const [alerts, setAlerts] = useState([]);
  const [report, setReport] = useState(null);
  const [modBudget, setModBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accumulativeSpent, setAccumulativeSpent] = useState(0);
  const [budgetRecords, setBudgetRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  
  // Confirmation dialog states
  const [confirmations, setConfirmations] = useState({
    createBudget: false,
    logUsage: false,
    modifyBudget: false,
    updateRecord: false,
    deleteRecord: false
  });
  const [actionData, setActionData] = useState({});

  // Fetch projects on mount
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  // Periodic data fetching for selected project
  useEffect(() => {
    if (selectedProject) {
      const interval = setInterval(() => {
        // Fetch project data
        fetch(`http://localhost:8080/api/projects/${selectedProject.id}`)
          .then(res => res.json())
          .then(data => setSelectedProject(data))
          .catch(() => setError('Failed to refresh project data'));
        // Fetch accumulative spent
        fetch(`http://localhost:8080/api/projects/${selectedProject.id}/budgets/sum`)
          .then(res => res.json())
          .then(data => setAccumulativeSpent(data.sum || 0))
          .catch(() => setAccumulativeSpent(0));
        // Fetch budget records for Document Control Manager/Admin
        if (loggedInRole === 'Document Control Manager' || loggedInRole === 'Admin') {
          fetch(`http://localhost:8080/api/project-budgets/project/${selectedProject.id}`)
            .then(res => res.json())
            .then(data => setBudgetRecords(data))
            .catch(() => setBudgetRecords([]));
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [selectedProject]);

  const handleSelectProject = async (id) => {
    const projectId = Number(id);
    setSelectedProject(null); // Clear current selection
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      if (res.ok) {
        const projectData = await res.json();
        setSelectedProject(projectData);
      } else {
        setError('Failed to fetch project data.');
      }
    } catch {
      setError('Failed to fetch project data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = () => {
    if (!selectedProject || !budgetInput) return;
    setActionData({ budgetAmount: budgetInput });
    setConfirmations(prev => ({ ...prev, createBudget: true }));
  };

  const confirmCreateBudget = async () => {
    setConfirmations(prev => ({ ...prev, createBudget: false }));
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    try {
      // Update project.pre_budget and project.curr_budget, and add date
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const res = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_budget: Number(actionData.budgetAmount),
          curr_budget: Number(actionData.budgetAmount),
          budget_date: today
        })
      });
      if (res.ok) {
        setBudgetInput('');
        // Refresh project data to confirm budget is non-zero
        const updatedRes = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`);
        if (updatedRes.ok) {
          const updatedProject = await updatedRes.json();
          setSelectedProject(updatedProject);
        }
      } else {
        setError('Failed to create budget.');
      }
    } catch {
      setError('Failed to create budget.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogUsage = () => {
    if (!selectedProject) return;
    const totalAmount = Object.values(dailyUsage).reduce((sum, value) => sum + Number(value || 0), 0);
    if (totalAmount === 0) return;
    
    setActionData({ usageData: dailyUsage, totalAmount });
    setConfirmations(prev => ({ ...prev, logUsage: true }));
  };

  const confirmLogUsage = async () => {
    setConfirmations(prev => ({ ...prev, logUsage: false }));
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    try {
      // Calculate total budget from resource usage
      const totalBudget = Object.values(actionData.usageData).reduce((sum, value) => sum + Number(value || 0), 0);

      const res = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...actionData.usageData, total_budget: totalBudget })
      });

      if (res.ok) {
        setDailyUsage({
          machinery: '', materials: '', labour_general: '', labour_skilled: '', subcontractors: '', other_costs: ''
        });

        // Refresh project data to update total spent
        const updatedRes = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`);
        if (updatedRes.ok) {
          const updatedProject = await updatedRes.json();
          setSelectedProject(updatedProject);
        }

        setAlerts(prev => [...prev, 'Resource usage logged successfully!']);
      } else {
        setError('Failed to log usage.');
      }
    } catch {
      setError('Failed to log usage.');
    } finally {
      setLoading(false);
    }
  };

  const handleModifyBudget = () => {
    if (!selectedProject || !modBudget) return;
    setActionData({ newBudget: modBudget });
    setConfirmations(prev => ({ ...prev, modifyBudget: true }));
  };

  const confirmModifyBudget = async () => {
    setConfirmations(prev => ({ ...prev, modifyBudget: false }));
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    try {
      // Update project.curr_budget using the project endpoint
      const res = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curr_budget: Number(actionData.newBudget) })
      });
      if (res.ok) {
        setModBudget('');
        // Optionally refresh project data
        const updatedRes = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`);
        if (updatedRes.ok) {
          const updatedProject = await updatedRes.json();
          setSelectedProject(updatedProject);
        }
      } else {
        setError('Failed to modify budget.');
      }
    } catch {
      setError('Failed to modify budget.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}/budget/report`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        setError('Failed to generate report.');
      }
    } catch {
      setError('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record.bgt_id);
    setEditingValues({
      machinery: record.machinery || 0,
      materials: record.materials || 0,
      labour_general: record.labour_general || 0,
      labour_skilled: record.labour_skilled || 0,
      subcontractors: record.subcontractors || 0,
      other_costs: record.other_costs || 0
    });
  };

  const handleSaveRecord = (recordId) => {
    const totalBudget = Object.values(editingValues).reduce((sum, val) => sum + Number(val || 0), 0);
    setActionData({ recordId, editingValues: { ...editingValues }, totalBudget });
    setConfirmations(prev => ({ ...prev, updateRecord: true }));
  };

  const confirmSaveRecord = async () => {
    setConfirmations(prev => ({ ...prev, updateRecord: false }));
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/project-budgets/${actionData.recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...actionData.editingValues, total_budget: actionData.totalBudget })
      });
      if (res.ok) {
        setEditingRecord(null);
        setEditingValues({});
        // Refresh budget records
        const updatedRes = await fetch(`http://localhost:8080/api/project-budgets/project/${selectedProject.id}`);
        if (updatedRes.ok) {
          const updatedRecords = await updatedRes.json();
          setBudgetRecords(updatedRecords);
        }
      } else {
        setError('Failed to save record.');
      }
    } catch {
      setError('Failed to save record.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = (recordId) => {
    setActionData({ recordId });
    setConfirmations(prev => ({ ...prev, deleteRecord: true }));
  };

  const confirmDeleteRecord = async () => {
    setConfirmations(prev => ({ ...prev, deleteRecord: false }));
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/project-budgets/${actionData.recordId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Refresh budget records
        const updatedRes = await fetch(`http://localhost:8080/api/project-budgets/project/${selectedProject.id}`);
        if (updatedRes.ok) {
          const updatedRecords = await updatedRes.json();
          setBudgetRecords(updatedRecords);
        }
      } else {
        setError('Failed to delete record.');
      }
    } catch {
      setError('Failed to delete record.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditingValues({});
  };

  const handleFieldChange = (field, value) => {
    setEditingValues(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return Object.values(editingValues).reduce((sum, val) => sum + Number(val || 0), 0);
  };

  const closeAllConfirmations = () => {
    setConfirmations({
      createBudget: false,
      logUsage: false,
      modifyBudget: false,
      updateRecord: false,
      deleteRecord: false
    });
  };

  return (
    <div className="budgeting-tab" style={{
      maxWidth: 1000,
      margin: '2rem auto',
      padding: '2rem',
      background: '#dff4e0',
      border: '4px solid #a5d6a7',
      borderRadius: 16,
      boxShadow: '0 2px 16px #e0f2e9',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.text
    }}>
      <h2 style={{ color: COLORS.greenDark, fontWeight: 700, marginBottom: 16, fontSize: '1.8rem' }}>Budgeting</h2>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 500, fontSize: '1.2rem' }}>
          Select Project:
          <select
            onChange={e => handleSelectProject(e.target.value)}
            value={selectedProject ? String(selectedProject.id) : ''}
            style={{
              marginLeft: 12,
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.gray,
              color: COLORS.text,
              fontWeight: 500,
              fontSize: '1rem'
            }}
            disabled={loading || projects.length === 0}
          >
            <option value="">-- Select --</option>
            {projects.map(p => (
              <option key={p.id} value={String(p.id)}>{p.name} ({p.status})</option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <div style={{ color: COLORS.red, marginBottom: 12, fontWeight: 500, fontSize: '1rem' }}>
          {error}
        </div>
      )}
      {(!loading && projects.length === 0 && !error) && (
        <div style={{ color: COLORS.greenDark, marginBottom: 12, fontWeight: 500 }}>
          No projects found.<br />
          Please add projects in the backend or check your API response.
        </div>
      )}
      {loading && <div style={{ color: COLORS.greenDark, marginBottom: 12 }}>Loading...</div>}
      {selectedProject && (
        <div style={{ marginTop: 24 }}>
          {/* Always show Create Budget card */}
          <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
            <h3 style={{ color: COLORS.greenDark, fontWeight: 600, fontSize: '1.5rem' }}>Project Details</h3>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Name:</strong> {selectedProject.name}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Status:</strong> {selectedProject.status}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Client:</strong> {selectedProject.client}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Location:</strong> {selectedProject.location}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Start Date:</strong> {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'N/A'}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>End Date:</strong> {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'N/A'}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Pre-Budget:</strong> {selectedProject.pre_budget ? `Rs. ${Number(selectedProject.pre_budget).toLocaleString()}` : 'None'}</div>
            <div style={{ marginBottom: 8, fontSize: '1.1rem' }}><strong>Current Budget:</strong> {selectedProject.curr_budget ? `Rs. ${Number(selectedProject.curr_budget).toLocaleString()}` : 'None'}</div>
        {(loggedInRole === 'Site Manager' && (selectedProject.pre_budget == null || selectedProject.pre_budget === 0) && (selectedProject.status.toLowerCase() !== 'completed') && (selectedProject.status.toLowerCase() === 'in progress' || selectedProject.status.toLowerCase() === 'ongoing') && (!selectedProject.curr_budget || selectedProject.curr_budget === 0)) && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter budget amount"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.gray,
                    color: COLORS.text,
                    fontWeight: 500
                  }}
                />
                <button
                  onClick={handleCreateBudget}
                  disabled={loading || !budgetInput}
                  style={{
                    background: COLORS.green,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    cursor: loading || !budgetInput ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 4px #e0f2e9'
                  }}
                >Create Budget</button>
              </div>
            )}
          </div>
      {/* Custom dialog popup for success messages */}
      {alerts.length > 0 && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <button className="close-btn" onClick={() => setAlerts([])}>&times;</button>
            <h2 style={{ color: COLORS.greenDark }}>Success</h2>
            <div style={{ margin: '16px 0', fontWeight: 500 }}>{alerts[alerts.length - 1]}</div>
          </div>
        </div>
      )}

          {(loggedInRole === 'Site Manager' && (selectedProject.status.toLowerCase() !== 'completed')) && (
            <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
              <h3 style={{ color: COLORS.greenDark, fontWeight: 600 }}>Log Daily Resource Usage</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Accumulative Spent:</strong> {`Rs. ${Number(accumulativeSpent).toLocaleString()}`}
              </div>
              <div style={{ margin: '12px 0' }}>
                <div style={{
                  height: 18,
                  width: '100%',
                  background: COLORS.gray,
                  borderRadius: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 1px 4px #e0f2e9'
                }}>
                  <div style={{
                    width: `${selectedProject.curr_budget ? Math.min(100, (accumulativeSpent / selectedProject.curr_budget) * 100) : 0}%`,
                    background: getBudgetStatusColor(selectedProject.curr_budget ? (accumulativeSpent / selectedProject.curr_budget) * 100 : 0),
                    height: '100%',
                    transition: 'width 0.5s'
                  }} />
                </div>
                <div style={{ fontSize: 13, color: COLORS.greenDark, marginTop: 4 }}>
                  {selectedProject.curr_budget
                    ? `${((accumulativeSpent / selectedProject.curr_budget) * 100).toFixed(1)}% of budget used`
                    : 'No budget data'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'machinery', label: 'Machinery' },
                  { key: 'materials', label: 'Materials' },
                  { key: 'labour_general', label: 'Labour General' },
                  { key: 'labour_skilled', label: 'Labour Skilled' },
                  { key: 'subcontractors', label: 'Subcontractors' },
                  { key: 'other_costs', label: 'Other Costs' }
                ].map(({ key, label }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontWeight: 500 }}>{label}:</label>
                    <input
                      type="number"
                      min="0"
                      value={dailyUsage[key] ?? ''}
                      onChange={e => setDailyUsage({ ...dailyUsage, [key]: e.target.value })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.gray,
                        color: COLORS.text,
                        fontWeight: 500
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleLogUsage}
                disabled={loading}
                style={{
                  background: COLORS.green,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontWeight: 600,
                  marginTop: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 4px #e0f2e9'
                }}
              >Log Usage</button>
              {alerts.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {alerts.map((a, i) => (
                    <div key={i} style={{ color: a === 'Overbudget!' ? COLORS.red : COLORS.yellow, fontWeight: 'bold' }}>{a}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(loggedInRole === 'Document Control Manager') && (
            <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
              <h3 style={{ color: COLORS.greenDark, fontWeight: 600 }}>Budget Monitoring & Actions</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Current Budget: </strong> {selectedProject.curr_budget ? `Rs. ${Number(selectedProject.curr_budget).toLocaleString()}` : 'None'}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Accumulative Spent: </strong> {`Rs. ${Number(accumulativeSpent).toLocaleString()}`}
              </div>
              <div style={{ margin: '12px 0' }}>
                <div style={{
                  height: 18,
                  width: '100%',
                  background: COLORS.gray,
                  borderRadius: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 1px 4px #e0f2e9'
                }}>
                  <div style={{
                    width: `${selectedProject.curr_budget ? Math.min(100, (accumulativeSpent / selectedProject.curr_budget) * 100) : 0}%`,
                    background: getBudgetStatusColor(selectedProject.curr_budget ? (accumulativeSpent / selectedProject.curr_budget) * 100 : 0),
                    height: '100%',
                    transition: 'width 0.5s'
                  }} />
                </div>
                <div style={{ fontSize: 13, color: COLORS.greenDark, marginTop: 4 }}>
                  {selectedProject.curr_budget
                    ? `${((accumulativeSpent / selectedProject.curr_budget) * 100).toFixed(1)}% of budget used`
                    : 'No budget data'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <input
                  type="number"
                  min="1"
                  placeholder="Modify current budget"
                  value={modBudget}
                  onChange={e => setModBudget(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.gray,
                    color: COLORS.text,
                    fontWeight: 500
                  }}
                />
                <button
                  onClick={handleModifyBudget}
                  disabled={loading || !modBudget}
                  style={{
                    background: COLORS.green,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    cursor: loading || !modBudget ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 4px #e0f2e9'
                  }}
                >Update Budget</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  style={{
                    background: COLORS.greenDark,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 4px #e0f2e9'
                  }}
                >Generate Budget Report</button>
                {/* Alerts for budget status */}
                {selectedProject.curr_budget && (
                  <div style={{ color: (accumulativeSpent / selectedProject.curr_budget) >= 1 ? COLORS.red : ((accumulativeSpent / selectedProject.curr_budget) >= 0.9 ? COLORS.yellow : COLORS.greenDark), fontWeight: 'bold', marginTop: 8 }}>
                    {(accumulativeSpent / selectedProject.curr_budget) >= 1
                      ? 'Overbudget!'
                      : ((accumulativeSpent / selectedProject.curr_budget) >= 0.9
                        ? 'Approaching budget limit!'
                        : '')}
                  </div>
                )}
              </div>
              {report && (
                <div style={{ marginTop: 16, background: COLORS.greenLight, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                  <h4 style={{ color: COLORS.greenDark, fontWeight: 600 }}>Budget Report</h4>
                  <pre style={{ fontSize: 13, color: COLORS.text }}>{JSON.stringify(report, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {/* Admin Combined Container - All budget management functions */}
          {(loggedInRole === 'Admin') && (
            <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
              <h3 style={{ color: COLORS.greenDark, fontWeight: 600, fontSize: '1.5rem' }}>Budgeting Section</h3>
              
              {/* Current and Accumulative Budget */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: '1.1rem' }}>
                  <strong>Current Budget: </strong> {selectedProject.curr_budget ? `Rs. ${Number(selectedProject.curr_budget).toLocaleString()}` : 'None'}
                </div>
                <div style={{ marginBottom: 8, fontSize: '1.1rem' }}>
                  <strong>Accumulative Spent: </strong> {`Rs. ${Number(accumulativeSpent).toLocaleString()}`}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ margin: '16px 0' }}>
                <div style={{
                  height: 20,
                  width: '100%',
                  background: COLORS.gray,
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 2px 6px #e0f2e9'
                }}>
                  <div style={{
                    width: `${selectedProject.curr_budget ? Math.min(100, (accumulativeSpent / selectedProject.curr_budget) * 100) : 0}%`,
                    background: getBudgetStatusColor(selectedProject.curr_budget ? (accumulativeSpent / selectedProject.curr_budget) * 100 : 0),
                    height: '100%',
                    transition: 'width 0.5s'
                  }} />
                </div>
                <div style={{ fontSize: 14, color: COLORS.greenDark, marginTop: 6, fontWeight: 500 }}>
                  {selectedProject.curr_budget
                    ? `${((accumulativeSpent / selectedProject.curr_budget) * 100).toFixed(1)}% of budget used`
                    : 'No budget data'}
                </div>
                {/* Budget status alerts */}
                {selectedProject.curr_budget && (
                  <div style={{ color: (accumulativeSpent / selectedProject.curr_budget) >= 1 ? COLORS.red : ((accumulativeSpent / selectedProject.curr_budget) >= 0.9 ? COLORS.yellow : COLORS.greenDark), fontWeight: 'bold', marginTop: 8 }}>
                    {(accumulativeSpent / selectedProject.curr_budget) >= 1
                      ? 'Overbudget!'
                      : ((accumulativeSpent / selectedProject.curr_budget) >= 0.9
                        ? 'Approaching budget limit!'
                        : '')}
                  </div>
                )}
              </div>

              {/* Update Budget */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 8 }}>Update Budget</h4>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter new budget amount"
                    value={modBudget}
                    onChange={e => setModBudget(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.gray,
                      color: COLORS.text,
                      fontWeight: 500,
                      flex: 1
                    }}
                  />
                  <button
                    onClick={handleModifyBudget}
                    disabled={loading || !modBudget}
                    style={{
                      background: COLORS.green,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 18px',
                      fontWeight: 600,
                      cursor: loading || !modBudget ? 'not-allowed' : 'pointer',
                      boxShadow: '0 1px 4px #e0f2e9'
                    }}
                  >Update Budget</button>
                </div>
              </div>

              {/* Generate Budget Report */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 8 }}>Budget Reports</h4>
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  style={{
                    background: COLORS.greenDark,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 4px #e0f2e9'
                  }}
                >Generate Budget Report</button>
                {report && (
                  <div style={{ marginTop: 12, background: COLORS.greenLight, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                    <h5 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 8 }}>Budget Report</h5>
                    <pre style={{ fontSize: 13, color: COLORS.text, margin: 0 }}>{JSON.stringify(report, null, 2)}</pre>
                  </div>
                )}
              </div>

              {/* Log Resource Usage */}
              {(selectedProject.status.toLowerCase() !== 'completed') && (
                <div>
                  <h4 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 12 }}>Log Resource Usage</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[
                      { key: 'machinery', label: 'Machinery' },
                      { key: 'materials', label: 'Materials' },
                      { key: 'labour_general', label: 'Labour General' },
                      { key: 'labour_skilled', label: 'Labour Skilled' },
                      { key: 'subcontractors', label: 'Subcontractors' },
                      { key: 'other_costs', label: 'Other Costs' }
                    ].map(({ key, label }) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontWeight: 500 }}>{label}:</label>
                        <input
                          type="number"
                          min="0"
                          value={dailyUsage[key] ?? ''}
                          onChange={e => setDailyUsage({ ...dailyUsage, [key]: e.target.value })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: `1px solid ${COLORS.border}`,
                            background: COLORS.gray,
                            color: COLORS.text,
                            fontWeight: 500
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleLogUsage}
                    disabled={loading}
                    style={{
                      background: COLORS.green,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 1px 4px #e0f2e9'
                    }}
                  >Log Resource Usage</button>
                  {alerts.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      {alerts.map((a, i) => (
                        <div key={i} style={{ color: a === 'Overbudget!' ? COLORS.red : COLORS.yellow, fontWeight: 'bold' }}>{a}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Budget Records Table for Document Control Manager */}
          {(loggedInRole === 'Document Control Manager') && budgetRecords.length > 0 && (
            <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
              <h3 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 16 }}>Budget Records</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.greenLight }}>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Machinery</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Materials</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Labour (General)</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Labour (Skilled)</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Subcontractors</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Other Costs</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Total Budget</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetRecords.map(record => (
                      <tr key={record.bgt_id}>
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{record.bgt_id}</td>
                        {editingRecord === record.bgt_id ? (
                          <>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.machinery}
                                onChange={e => handleFieldChange('machinery', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.materials}
                                onChange={e => handleFieldChange('materials', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.labour_general}
                                onChange={e => handleFieldChange('labour_general', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.labour_skilled}
                                onChange={e => handleFieldChange('labour_skilled', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.subcontractors}
                                onChange={e => handleFieldChange('subcontractors', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.other_costs}
                                onChange={e => handleFieldChange('other_costs', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600, color: COLORS.green }}>
                              {calculateTotal().toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.machinery || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.materials || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.labour_general || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.labour_skilled || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.subcontractors || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.other_costs || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>{(record.total_budget || 0).toFixed(2)}</td>
                          </>
                        )}
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>
                          {record.allocated_date ? new Date(record.allocated_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>
                          {editingRecord === record.bgt_id ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleSaveRecord(record.bgt_id)}
                                disabled={loading}
                                style={{
                                  background: COLORS.green,
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                              >Save</button>
                              <button
                                onClick={handleCancelEdit}
                                style={{
                                  background: COLORS.gray,
                                  color: COLORS.text,
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >Cancel</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleEditRecord(record)}
                                style={{
                                  background: COLORS.greenDark,
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >Edit</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Budget Records Table for Admin */}
          {(loggedInRole === 'Admin') && budgetRecords.length > 0 && (
            <div style={{ marginBottom: 32, padding: 20, background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: '0 1px 8px #e0f2e9' }}>
              <h3 style={{ color: COLORS.greenDark, fontWeight: 600, marginBottom: 16 }}>Budget Records</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.greenLight }}>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Machinery</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Materials</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Labour (General)</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Labour (Skilled)</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Subcontractors</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Other Costs</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Total Budget</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetRecords.map(record => (
                      <tr key={record.bgt_id}>
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{record.bgt_id}</td>
                        {editingRecord === record.bgt_id ? (
                          <>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.machinery}
                                onChange={e => handleFieldChange('machinery', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.materials}
                                onChange={e => handleFieldChange('materials', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.labour_general}
                                onChange={e => handleFieldChange('labour_general', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.labour_skilled}
                                onChange={e => handleFieldChange('labour_skilled', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.subcontractors}
                                onChange={e => handleFieldChange('subcontractors', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '4px', border: `1px solid ${COLORS.border}` }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingValues.other_costs}
                                onChange={e => handleFieldChange('other_costs', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: `1px solid ${COLORS.border}`, borderRadius: 4 }}
                              />
                            </td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600, color: COLORS.green }}>
                              {calculateTotal().toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.machinery || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.materials || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.labour_general || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.labour_skilled || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.subcontractors || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>{(record.other_costs || 0).toFixed(2)}</td>
                            <td style={{ padding: '8px', border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>{(record.total_budget || 0).toFixed(2)}</td>
                          </>
                        )}
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>
                          {record.allocated_date ? new Date(record.allocated_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '8px', border: `1px solid ${COLORS.border}` }}>
                          {editingRecord === record.bgt_id ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleSaveRecord(record.bgt_id)}
                                disabled={loading}
                                style={{
                                  background: COLORS.green,
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                              >Save</button>
                              <button
                                onClick={handleCancelEdit}
                                style={{
                                  background: COLORS.gray,
                                  color: COLORS.text,
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >Cancel</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleEditRecord(record)}
                                style={{
                                  background: COLORS.greenDark,
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >Edit</button>
                              {loggedInRole === 'Admin' && (
                                <button
                                  onClick={() => handleDeleteRecord(record.bgt_id)}
                                  disabled={loading}
                                  style={{
                                    background: COLORS.red,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                  }}
                                >Delete</button>
                              )}
                            </div>
                          )}
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
      
      {/* Confirmation Dialogs */}
      <ConfirmationModal
        open={confirmations.createBudget}
        onClose={() => setConfirmations(prev => ({ ...prev, createBudget: false }))}
        onConfirm={confirmCreateBudget}
        title="Confirm Budget Creation"
        message={`Are you sure you want to create a budget of Rs. ${Number(actionData.budgetAmount || 0).toLocaleString()} for ${selectedProject?.project_name || 'this project'}?`}
        confirmText="Create Budget"
        cancelText="Cancel"
      />
      
      <ConfirmationModal
        open={confirmations.logUsage}
        onClose={() => setConfirmations(prev => ({ ...prev, logUsage: false }))}
        onConfirm={confirmLogUsage}
        title="Confirm Resource Usage Log"
        message={`Are you sure you want to log resource usage totaling Rs. ${Number(actionData.totalAmount || 0).toLocaleString()}?`}
        confirmText="Log Usage"
        cancelText="Cancel"
      />
      
      <ConfirmationModal
        open={confirmations.modifyBudget}
        onClose={() => setConfirmations(prev => ({ ...prev, modifyBudget: false }))}
        onConfirm={confirmModifyBudget}
        title="Confirm Budget Modification"
        message={`Are you sure you want to modify the current budget to Rs. ${Number(actionData.newBudget || 0).toLocaleString()}?`}
        confirmText="Modify Budget"
        cancelText="Cancel"
      />
      
      <ConfirmationModal
        open={confirmations.updateRecord}
        onClose={() => setConfirmations(prev => ({ ...prev, updateRecord: false }))}
        onConfirm={confirmSaveRecord}
        title="Confirm Record Update"
        message={`Are you sure you want to update this budget record with a total of Rs. ${Number(actionData.totalBudget || 0).toLocaleString()}?`}
        confirmText="Update Record"
        cancelText="Cancel"
      />
      
      <ConfirmationModal
        open={confirmations.deleteRecord}
        onClose={() => setConfirmations(prev => ({ ...prev, deleteRecord: false }))}
        onConfirm={confirmDeleteRecord}
        title="Confirm Record Deletion"
        message="Are you sure you want to delete this budget record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
