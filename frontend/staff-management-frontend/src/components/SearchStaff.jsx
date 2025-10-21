import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import { Search, Filter, X, UserCircle, Mail, Phone, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchStaff = ({ onStaffSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const { data: searchResults, isLoading, error, refetch } = useQuery(
        ['search', searchTerm, role, status],
        () => staffAPI.searchStaff({ searchTerm, role, status }),
        {
            enabled: isSearching,
            retry: 1,
            onError: (err) => {
                toast.error(err.message || 'Search failed');
            }
        }
    );

    const handleSearch = (e) => {
        e.preventDefault();

        // Validate that at least one search criteria is provided
        if (!searchTerm.trim() && !role && !status) {
            toast.error('Please enter at least one search criteria');
            return;
        }

        setIsSearching(true);
        refetch();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRole('');
        setStatus('');
        setIsSearching(false);
    };

    // Handle different response structures
    const results = searchResults?.data?.content || searchResults?.data || [];
    const totalResults = searchResults?.data?.totalElements || results.length;

    // Helper to get full name
    const getFullName = (member) => {
        if (member.fullName) return member.fullName;
        return `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'N/A';
    };

    // Helper to get ID
    const getMemberId = (member) => {
        return member.id || member.staffId;
    };

    const getStatusBadge = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800',
            INACTIVE: 'bg-gray-100 text-gray-800',
            SUSPENDED: 'bg-red-100 text-red-800',
            PENDING_ACTIVATION: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getRoleBadge = (role) => {
        const colors = {
            ADMIN: 'bg-purple-100 text-purple-800',
            MANAGER: 'bg-blue-100 text-blue-800',
            SUPERVISOR: 'bg-indigo-100 text-indigo-800',
            STAFF: 'bg-cyan-100 text-cyan-800',
            SITE_ENGINEER: 'bg-blue-100 text-blue-800',
            DOCUMENT_CONTROL_MANAGER: 'bg-indigo-100 text-indigo-800',
            SITE_STAFF: 'bg-cyan-100 text-cyan-800',
            BUDGET_PLANNING_TEAM: 'bg-teal-100 text-teal-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Search Staff</h2>
                <p className="text-gray-600">Find staff members using advanced filters</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Term */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search by Name, Email, or Phone
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Enter name, email, or phone..."
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Roles</option>
                            {rolesData?.data?.map((r) => (
                                <option key={r.name} value={r.name}>
                                    {r.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Statuses</option>
                            {statusesData?.data?.map((s) => (
                                <option key={s.name} value={s.name}>
                                    {s.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <Search size={20} />
                                <span>Search</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        <X size={20} />
                        <span>Clear Filters</span>
                    </button>

                    {isSearching && (
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                        >
                            <RefreshCw size={20} />
                            <span>Refresh Results</span>
                        </button>
                    )}
                </div>

                {/* Active Filters Display */}
                {(searchTerm || role || status) && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
                        <div className="flex flex-wrap gap-2">
                            {searchTerm && (
                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    <span>Search: {searchTerm}</span>
                                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {role && (
                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    <span>Role: {role.replace(/_/g, ' ')}</span>
                                    <button onClick={() => setRole('')} className="hover:text-purple-900">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {status && (
                                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    <span>Status: {status}</span>
                                    <button onClick={() => setStatus('')} className="hover:text-green-900">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </form>

            {/* Search Results */}
            {isSearching && (
                <div>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border-2 border-gray-200">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Searching staff members...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border-2 border-red-200">
                            <AlertCircle className="text-red-500 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Failed</h3>
                            <p className="text-gray-600 mb-4">{error.message || 'An error occurred'}</p>
                            <button
                                onClick={() => refetch()}
                                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <RefreshCw size={18} />
                                <span>Try Again</span>
                            </button>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Search Results ({totalResults})
                                </h3>
                                <button
                                    onClick={() => refetch()}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map((member) => (
                                    <div
                                        key={getMemberId(member)}
                                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                        onClick={() => onStaffSelect(getMemberId(member))}
                                    >
                                        <div className="flex items-start space-x-4 mb-4">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full flex-shrink-0">
                                                <span className="text-white font-bold text-sm">
                                                    {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg text-gray-900 truncate">
                                                    {getFullName(member)}
                                                </h4>
                                                <p className="text-sm text-gray-500">{member.staffId}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Mail size={16} className="flex-shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Phone size={16} className="flex-shrink-0" />
                                                <span>{member.phoneNumber}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                                                {member.role?.replace(/_/g, ' ')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                                                {member.status}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStaffSelect(getMemberId(member));
                                            }}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye size={16} />
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
                            <Search size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-600 mb-4">
                                No staff members match your search criteria
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters and Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Initial State */}
            {!isSearching && (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                    <Filter size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Search</h3>
                    <p className="text-gray-600 mb-6">
                        Enter search criteria above and click "Search" to find staff members
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                            <p className="text-sm font-medium text-gray-700">🔍 Search by name, email, or phone</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                            <p className="text-sm font-medium text-gray-700">👔 Filter by role</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                            <p className="text-sm font-medium text-gray-700">✅ Filter by status</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchStaff;