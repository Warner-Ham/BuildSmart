/**import React, { useState, useEffect } from 'react';
import { User, Users, Search, CheckCircle, XCircle, Phone, Mail, Calendar, Shield, Plus, Filter, Wifi, WifiOff } from 'lucide-react';
import { StaffRole, StaffStatus } from './utils/Staff';
import ValidationUtils from './services/ValidationUtils';
import StaffApiService from './services/api';
import StaffCard from './components/StaffCard';
import StatCard from './components/StatCard';
//import ValidationDemo from './components/ValidationDemo';

const StaffManagementApp = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [staffList, setStaffList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backendStatus, setBackendStatus] = useState('checking');

    // Statistics state
    const [stats, setStats] = useState({
        totalStaff: 0,
        activeStaff: 0,
        adminCount: 0,
        engineerCount: 0
    });

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        createdBy: 'SYSTEM'
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

    // Search filters
    const [searchFilters, setSearchFilters] = useState({
        searchName: '',
        filterRole: '',
        filterStatus: ''
    });

    // Check backend health on component mount
    useEffect(() => {
        checkBackendHealth();
    }, []);

    // Load data when backend is available
    useEffect(() => {
        if (backendStatus === 'connected') {
            loadAllData();
        }
    }, [backendStatus]);

    // Update search results when filters change
    useEffect(() => {
        if (backendStatus === 'connected') {
            performSearch();
        }
    }, [searchFilters]);

    const checkBackendHealth = async () => {
        try {
            setBackendStatus('checking');
            await StaffApiService.healthCheck();
            setBackendStatus('connected');
            setError('');
            console.log('Backend connected successfully');
        } catch (err) {
            setBackendStatus('disconnected');
            setError('Backend not available. Please start Spring Boot server.');
            console.error('Backend connection failed:', err.message);
        }
    };

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [staffData, statsData] = await Promise.all([
                StaffApiService.getAllStaff(),
                StaffApiService.getStats()
            ]);

            // Ensure staffData is always an array
            setStaffList(Array.isArray(staffData) ? staffData : []);
            setStats(statsData || {});
            setError('');

            console.log(
                `Loaded ${Array.isArray(staffData) ? staffData.length : 0} staff members from backend`
            );
        } catch (err) {
            setError(`Failed to load data: ${err.message}`);
            console.error('Data loading failed:', err);
        } finally {
            setLoading(false);
        }
    };


    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Real-time validation
        const errors = { ...validationErrors };

        switch (field) {
            case 'firstName':
            case 'lastName':
                if (value && !ValidationUtils.isValidName(value)) {
                    errors[field] = 'Letters and spaces only, 2-50 characters';
                } else {
                    delete errors[field];
                }
                break;
            case 'email':
                if (value && !ValidationUtils.isValidEmail(value)) {
                    errors[field] = 'Please enter a valid email address';
                } else {
                    delete errors[field];
                }
                break;
            case 'phoneNumber':
                if (value && !ValidationUtils.isValidPhoneNumber(value)) {
                    errors[field] = 'Use format: +1234567890';
                } else {
                    delete errors[field];
                }
                break;
        }

        setValidationErrors(errors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (backendStatus !== 'connected') {
            setSubmitMessage({ text: 'Backend not connected. Please check server.', type: 'error' });
            return;
        }

        // Client-side validation
        const errors = {};

        if (!ValidationUtils.isValidName(formData.firstName)) {
            errors.firstName = 'Valid first name required';
        }
        if (!ValidationUtils.isValidName(formData.lastName)) {
            errors.lastName = 'Valid last name required';
        }
        if (!ValidationUtils.isValidEmail(formData.email)) {
            errors.email = 'Valid email required';
        }
        if (!ValidationUtils.isValidPhoneNumber(formData.phoneNumber)) {
            errors.phoneNumber = 'Valid phone number required';
        }
        if (!formData.role) {
            errors.role = 'Please select a role';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        try {
            const newStaff = await StaffApiService.createStaff(formData);

            setSubmitMessage({
                text: `Staff created successfully! Staff ID: ${newStaff.staffId}`,
                type: 'success'
            });

            // Optimistically update staffList
            setStaffList((prevList) => [...prevList, newStaff]);

            // Optimistically update searchResults (only if the new staff matches current filters)
            setSearchResults((prevResults) => {
                // No active filters → just add
                if (!searchFilters.searchName && !searchFilters.filterRole && !searchFilters.filterStatus) {
                    return [...prevResults, newStaff];
                }

                // Check if it matches current filters
                const nameMatch =
                    !searchFilters.searchName ||
                    `${newStaff.firstName} ${newStaff.lastName}`
                        .toLowerCase()
                        .includes(searchFilters.searchName.toLowerCase());

                const roleMatch =
                    !searchFilters.filterRole || newStaff.role === searchFilters.filterRole;

                const statusMatch =
                    !searchFilters.filterStatus || newStaff.status === searchFilters.filterStatus;

                if (nameMatch && roleMatch && statusMatch) {
                    return [...prevResults, newStaff];
                }

                return prevResults; // doesn’t match filters → no change
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                role: '',
                createdBy: 'SYSTEM'
            });
            setValidationErrors({});

            // Background refresh to sync with backend
            loadAllData();

            setTimeout(() => setSubmitMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setSubmitMessage({
                text: `Error creating staff: ${errorMessage}`,
                type: 'error'
            });
            console.error('Create staff failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const performSearch = async () => {
        if (backendStatus !== 'connected') return;

        setLoading(true);
        try {
            const params = {};

            if (searchFilters.searchName.trim()) {
                const nameParts = searchFilters.searchName.trim().split(' ');
                if (nameParts[0]) params.firstName = nameParts[0];
                if (nameParts[1]) params.lastName = nameParts[1];
            }

            if (searchFilters.filterRole) params.role = searchFilters.filterRole;
            if (searchFilters.filterStatus) params.status = searchFilters.filterStatus;

            const results = await StaffApiService.searchStaff(params);
            setSearchResults(Array.isArray(results) ? results : []);
            console.log(`Search completed: ${Array.isArray(results) ? results.length : 0} results`);

        } catch (err) {
            setError(`Search failed: ${err.message}`);
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const BackendStatusIndicator = () => (
        <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
            backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
                backendStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
        }`}>
            {backendStatus === 'connected' ? <Wifi size={14} className="mr-1" /> : <WifiOff size={14} className="mr-1" />}
            {backendStatus === 'connected' ? 'Backend Connected' :
                backendStatus === 'checking' ? 'Checking Backend...' : 'Backend Disconnected'}
            {backendStatus === 'disconnected' && (
                <button
                    onClick={checkBackendHealth}
                    className="ml-2 text-xs underline hover:no-underline"
                >
                    Retry
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-green-50">
            <div className="max-w-7xl mx-auto py-6 px-4">
                {/* Header
{/*  <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Construction Staff Management System</h1>
                        </div>
                        <BackendStatusIndicator />
                    </div>
                </div>
*/}
                {/* Error Display
                {error && (
                    <div className="bg-green-100 border border-green-400 text-green-900 px-4 py-3 rounded mb-6">
                        <strong>Error:</strong> {error}
                        {backendStatus === 'disconnected' && (
                            <div className="mt-2 text-sm">
                                <strong>To fix this:</strong>
                                <ol className="list-decimal list-inside mt-1">
                                    <li>Start your Spring Boot backend: <code className="bg-green-200 px-1 rounded">mvn spring-boot:run</code></li>
                                    <li>Verify it's running on <code className="bg-green-200 px-1 rounded">http://localhost:8080</code></li>
                                    <li>Click "Retry" button above</li>
                                </ol>
                            </div>
                        )}
                    </div>
                )}
*/}
                {/* Loading Indicator
                {loading && (
                    <div className="fixed top-4 right-4 bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading...
                        </div>
                    </div>
                )}
*/}
                {/* Navigation
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex">
                        {[
                            { id: 'create', label: 'Create Staff', icon: Plus },
                            { id: 'view', label: 'View All Staff', icon: Users },
                            { id: 'search', label: 'Search & Filter', icon: Search },
                            //{ id: 'validation', label: 'Validation Demo', icon: CheckCircle }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium ${
                                    activeTab === tab.id
                                        ? 'bg-green-700 text-white'
                                        : 'text-green-700 hover:text-green-900 hover:bg-green-100'
                                } ${backendStatus !== 'connected' && tab.id !== 'validation' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={backendStatus !== 'connected' && tab.id !== 'validation'}
                            >
                                <tab.icon size={18} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
*/}
                {/* Tab Content
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Create Staff Tab
                    {activeTab === 'create' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-green-800">Create New Staff Member</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleFormChange('firstName', e.target.value)}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={backendStatus !== 'connected'}
                                        />
                                        {validationErrors.firstName && (
                                            <p className="text-green-700 text-xs mt-1">{validationErrors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleFormChange('lastName', e.target.value)}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={backendStatus !== 'connected'}
                                        />
                                        {validationErrors.lastName && (
                                            <p className="text-green-700 text-xs mt-1">{validationErrors.lastName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleFormChange('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={backendStatus !== 'connected'}
                                        />
                                        {validationErrors.email && (
                                            <p className="text-green-700 text-xs mt-1">{validationErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                                            placeholder="+1234567890"
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={backendStatus !== 'connected'}
                                        />
                                        {validationErrors.phoneNumber && (
                                            <p className="text-green-700 text-xs mt-1">{validationErrors.phoneNumber}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Role *</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={backendStatus !== 'connected'}
                                        >
                                            <option value="">Select Role</option>
                                            {Object.entries(StaffRole).map(([key, role]) => (
                                                <option key={key} value={key}>{role.displayName}</option>
                                            ))}
                                        </select>
                                        {validationErrors.role && (
                                            <p className="text-green-700 text-xs mt-1">{validationErrors.role}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Created By</label>
                                        <input
                                            type="text"
                                            value={formData.createdBy}
                                            onChange={(e) => setFormData(prev => ({ ...prev, createdBy: e.target.value }))}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            disabled={backendStatus !== 'connected'}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading || backendStatus !== 'connected'}
                                >
                                    {loading ? 'Creating...' : 'Create Staff Member'}
                                </button>
                            </form>

                            {submitMessage.text && (
                                <div className={`mt-4 p-4 rounded-md ${
                                    submitMessage.type === 'success'
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    {submitMessage.text}
                                </div>
                            )}
                        </div>
                    )}
*/}
                    {/* View All Staff Tab
                    {activeTab === 'view' && (
                        <div>
                            {/* Statistics Cards
                            <div className="grid md:grid-cols-4 gap-4 mb-6">
                                <StatCard title="Total Staff" value={stats.totalStaff} icon={Users} bgColor="bg-green-600" />
                                <StatCard title="Active Staff" value={stats.activeStaff} icon={CheckCircle} bgColor="bg-green-700" />
                                <StatCard title="Administrators" value={stats.adminCount} icon={Shield} bgColor="bg-green-800" />
                                <StatCard title="Site Managers" value={stats.engineerCount} icon={User} bgColor="bg-green-900" />
                            </div>

                            <h2 className="text-2xl font-bold mb-6 text-green-800">All Staff Members ({staffList.length})</h2>

                            {staffList.length === 0 && backendStatus === 'connected' ? (
                                <div className="text-center py-12">
                                    <Users size={64} className="mx-auto text-green-400 mb-4" />
                                    <h3 className="text-xl font-medium text-green-700">No Staff Members Found</h3>
                                    <p className="text-green-600">Create your first staff member using the "Create Staff" tab.</p>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {staffList.map((staff) => (
                                        <StaffCard key={staff.staffId} staff={staff} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search & Filter Tab
                    {activeTab === 'search' && (
                        <div>
                            <div className="bg-green-50 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
                                    <Filter className="mr-2" size={20} />
                                    Search and Filter Staff
                                </h3>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Search by Name</label>
                                        <input
                                            type="text"
                                            value={searchFilters.searchName}
                                            onChange={(e) => setSearchFilters(prev => ({ ...prev, searchName: e.target.value }))}
                                            placeholder="Enter first or last name"
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            disabled={backendStatus !== 'connected'}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Filter by Role</label>
                                        <select
                                            value={searchFilters.filterRole}
                                            onChange={(e) => setSearchFilters(prev => ({ ...prev, filterRole: e.target.value }))}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            disabled={backendStatus !== 'connected'}
                                        >
                                            <option value="">All Roles</option>
                                            {Object.entries(StaffRole).map(([key, role]) => (
                                                <option key={key} value={key}>{role.displayName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-green-800 mb-1">Filter by Status</label>
                                        <select
                                            value={searchFilters.filterStatus}
                                            onChange={(e) => setSearchFilters(prev => ({ ...prev, filterStatus: e.target.value }))}
                                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            disabled={backendStatus !== 'connected'}
                                        >
                                            <option value="">All Statuses</option>
                                            {Object.entries(StaffStatus).map(([key, status]) => (
                                                <option key={key} value={status}>{status.displayName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-6 text-green-800">Search Results ({searchResults.length})</h2>

                            {searchResults.length === 0 && backendStatus === 'connected' ? (
                                <div className="text-center py-12">
                                    <Search size={64} className="mx-auto text-green-400 mb-4" />
                                    <h3 className="text-xl font-medium text-green-700">No Results Found</h3>
                                    <p className="text-green-600">Try adjusting your search criteria.</p>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {searchResults.map((staff) => (
                                        <StaffCard key={staff.staffId} staff={staff} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Validation Demo Tab
                    {activeTab === 'validation' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-green-800">Validation System Demo</h2>
                            <p className="text-green-700 mb-6">
                                This validation system works offline and demonstrates the same logic used by both frontend and backend.
                            </p>
                            <ValidationDemo />
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};
*/}
/**
export default StaffManagementApp;
*/