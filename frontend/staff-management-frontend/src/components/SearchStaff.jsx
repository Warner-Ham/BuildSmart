import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import { Search, Filter, X, UserCircle, Mail, Phone, Eye } from 'lucide-react';

const SearchStaff = ({ onStaffSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const { data: searchResults, isLoading, refetch } = useQuery(
        ['search', searchTerm, role, status],
        () => staffAPI.searchStaff({ searchTerm, role, status }),
        { enabled: isSearching }
    );

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        refetch();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRole('');
        setStatus('');
        setIsSearching(false);
    };

    const results = searchResults?.data?.content || [];

    const getStatusBadge = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800',
            INACTIVE: 'bg-gray-100 text-gray-800',
            SUSPENDED: 'bg-red-100 text-red-800',
            PENDING_ACTIVATION: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                            Search by Name or Email
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Enter name or email..."
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
                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Search size={20} />
                        <span>Search</span>
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        <X size={20} />
                        <span>Clear Filters</span>
                    </button>
                </div>
            </form>

            {/* Search Results */}
            {isSearching && (
                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Search Results ({results.length})
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map((member) => (
                                    <div
                                        key={member.id}
                                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-200"
                                    >
                                        <div className="flex items-start space-x-4 mb-4">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full flex-shrink-0">
                                                <UserCircle className="text-white" size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg text-gray-900 truncate">
                                                    {member.fullName}
                                                </h4>
                                                <p className="text-sm text-gray-500">{member.staffId}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Mail size={16} />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Phone size={16} />
                                                <span>{member.phoneNumber}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {member.role.replace(/_/g, ' ')}
                      </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                        {member.status}
                      </span>
                                        </div>

                                        <button
                                            onClick={() => onStaffSelect(member.id)}
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
                            <p className="text-gray-600">Try adjusting your search criteria</p>
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
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <p className="text-sm font-medium text-gray-700">Search by name or email</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <p className="text-sm font-medium text-gray-700">Filter by role</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <p className="text-sm font-medium text-gray-700">Filter by status</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchStaff;