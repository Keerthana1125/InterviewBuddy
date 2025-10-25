import React, { useState, useEffect } from 'react';

// Helper function for input styling
const getInputClass = (readOnly = false) => {
  const base = "w-full px-4 py-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm";
  return readOnly
    ? `${base} border-gray-200 bg-gray-50 text-gray-700 cursor-default`
    : `${base} border-gray-300 bg-white text-gray-900`;
};

// Helper function for select styling
const getSelectClass = (readOnly = false) => {
  const base = "w-full px-4 py-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none";
  return readOnly
    ? `${base} border-gray-200 bg-gray-100 text-gray-700 cursor-default`
    : `${base} border-gray-300 bg-white text-gray-900`;
};

const WorkExperienceForm = () => {
  const [userData, setUserData] = useState({
    domain1: "",
    subdomain1: "",
    experience1: "",
    domain2: "",
    subdomain2: "",
    experience2: "",
    linkedinUrl: "",
    resumeFileName: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("workExperienceData");
    if (saved) setUserData(JSON.parse(saved));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      setUserData((prev) => ({ ...prev, resumeFileName: files[0].name }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("workExperienceData", JSON.stringify(userData));
    setIsEditing(false);
  };

  return (
    <form className="space-y-8 p-6 bg-white rounded-lg shadow-sm" onSubmit={handleSave}>
      {/* Work Experience Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
        <button
          type="button"
          onClick={toggleEditMode}
          className={`p-2 rounded-full transition-colors ${
            isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'text-purple-600 hover:bg-purple-50'
          }`}
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
      </div>

      {/* First Work Experience Entry */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <input
            type="text"
            name="domain1"
            value={userData.domain1}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="e.g. Technology"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-domain</label>
            <input
              type="text"
              name="subdomain1"
              value={userData.subdomain1}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={getInputClass(!isEditing)}
              placeholder="e.g. MERN Stack"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <select
              name="experience1"
              value={userData.experience1}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={getSelectClass(!isEditing)}
            >
              <option value="">Select an option</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-3 years">2-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-7 years">5-7 years</option>
              <option value="7-10 years">7-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Work Experience Entry */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <input
            type="text"
            name="domain2"
            value={userData.domain2}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="e.g. Technology"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-domain</label>
            <input
              type="text"
              name="subdomain2"
              value={userData.subdomain2}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={getInputClass(!isEditing)}
              placeholder="e.g. MERN Stack"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <select
              name="experience2"
              value={userData.experience2}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={getSelectClass(!isEditing)}
            >
              <option value="">Select an option</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-3 years">2-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-7 years">5-7 years</option>
              <option value="7-10 years">7-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* LinkedIn Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">LinkedIn</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL</label>
          <input
            type="url"
            name="linkedinUrl"
            value={userData.linkedinUrl}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="linkedin.com/in/mrbean"
          />
        </div>
      </div>

      {/* Resume Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
          {isEditing ? (
            <div>
              <input
                type="file"
                name="resumeFile"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-3"
              />
              <p className="mt-2 text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">
                {userData.resumeFileName || 'No file uploaded'}
              </span>
              {userData.resumeFileName && (
                <button
                  type="button"
                  className="ml-auto px-3 py-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </form>
  );
};

export default WorkExperienceForm;