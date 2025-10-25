import React, { useState, useEffect } from "react";

// Input styling helpers
const getInputClass = (readOnly = false) => {
  const base = "w-full px-4 py-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm";
  return readOnly
    ? `${base} border-gray-200 bg-gray-50 text-gray-700 cursor-default`
    : `${base} border-gray-300 bg-white text-gray-900`;
};

const getSelectClass = (readOnly = false) => {
  const base = "w-full px-4 py-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none";
  return readOnly
    ? `${base} border-gray-200 bg-gray-100 text-gray-700 cursor-default`
    : `${base} border-gray-300 bg-white text-gray-900`;
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 70; i--) years.push(i);
  return years;
};

const EducationSkillsForm = () => {
  const [userData, setUserData] = useState({
    schoolCollege: "",
    highestDegree: "",
    course: "",
    yearOfCompletion: "",
    grade: "",
    skills: "",
    projects: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("educationData");
    if (saved) setUserData(JSON.parse(saved));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("educationData", JSON.stringify(userData));
    setIsEditing(false);
  };

  return (
    <form className="space-y-8 p-6 bg-white rounded-lg shadow-sm" onSubmit={handleSave}>
      {/* Education Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Education Details</h3>
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

      {/* Education Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School / College</label>
          <input
            type="text"
            name="schoolCollege"
            value={userData.schoolCollege}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="e.g. Lincoln College"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highest degree</label>
          <input
            type="text"
            name="highestDegree"
            value={userData.highestDegree}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="e.g. Bachelors in Technology"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <input
            type="text"
            name="course"
            value={userData.course}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={getInputClass(!isEditing)}
            placeholder="e.g. Computer Science Engineering"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year of completion</label>
            <select
              name="yearOfCompletion"
              value={userData.yearOfCompletion}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={getSelectClass(!isEditing)}
            >
              <option value="">YYYY</option>
              {getYearOptions().map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <input
              type="text"
              name="grade"
              value={userData.grade}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={getInputClass(!isEditing)}
              placeholder="Enter here"
            />
          </div>
        </div>
      </div>

      {/* Skills & Projects */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Skills & Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <textarea
            name="skills"
            value={userData.skills}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`${getInputClass(!isEditing)} resize-none`}
            rows={5}
            placeholder="Enter skills"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
          <textarea
            name="projects"
            value={userData.projects}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`${getInputClass(!isEditing)} resize-none`}
            rows={5}
            placeholder="Enter project details"
          />
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

export default EducationSkillsForm;
