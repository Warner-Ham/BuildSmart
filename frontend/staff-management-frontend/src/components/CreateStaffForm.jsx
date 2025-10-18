import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { staffAPI } from '../services/api';
import { UserPlus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateStaffForm = ({ onSuccess }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { data: rolesData } = useQuery('roles', staffAPI.getAllRoles);

    const createMutation = useMutation(staffAPI.createStaff, {
        onSuccess: (data) => {
            toast.success('Staff created successfully!');
            queryClient.invalidateQueries('staff');
            reset();
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create staff');
        },
    });

    const onSubmit = (data) => {
        createMutation.mutate({
            ...data,
            createdBy: 'ADMIN', // In production, get from auth context
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl">
                        <UserPlus className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Add New Staff Member</h2>
                </div>
                <p className="text-gray-600">Fill in the details to create a new staff account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
                        Personal Information
                    </h3>

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
                                        message: 'First name must be 2-50 letters only'
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter first name"
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
                                        message: 'Last name must be 2-50 letters only'
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
                        Contact Information
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                        message: 'Invalid email format'
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="email@buildsmart.com"
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
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^\+?[1-9]\d{1,14}$/,
                                        message: 'Invalid phone format (use international format: +94771234567)'
                                    }
                                })}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="+94771234567"
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Selection */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
                        Role Assignment
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Staff Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.role ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a role</option>
                            {rolesData?.data?.map((role) => (
                                <option key={role.name} value={role.name}>
                                    {role.displayName} - {role.description}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        disabled={createMutation.isLoading}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {createMutation.isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Create Staff Member</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                        <X size={20} className="inline mr-2" />
                        Clear Form
                    </button>
                </div>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All fields marked with <span className="text-red-500">*</span> are required</li>
                    <li>• Email must be unique in the system</li>
                    <li>• Phone number should be in international format</li>
                    <li>• Staff will be created with ACTIVE status by default</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateStaffForm;