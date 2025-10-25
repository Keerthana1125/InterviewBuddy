// src/components/BasicDetailsForm.jsx - MODIFIED

import React from 'react';

// List of Indian states
const INDIAN_STATES = [
    "Select an option", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// List of countries for the Domicile Country dropdown
const DOMICILE_COUNTRIES = [
    "Select an option", "India", "United States", "United Kingdom", "Canada", "Australia", 
    "Germany", "France", "Japan", "Brazil"
];


// List of phone codes with flags
const PHONE_COUNTRIES = [
    { code: '+91', flag: '🇮🇳', country: 'India' },
    { code: '+1', flag: '🇺🇸', country: 'USA/Canada' },
    { code: '+44', flag: '🇬🇧', country: 'UK' },
    { code: '+61', flag: '🇦🇺', country: 'Australia' },
    { code: '+81', flag: '🇯🇵', country: 'Japan' },
    { code: '+49', flag: '🇩🇪', country: 'Germany' },
];

const BasicDetailsForm = ({ userData, onInputChange, isEditing, toggleEditMode, handleSave }) => {
    
    // Find the currently selected country for the flag display
    const currentCountry = PHONE_COUNTRIES.find(
        c => c.code === userData.phoneCountryCode
    ) || PHONE_COUNTRIES[0]; 

    // Helper function for standard input styles
    const getInputClass = (readOnlyOverride = false) => {
        const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm";
        
        // Use readOnlyOverride (for Email) or check isEditing
        if (!isEditing || readOnlyOverride) {
            return `${baseClasses} border-gray-200 bg-gray-50 text-gray-700 cursor-default`;
        }
        return `${baseClasses} border-gray-300 bg-white text-gray-900`;
    };

    // Helper function for SELECT styles
    const getSelectClass = () => {
        const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none";
        
        if (!isEditing) {
            return `${baseClasses} border-gray-200 bg-gray-50 text-gray-700 cursor-default`;
        }
        return `${baseClasses} border-gray-300 bg-white text-gray-900`;
    };


    return (
        <form className="space-y-6" onSubmit={handleSave}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
                Basic Details
                   <button 
                       type="button"
                       onClick={toggleEditMode} 
                       className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'text-purple-600 hover:bg-purple-50'}`} 
                       aria-label={isEditing ? "Cancel Editing" : "Edit Basic Details"}
                   >
                       {isEditing ? (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                       ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z" />
                            </svg>
                       )}
                   </button>
            </h2>

            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={userData.firstName}
                        onChange={onInputChange}
                        // TOGGLED: Editable when isEditing is TRUE
                        readOnly={!isEditing} 
                        className={getInputClass()}
                        placeholder="e.g. John" 
                    />
                </div>
                
                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={userData.lastName}
                        onChange={onInputChange}
                        // TOGGLED: Editable when isEditing is TRUE
                        readOnly={!isEditing} 
                        className={getInputClass()}
                        placeholder="e.g. Doe" 
                    />
                </div>
                
                {/* E-mail ID (Permanently Read-Only) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email ID
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={userData.email}
                        readOnly 
                        disabled 
                        className={getInputClass(true)} // Uses permanent read-only style
                        placeholder="e.g. mrnobody@mail.com"
                    />
                </div>
            </div>

            {/* Row 2: DOB, Gender, Phone, Alt Phone */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Date of Birth */}
                <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                    </label>
                    <input
                        type="date" 
                        id="dateOfBirth"
                        value={userData.dateOfBirth}
                        onChange={onInputChange}
                        // TOGGLED: Editable when isEditing is TRUE
                        readOnly={!isEditing} 
                        className={getInputClass()}
                    />
                </div>

                {/* Gender (Select) */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        id="gender"
                        value={userData.gender}
                        onChange={onInputChange}
                        // TOGGLED: Enabled when isEditing is TRUE
                        disabled={!isEditing} 
                        className={getSelectClass()} 
                    >
                        <option disabled value="Select an option">Select an option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                {/* Phone Number (Country Select + Input) */}
                <div className="md:col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone number
                    </label>
                    <div className="flex">
                        {/* Country Code Select and Flag */}
                        <div className="relative">
                            <select
                                id="phoneCountryCode"
                                value={userData.phoneCountryCode}
                                onChange={onInputChange}
                                // TOGGLED: Enabled when isEditing is TRUE
                                disabled={!isEditing} 
                                className={`pl-12 pr-6 py-2 border rounded-l-lg focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none ${!isEditing ? 'border-gray-200 bg-gray-50 text-gray-700 cursor-default' : 'border-gray-300 bg-white text-gray-900'}`}
                                style={{ minWidth: '75px' }}
                            >
                                {PHONE_COUNTRIES.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.code}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-lg">{currentCountry.flag}</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg className={`w-4 h-4 ${!isEditing ? 'text-gray-500' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        
                        {/* Phone Input */}
                        <input
                            type="text"
                            id="phone"
                            value={userData.phone}
                            onChange={onInputChange}
                            // TOGGLED: Editable when isEditing is TRUE
                            readOnly={!isEditing} 
                            className={`w-full px-4 py-2 border border-l-0 rounded-r-lg focus:ring-purple-500 focus:border-purple-500 text-sm ${!isEditing ? 'border-gray-200 bg-gray-50 text-gray-700 cursor-default' : 'border-gray-300 bg-white text-gray-900'}`}
                            placeholder="Type here"
                        />
                    </div>
                </div>
                
                {/* Alternate Phone No */}
                <div>
                    <label htmlFor="altPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Alternate Phone no
                    </label>
                    <input
                        type="text"
                        id="altPhone"
                        value={userData.altPhone}
                        onChange={onInputChange}
                        // TOGGLED: Editable when isEditing is TRUE
                        readOnly={!isEditing} 
                        className={getInputClass()}
                        placeholder="e.g. 9876543210" 
                    />
                </div>
            </div>

            {/* NEW ROW: Address and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Address (Text Area) */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>
                    <textarea 
                        id="address"
                        rows="10" 
                        value={userData.address}
                        onChange={onInputChange}
                        // TOGGLED: Editable when isEditing is TRUE
                        readOnly={!isEditing} 
                        className={`${getInputClass()} resize-none`} 
                        placeholder="Enter street address and city" 
                    />
                </div>
                
                {/* Right Column: Pincode, State, Country */}
                <div className="space-y-6"> 
                    
                    {/* Row A: Pincode and Domicile State */}
                    <div className="grid grid-cols-2 gap-6">
                        
                        {/* Pincode */}
                        <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                                Pincode
                            </label>
                            <input
                                type="text"
                                id="pincode"
                                value={userData.pincode}
                                onChange={onInputChange}
                                // TOGGLED: Editable when isEditing is TRUE
                                readOnly={!isEditing} 
                                className={getInputClass()}
                                placeholder="Enter here" 
                            />
                        </div>

                        {/* Domicile State (Select) */}
                        <div>
                            <label htmlFor="domicileState" className="block text-sm font-medium text-gray-700 mb-2">
                                Domicile state
                            </label>
                            <select
                                id="domicileState"
                                value={userData.domicileState}
                                onChange={onInputChange}
                                // TOGGLED: Enabled when isEditing is TRUE
                                disabled={!isEditing} 
                                className={getSelectClass()} 
                            >
                                {INDIAN_STATES.map(state => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Row B: Domicile Country (Pincode width) */}
                    <div className="grid grid-cols-2 gap-6"> 
                        <div>
                            <label htmlFor="domicileCountry" className="block text-sm font-medium text-gray-700 mb-2">
                                Domicile country
                            </label>
                            <select
                                id="domicileCountry"
                                value={userData.domicileCountry}
                                onChange={onInputChange}
                                // TOGGLED: Enabled when isEditing is TRUE
                                disabled={!isEditing} 
                                className={getSelectClass()} 
                            >
                                {DOMICILE_COUNTRIES.map(country => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Second column remains empty */}
                        <div />
                    </div>
                </div>

            </div>

            {/* Save Button Bar - Only Visible When Editing */}
            {isEditing && (
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit" 
                        className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-md"
                    >
                        Save
                    </button>
                </div>
            )}
        </form>
    );
};

export default BasicDetailsForm;