import React from 'react';

const tabs = [
    { id: 'basicInfo', label: 'Basic Info' },
    { id: 'educationSkills', label: 'Education & skills' },
    { id: 'experience', label: 'Experience' },
];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="profile-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default ProfileTabs;