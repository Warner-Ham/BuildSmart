import React from 'react';
import { useQuery } from 'react-query';
import { staffAPI } from '../services/api';
import {
    Users, UserCheck, UserX, Clock, TrendingUp,
    Briefcase, FileText, DollarSign, ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ onViewStaff }) => {
    const { data: statsData, isLoading } = useQuery('statistics', staffAPI.getStatistics);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const stats = statsData?.data || {};
    const roleData = Object.entries(stats.staffByRole || {}).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value
    }));

    const statusData = Object.entries(stats.staffByStatus || {}).map(([name, value]) => ({
        name: name,
        value
    }));

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const statCards = [
        {
            title: 'Total Staff',
            value: stats.totalStaff || 0,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Active Staff',
            value: stats.activeStaff || 0,
            icon: UserCheck,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Inactive Staff',
            value: stats.inactiveStaff || 0,
            icon: UserX,
            color: 'from-gray-500 to-gray-600',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-600'
        },
        {
            title: 'Pending Activation',
            value: stats.pendingActivation || 0,
            icon: Clock,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome to BuildSmart Staff Management System</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className={card.textColor} size={24} />
                                </div>
                                <TrendingUp className="text-green-500" size={20} />
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-500">Updated just now</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staff by Role Chart */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <Briefcase className="mr-2 text-blue-600" size={24} />
                        Staff Distribution by Role
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Staff by Status Chart */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FileText className="mr-2 text-green-600" size={24} />
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
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Role Breakdown */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Staff Roles Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {roleData.map((role, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <Briefcase size={20} className="text-blue-600" />
                                <span className="text-2xl font-bold text-blue-600">{role.value}</span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-700">{role.name}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={onViewStaff}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    >
                        <div className="flex items-center space-x-3">
                            <Users size={24} />
                            <span className="font-medium">View All Staff</span>
                        </div>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl group">
                        <div className="flex items-center space-x-3">
                            <FileText size={24} />
                            <span className="font-medium">Generate Report</span>
                        </div>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl group">
                        <div className="flex items-center space-x-3">
                            <DollarSign size={24} />
                            <span className="font-medium">Budget Analysis</span>
                        </div>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="bg-green-500 rounded-full p-2">
                            <UserCheck className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New staff member activated</p>
                            <p className="text-xs text-gray-600">System automatically activated pending staff</p>
                        </div>
                        <span className="text-xs text-gray-500">2 min ago</span>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="bg-blue-500 rounded-full p-2">
                            <Users className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Staff data synchronized</p>
                            <p className="text-xs text-gray-600">All staff records updated successfully</p>
                        </div>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="bg-purple-500 rounded-full p-2">
                            <FileText className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Monthly report generated</p>
                            <p className="text-xs text-gray-600">Staff performance report for October 2025</p>
                        </div>
                        <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;