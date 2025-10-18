import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import {
    ChevronLeft, ChevronRight, Search, Filter,
    Mail, Phone, UserCircle, Eye, Trash2, Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

const StaffList = ({ onStaffSelect }) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState('firstName');
    const [direction, setDirection] = useState('asc');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const { data, isLoading, error, refetch } = useQuery(
        ['staff', page, size, sortBy, direction],
        () => staffAPI.getAllStaff({ page, size, sortBy, direction }),
        { keepPreviousData: true }
    );

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const handleDelete = async (id, staffName) => {
        if (window.confirm(`Are you sure you want to deactivate ${staffName}?`)) {
            try {
                await staffAPI.deactivateStaff(id, 'ADMIN');
                toast.success('Staff deactivated successfully');
                refetch();
            } catch (error) {
                toast.error('Failed to deactivate staff');
            }
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800 border-green-200',
            INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
            SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
            PENDING_ACTIVATION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getRoleBadge = (role) => {
        const colors = {
            ADMIN: 'bg-purple-100 text-purple-800',
            SITE_ENGINEER: 'bg-blue-100 text-blue-800',
            DOCUMENT_CONTROL_MANAGER: 'bg-indigo-100 text-indigo-800',
            SITE_STAFF: 'bg-cyan-100 text-cyan-800',
            BUDGET_PLANNING_TEAM: 'bg-teal-100 text-teal-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
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

    const staff = data?.data?.content || [];
    const totalPages = data?.data?.totalPages || 0;
    const totalElements = data?.data?.totalElements || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Staff Directory</h2>
                    <p className="text-gray-600 mt-1">
                        Manage and view all construction staff members
                    </p>
                </div>
                <div className="text-sm text-gray-600">
                    Showing {staff.length} of {totalElements} staff
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl">
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
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
                    onChange={(e) => setFilterStatus(e.target.value)}
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
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-200 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full">
                                    <UserCircle className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {member.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{member.staffId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
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
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                {member.role.replace(/_/g, ' ')}
              </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(member.status)}`}>
                {member.status}
              </span>
                        </div>

                        <div className="flex space-x-2 pt-4 border-t">
                            <button
                                onClick={() => onStaffSelect(member.id)}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Eye size={16} />
                                <span>View</span>
                            </button>
                            <button
                                onClick={() => handleDelete(member.id, member.fullName)}
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
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffList;