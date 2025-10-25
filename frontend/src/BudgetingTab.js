import React, { useState, useEffect } from 'react';

// Enhanced color palette with modern gradients
const COLORS = {
  green: '#27ae60',
  greenDark: '#205c20',
  greenLight: '#eaf7ea',
  greenGradient: 'linear-gradient(135deg, #336504 0%, #369A06 100%)',
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

function MergeReplaceModal({ open, onClose, onMerge, onReplace, newData, existingData }) {
  if (!open || !existingData) return null;

  const fields = ['machinery', 'materials', 'labour_general', 'labour_skilled', 'subcontractors', 'other_costs'];

  const mergedData = fields.reduce((acc, field) => {
    acc[field] = (Number(existingData[field] || 0) + Number(newData[field] || 0));
    return acc;
  }, {});
  const totalMerged = Object.values(mergedData).reduce((sum, val) => sum + Number(val), 0);

  const replacedData = fields.reduce((acc, field) => {
    acc[field] = (Number(newData[field] || 0));
    return acc;
  }, {});
  const totalReplaced = Object.values(replacedData).reduce((sum, val) => sum + Number(val), 0);

  const renderPreview = (data, total) => (
    <div style={{ textAlign: 'left', fontSize: '0.9rem', color: COLORS.text }}>
      {fields.map(field => (
        <div key={field} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
          <span>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
          <strong>{data[field].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      ))}
      <hr style={{ border: 0, borderTop: `1px solid ${COLORS.border}`, margin: '8px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total:</span>
        <span>Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '700px', width: '90%',
        textAlign: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: COLORS.greenDark }}>Budget Entry Exists for Today</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#555' }}>
          An entry for today already exists. Please choose to merge with the existing entry or replace it entirely.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '2rem' }}>
          <div style={{ flex: 1, border: `2px solid ${COLORS.green}`, padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: COLORS.green, margin: '0 0 10px 0' }}>If Merging</h4>
            {renderPreview(mergedData, totalMerged)}
          </div>
          <div style={{ flex: 1, border: `2px solid ${COLORS.yellow}`, padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: COLORS.yellow, margin: '0 0 10px 0' }}>If Replacing</h4>
            {renderPreview(replacedData, totalReplaced)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onMerge} style={{ background: COLORS.green, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Merge</button>
          <button onClick={onReplace} style={{ background: COLORS.yellow, color: '#222', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Replace</button>
          <button onClick={onClose} style={{ background: COLORS.red, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AlertModal({ open, onClose, title, message }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%',
        textAlign: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none',
            fontSize: '1.5rem', cursor: 'pointer', color: '#999'
          }}
        >&times;</button>
        <h3 style={{ margin: '0 0 1rem 0', color: COLORS.greenDark }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#555', lineHeight: '1.4' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: COLORS.green, color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 20px', fontWeight: '600', cursor: 'pointer', minWidth: '100px'
            }}
          >OK</button>
        </div>
      </div>
    </div>
  );
}

function getBudgetStatusColor(percent) {
  if (percent >= 100) return COLORS.red;
  if (percent >= 85) return COLORS.yellow;
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
  // States for Admin's merge/replace functionality
  const [mergeReplaceModalOpen, setMergeReplaceModalOpen] = useState(false);
  const [existingDailyRecord, setExistingDailyRecord] = useState(null);
  const [alertModalInfo, setAlertModalInfo] = useState({ open: false, title: '', message: '' });

  // Project search and filtering states
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    client: '',
    location: '',
    budgetStatus: '', // 'overbudget', 'within-budget', 'approaching-limit', 'no-budget-logged'
    startDateFrom: '',
    startDateTo: ''
  });
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const [projectBudgetData, setProjectBudgetData] = useState({});

  // Confirmation dialog states
  const [confirmations, setConfirmations] = useState({
    createBudget: false,
    logUsage: false,
    modifyBudget: false,
    updateRecord: false,
    deleteRecord: false
  });
  const [actionData, setActionData] = useState({});

  // Fetch projects on mount and periodically
  useEffect(() => {
    const fetchAllProjects = (isInitialLoad = false) => {
      if (isInitialLoad) setLoading(true);
      fetch('http://localhost:8080/api/projects')
        .then(res => res.json())
        .then(data => {
          setProjects(data);
          if (isInitialLoad) setFilteredProjects(data);
        })
        .catch(() => setError('Failed to load projects'))
        .finally(() => {
          if (isInitialLoad) setLoading(false);
        });
    };

    fetchAllProjects(true); // Initial load
    const interval = setInterval(() => fetchAllProjects(false), 500);

    return () => clearInterval(interval);
  }, []);

  // Fetch budget data when projects change
  useEffect(() => {
    if (projects.length > 0) {
      fetchProjectBudgetData();
    }
  }, [projects]);

  // Apply filters when search criteria or projects change
  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    }
  }, [searchFilters, projects, projectBudgetData]);

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
        // BUG FIX: Always fetch budget records for all roles to check for today's entry.
        // The UI will still only display the table for authorized roles.
        fetch(`http://localhost:8080/api/project-budgets/project/${selectedProject.id}`)
          .then(res => res.json())
          .then(data => setBudgetRecords(data))
          .catch(() => setBudgetRecords([]));
      }, 250);
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

    const today = new Date().toISOString().split('T')[0];
    const existingRecord = budgetRecords.find(record => 
        record.allocated_date && record.allocated_date.startsWith(today)
    );

    if (existingRecord) {
        if (loggedInRole === 'Admin') {
            setExistingDailyRecord(existingRecord);
            setMergeReplaceModalOpen(true);
            return;
        } else {
            // Show a modal prompt for Site Manager instead of the text error
            setAlertModalInfo({
                open: true,
                title: 'Entry Exists for Today',
                message: 'A budget has already been logged for today. To make any changes, please contact an Administrator.'
            });
            return;
        }
    }
    
    setActionData({ usageData: dailyUsage, totalAmount });
    setConfirmations(prev => ({ ...prev, logUsage: true }));
  };

  const confirmMergeUsage = async () => {
    setMergeReplaceModalOpen(false);
    if (!existingDailyRecord || !dailyUsage) return;
    setLoading(true);
    setError('');
    try {
      const fields = ['machinery', 'materials', 'labour_general', 'labour_skilled', 'subcontractors', 'other_costs'];
      const mergedData = fields.reduce((acc, field) => {
        acc[field] = Number(existingDailyRecord[field] || 0) + Number(dailyUsage[field] || 0);
        return acc;
      }, {});
      const totalBudget = Object.values(mergedData).reduce((sum, val) => sum + val, 0);
      
      const res = await fetch(`http://localhost:8080/api/project-budgets/${existingDailyRecord.bgt_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mergedData, total_budget: totalBudget })
      });
      if (res.ok) {
        setDailyUsage({ machinery: '', materials: '', labour_general: '', labour_skilled: '', subcontractors: '', other_costs: '' });
        setExistingDailyRecord(null);
      } else {
        setError('Failed to merge budget record.');
      }
    } catch {
      setError('Failed to merge budget record.');
    } finally {
      setLoading(false);
    }
  };

  const confirmReplaceUsage = async () => {
    setMergeReplaceModalOpen(false);
    if (!existingDailyRecord || !dailyUsage) return;
    setLoading(true);
    setError('');
    try {
      const totalBudget = Object.values(dailyUsage).reduce((sum, val) => sum + Number(val || 0), 0);
      const res = await fetch(`http://localhost:8080/api/project-budgets/${existingDailyRecord.bgt_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dailyUsage, total_budget: totalBudget })
      });
      if (res.ok) {
        setDailyUsage({ machinery: '', materials: '', labour_general: '', labour_skilled: '', subcontractors: '', other_costs: '' });
        setExistingDailyRecord(null);
      } else {
        setError('Failed to replace budget record.');
      }
    } catch {
      setError('Failed to replace budget record.');
    } finally {
      setLoading(false);
    }
  };

  const confirmLogUsage = async () => {
    setConfirmations(prev => ({ ...prev, logUsage: false }));
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    try {
      // Calculate total budget from resource usage
      const totalBudget = Object.values(actionData.usageData).reduce((sum, value) => sum + Number(value || 0), 0);
      
      // Add current date to the usage data
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      const res = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...actionData.usageData, 
          total_budget: totalBudget,
          allocated_date: today 
        })
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

  // Helper function to check if a project's budget was logged today
  const isBudgetLoggedToday = async (projectId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}/budgets`);
      if (res.ok) {
        const records = await res.json();
        return records.some(record => 
          record.allocated_date && record.allocated_date.split('T')[0] === today
        );
      }
    } catch (error) {
      console.error('Error checking budget log:', error);
    }
    return false;
  };

  // Filter projects based on search criteria
  const filterProjects = async () => {
    if (!projects || projects.length === 0) {
      setFilteredProjects([]);
      return;
    }

    let filtered = [...projects];

    // Filter by name
    if (searchFilters.name) {
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }

    // Filter by client
    if (searchFilters.client) {
      filtered = filtered.filter(project => 
        project.client?.toLowerCase().includes(searchFilters.client.toLowerCase())
      );
    }

    // Filter by location
    if (searchFilters.location) {
      filtered = filtered.filter(project => 
        project.location?.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Filter by start date range
    if (searchFilters.startDateFrom || searchFilters.startDateTo) {
      filtered = filtered.filter(project => {
        if (!project.start_date) return false;
        const projectDate = new Date(project.start_date).getTime();
        const fromDate = searchFilters.startDateFrom ? new Date(searchFilters.startDateFrom).getTime() : 0;
        const toDate = searchFilters.startDateTo ? new Date(searchFilters.startDateTo).getTime() : Date.now();
        return projectDate >= fromDate && projectDate <= toDate;
      });
    }

    // Filter by budget status (this requires async operations)
    if (searchFilters.budgetStatus) {
      const budgetFiltered = [];
      for (const project of filtered) {
        let includeProject = false;
        
        const spent = projectBudgetData[project.id]?.spent || 0;
        const budget = project.curr_budget || 0;

        if (searchFilters.budgetStatus === 'overbudget') {
          includeProject = budget > 0 && spent >= budget;
        } else if (searchFilters.budgetStatus === 'within-budget') {
          if (budget > 0) {
            const percentage = spent / budget;
            includeProject = percentage < 0.85;
          }
        } else if (searchFilters.budgetStatus === 'approaching-limit') {
          if (budget > 0) {
            const percentage = spent / budget;
            includeProject = percentage >= 0.85 && percentage < 1;
          }
        } else if (searchFilters.budgetStatus === 'no-budget-logged') {
          includeProject = !(await isBudgetLoggedToday(project.id));
        }
        
        if (includeProject) {
          budgetFiltered.push(project);
        }
      }
      filtered = budgetFiltered;
    }

    setFilteredProjects(filtered);
    // setCurrentPage(1); // Reset to first page when filtering
  };

  // Fetch budget data for all projects (for filtering)
  const fetchProjectBudgetData = async () => {
    const budgetData = {};
    for (const project of projects) {
      try {
        const res = await fetch(`http://localhost:8080/api/projects/${project.id}/budgets/sum`);
        if (res.ok) {
          const data = await res.json();
          budgetData[project.id] = { spent: data.sum || 0 };
        }
      } catch (error) {
        console.error(`Error fetching budget data for project ${project.id}:`, error);
      }
    }
    setProjectBudgetData(budgetData);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setCurrentPage(1); // Reset to page 1 on any filter change
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setCurrentPage(1); // Reset to page 1 on any filter change
    setSearchFilters({
      name: '',
      client: '',
      location: '',
      budgetStatus: '',
      startDateFrom: '',
      startDateTo: ''
    });
  };

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="budgeting-tab" style={{
      maxWidth: 1200,
      margin: '2rem auto',
      padding: '0',
      fontFamily: '"Segoe UI", Arial, sans-serif',
      color: COLORS.text
    }}>
      {/* Modern Header */}
      <div style={{
        background: COLORS.greenGradient,
        padding: '1.5rem 2rem',
        borderRadius: '20px 20px 0 0',
        color: 'white',
        boxShadow: COLORS.shadow
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2rem', 
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Project Budgeting Dashboard
        </h1>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '1.2rem', 
          opacity: 0.9 
        }}>
          Manage budgets, track expenses, and monitor project financial health
        </p>
      </div>

      {/* Main Content Container */}
      <div style={{
        background: 'white',
        padding: '2rem 3rem',
        borderRadius: '0 0 20px 20px',
        boxShadow: COLORS.shadow,
        minHeight: '600px'
      }}>
        
        {/* Search and Filter Section */}
        <div style={{
          background: COLORS.grayLight,
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: `1px solid ${COLORS.borderLight}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            color: COLORS.greenDark, 
            margin: '0 0 1rem 0',
            fontSize: '1.3rem',
            fontWeight: 600
          }}>
            Search & Filter Projects
          </h3>
          
          {/* Search Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Project Name
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchFilters.name}
                onChange={e => handleFilterChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '90%',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Client
              </label>
              <input
                type="text"
                placeholder="Search by client..."
                value={searchFilters.client}
                onChange={e => handleFilterChange('client', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '90%',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Location
              </label>
              <input
                type="text"
                placeholder="Search by location..."
                value={searchFilters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '90%',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              />
            </div>
          </div>

          {/* Search Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Budget Status
              </label>
              <select
                value={searchFilters.budgetStatus}
                onChange={e => handleFilterChange('budgetStatus', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              >
                <option value="">All Projects</option>
                <option value="overbudget">Over Budget</option>
                <option value="within-budget">Within Budget</option>
                <option value="approaching-limit">Approaching Limit</option>
                <option value="no-budget-logged">No Budget Logged Today</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Start Date From
              </label>
              <input
                type="date"
                value={searchFilters.startDateFrom}
                onChange={e => handleFilterChange('startDateFrom', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '90%',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: COLORS.textLight }}>
                Start Date To
              </label>
              <input
                type="date"
                value={searchFilters.startDateTo}
                onChange={e => handleFilterChange('startDateTo', e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '90%',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
              />
            </div>
            
            <button
              onClick={clearFilters}
              style={{
                padding: '11px 15px',
                background: COLORS.red,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: `1px solid ${COLORS.borderLight}`,
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            background: COLORS.greenLight,
            padding: '1rem 1.5rem',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: COLORS.greenDark, 
              fontSize: '1.2rem',
              fontWeight: 600 
            }}>
              Projects ({filteredProjects.length} found)
            </h3>
            <div style={{ fontSize: '0.9rem', color: COLORS.textLight }}>
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: COLORS.textLight }}>
              <div style={{ fontSize: '1.1rem' }}>Loading projects...</div>
            </div>
          ) : currentProjects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: COLORS.textLight }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No projects found</div>
              <div style={{ fontSize: '0.9rem' }}>Try adjusting your search filters</div>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.grayLight }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Name</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Client</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Location</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Budget</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Progress</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: COLORS.greenDark, borderBottom: `1px solid ${COLORS.border}` }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProjects.map(project => {
                      const spent = projectBudgetData[project.id]?.spent || 0;
                      const budget = project.curr_budget || 0;
                      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                      const isSelected = selectedProject?.id === project.id;
                      
                      return (
                        <tr 
                          key={project.id}
                          style={{
                            background: isSelected ? COLORS.greenLight : 'white',
                            borderBottom: `1px solid ${COLORS.borderLight}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = isSelected ? COLORS.greenLight : COLORS.grayLight}
                          onMouseOut={e => e.currentTarget.style.background = isSelected ? COLORS.greenLight : 'white'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 500 }}>{project.name}</td>
                          <td style={{ padding: '12px 16px' }}>{project.client}</td>
                          <td style={{ padding: '12px 16px' }}>{project.location}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              background: project.status.toLowerCase() === 'completed' ? COLORS.green : 
                                         project.status.toLowerCase().includes('progress') ? COLORS.yellow : COLORS.gray,
                              color: project.status.toLowerCase() === 'completed' ? 'white' : COLORS.text
                            }}>
                              {project.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {budget > 0 ? `Rs. ${budget.toLocaleString()}` : 'Not set'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {budget > 0 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '60px',
                                  height: '8px',
                                  background: COLORS.gray,
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${Math.min(100, percentage)}%`,
                                    height: '100%',
                                    background: getBudgetStatusColor(percentage),
                                    transition: 'width 0.3s'
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', color: COLORS.textLight }}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: COLORS.textLight }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleSelectProject(project.id)}
                              style={{
                                padding: '6px 12px',
                                background: isSelected ? COLORS.green : COLORS.greenDark,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => e.target.style.transform = 'translateY(-1px)'}
                              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                            >
                              {isSelected ? '✓ Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: '1rem 1.5rem',
                  borderTop: `1px solid ${COLORS.borderLight}`,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      background: 'white',
                      color: COLORS.text,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          padding: '6px 12px',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '6px',
                          background: currentPage === pageNum ? COLORS.green : 'white',
                          color: currentPage === pageNum ? 'white' : COLORS.text,
                          cursor: 'pointer',
                          fontWeight: currentPage === pageNum ? 600 : 400
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      background: 'white',
                      color: COLORS.text,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Error Messages */}
        {error && (
          <div style={{ 
            color: COLORS.red, 
            marginBottom: '1rem', 
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
        
        {(!loading && projects.length === 0 && !error) && (
          <div style={{ 
            color: COLORS.textLight, 
            marginBottom: '1rem', 
            padding: '2rem',
            textAlign: 'center',
            background: COLORS.grayLight,
            borderRadius: '8px',
            border: `1px solid ${COLORS.borderLight}`
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📂 No projects found</div>
            <div style={{ fontSize: '0.9rem' }}>Please add projects in the backend or check your API response.</div>
          </div>
        )}
        {/* Selected Project Management Section */}
        {selectedProject && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: `1px solid ${COLORS.borderLight}`,
            overflow: 'hidden',
            boxShadow: COLORS.shadow
          }}>
            {/* Selected Project Header */}
            <div style={{
              background: COLORS.greenGradient,
              padding: '1.5rem',
              color: 'white'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Managing: {selectedProject.name}
              </h2>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                opacity: 0.9,
                fontSize: '1.1rem'
              }}>
                {selectedProject.client} • {selectedProject.location} • {selectedProject.status}
              </p>
            </div>

            {/* Project Management Content */}
            <div style={{ padding: '2rem' }}>
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

            {/* Show budget summary ONLY if the project is completed */}
            {selectedProject.status.toLowerCase() === 'completed' && (
              <>
                <div style={{ marginBottom: 8, fontSize: '1.1rem' }}>
                  <strong>Accumulative Spent:</strong> {`Rs. ${Number(accumulativeSpent).toLocaleString()}`}
                </div>
                {/* Budget Progress Bar */}
                {selectedProject.curr_budget > 0 && (
                  <div style={{ margin: '12px 0' }}>
                    <div style={{ height: 18, width: '100%', background: COLORS.gray, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        width: `${Math.min(100, (accumulativeSpent / selectedProject.curr_budget) * 100)}%`,
                        background: getBudgetStatusColor((accumulativeSpent / selectedProject.curr_budget) * 100),
                        height: '100%',
                        transition: 'width 0.5s'
                      }} />
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.greenDark, marginTop: 4 }}>
                      {`${((accumulativeSpent / selectedProject.curr_budget) * 100).toFixed(1)}% of budget used`}
                    </div>
                  </div>
                )}
              </>
            )}
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

          {(loggedInRole === 'Document Control Manager' && selectedProject.status.toLowerCase() !== 'completed') && (
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
                {selectedProject.curr_budget > 0 && (
                  <div style={{ color: (accumulativeSpent / selectedProject.curr_budget) >= 1 ? COLORS.red : ((accumulativeSpent / selectedProject.curr_budget) >= 0.85 ? COLORS.yellow : COLORS.greenDark), fontWeight: 'bold', marginTop: 8 }}>
                    {(accumulativeSpent / selectedProject.curr_budget) >= 1
                      ? 'Overbudget!'
                      : ((accumulativeSpent / selectedProject.curr_budget) >= 0.85
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
          {(loggedInRole === 'Admin' && (selectedProject.status.toLowerCase() !== 'completed')) && (
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
                {selectedProject.curr_budget > 0 && (
                  <div style={{ color: (accumulativeSpent / selectedProject.curr_budget) >= 1 ? COLORS.red : ((accumulativeSpent / selectedProject.curr_budget) >= 0.85 ? COLORS.yellow : COLORS.greenDark), fontWeight: 'bold', marginTop: 8 }}>
                    {(accumulativeSpent / selectedProject.curr_budget) >= 1
                      ? 'Overbudget!'
                      : ((accumulativeSpent / selectedProject.curr_budget) >= 0.85
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
          {(loggedInRole === 'Document Control Manager'&& (selectedProject.status.toLowerCase() !== 'completed')) && budgetRecords.length > 0 && (
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
          {(loggedInRole === 'Admin'&& (selectedProject.status.toLowerCase() !== 'completed')) && budgetRecords.length > 0 && (
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

      {/* Admin's Merge/Replace Modal */}
      <MergeReplaceModal
        open={mergeReplaceModalOpen}
        onClose={() => setMergeReplaceModalOpen(false)}
        onMerge={confirmMergeUsage}
        onReplace={confirmReplaceUsage}
        newData={dailyUsage}
        existingData={existingDailyRecord}
      />

        {/* Informational Alert Modal */}
        <AlertModal
          open={alertModalInfo.open}
          onClose={() => setAlertModalInfo({ open: false, title: '', message: '' })}
          title={alertModalInfo.title}
          message={alertModalInfo.message}
        />
      </div>
    </div>
  );
}
