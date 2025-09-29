import React, { useState } from 'react';
import { useMonthlyReport, useSubmitReport, useApproveReport, useRejectReport, useDeleteMonthlyReport } from '../../hooks/useMonthlyReports';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../services/api';
import { 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Download, 
  ArrowLeft,
  AlertTriangle,
  User
} from 'lucide-react';

const ReportDetails = ({ reportId, onClose, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { data: report, isLoading, error } = useMonthlyReport(reportId);
  const submitMutation = useSubmitReport();
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();
  const deleteMutation = useDeleteMonthlyReport();

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync(reportId);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(reportId);
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync(reportId);
    } catch (error) {
      console.error('Error rejecting report:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(reportId);
      onClose();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading report details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">Error loading report: {error.message}</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Report not found</p>
      </div>
    );
  }

  const canEdit = report.status === 'DRAFT';
  const canSubmit = report.status === 'DRAFT';
  const canApprove = report.status === 'SUBMITTED';
  const canReject = report.status === 'SUBMITTED';
  const canDelete = report.status !== 'APPROVED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Monthly Report - {report.projectName}
            </h1>
            <p className="text-gray-600">
              {report.reportYear}/{report.reportMonth.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={getStatusColor(report.status)}>
            {getStatusText(report.status)}
          </span>
          <button className="btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Project</label>
              <p className="text-gray-900">{report.projectName}</p>
              <p className="text-sm text-gray-500">{report.projectLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Report Period</label>
              <p className="text-gray-900">{report.reportYear}/{report.reportMonth.toString().padStart(2, '0')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={getStatusColor(report.status)}>
                {getStatusText(report.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Materials Cost:</span>
              <span className="font-medium">{formatCurrency(report.totalMaterialsCost || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Labor Cost:</span>
              <span className="font-medium">{formatCurrency(report.totalLaborCost || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Machinery Cost:</span>
              <span className="font-medium">{formatCurrency(report.totalMachineryCost || 0)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Cost:</span>
              <span className="text-green-600">{formatCurrency(report.totalCost || 0)}</span>
            </div>
            {report.budgetVariance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Budget Variance:</span>
                <span className={`font-medium ${report.budgetVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(report.budgetVariance)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Productivity Metrics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Metrics</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Labor Hours</label>
              <p className="text-gray-900">{report.totalLaborHours || 0} hours</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Machinery Hours</label>
              <p className="text-gray-900">{report.totalMachineryHours || 0} hours</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Work Days</label>
              <p className="text-gray-900">{report.workDays || 0} days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Productivity Score</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${report.productivityScore || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{report.productivityScore?.toFixed(1) || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {report.notes && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
        </div>
      )}

      {/* Audit Trail */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Created by {report.createdBy}</p>
              <p className="text-sm text-gray-500">{formatDate(report.createdAt)}</p>
            </div>
          </div>
          
          {report.updatedBy && (
            <div className="flex items-center space-x-3">
              <Edit className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last updated by {report.updatedBy}</p>
                <p className="text-sm text-gray-500">{formatDate(report.updatedAt)}</p>
              </div>
            </div>
          )}
          
          {report.approvedBy && (
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Approved by {report.approvedBy}</p>
                <p className="text-sm text-gray-500">{formatDate(report.approvedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {canDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger"
            disabled={deleteMutation.isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        )}
        
        {canEdit && (
          <button
            onClick={() => onEdit(report)}
            className="btn-secondary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        )}
        
        {canSubmit && (
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={submitMutation.isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit for Approval
          </button>
        )}
        
        {canApprove && (
          <button
            onClick={handleApprove}
            className="btn-success"
            disabled={approveMutation.isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </button>
        )}
        
        {canReject && (
          <button
            onClick={handleReject}
            className="btn-danger"
            disabled={rejectMutation.isLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Report</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this monthly report? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
