import React, { useState } from 'react';
import { useMonthlyReports, usePendingApprovalReports } from '../../hooks/useMonthlyReports';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Filter,
  Download
} from 'lucide-react';

const MonthlyReportsDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  
  const { data: reports, isLoading: reportsLoading, error: reportsError } = useMonthlyReports();
  const { data: pendingReports, isLoading: pendingLoading } = usePendingApprovalReports();

  // Filter reports based on selected filters
  const filteredReports = reports?.filter(report => {
    const statusMatch = selectedStatus === 'ALL' || report.status === selectedStatus;
    const projectMatch = selectedProject === 'ALL' || report.projectId.toString() === selectedProject;
    return statusMatch && projectMatch;
  }) || [];

  // Calculate summary statistics
  const totalReports = filteredReports.length;
  const totalCost = filteredReports.reduce((sum, report) => sum + (report.totalCost || 0), 0);
  const averageProductivity = filteredReports.length > 0 
    ? filteredReports.reduce((sum, report) => sum + (report.productivityScore || 0), 0) / filteredReports.length 
    : 0;

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Draft', value: filteredReports.filter(r => r.status === 'DRAFT').length, color: '#6b7280' },
    { name: 'Submitted', value: filteredReports.filter(r => r.status === 'SUBMITTED').length, color: '#3b82f6' },
    { name: 'Approved', value: filteredReports.filter(r => r.status === 'APPROVED').length, color: '#10b981' },
    { name: 'Rejected', value: filteredReports.filter(r => r.status === 'REJECTED').length, color: '#ef4444' },
  ];

  // Monthly cost trend data
  const monthlyTrend = filteredReports.reduce((acc, report) => {
    const key = `${report.reportYear}-${report.reportMonth.toString().padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = { month: key, cost: 0, reports: 0 };
    }
    acc[key].cost += report.totalCost || 0;
    acc[key].reports += 1;
    return acc;
  }, {});

  const trendData = Object.values(monthlyTrend).sort((a, b) => a.month.localeCompare(b.month));

  if (reportsLoading || pendingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (reportsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Error loading reports: {reportsError.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Reports Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and manage construction monthly reports</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </button>
          <button className="btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReports?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
              <p className="text-2xl font-bold text-gray-900">{averageProductivity.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-40"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input w-40"
          >
            <option value="ALL">All Projects</option>
            {/* Add project options here */}
          </select>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cost Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Cost']} />
              <Bar dataKey="cost" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">Project</th>
                <th className="table-head">Period</th>
                <th className="table-head">Total Cost</th>
                <th className="table-head">Productivity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredReports.slice(0, 10).map((report) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{report.projectName}</div>
                      <div className="text-sm text-gray-500">{report.projectLocation}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {report.reportYear}/{report.reportMonth.toString().padStart(2, '0')}
                  </td>
                  <td className="table-cell font-medium">
                    {formatCurrency(report.totalCost || 0)}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${report.productivityScore || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {report.productivityScore?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={getStatusColor(report.status)}>
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      {report.status === 'DRAFT' && (
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          Edit
                        </button>
                      )}
                      {report.status === 'SUBMITTED' && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportsDashboard;
