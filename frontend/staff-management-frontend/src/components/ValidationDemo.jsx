import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import ValidationUtils from '../services/ValidationUtils';

const ValidationDemo = () => {
    const [testInputs, setTestInputs] = useState({
        email: '',
        name: '',
        phone: ''
    });

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Email Validation Test</h4>
                <input
                    type="text"
                    value={testInputs.email}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email to test..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {testInputs.email && (
                    <div className={`mt-2 text-sm flex items-center ${ValidationUtils.isValidEmail(testInputs.email) ? 'text-green-600' : 'text-red-600'}`}>
                        {ValidationUtils.isValidEmail(testInputs.email) ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                        {ValidationUtils.isValidEmail(testInputs.email) ? 'Valid email format' : 'Invalid email format'}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Name Validation Test</h4>
                <input
                    type="text"
                    value={testInputs.name}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name to test..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {testInputs.name && (
                    <div className={`mt-2 text-sm flex items-center ${ValidationUtils.isValidName(testInputs.name) ? 'text-green-600' : 'text-red-600'}`}>
                        {ValidationUtils.isValidName(testInputs.name) ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                        {ValidationUtils.isValidName(testInputs.name) ? 'Valid name format' : 'Invalid name format (letters and spaces, 2-50 chars)'}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Phone Validation Test</h4>
                <input
                    type="text"
                    value={testInputs.phone}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number to test..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {testInputs.phone && (
                    <div className={`mt-2 text-sm flex items-center ${ValidationUtils.isValidPhoneNumber(testInputs.phone) ? 'text-green-600' : 'text-red-600'}`}>
                        {ValidationUtils.isValidPhoneNumber(testInputs.phone) ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                        {ValidationUtils.isValidPhoneNumber(testInputs.phone) ? 'Valid phone format' : 'Invalid phone format (use +country code)'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidationDemo;