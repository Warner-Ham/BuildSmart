import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = ({ onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                username: data.username,
                password: data.password
            });

            if (response.data.success) {
                const { token, username, fullName, role, staffId, email } = response.data.data;

                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('fullName', fullName);
                localStorage.setItem('role', role);
                localStorage.setItem('staffId', staffId);
                localStorage.setItem('email', email);

                toast.success('Login successful!');
                onLoginSuccess(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">BuildSmart</h1>
                    <p className="text-blue-100">Staff Management System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your username"
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Login</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 text-center border-t">
                    <p className="text-sm text-gray-600">
                        Default: <span className="font-mono font-bold">admin / admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;