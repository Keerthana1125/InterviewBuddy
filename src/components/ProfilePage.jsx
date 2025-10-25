import React, { useState, useEffect } from "react";
import BasicDetailsForm from "./BasicDetailsForm";
import EducationSkillsForm from "./EducationSkillsForm"; 
import WorkExperienceForm from "./WorkExperienceForm";
import "../index.css"; 

// A simple custom hook to manage state persistence in localStorage
const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error reading localStorage key '" + key + "': ", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting localStorage key '" + key + "': ", error);
        }
    }, [key, value]);

    return [value, setValue];
};


// Default data with empty strings to prevent saving placeholder text.
const DEFAULT_USER_DATA = {
    // Basic Details
    firstName: '',
    lastName: '',
    email: '', 
    phoneCountryCode: '+91',
    phone: '', 
    altPhone: '', 
    dateOfBirth: '', 
    gender: '',
    address: '', 
    pincode: '', 
    domicileState: '',
    domicileCountry: '',
};

// State keys corresponding to the forms' editing status
const FORM_EDIT_KEYS = {
    'basicInfo': 'isEditingBasic',
};


const ProfilePage = ({ onToggle }) => { 
    // Use local storage hook to load/save profile data
    const [userData, setUserData] = useLocalStorage('profileData', DEFAULT_USER_DATA); 
    
    // Load active tab from localStorage or default to 'basicInfo'
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('activeProfileTab');
        return savedTab || 'basicInfo';
    });
    
    // State to hold temporary edits before they are saved. 
    const [draftUserData, setDraftUserData] = useState(userData);

    // Sync draft with userData when userData changes (e.g., initial load or successful save)
    useEffect(() => {
        setDraftUserData(userData);
    }, [userData]);

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('activeProfileTab', activeTab);
    }, [activeTab]);


    // State to manage editing status for each tab separately
    const [editStatus, setEditStatus] = useState({
        isEditingBasic: false,
    });


    // Toggle edit mode for the currently active tab
    const toggleEditMode = () => {
        const key = FORM_EDIT_KEYS[activeTab];
        
        // If CANCELING edit mode, revert the draft data back to the saved userData
        if (editStatus[key]) {
             setDraftUserData(userData);
        }
        
        setEditStatus(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Handle save for the currently active tab (on Save button click)
    const handleSave = (e) => {
        e.preventDefault(); 
        
        // 1. Commit the draft changes to the main userData state, which triggers useLocalStorage to save.
        setUserData(draftUserData); 

        // 2. Turn off edit mode.
        const key = FORM_EDIT_KEYS[activeTab];
         setEditStatus(prev => ({
            ...prev,
            [key]: false,
        }));
        
        console.log(`${activeTab} saved! Data persisted to localStorage.`);
    };

    // Handle input change on the DRAFT data when in edit mode
    const handleInputChange = (e) => {
        const { id, name, value, files } = e.target;
        const fieldName = id || name;
        
        // Handle file uploads
        if (files && files[0]) {
            setDraftUserData(prevData => ({
                ...prevData,
                resumeFileName: files[0].name,
            }));
            return;
        }
        
        // Changes are applied to DRAFT state, not directly to userData
        setDraftUserData(prevData => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const renderContent = () => {
        const isEditingCurrent = editStatus[FORM_EDIT_KEYS[activeTab]];

        switch (activeTab) {
            case 'basicInfo':
                return (
                    <BasicDetailsForm 
                        userData={isEditingCurrent ? draftUserData : userData} 
                        onInputChange={handleInputChange}
                        isEditing={isEditingCurrent} 
                        toggleEditMode={toggleEditMode}
                        handleSave={handleSave}
                    />
                );
            case 'educationSkills':
                return <EducationSkillsForm />;
            case 'experience':
                return <WorkExperienceForm />;
            default:
                return null;
        }
    };

    // Header data uses the SAVED state (userData), not the draft
    const profileHeaderData = {
        name: `${userData.firstName || 'User'} ${userData.lastName || 'Name'}`,
        email: userData.email || 'email@example.com',
        phone: userData.phone ? `${userData.phoneCountryCode} ${userData.phone}` : '+91 8332883854',
    };
    
    // Disable tabs if basic info tab is currently being edited
    const isEditingAny = editStatus.isEditingBasic;

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            
            {/* Header Structure */}
             <header className="bg-white border-b px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start justify-center leading-none gap-0.5 whitespace-nowrap">
                        <div className="bg-white text-black font-bold px-2 py-1 border-2 border-black">
                            LOGO
                        </div>
                        <div className="text-[7px] text-gray-500 mt-1 text-center font-medium mx-auto">ESTD <br />2025</div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" aria-label="Support">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" aria-label="Notifications">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={onToggle} 
                        className="p-1 border border-purple-400 rounded-full hover:shadow-md transition-shadow" 
                        aria-label="Back to Dashboard"
                    >
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-purple-600">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                           </svg>
                        </div>
                    </button>
                </div>
            </header>

            <main className="profile-container p-8 md:p-12 lg:px-20 mx-auto w-full max-w-screen-2xl">
                
                {/* Profile Header Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-28 h-28 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 border border-purple-200 flex-shrink-0">
                           <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                           </svg>
                        </div>
                        
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mt-2">{profileHeaderData.name}</h1>
                            <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.85-5.91a2 2 0 012.3 0L21 8m-2 7.42V19a2 2 0 01-2 2H7a2 2 0 01-2-2v-3.58a2 2 0 01.75-1.59l4.47-3.35a2 2 0 012.56 0l4.47 3.35a2 2 0 01.75 1.59z" /></svg>
                                {profileHeaderData.email}
                            </p>
                            <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                {profileHeaderData.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-0 bg-white shadow-sm rounded-t-xl overflow-hidden">
                    <button 
                        onClick={() => setActiveTab('basicInfo')}
                        disabled={isEditingAny}
                        className={
                            `px-4 py-3 text-sm font-medium transition-colors 
                            ${activeTab === 'basicInfo' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'} 
                            ${isEditingAny ? 'cursor-not-allowed opacity-60' : ''}`
                        }
                    >
                        Basic Info
                    </button>
                    <button 
                        onClick={() => setActiveTab('educationSkills')}
                        disabled={isEditingAny}
                        className={
                            `px-4 py-3 text-sm font-medium transition-colors 
                            ${activeTab === 'educationSkills' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'} 
                            ${isEditingAny ? 'cursor-not-allowed opacity-60' : ''}`
                        }
                    >
                        Education & skills
                    </button>
                    <button 
                        onClick={() => setActiveTab('experience')}
                        disabled={isEditingAny}
                        className={
                            `px-4 py-3 text-sm font-medium transition-colors 
                            ${activeTab === 'experience' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'} 
                            ${isEditingAny ? 'cursor-not-allowed opacity-60' : ''}`
                        }
                    >
                        Experience
                    </button>
                </div>

                {/* Content Area */}
                <section className="bg-white p-6 rounded-b-xl shadow-lg border-t-0">
                    {renderContent()}
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;