import React from 'react';

const StatCard = ({ title, value, icon: Icon, bgColor = "bg-blue-500" }) => (
    <div className={`${bgColor} text-white rounded-lg p-6 shadow-lg`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm opacity-90 uppercase tracking-wide">{title}</p>
            </div>
            <Icon size={32} className="opacity-75" />
        </div>
    </div>
);

export default StatCard;