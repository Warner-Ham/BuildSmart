import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Users, UserPlus, BarChart3, Menu, X, LogOut } from 'lucide-react';

import StaffList from './components/StaffList';
import CreateStaffForm from './components/CreateStaffForm';
import Dashboard from './components/Dashboard';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
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
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('username', userData.username);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
    };

    // Check if user is not authenticated
    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7fa 100%)'
            }}>
                <div style={{
                    textAlign: 'center',
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '3px solid #e8f5e9',
                    maxWidth: '500px'
                }}>
                    <Users size={64} color="#205c20" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: '#205c20', marginBottom: '1rem', fontSize: '1.8rem' }}>
                        Access Denied
                    </h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        Please log in as admin to access the staff management system.
                    </p>
                    <div style={{
                        background: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '2px dashed #ddd',
                        fontSize: '0.9rem',
                        color: '#888'
                    }}>
                        <strong style={{ color: '#205c20' }}>Hint:</strong> Open browser console and run:<br/>
                        <code style={{ 
                            background: '#fff', 
                            padding: '0.5rem', 
                            display: 'block', 
                            marginTop: '0.5rem',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                        }}>
                            localStorage.setItem('username', 'admin');<br/>
                            localStorage.setItem('token', 'demo-token');<br/>
                            location.reload();
                        </code>
                    </div>
                </div>
            </div>
        );
    }

    // Check if user is admin
    if (user && user.username !== 'admin') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7fa 100%)'
            }}>
                <div style={{
                    textAlign: 'center',
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '3px solid #ffebee',
                    maxWidth: '500px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#ffebee',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <X size={48} color="#e74c3c" />
                    </div>
                    <h2 style={{ color: '#e74c3c', marginBottom: '1rem', fontSize: '1.8rem' }}>
                        Access Denied
                    </h2>
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '1rem' }}>
                        Only admin users can access the staff management system.
                    </p>
                    <p style={{ color: '#999', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Current user: <strong style={{ color: '#205c20' }}>{user.username}</strong>
                    </p>
                    <button 
                        onClick={handleLogout} 
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '0 auto'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
        { id: 'staff', name: 'All Staff', icon: Users },
        { id: 'create', name: 'Add Staff', icon: UserPlus },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'staff':
                return <StaffList />;
            case 'create':
                return <CreateStaffForm />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7fa 100%)' }}>
                <Toaster position="top-right" />

                {/* BuildSmart Style Navbar */}
                <header className="staff-navbar">
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
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
                                <h1 className="staff-navbar-title">BuildSmart Staff</h1>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#9AFE6A',
                                    boxShadow: '0 0 8px #9AFE6A'
                                }}></div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                    {user?.username || 'User'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(231, 76, 60, 0.9)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {/* Sidebar - BuildSmart Style */}
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
                                            const isActive = activeTab === item.id;
                                            return (
                                                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                                    <button
                                                        onClick={() => setActiveTab(item.id)}
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

                {/* Footer - BuildSmart Style */}
                <footer style={{
                    background: '#181a2a',
                    color: 'white',
                    padding: '2rem 0 1rem 0',
                    marginTop: '4rem'
                }}>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '0.5rem'
                            }}>
                                <Users size={32} />
                                <div>
                                    <strong style={{ fontSize: '1.1rem' }}>BuildSmart Staff</strong>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.85rem',
                                        opacity: 0.8
                                    }}>
                                        Smart staff management solutions
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            © 2025 BuildSmart. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    );
}

export default App;