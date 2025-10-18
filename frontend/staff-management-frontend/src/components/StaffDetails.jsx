import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { staffAPI } from '../services/api';
import {
    ArrowLeft, Mail, Phone, Calendar, User, Briefcase,
    Shield, Edit, Save, X, Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const StaffDetails = ({ staffId, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { data, isLoading, error } = useQuery(
        ['staff', staffId],
        () => staffAPI.getStaffById(staffId)
    );

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);
    const { data: statusesData } = useQuery('statuses', staffAPI.getAllStatuses);

    const updateMutation = useMutation(
        (updateData) => staffAPI.updateStaff(staffId, updateData),
        {
            onSuccess: () => {
                toast.success('Staff updated successfully!');
                queryClient.invalidateQueries(['staff', staffId]);
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
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to change status');
            },
        }
    );

    const deleteMutation = useMutation(
        () => staffAPI.deactivateStaff(staffId, 'ADMIN'),
        {
            onSuccess: () => {
                toast.success('Staff deactivated successfully!');
                onBack();
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to deactivate staff');
            },
        }
    );

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
                <p className="text-red-600 text-lg">Error loading staff details</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const staff = data?.data;

    const onSubmit = (formData) => {
        updateMutation.mutate({
            ...formData,
            updatedBy: 'ADMIN'
        });
    };

    const handleStatusChange = (newStatus) => {
        if (window.confirm(`Change status to ${newStatus}?`)) {
            statusMutation.mutate({
                newStatus,
                updatedBy: 'ADMIN'
            });
        }
    };

    const handleDeactivate = () => {
        if (window.confirm(`Are you sure you want to deactivate ${staff.fullName}?`)) {
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
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit size={16} />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDeactivate}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={16} />
                                <span>Deactivate</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <X size={16} />
                            <span>Cancel</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Staff Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                            <User size={48} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{staff.fullName}</h1>
                            <p className="text-blue-100 text-lg mb-4">{staff.staffId}</p>
                            <div className="flex space-x-3">
                <span className={`px-4 py-2 rounded-lg font-medium border-2 ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
                  {staff.role.replace(/_/g, ' ')}
                </span>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                defaultValue={staff.firstName}
                                {...register('firstName', { pattern: /^[A-Za-z\s]{2,50}$/ })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                defaultValue={staff.lastName}
                                {...register('lastName', { pattern: /^[A-Za-z\s]{2,50}$/ })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue={staff.email}
                                {...register('email')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue={staff.phoneNumber}
                                {...register('phoneNumber')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                defaultValue={staff.role}
                                {...register('role')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {rolesData?.data?.map((role) => (
                                    <option key={role.name} value={role.name}>
                                        {role.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updateMutation.isLoading}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={20} />
                        <span>{updateMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            ) : (
                /* View Mode */
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Mail className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{staff.email}</p>
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
                            </div>
                        </div>

                        {/* Role Information */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Role & Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <Briefcase className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-medium text-gray-900">
                                            {staff.role.replace(/_/g, ' ')}
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
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">System Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Calendar className="text-indigo-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Created</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(staff.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-pink-100 p-2 rounded-lg">
                                        <User className="text-pink-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Created By</p>
                                        <p className="font-medium text-gray-900">{staff.createdBy}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Information */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-teal-100 p-2 rounded-lg">
                                        <Calendar className="text-teal-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium text-gray-900">
                                            {staff.updatedAt ? new Date(staff.updatedAt).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Calendar className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Login</p>
                                        <p className="font-medium text-gray-900">
                                            {staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Change Actions */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Status Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {statusesData?.data?.map((status) => (
                                <button
                                    key={status.name}
                                    onClick={() => handleStatusChange(status.name)}
                                    disabled={staff.status === status.name || statusMutation.isLoading}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        staff.status === status.name
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400'
                                    }`}
                                >
                                    {status.displayName}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StaffDetails;