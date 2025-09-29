import React, { useState } from 'react';
import { usePendingApprovalReports, useApproveReport, useRejectReport } from '../../hooks/useMonthlyReports';
import { formatCurrency, formatDate } from '../../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye
} from 'lucide-react';

const ApprovalWorkflow = () => {
  const [selectedReports, setSelectedReports] = useState(new Set());
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  
  const { data: pendingReports, isLoading, error, refetch } = usePendingApprovalReports();
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  const handleSelectReport = (reportId) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId);
    } else {
      newSelected.add(reportId);
    }
    setSelectedReports(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedReports.size === pendingReports?.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(pendingReports?.map(r => r.reportId) || []));
    }
  };

  const handleApprove = async (reportId) => {
    try {
      await approveMutation.mutateAsync(reportId);
      setSelectedReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const handleApproveSelected = async () => {
    const promises = Array.from(selectedReports).map(reportId => 
      approveMutation.mutateAsync(reportId)
    );
    try {
      await Promise.all(promises);
      setSelectedReports(new Set());
    } catch (error) {
      console.error('Error approving reports:', error);
    }
  };

  const handleReject = async (reportId, reason) => {
    try {
      await rejectMutation.mutateAsync(reportId);
      setSelectedReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
      setShowRejectModal(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting report:', error);
    }
  };

  const openRejectModal = (reportId) => {
    setShowRejectModal(reportId);
    setRejectReason('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading pending reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Error loading reports: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Workflow</h1>
          <p className="text-gray-600 mt-1">Review and approve monthly reports</p>
        </div>
        
        {pendingReports?.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedReports.size} of {pendingReports.length} selected
            </span>
            {selectedReports.size > 0 && (
              <button
                onClick={handleApproveSelected}
                className="btn-success"
                disabled={approveMutation.isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReports?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected Today</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {pendingReports?.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No reports are currently pending approval.</p>
        </div>
      ) : (
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Reports</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedReports.size === pendingReports?.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={() => refetch()}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head w-12">
                    <input
                      type="checkbox"
                      checked={selectedReports.size === pendingReports?.length && pendingReports?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="table-head">Project</th>
                  <th className="table-head">Period</th>
                  <th className="table-head">Total Cost</th>
                  <th className="table-head">Productivity</th>
                  <th className="table-head">Submitted</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {pendingReports?.map((report) => (
                  <tr key={report.reportId} className="table-row">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedReports.has(report.reportId)}
                        onChange={() => handleSelectReport(report.reportId)}
                        className="rounded"
                      />
                    </td>
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
                    <td className="table-cell text-sm text-gray-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(report.reportId)}
                          className="text-green-600 hover:text-green-800 text-sm"
                          disabled={approveMutation.isLoading}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openRejectModal(report.reportId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={rejectMutation.isLoading}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <XCircle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Reject Report</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this report:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="input w-full"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRejectModal(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal, rejectReason)}
                className="btn-danger"
                disabled={!rejectReason.trim() || rejectMutation.isLoading}
              >
                {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
