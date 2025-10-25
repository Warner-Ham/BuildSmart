import React from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import {
    Users, UserCheck, UserX, Clock, TrendingUp,
    Briefcase, FileText, RefreshCw, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ onViewStaff }) => {
    const { data: statsData, isLoading, isError, error, refetch } = useQuery(
        'statistics',
        staffAPI.getStatistics,
        {
            retry: 2,
            refetchOnWindowFocus: false,
        }
    );

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mb-4"></div>
                <p className="text-primary-600 font-medium">Loading dashboard data...</p>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
                <AlertCircle className="text-red-500 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
                <p className="text-gray-600 mb-4">{error?.message || 'An error occurred'}</p>
                <button
                    onClick={() => refetch()}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <RefreshCw size={18} />
                    <span>Retry</span>
                </button>
            </div>
        );
    }

    const stats = statsData?.data || {};

    // Prepare role data with fallback
    const roleData = stats.staffByRole
        ? Object.entries(stats.staffByRole).map(([name, value]) => ({
            name: name.replace(/_/g, ' '),
            value
        }))
        : [];

    // Prepare status data with fallback
    const statusData = stats.staffByStatus
        ? Object.entries(stats.staffByStatus).map(([name, value]) => ({
            name: name,
            value
        }))
        : [];

    // BuildSmart Color Palette
    const COLORS = ['#287a2c', '#4caf50', '#81c784', '#a8e063', '#c8e6c9'];

    const statCards = [
        {
            title: 'Total Staff',
            value: stats.totalStaff || 0,
            icon: Users,
            color: 'from-primary-700 to-primary-600',
            bgColor: 'bg-primary-50',
            textColor: 'text-primary-700',
            change: '+12%'
        },
        {
            title: 'Active Staff',
            value: stats.activeStaff || 0,
            icon: UserCheck,
            color: 'from-primary-600 to-primary-500',
            bgColor: 'bg-accent-100',
            textColor: 'text-primary-600',
            change: '+8%'
        },
        {
            title: 'Inactive Staff',
            value: stats.inactiveStaff || 0,
            icon: UserX,
            color: 'from-gray-500 to-gray-600',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-600',
            change: '-3%'
        },
        {
            title: 'Pending Activation',
            value: stats.pendingActivation || 0,
            icon: Clock,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            change: '+5%'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="section-title mb-2">Dashboard Overview</h2>
                    <p className="text-primary-600 font-medium">Welcome to BuildSmart Staff Management System</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all"
                >
                    <RefreshCw size={18} className="text-primary-700" />
                    <span className="text-primary-700 font-medium">Refresh</span>
                </button>
            </div>

            {/* Stats Cards - BuildSmart Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="card-buildsmart cursor-pointer group"
                            onClick={onViewStaff}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-buildsmart-sm`}>
                                    <Icon className={card.textColor} size={24} />
                                </div>
                                <div className="flex items-center space-x-1 text-primary-600 text-sm font-bold">
                                    <TrendingUp size={16} />
                                    <span>{card.change}</span>
                                </div>
                            </div>
                            <h3 className="text-primary-600 text-sm font-semibold mb-1 uppercase tracking-wide">{card.title}</h3>
                            <p className="text-4xl font-bold text-primary-700">{card.value}</p>
                            <div className="mt-4 pt-4 border-t border-primary-200">
                                <span className="text-xs text-primary-500 font-medium">Updated just now</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            {(roleData.length > 0 || statusData.length > 0) ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Staff by Role Chart */}
                    {roleData.length > 0 && (
                        <div className="card-buildsmart">
                            <h3 className="text-xl font-bold text-primary-700 mb-6 flex items-center">
                                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                                    <Briefcase className="text-primary-700" size={24} />
                                </div>
                                Staff Distribution by Role
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={roleData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#c8e6c9" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        style={{ fontSize: '12px', fill: '#205c20' }}
                                    />
                                    <YAxis style={{ fontSize: '12px', fill: '#205c20' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '2px solid #a5d6a7',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#287a2c"
                                        radius={[8, 8, 0, 0]}
                                        animationDuration={1000}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Staff by Status Chart */}
                    {statusData.length > 0 && (
                        <div className="card-buildsmart">
                            <h3 className="text-xl font-bold text-primary-700 mb-6 flex items-center">
                                <div className="bg-accent-100 p-2 rounded-lg mr-3">
                                    <FileText className="text-primary-600" size={24} />
                                </div>
                                Staff Status Overview
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        animationDuration={1000}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '2px solid #a5d6a7',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card-buildsmart text-center py-12">
                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart className="text-primary-400" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-primary-700 mb-2">No Data Available</h3>
                    <p className="text-primary-600">Add staff members to see charts and analytics</p>
                </div>
            )}

            {/* Role Breakdown */}
            {roleData.length > 0 && (
                <div className="bg-gradient-buildsmart border-4 border-white outline outline-2 outline-primary-200 rounded-2xl p-6 shadow-buildsmart-md">
                    <h3 className="text-xl font-bold text-primary-700 mb-6">Staff Roles Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {roleData.map((role, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 border-2 border-primary-200 hover:shadow-buildsmart-lg hover:border-accent-500 transition-all cursor-pointer group"
                                onClick={onViewStaff}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="bg-primary-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <Briefcase size={20} className="text-primary-700" />
                                    </div>
                                    <span className="text-2xl font-bold text-primary-700">{role.value}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-primary-600">{role.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions removed per request */}

            {/* Recent Activity */}
            <div className="card-buildsmart">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-primary-700">Recent Activity</h3>
                    <span className="text-sm text-primary-500 font-medium bg-primary-50 px-3 py-1 rounded-full">Last 24 hours</span>
                </div>
                <div className="space-y-4">
                    {stats.totalStaff > 0 ? (
                        <>
                            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border-2 border-primary-200 hover:shadow-buildsmart-md transition-all">
                                <div className="bg-primary-600 rounded-full p-2 shadow-buildsmart-sm">
                                    <UserCheck className="text-white" size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-primary-700">Staff members activated</p>
                                    <p className="text-xs text-primary-600">{stats.activeStaff} staff members are currently active</p>
                                </div>
                                <span className="text-xs text-primary-500 font-medium">Now</span>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border-2 border-primary-200 hover:shadow-buildsmart-md transition-all">
                                <div className="bg-accent-500 rounded-full p-2 shadow-buildsmart-sm">
                                    <Users className="text-white" size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-primary-700">Total staff count</p>
                                    <p className="text-xs text-primary-600">{stats.totalStaff} staff members in the system</p>
                                </div>
                                <span className="text-xs text-primary-500 font-medium">Now</span>
                            </div>

                            {stats.pendingActivation > 0 && (
                                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border-2 border-yellow-200 hover:shadow-buildsmart-md transition-all">
                                    <div className="bg-yellow-500 rounded-full p-2 shadow-buildsmart-sm">
                                        <Clock className="text-white" size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Pending activation</p>
                                        <p className="text-xs text-gray-600">{stats.pendingActivation} staff members awaiting activation</p>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Now</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="text-primary-400" size={32} />
                            </div>
                            <p className="text-primary-700 font-semibold">No recent activity</p>
                            <p className="text-sm text-primary-600 mt-2">Add staff members to see activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;