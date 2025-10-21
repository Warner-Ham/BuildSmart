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
        <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                {/* Header - BuildSmart Green Gradient */}
                <div className="bg-gradient-to-r from-primary-700 to-primary-600 p-8 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12"></div>

                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center relative z-10">
                        <Lock className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 relative z-10" style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                        BuildSmart
                    </h1>
                    <p className="text-primary-50 relative z-10">Staff Management System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div>
                        <label className="form-label">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
                            <input
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className={`form-input pl-10 ${
                                    errors.username ? 'border-red-500' : ''
                                }`}
                                placeholder="Enter your username"
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="form-label">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className={`form-input pl-10 pr-12 ${
                                    errors.password ? 'border-red-500' : ''
                                }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
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
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-700"></div>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Login</span>
                            </>
                        )}
                    </button>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-primary-100">
                        <p className="text-center text-xs text-primary-600 mb-2">
                            🔒 Secure Authentication
                        </p>
                    </div>
                </form>

                {/* Footer - BuildSmart Style */}
                <div className="bg-gradient-buildsmart px-8 py-4 text-center border-t-2 border-primary-200">
                    <p className="text-sm text-primary-700 font-medium">
                        Default: <span className="font-mono font-bold bg-white px-2 py-1 rounded">admin / admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;