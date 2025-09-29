import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import MonthlyReportsDashboard from './MonthlyReportsDashboard';
import ReportForm from './ReportForm';
import ReportDetails from './ReportDetails';
import ApprovalWorkflow from './ApprovalWorkflow';
import ReportAnalytics from './ReportAnalytics';
import { 
  BarChart3, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MonthlyReportsApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, current: currentView === 'dashboard' },
    { id: 'approval', name: 'Approval Workflow', icon: CheckCircle, current: currentView === 'approval' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, current: currentView === 'analytics' },
  ];

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setCurrentView('details');
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setShowReportForm(true);
  };

  const handleCreateReport = () => {
    setEditingReport(null);
    setShowReportForm(true);
  };

  const handleCloseForm = () => {
    setShowReportForm(false);
    setEditingReport(null);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MonthlyReportsDashboard 
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            onCreateReport={handleCreateReport}
          />
        );
      case 'approval':
        return <ApprovalWorkflow />;
      case 'analytics':
        return <ReportAnalytics />;
      case 'details':
        return (
          <ReportDetails 
            reportId={selectedReport?.id}
            onClose={handleCloseDetails}
            onEdit={handleEditReport}
          />
        );
      default:
        return <MonthlyReportsDashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Reports</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
            <div className="flex items-center px-6 py-4 border-b">
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Monthly Reports</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-64">
            {/* Mobile header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Monthly Reports</h1>
                <div className="w-6" />
              </div>
            </div>

            {/* Page content */}
            <div className="p-6">
              {renderCurrentView()}
            </div>
          </div>
        </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <ReportForm
            report={editingReport}
            onClose={handleCloseForm}
            onSuccess={() => {
              handleCloseForm();
              setCurrentView('dashboard');
            }}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default MonthlyReportsApp;
