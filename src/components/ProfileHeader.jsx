// src/components/ProfileHeader.jsx

import React from 'react';

// NOTE: This component is styled using Tailwind CSS classes.
const ProfileHeader = ({ name, email, phone }) => {
    return (
        // The main container for the profile summary
        <div className="flex items-center pb-6 border-b border-gray-200">
            {/* Avatar Circle */}
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-100 mr-6 shadow-md border border-purple-300">
                <span className="text-4xl text-purple-600">👤</span>
            </div>

            {/* Profile Details (Name, Email, Phone) */}
            <div className="profile-details">
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">{name}</h1>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                    {email} 
                    <span className="text-purple-500 ml-2 text-xs">🔗</span>
                </p>
                <p className="text-sm text-gray-500">{phone}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;