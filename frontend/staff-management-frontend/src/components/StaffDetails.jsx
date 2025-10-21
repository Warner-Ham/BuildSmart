import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { staffAPI } from '../services/api';
import {
    ArrowLeft, Mail, Phone, Calendar, User, Briefcase,
    Shield, Edit, Save, X, Trash2, Lock, Unlock, AlertCircle, RefreshCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const StaffDetails = ({ staffId, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { data, isLoading, error, refetch } = useQuery(
        ['staff', staffId],
        () => staffAPI.getStaffById(staffId),
        {
            retry: 2,
            onSuccess: (data) => {
                // Set form defaults when data loads
                if (data?.data) {
                    reset({
                        firstName: data.data.firstName,
                        lastName: data.data.lastName,
                        email: data.data.email,
                        phoneNumber: data.data.phoneNumber,
                        role: data.data.role,
                    });
                }
            }
        }
    );

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const updateMutation = useMutation(
        (updateData) => staffAPI.updateStaff(staffId, updateData),
        {
            onSuccess: () => {
                toast.success('Staff updated successfully!');
                queryClient.invalidateQueries(['staff', staffId]);
                queryClient.invalidateQueries('staff');
                setIsEditing(false);
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to update staff');
            },
        }
    );

    const statusMutation = useMutation(
        (statusData) => staffAPI.changeStaffStatus(staffId, statusData),
        {
            onSuccess: () => {
                toast.success('Status changed successfully!');
                queryClient.invalidateQueries(['staff', staffId]);
                queryClient.invalidateQueries('staff');
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to change status');
            },
        }
    );

    const deleteMutation = useMutation(
        () => {
            const currentUser = localStorage.getItem('username') || 'ADMIN';
            return staffAPI.deactivateStaff(staffId, currentUser);
        },
        {
            onSuccess: () => {
                toast.success('Staff deactivated successfully!');
                queryClient.invalidateQueries('staff');
                onBack();
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to deactivate staff');
            },
        }
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading staff details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <AlertCircle className="text-red-500 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Staff Details</h3>
                <p className="text-gray-600 mb-4">{error.message || 'An error occurred'}</p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => refetch()}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <RefreshCw size={18} />
                        <span>Retry</span>
                    </button>
                    <button
                        onClick={onBack}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const staff = data?.data;

    if (!staff) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">Staff not found</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Helper to get full name
    const getFullName = () => {
        if (staff.fullName) return staff.fullName;
        return `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'N/A';
    };

    const onSubmit = (formData) => {
        const currentUser = localStorage.getItem('username') || 'ADMIN';
        updateMutation.mutate({
            ...formData,
            updatedBy: currentUser
        });
    };

    const handleStatusChange = (newStatus) => {
        if (window.confirm(`Change status to ${newStatus}?`)) {
            const currentUser = localStorage.getItem('username') || 'ADMIN';
            statusMutation.mutate({
                newStatus,
                updatedBy: currentUser
            });
        }
    };

    const handleDeactivate = () => {
        if (window.confirm(`Are you sure you want to deactivate ${getFullName()}?`)) {
            deleteMutation.mutate();
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800 border-green-300',
            INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
            SUSPENDED: 'bg-red-100 text-red-800 border-red-300',
            PENDING_ACTIVATION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to List</span>
                </button>

                <div className="flex space-x-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => refetch()}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all"
                            >
                                <RefreshCw size={16} className="text-primary-700" />
                                <span className="text-primary-700 font-medium">Refresh</span>
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                            >
                                <Edit size={16} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDeactivate}
                                disabled={deleteMutation.isLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                                <span>{deleteMutation.isLoading ? 'Deactivating...' : 'Deactivate'}</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all"
                        >
                            <X size={16} />
                            <span className="font-medium">Cancel</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Staff Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-6">
                        <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                            <div className="text-3xl font-bold">
                                {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{getFullName()}</h1>
                            <p className="text-blue-100 text-lg mb-2">@{staff.username || 'N/A'}</p>
                            <p className="text-blue-100 text-sm mb-4">{staff.staffId}</p>
                            <div className="flex flex-wrap gap-3">
                                <span className={`px-4 py-2 rounded-lg font-medium border-2 ${getStatusColor(staff.status)}`}>
                                    {staff.status}
                                </span>
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
                                    {staff.role?.replace(/_/g, ' ')}
                                </span>
                                {staff.accountLocked && (
                                    <span className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg font-medium flex items-center space-x-2">
                                        <Lock size={16} />
                                        <span>Locked</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Edit Staff Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('firstName', {
                                    required: 'First name is required',
                                    pattern: {
                                        value: /^[A-Za-z\s]{2,50}$/,
                                        message: 'First name must be 2-50 letters'
                                    }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    pattern: {
                                        value: /^[A-Za-z\s]{2,50}$/,
                                        message: 'Last name must be 2-50 letters'
                                    }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                {...register('phoneNumber', {
                                    required: 'Phone number is required'
                                })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.role ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                {rolesData?.data?.map((role) => (
                                    <option key={role.name} value={role.name}>
                                        {role.displayName}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={updateMutation.isLoading}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save size={20} />
                            <span>{updateMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                /* View Mode */
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="card-buildsmart p-6">
                            <h3 className="text-lg font-bold text-primary-700 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Mail className="text-blue-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900 break-all">{staff.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Phone className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{staff.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <User className="text-indigo-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Username</p>
                                        <p className="font-medium text-gray-900">{staff.username || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Information */}
                        <div className="card-buildsmart p-6">
                            <h3 className="text-lg font-bold text-primary-700 mb-4">Role & Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <Briefcase className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-medium text-gray-900">
                                            {staff.role?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                        <Shield className="text-yellow-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="font-medium text-gray-900">{staff.status}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className={`${staff.accountLocked ? 'bg-red-100' : 'bg-green-100'} p-2 rounded-lg`}>
                                        {staff.accountLocked ? (
                                            <Lock className="text-red-600" size={20} />
                                        ) : (
                                            <Unlock className="text-green-600" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Account Status</p>
                                        <p className="font-medium text-gray-900">
                                            {staff.accountLocked ? 'Locked' : 'Unlocked'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="card-buildsmart p-6">
                            <h3 className="text-lg font-bold text-primary-700 mb-4">System Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Calendar className="text-indigo-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Created</p>
                                        <p className="font-medium text-gray-900 text-sm">
                                            {formatDate(staff.createdAt)}
                                        </p>
                                        {staff.createdBy && (
                                            <p className="text-xs text-gray-500 mt-1">By: {staff.createdBy}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-teal-100 p-2 rounded-lg">
                                        <Calendar className="text-teal-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium text-gray-900 text-sm">
                                            {formatDate(staff.updatedAt)}
                                        </p>
                                        {staff.updatedBy && (
                                            <p className="text-xs text-gray-500 mt-1">By: {staff.updatedBy}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Information */}
                        <div className="card-buildsmart p-6">
                            <h3 className="text-lg font-bold text-primary-700 mb-4">Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Calendar className="text-orange-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Last Login</p>
                                        <p className="font-medium text-gray-900 text-sm">
                                            {formatDate(staff.lastLogin)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-pink-100 p-2 rounded-lg">
                                        <AlertCircle className="text-pink-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Failed Login Attempts</p>
                                        <p className="font-medium text-gray-900">{staff.failedLoginAttempts || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick status actions removed as per UI change request */}
                </>
            )}
        </div>
    );
};

export default StaffDetails;