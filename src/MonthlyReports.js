import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import './App.css';

// Register Chart.js components once
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

// MonthlyReports component - A clean, standalone monthly reports page
function MonthlyReports({ loggedInRole, loggedInUser }) {
  // State management
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  
  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    dailyLogs: [],
    projectBudget: null,
    historicalReports: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  // Form states
  const [generateForm, setGenerateForm] = useState({
    projectId: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Filter states
  const [filters, setFilters] = useState({
    projectId: '',
    status: '', // No default filter - show all reports
    year: '',
    month: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadProjects();
    loadMonthlyReports();
  }, []);

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

  // Load monthly reports from backend
  const loadMonthlyReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/monthly-reports');
      const data = await response.json();
      setMonthlyReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading monthly reports:', error);
      setError('Failed to load monthly reports');
    } finally {
      setLoading(false);
    }
  };

  // Check if report already exists for the selected project and period
  const checkExistingReport = () => {
    const existingReport = monthlyReports.find(report => 
      report.projectId === parseInt(generateForm.projectId) &&
      report.reportYear === generateForm.year &&
      report.reportMonth === generateForm.month
    );
    return existingReport;
  };

  // Generate new monthly report
  const generateReport = async (overwrite = false) => {
    if (!generateForm.projectId) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        projectId: generateForm.projectId,
        year: generateForm.year.toString(),
        month: generateForm.month.toString(),
        overwrite: overwrite.toString()
      });

      const response = await fetch(`http://localhost:8080/api/monthly-reports/generate?${params}`, {
        method: 'POST',
        headers: {
          'X-User-Id': loggedInUser || 'admin',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const message = responseData.message || (responseData.overwritten ? 'Monthly report overwritten successfully!' : 'Monthly report generated successfully!');
        setSuccess(message);
        setShowGenerateModal(false);
        setGenerateForm({
          projectId: '',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        });
        loadMonthlyReports(); // Reload reports
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Handle generate button click with overwrite confirmation
  const handleGenerateClick = () => {
    const existingReport = checkExistingReport();
    if (existingReport) {
      const projectName = getProjectName(parseInt(generateForm.projectId));
      const monthName = new Date(generateForm.year, generateForm.month - 1).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (window.confirm(
        `A monthly report already exists for ${projectName} for ${monthName}.\n\n` +
        `Do you want to overwrite the existing report?\n\n` +
        `Click OK to overwrite, or Cancel to abort.`
      )) {
        generateReport(true);
      }
    } else {
      generateReport(false);
    }
  };

  // Download monthly report as PDF
  const downloadReport = async (reportId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/monthly-reports/${reportId}/download`, {
        method: 'GET',
        headers: {
          'X-User-Id': loggedInUser || 'admin',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'MonthlyReport.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setSuccess('Report downloaded successfully!');
      } else {
        setError('Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  // Load analytics data for a report
  const loadAnalyticsData = async (report) => {
    setAnalyticsLoading(true);
    try {
      // Load daily logs for the report period
      const startDate = new Date(report.reportYear, report.reportMonth - 1, 1);
      const endDate = new Date(report.reportYear, report.reportMonth, 0);
      
      const dailyLogsResponse = await fetch(`http://localhost:8080/api/daily-logs/project/${report.projectId}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
      const dailyLogs = dailyLogsResponse.ok ? await dailyLogsResponse.json() : [];
      
      // Load project budget if available
      let projectBudget = null;
      try {
        const budgetResponse = await fetch(`http://localhost:8080/api/project-budgets/project/${report.projectId}`);
        if (budgetResponse.ok) {
          projectBudget = await budgetResponse.json();
        }
      } catch (error) {
        console.log('No budget data available');
      }
      
      // Load historical reports for trend analysis
      const historicalResponse = await fetch(`http://localhost:8080/api/monthly-reports/project/${report.projectId}`);
      const historicalReports = historicalResponse.ok ? await historicalResponse.json() : [];
      
      setAnalyticsData({
        dailyLogs: Array.isArray(dailyLogs) ? dailyLogs : [],
        projectBudget,
        historicalReports: Array.isArray(historicalReports) ? historicalReports : []
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setAnalyticsData({
        dailyLogs: [],
        projectBudget: null,
        historicalReports: []
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // View report details
  const viewReport = async (report) => {
    setViewingReport(report);
    setShowViewModal(true);
    
    // Fetch full report details for analytics
    try {
      const response = await fetch(`http://localhost:8080/api/monthly-reports/${report.reportId}`);
      if (response.ok) {
        const fullReport = await response.json();
        setViewingReport(fullReport); // Update with full report data
      }
    } catch (error) {
      console.error('Error fetching full report details:', error);
    }
    
    await loadAnalyticsData(report);
  };

  // Approve report
  const approveReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/monthly-reports/${reportId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': loggedInUser || 'admin',
        },
      });

      if (response.ok) {
        setSuccess('Report approved successfully!');
        loadMonthlyReports();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to approve report' }));
        setError(errorData.error || 'Failed to approve report');
      }
    } catch (error) {
      console.error('Error approving report:', error);
      setError('Failed to approve report');
    }
  };

  // Reject report
  const rejectReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/monthly-reports/${reportId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': loggedInUser || 'admin',
        },
      });

      if (response.ok) {
        setSuccess('Report rejected successfully!');
        loadMonthlyReports();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to reject report' }));
        setError(errorData.error || 'Failed to reject report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      setError('Failed to reject report');
    }
  };

  // Submit report for approval
  const submitReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/monthly-reports/${reportId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': loggedInUser || 'admin',
        },
      });

      if (response.ok) {
        setSuccess('Report submitted for approval successfully!');
        loadMonthlyReports();
      } else {
        setError('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Failed to submit report');
    }
  };

  // Delete monthly report
  const deleteReport = async (reportId, reportStatus) => {
    const report = monthlyReports.find(r => r.reportId === reportId);
    const projectName = report ? getReportProjectName(report) : 'Unknown Project';
    const monthName = report ? new Date(report.reportYear, report.reportMonth - 1).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }) : 'Unknown Period';

    const confirmMessage = `Are you sure you want to delete the ${reportStatus.toLowerCase()} monthly report for ${projectName} (${monthName})?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`http://localhost:8080/api/monthly-reports/${reportId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': loggedInRole || 'Admin',
          },
        });

        if (response.ok) {
          setSuccess('Report deleted successfully!');
          loadMonthlyReports();
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Failed to delete report' }));
          setError(errorData.error || 'Failed to delete report');
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        setError('Failed to delete report');
      }
    }
  };

  // Filter reports based on current filters
  const filteredReports = monthlyReports.filter(report => {
    const projectMatch = !filters.projectId || report.projectId === parseInt(filters.projectId);
    const statusMatch = !filters.status || report.status === filters.status;
    const yearMatch = !filters.year || report.reportYear === parseInt(filters.year);
    const monthMatch = !filters.month || report.reportMonth === parseInt(filters.month);
    
    return projectMatch && statusMatch && yearMatch && monthMatch;
  });

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Get project name from report data (backend already includes projectName)
  const getReportProjectName = (report) => {
    return report.projectName || getProjectName(report.projectId);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'DRAFT': return '#f39c12';
      case 'SUBMITTED': return '#3498db';
      case 'APPROVED': return '#27ae60';
      case 'REJECTED': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Analytics helper functions
  const calculateCostBreakdown = (report) => {
    // Check if we have individual cost breakdowns (excluding materials)
    const hasDetailedCosts = report.totalLaborCost !== undefined || 
                            report.totalMachineryCost !== undefined;
    
    if (hasDetailedCosts) {
      const labor = Number(report.totalLaborCost) || 0;
      const machinery = Number(report.totalMachineryCost) || 0;
      const total = labor + machinery;
      
      return {
        labor: { value: labor, percentage: total > 0 ? (labor / total * 100) : 0 },
        machinery: { value: machinery, percentage: total > 0 ? (machinery / total * 100) : 0 },
        total,
        hasDetailedData: true
      };
    } else {
      // Fallback: estimate breakdown from total cost if detailed costs not available
      const totalCost = Number(report.totalCost) || 0;
      const estimatedLabor = totalCost * 0.6;    // Estimate 60% labor
      const estimatedMachinery = totalCost * 0.4; // Estimate 40% machinery
      
      return {
        labor: { value: estimatedLabor, percentage: 60 },
        machinery: { value: estimatedMachinery, percentage: 40 },
        total: totalCost,
        hasDetailedData: false
      };
    }
  };

  const calculateResourceUtilization = (report) => {
    const laborHours = Number(report.totalLaborHours) || 0;
    const machineryHours = Number(report.totalMachineryHours) || 0;
    const totalHours = laborHours + machineryHours;
    
    return {
      laborHours,
      machineryHours,
      totalHours,
      laborPercentage: totalHours > 0 ? (laborHours / totalHours * 100) : 0,
      machineryPercentage: totalHours > 0 ? (machineryHours / totalHours * 100) : 0
    };
  };

  const calculateEfficiencyMetrics = (report) => {
    const workDays = Number(report.workDays) || 0;
    const totalHours = (Number(report.totalLaborHours) || 0) + (Number(report.totalMachineryHours) || 0);
    const totalCost = Number(report.totalCost) || 0;
    
    return {
      avgHoursPerDay: workDays > 0 ? (totalHours / workDays) : 0,
      avgCostPerHour: totalHours > 0 ? (totalCost / totalHours) : 0,
      avgCostPerDay: workDays > 0 ? (totalCost / workDays) : 0,
      workDays,
      totalHours,
      totalCost
    };
  };

  const getMaterialsAnalysis = (dailyLogs) => {
    const materialsCount = {};
    dailyLogs.forEach(log => {
      if (log.materialsUsed) {
        const materials = log.materialsUsed.split(',').map(m => m.trim());
        materials.forEach(material => {
          if (material) {
            materialsCount[material] = (materialsCount[material] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(materialsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10 materials
  };

  const getTeamPerformance = (dailyLogs) => {
    const teamStats = {};
    dailyLogs.forEach(log => {
      if (log.createdBy) {
        if (!teamStats[log.createdBy]) {
          teamStats[log.createdBy] = {
            logs: 0,
            laborHours: 0,
            machineryHours: 0
          };
        }
        teamStats[log.createdBy].logs++;
        teamStats[log.createdBy].laborHours += Number(log.laborHours) || 0;
        teamStats[log.createdBy].machineryHours += Number(log.machineryHours) || 0;
      }
    });
    
    return Object.entries(teamStats).map(([member, stats]) => ({
      member,
      ...stats,
      totalHours: stats.laborHours + stats.machineryHours
    }));
  };

  const getTrendData = (historicalReports, currentReport) => {
    const sortedReports = historicalReports
      .filter(r => r.reportId !== currentReport.reportId)
      .sort((a, b) => {
        if (a.reportYear !== b.reportYear) return a.reportYear - b.reportYear;
        return a.reportMonth - b.reportMonth;
      });
    
    const labels = sortedReports.map(r => 
      new Date(r.reportYear, r.reportMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );
    
    return {
      labels: [...labels, new Date(currentReport.reportYear, currentReport.reportMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })],
      costs: [...sortedReports.map(r => Number(r.totalCost) || 0), Number(currentReport.totalCost) || 0],
      productivity: [...sortedReports.map(r => Number(r.productivityScore) || 0), Number(currentReport.productivityScore) || 0],
      workDays: [...sortedReports.map(r => Number(r.workDays) || 0), Number(currentReport.workDays) || 0]
    };
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#205c20', 
          marginBottom: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          Monthly Reports
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          marginBottom: '1rem'
        }}>
          {loggedInRole === 'Site Manager' 
            ? 'Review, approve, and track all monthly project reports with complete oversight'
            : 'Manage and track monthly project reports'
          }
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
        {/* Only show Generate New Report button for Document Control Manager and Admin */}
        {(loggedInRole === 'Document Control Manager' || loggedInRole === 'Admin') && (
          <button
            onClick={() => setShowGenerateModal(true)}
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
            Generate New Report
          </button>
        )}
        
        <button
          onClick={loadMonthlyReports}
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
          Refresh Reports
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
              Status:
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Year:
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Month:
            </label>
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Months</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
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
          Monthly Reports ({filteredReports.length})
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', color: '#666' }}>Loading reports...</div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', color: '#666' }}>
              No monthly reports found matching your criteria.
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
                    Period
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Status
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Total Cost
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Productivity
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Created
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.reportId} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>
                      {getReportProjectName(report)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(report.reportYear, report.reportMonth - 1).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: getStatusBadgeColor(report.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      Rs. {report.totalCost?.toLocaleString() || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {report.productivityScore ? `${report.productivityScore.toFixed(1)}%` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => viewReport(report)}
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
                        
                        {/* Submit button - only for Document Control Manager and Admin */}
                        {report.status === 'DRAFT' && (loggedInRole === 'Document Control Manager' || loggedInRole === 'Admin') && (
                          <button
                            onClick={() => submitReport(report.reportId)}
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
                            Submit
                          </button>
                        )}
                        
                        {/* Approval buttons - for Site Manager and Admin */}
                        {(loggedInRole === 'Site Manager' || loggedInRole === 'Admin') && report.status === 'SUBMITTED' && (
                          <>
                            <button
                              onClick={() => approveReport(report.reportId)}
                              style={{
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectReport(report.reportId)}
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
                              Reject
                            </button>
                          </>
                        )}
                        
                        {/* Delete button - for Site Manager and Admin on rejected reports, and Document Control Manager/Admin on draft reports */}
                        {((report.status === 'REJECTED' && (loggedInRole === 'Site Manager' || loggedInRole === 'Admin')) ||
                          (report.status === 'DRAFT' && (loggedInRole === 'Document Control Manager' || loggedInRole === 'Admin'))) && (
                          <button
                            onClick={() => deleteReport(report.reportId, report.status)}
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
                            🗑️ Delete
                          </button>
                        )}
                        
                        {/* Download button - available for all users */}
                        <button
                          onClick={() => downloadReport(report.reportId)}
                          style={{
                            background: '#8e44ad',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          📄 Download
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

      {/* Generate Report Modal */}
      {showGenerateModal && (
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#205c20' }}>
              Generate Monthly Report
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Project:
              </label>
              <select
                value={generateForm.projectId}
                onChange={(e) => setGenerateForm({ ...generateForm, projectId: e.target.value })}
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
                Year:
              </label>
              <select
                value={generateForm.year}
                onChange={(e) => setGenerateForm({ ...generateForm, year: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Month:
              </label>
              <select
                value={generateForm.month}
                onChange={(e) => setGenerateForm({ ...generateForm, month: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Show existing report warning */}
            {generateForm.projectId && checkExistingReport() && (
              <div style={{
                background: '#fff3cd',
                color: '#856404',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                border: '1px solid #ffeaa7'
              }}>
                <strong>⚠️ Warning:</strong> A monthly report already exists for{' '}
                {getProjectName(parseInt(generateForm.projectId))} for{' '}
                {new Date(generateForm.year, generateForm.month - 1).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}.
                <br />
                Clicking "Generate Report" will overwrite the existing report.
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowGenerateModal(false)}
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
                onClick={handleGenerateClick}
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
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && viewingReport && (
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
            maxWidth: '1200px',
            width: '95%',
            maxHeight: '95vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#205c20' }}>
              Monthly Report Details
            </h3>
            
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Project:</strong> {getReportProjectName(viewingReport)}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Period:</strong> {new Date(viewingReport.reportYear, viewingReport.reportMonth - 1).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong> 
              <span style={{
                background: getStatusBadgeColor(viewingReport.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}>
                {viewingReport.status}
              </span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Created:</strong> {new Date(viewingReport.createdAt).toLocaleString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Total Cost:</strong> Rs. {viewingReport.totalCost?.toLocaleString() || 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Budget Variance:</strong> Rs. {viewingReport.budgetVariance?.toLocaleString() || 'N/A'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Productivity Score:</strong> {viewingReport.productivityScore || 'N/A'}%
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Created By:</strong> {viewingReport.createdBy || 'N/A'}
            </div>
            
            {viewingReport.content && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Content:</strong>
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingReport.content}
                </div>
              </div>
            )}

            {/* Enhanced Analytics */}
            <div style={{
              margin: '1.5rem 0',
              padding: '1rem',
              background: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px'
            }}>
              <h4 style={{ marginBottom: '1rem', color: '#205c20' }}> Advanced Analytics</h4>
              
              {analyticsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.1rem', color: '#666' }}>Loading analytics data...</div>
                </div>
              ) : !viewingReport ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.1rem', color: '#666' }}>No report data available</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  
                  {/* Cost Breakdown Analysis */}
                  <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}>
                       Cost Breakdown
                      {(() => {
                        const breakdown = calculateCostBreakdown(viewingReport);
                        return !breakdown.hasDetailedData ? (
                          <span style={{ fontSize: '0.8rem', color: '#f39c12', fontWeight: 'normal' }}> (Estimated)</span>
                        ) : null;
                      })()}
                    </h5>
                    {(() => {
                      const breakdown = calculateCostBreakdown(viewingReport);
                      if (breakdown.total === 0) {
                        return <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No cost data available</div>;
                      }
                      
                      const data = {
                        labels: ['Labor', 'Machinery'],
                        datasets: [{
                          data: [breakdown.labor.value, breakdown.machinery.value],
                          backgroundColor: ['#3498db', '#f39c12'],
                          borderWidth: 0
                        }]
                      };
                      const options = {
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: { 
                            callbacks: { 
                              label: (ctx) => {
                                const label = ctx.label;
                                const value = Number(ctx.raw);
                                const percentage = breakdown[label.toLowerCase()].percentage.toFixed(1);
                                const note = !breakdown.hasDetailedData ? ' (estimated)' : '';
                                return `${label}: Rs. ${value.toLocaleString()} (${percentage}%)${note}`;
                              }
                            } 
                          }
                        }
                      };
                      return <Pie data={data} options={options} />;
                    })()}
                  </div>

                  {/* Resource Utilization */}
                  <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}> Resource Utilization</h5>
                    {(() => {
                      const utilization = calculateResourceUtilization(viewingReport);
                      if (utilization.totalHours === 0) {
                        return <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No hours data available</div>;
                      }
                      
                      const data = {
                        labels: ['Labor Hours', 'Machinery Hours'],
                        datasets: [{
                          data: [utilization.laborHours, utilization.machineryHours],
                          backgroundColor: ['#27ae60', '#8e44ad'],
                          borderWidth: 0
                        }]
                      };
                      const options = {
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: { 
                            callbacks: { 
                              label: (ctx) => {
                                const label = ctx.label;
                                const value = Number(ctx.raw);
                                const percentage = label === 'Labor Hours' ? utilization.laborPercentage : utilization.machineryPercentage;
                                return `${label}: ${value.toFixed(1)}h (${percentage.toFixed(1)}%)`;
                              }
                            } 
                          }
                        }
                      };
                      return <Doughnut data={data} options={options} />;
                    })()}
                  </div>

                  {/* Efficiency Metrics */}
                  <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}> Efficiency Metrics</h5>
                    {(() => {
                      const efficiency = calculateEfficiencyMetrics(viewingReport);
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                          <div style={{ padding: '0.5rem', background: '#e8f5e8', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                              {efficiency.avgHoursPerDay.toFixed(1)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Hours/Day</div>
                          </div>
                          <div style={{ padding: '0.5rem', background: '#e8f4fd', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                              Rs. {efficiency.avgCostPerHour.toFixed(0)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Cost/Hour</div>
                          </div>
                          <div style={{ padding: '0.5rem', background: '#fef9e7', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
                              Rs. {efficiency.avgCostPerDay.toFixed(0)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Cost/Day</div>
                          </div>
                          <div style={{ padding: '0.5rem', background: '#f4e8f7', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8e44ad' }}>
                              {efficiency.workDays}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Work Days</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Productivity Score */}
                  <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}> Productivity Score</h5>
                    {(() => {
                      const productivity = Math.max(0, Math.min(100, Number(viewingReport.productivityScore) || 0));
                      const data = {
                        labels: ['Score', 'Remaining'],
                        datasets: [{
                          data: [productivity, 100 - productivity],
                          backgroundColor: ['#27ae60', '#e9ecef'],
                          borderWidth: 0
                        }]
                      };
                      const options = {
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true }
                        },
                        cutout: '70%'
                      };
                      return (
                        <div style={{ position: 'relative', width: '100%', maxWidth: 200, margin: '0 auto' }}>
                          <Doughnut data={data} options={options} />
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, color: '#205c20', fontSize: '1.2rem' }}>
                            {productivity.toFixed(0)}%
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Materials Analysis */}
                  {analyticsData.dailyLogs.length > 0 && (
                    <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                      <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}>🔨 Top Materials Used</h5>
                      {(() => {
                        const materials = getMaterialsAnalysis(analyticsData.dailyLogs);
                        if (materials.length === 0) {
                          return <div style={{ textAlign: 'center', color: '#666' }}>No materials data available</div>;
                        }
                        return (
                          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {materials.map(([material, count], index) => (
                              <div key={material} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '0.5rem 0',
                                borderBottom: index < materials.length - 1 ? '1px solid #eee' : 'none'
                              }}>
                                <span style={{ fontSize: '0.9rem' }}>{material}</span>
                                <span style={{ fontWeight: 'bold', color: '#205c20' }}>{count} times</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Team Performance */}
                  {analyticsData.dailyLogs.length > 0 && (
                    <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
                      <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}> Team Performance</h5>
                      {(() => {
                        const teamStats = getTeamPerformance(analyticsData.dailyLogs);
                        if (teamStats.length === 0) {
                          return <div style={{ textAlign: 'center', color: '#666' }}>No team data available</div>;
                        }
                        return (
                          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {teamStats.map((member, index) => (
                              <div key={member.member} style={{ 
                                padding: '0.5rem 0',
                                borderBottom: index < teamStats.length - 1 ? '1px solid #eee' : 'none'
                              }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{member.member}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                  {member.logs} logs • {member.totalHours.toFixed(1)}h total
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Trend Analysis */}
                  {analyticsData.historicalReports.length > 0 && (
                    <div style={{ padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px', gridColumn: '1 / -1' }}>
                      <h5 style={{ marginBottom: '1rem', color: '#205c20', textAlign: 'center' }}> Project Trends</h5>
                      {(() => {
                        const trendData = getTrendData(analyticsData.historicalReports, viewingReport);
                        if (trendData.labels.length < 2) {
                          return <div style={{ textAlign: 'center', color: '#666' }}>Insufficient data for trend analysis</div>;
                        }
                        const data = {
                          labels: trendData.labels,
                          datasets: [
                            {
                              label: 'Total Cost (Rs.)',
                              data: trendData.costs,
                              borderColor: '#3498db',
                              backgroundColor: 'rgba(52, 152, 219, 0.1)',
                              yAxisID: 'y'
                            },
                            {
                              label: 'Productivity (%)',
                              data: trendData.productivity,
                              borderColor: '#27ae60',
                              backgroundColor: 'rgba(39, 174, 96, 0.1)',
                              yAxisID: 'y1'
                            }
                          ]
                        };
                        const options = {
                          responsive: true,
                          plugins: {
                            legend: { position: 'top' }
                          },
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              ticks: { callback: (v) => `Rs. ${Number(v).toLocaleString()}` }
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              ticks: { callback: (v) => `${v}%` },
                              grid: { drawOnChartArea: false }
                            }
                          }
                        };
                        return <Line data={data} options={options} />;
                      })()}
                    </div>
                  )}

                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => downloadReport(viewingReport.reportId)}
                style={{
                  background: '#8e44ad',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📄 Download PDF
              </button>
              
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

export default MonthlyReports;
