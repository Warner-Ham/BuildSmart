import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Users, UserPlus, BarChart3, Search, Settings, Menu, X } from 'lucide-react';
import StaffList from './components/StaffList';
import CreateStaffForm from './components/CreateStaffForm';
import StaffDetails from './components/StaffDetails';
import Dashboard from './components/Dashboard';
import SearchStaff from './components/SearchStaff';
import Login from './components/Login';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setIsAuthenticated(true);
            setUser({ username, token });
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

     const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
        { id: 'staff', name: 'All Staff', icon: Users },
        { id: 'create', name: 'Add Staff', icon: UserPlus },
        { id: 'search', name: 'Search', icon: Search },
    ];

    const handleStaffSelect = (staffId) => {
        setSelectedStaffId(staffId);
        setActiveTab('details');
    };

    const renderContent = () => {
        if (activeTab === 'details' && selectedStaffId) {
            return (
                <StaffDetails
                    staffId={selectedStaffId}
                    onBack={() => {
                        setActiveTab('staff');
                        setSelectedStaffId(null);
                    }}
                />
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return <Dashboard onViewStaff={() => setActiveTab('staff')} />;
            case 'staff':
                return <StaffList onStaffSelect={handleStaffSelect} />;
            case 'create':
                return <CreateStaffForm onSuccess={() => setActiveTab('staff')} />;
            case 'search':
                return <SearchStaff onStaffSelect={handleStaffSelect} />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
                <Toaster position="top-right" />

                {/* Header */}
                <header className="bg-white shadow-lg border-b-4 border-blue-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                                >
                                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                                        <Users className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                            BuildSmart
                                        </h1>
                                        <p className="text-sm text-gray-600">Staff Management System</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-blue-900">System Online</span>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Settings size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <aside className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
                            <nav className="bg-white rounded-2xl shadow-xl p-4 sticky top-8">
                                <ul className="space-y-2">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => setActiveTab(item.id)}
                                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                                        isActive
                                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
                                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                    }`}
                                                >
                                                    <Icon size={20} />
                                                    <span>{item.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <h3 className="font-semibold text-blue-900 mb-2">Quick Stats</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Staff</span>
                                            <span className="font-bold text-blue-700">...</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active</span>
                                            <span className="font-bold text-green-600">...</span>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0">
                            <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[600px]">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-600 text-sm">
                                © 2025 BuildSmart Staff Management. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-sm mt-2 md:mt-0">
                                Version 2.0.0 | Construction Property Solution Pvt Ltd
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    );
}

export default App;