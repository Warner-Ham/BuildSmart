import React, { useState } from 'react';
import { useMonthlyReports, useHighVarianceReports } from '../../hooks/useMonthlyReports';
import { formatCurrency } from '../../services/api';
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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Scatter,
  ScatterChart
} from 'recharts';
import { 
  AlertTriangle, 
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const ReportAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('cost');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  const { data: reports, isLoading: reportsLoading } = useMonthlyReports();
  const { data: highVarianceReports, isLoading: varianceLoading } = useHighVarianceReports(1000);

  // Process data for charts
  const processCostTrend = () => {
    if (!reports) return [];
    
    const monthlyData = reports.reduce((acc, report) => {
      const key = `${report.reportYear}-${report.reportMonth.toString().padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = { 
          month: key, 
          cost: 0, 
          materials: 0, 
          labor: 0, 
          machinery: 0,
          reports: 0 
        };
      }
      acc[key].cost += report.totalCost || 0;
      acc[key].materials += report.totalMaterialsCost || 0;
      acc[key].labor += report.totalLaborCost || 0;
      acc[key].machinery += report.totalMachineryCost || 0;
      acc[key].reports += 1;
      return acc;
    }, {});

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const processProductivityTrend = () => {
    if (!reports) return [];
    
    const monthlyData = reports.reduce((acc, report) => {
      const key = `${report.reportYear}-${report.reportMonth.toString().padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = { 
          month: key, 
          productivity: 0, 
          laborHours: 0, 
          machineryHours: 0,
          workDays: 0,
          reports: 0 
        };
      }
      acc[key].productivity += report.productivityScore || 0;
      acc[key].laborHours += report.totalLaborHours || 0;
      acc[key].machineryHours += report.totalMachineryHours || 0;
      acc[key].workDays += report.workDays || 0;
      acc[key].reports += 1;
      return acc;
    }, {});

    return Object.values(monthlyData).map(item => ({
      ...item,
      productivity: item.reports > 0 ? item.productivity / item.reports : 0,
      laborHours: item.reports > 0 ? item.laborHours / item.reports : 0,
      machineryHours: item.reports > 0 ? item.machineryHours / item.reports : 0,
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const processStatusDistribution = () => {
    if (!reports) return [];
    
    const statusCounts = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      DRAFT: '#6b7280',
      SUBMITTED: '#3b7280',
      APPROVED: '#10b981',
      REJECTED: '#ef4444'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: colors[status] || '#6b7280'
    }));
  };

  const processProjectPerformance = () => {
    if (!reports) return [];
    
    const projectData = reports.reduce((acc, report) => {
      const projectName = report.projectName || 'Unknown Project';
      if (!acc[projectName]) {
        acc[projectName] = {
          project: projectName,
          totalCost: 0,
          productivity: 0,
          reports: 0
        };
      }
      acc[projectName].totalCost += report.totalCost || 0;
      acc[projectName].productivity += report.productivityScore || 0;
      acc[projectName].reports += 1;
      return acc;
    }, {});

    return Object.values(projectData).map(item => ({
      ...item,
      productivity: item.reports > 0 ? item.productivity / item.reports : 0
    }));
  };

  const costTrendData = processCostTrend();
  const productivityTrendData = processProductivityTrend();
  const statusDistribution = processStatusDistribution();
  const projectPerformance = processProjectPerformance();

  if (reportsLoading || varianceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of monthly reports</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="input w-40"
          >
            <option value="cost">Cost Analysis</option>
            <option value="productivity">Productivity</option>
            <option value="status">Status Distribution</option>
            <option value="projects">Project Performance</option>
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-40"
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reports?.reduce((sum, r) => sum + (r.totalCost || 0), 0) || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports?.length > 0 
                  ? (reports.reduce((sum, r) => sum + (r.productivityScore || 0), 0) / reports.length).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Variance</p>
              <p className="text-2xl font-bold text-gray-900">{highVarianceReports?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Cost Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total Cost</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Cost']} />
              <Area type="monotone" dataKey="cost" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
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

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Cost']} />
              <Bar dataKey="materials" stackId="a" fill="#10b981" />
              <Bar dataKey="labor" stackId="a" fill="#3b82f6" />
              <Bar dataKey="machinery" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Productivity']} />
              <Line type="monotone" dataKey="productivity" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={projectPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="totalCost" 
              name="Total Cost"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis 
              dataKey="productivity" 
              name="Productivity"
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'totalCost' ? formatCurrency(value) : `${value.toFixed(1)}%`,
                name === 'totalCost' ? 'Cost' : 'Productivity'
              ]}
              labelFormatter={(label, payload) => 
                payload?.[0]?.payload?.project || 'Project'
              }
            />
            <Scatter dataKey="productivity" fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* High Variance Reports */}
      {highVarianceReports?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">High Variance Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Project</th>
                  <th className="table-head">Period</th>
                  <th className="table-head">Total Cost</th>
                  <th className="table-head">Budget Variance</th>
                  <th className="table-head">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {highVarianceReports.slice(0, 10).map((report) => (
                  <tr key={report.reportId} className="table-row">
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
                      <span className={`font-medium ${report.budgetVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(report.budgetVariance || 0)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        report.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalytics;
