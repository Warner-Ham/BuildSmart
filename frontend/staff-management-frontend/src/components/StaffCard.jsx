import React from 'react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { StaffRole, StaffStatus } from '../utils/Staff';

const StaffCard = ({ staff }) => {
    const role = StaffRole[staff.getRole()] || { displayName: staff.getRole() };
    const status = StaffStatus[staff.getStatus()] || { displayName: staff.getStatus() };

    const getStatusBadgeClass = (statusKey) => {
        const classes = {
            ACTIVE: 'bg-green-100 text-green-800',
            INACTIVE: 'bg-gray-100 text-gray-800',
            SUSPENDED: 'bg-red-100 text-red-800',
            PENDING_ACTIVATION: 'bg-blue-100 text-blue-800'
        };
        return classes[statusKey] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{staff.getFullName()}</h3>
                <User className="text-gray-400" size={20} />
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Staff ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{staff.getStaffId()}</span>
                </div>

                <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium flex items-center">
            <Mail size={14} className="mr-1" />
            Email:
          </span>
                    <span className="text-gray-900 text-xs">{staff.getEmail()}</span>
                </div>

                <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium flex items-center">
            <Phone size={14} className="mr-1" />
            Phone:
          </span>
                    <span className="text-gray-900">{staff.getPhoneNumber()}</span>
                </div>

                <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium flex items-center">
            <Shield size={14} className="mr-1" />
            Role:
          </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {role.displayName}
          </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(staff.getStatus())}`}>
            {status.displayName}
          </span>
                </div>

                <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium flex items-center">
            <Calendar size={14} className="mr-1" />
            Created:
          </span>
                    <span className="text-gray-900">{staff.getCreatedAt().toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Created By:</span>
                    <span className="text-gray-900">{staff.getCreatedBy()}</span>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;