import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import {
    ChevronLeft, ChevronRight, Search, Filter,
    Mail, Phone, UserCircle, Eye, Trash2, Edit, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const StaffList = ({ onStaffSelect }) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState('firstName');
    const [direction, setDirection] = useState('asc');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Use search API when filters are applied, otherwise use getAllStaff
    const shouldUseSearch = filterRole || filterStatus || searchTerm;

    const { data, isLoading, error, refetch } = useQuery(
        ['staff', page, size, sortBy, direction, filterRole, filterStatus, searchTerm],
        () => {
            if (shouldUseSearch) {
                return staffAPI.searchStaff({
                    searchTerm,
                    role: filterRole,
                    status: filterStatus,
                    page,
                    size,
                    sortBy,
                    sortDirection: direction
                });
            }
            return staffAPI.getAllStaff({ page, size, sortBy, direction });
        },
        { keepPreviousData: true }
    );

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const handleDelete = async (id, staffName) => {
        if (window.confirm(`Are you sure you want to deactivate ${staffName}?`)) {
            try {
                const currentUser = localStorage.getItem('username') || 'ADMIN';
                await staffAPI.deactivateStaff(id, currentUser);
                toast.success('Staff deactivated successfully');
                refetch();
            } catch (error) {
                toast.error(error.message || 'Failed to deactivate staff');
            }
        }
    };

    const handleClearFilters = () => {
        setFilterRole('');
        setFilterStatus('');
        setSearchTerm('');
        setPage(0);
    };

    const getStatusBadge = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800 border-green-200',
            INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
            SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
            PENDING_ACTIVATION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

    // Format full name from firstName and lastName
    const getFullName = (member) => {
        if (member.fullName) return member.fullName;
        return `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'N/A';
    };

    // Get the correct ID field
    const getMemberId = (member) => {
        return member.id || member.staffId;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading staff: {error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const staff = data?.data?.content || data?.data || [];
    const totalPages = data?.data?.totalPages || 1;
    const totalElements = data?.data?.totalElements || staff.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="section-title mb-2">Staff Directory</h2>
                    <p className="text-primary-600 font-medium mt-1">Manage and view all construction staff members</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all"
                >
                    <RefreshCw size={18} className="text-primary-700" />
                    <span className="text-primary-700 font-medium">Refresh</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="card-buildsmart p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <select
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setPage(0);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Roles</option>
                            {rolesData?.data?.map((role) => (
                                <option key={role.name} value={role.name}>
                                    {role.displayName}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(0);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Statuses</option>
                            {statusesData?.data?.map((status) => (
                                <option key={status.name} value={status.name}>
                                    {status.displayName}
                                </option>
                            ))}
                        </select>

                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>

                        {(filterRole || filterStatus || searchTerm) && (
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
                            >
                                <Filter size={16} />
                                <span>Clear Filters</span>
                            </button>
                        )}

                        <div className="ml-auto text-sm text-primary-600 flex items-center font-medium">
                            Showing {staff.length} of {totalElements} staff
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div
                        key={getMemberId(member)}
                        className="card-buildsmart group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary-100 p-3 rounded-full">
                                    <span className="text-primary-700 font-bold text-sm">
                                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary-700 group-hover:text-primary-600 transition-colors">
                                        {getFullName(member)}
                                    </h3>
                                    <p className="text-sm text-primary-600">{member.staffId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4 text-primary-600">
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail size={16} />
                                <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Phone size={16} />
                                <span>{member.phoneNumber}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                                {member.role.replace(/_/g, ' ')}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(member.status)}`}>
                                {member.status}
                            </span>
                        </div>

                        <div className="flex space-x-2 pt-4 border-t">
                            <button
                                onClick={() => onStaffSelect(getMemberId(member))}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                            >
                                <Eye size={16} />
                                <span>View</span>
                            </button>
                            <button
                                onClick={() => handleDelete(getMemberId(member), getFullName(member))}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {staff.length === 0 && (
                <div className="text-center py-12">
                    <UserCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff found</h3>
                    <p className="text-gray-600">Try adjusting your filters or add new staff members</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t">
                    <div className="text-sm text-gray-600">
                        Page {page + 1} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            <ChevronLeft size={20} />
                            <span>Previous</span>
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            <span>Next</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffList;