// staff-management/StaffManagementApp.jsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Users, UserPlus, BarChart3, Search } from 'lucide-react';

import StaffList from './components/StaffList';
import CreateStaffForm from './components/CreateStaffForm';
import Dashboard from './components/Dashboard';
import SearchStaff from './components/SearchStaff';
import StaffDetails from './components/StaffDetails';

// Import the staff management CSS
import './styles/buildsmart-staff.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function StaffManagementApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
        { id: 'staff', name: 'All Staff', icon: Users },
        { id: 'search', name: 'Search', icon: Search },
        { id: 'create', name: 'Add Staff', icon: UserPlus },
    ];

    const handleStaffSelect = (staffId) => {
        setSelectedStaffId(staffId);
        setActiveTab('details');
    };

    const handleBackFromDetails = () => {
        setSelectedStaffId(null);
        setActiveTab('staff');
    };

    const renderContent = () => {
        if (activeTab === 'details' && selectedStaffId) {
            return <StaffDetails staffId={selectedStaffId} onBack={handleBackFromDetails} />;
        }

        switch (activeTab) {
            case 'dashboard':
                return <Dashboard onViewStaff={() => setActiveTab('staff')} />;
            case 'staff':
                return <StaffList onStaffSelect={handleStaffSelect} />;
            case 'search':
                return <SearchStaff onStaffSelect={handleStaffSelect} />;
            case 'create':
                return <CreateStaffForm onSuccess={() => setActiveTab('staff')} />;
            default:
                return <Dashboard onViewStaff={() => setActiveTab('staff')} />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7fa 100%)',
                paddingBottom: '2rem'
            }}>
                <Toaster position="top-right" />

                {/* Staff Management Header */}
                <header className="staff-navbar">
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Users size={24} />
                                </div>
                                <h1 className="staff-navbar-title">BuildSmart Staff Management</h1>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {/* Sidebar */}
                        {isSidebarOpen && (
                            <aside style={{
                                width: '280px',
                                flexShrink: 0,
                                animation: 'fadeInLeft 0.3s ease-out'
                            }}>
                                <nav className="card" style={{
                                    padding: '1.5rem',
                                    position: 'sticky',
                                    top: '100px',
                                    background: 'white',
                                    border: '3px solid var(--color-border)'
                                }}>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {navigation.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = activeTab === item.id || (activeTab === 'details' && item.id === 'staff');
                                            return (
                                                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            setActiveTab(item.id);
                                                            if (item.id !== 'details') {
                                                                setSelectedStaffId(null);
                                                            }
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.75rem',
                                                            padding: '0.85rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            background: isActive
                                                                ? 'linear-gradient(135deg, #205c20 0%, #287a2c 100%)'
                                                                : 'transparent',
                                                            color: isActive ? 'white' : '#205c20',
                                                            fontSize: '1rem',
                                                            fontWeight: isActive ? '700' : '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: isActive ? '0 4px 12px rgba(32, 92, 32, 0.3)' : 'none',
                                                            transform: isActive ? 'translateX(5px)' : 'translateX(0)'
                                                        }}
                                                    >
                                                        <Icon size={20} />
                                                        <span>{item.name}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>
                            </aside>
                        )}

                        {/* Main Content */}
                        <main style={{
                            flex: 1,
                            minWidth: 0,
                            animation: 'fadeInUp 0.5s ease-out'
                        }}>
                            {renderContent()}
                        </main>
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default StaffManagementApp;