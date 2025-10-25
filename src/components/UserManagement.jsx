// src/components/UserManagement.jsx

import React, { useState, useEffect } from 'react';

// --- CDN Imports for Firebase (Required for the environment) ---
import { getAuth, signInAnonymously, signInWithCustomToken } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getFirestore, collection, onSnapshot, doc, addDoc, deleteDoc, query } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// --- Global Firebase Variables (Mandatory for Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Helper function for safe logging
const safeConsoleLog = (...args) => {
  if (typeof console !== 'undefined' && console.log) {
    console.log(...args);
  }
};

// Component to display a simple toast notification
const Toast = ({ message, onClose }) => {
  if (!message) return null;

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] p-4 bg-purple-600 text-white rounded-xl shadow-xl flex items-center gap-4 transition-opacity duration-300 animate-fadeInOut" role="alert">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-purple-700" aria-label="Close notification">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Main Application Component
export default function UserManagement({ onToggleProfile }) { // <-- Accepts the toggle function
  // Authentication & Firestore State
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application State
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [formData, setFormData] = useState({ name: '', email: '', contact: '' });
  const [toastMessage, setToastMessage] = useState('');

  // --- Firebase Initialization and Authentication ---
  useEffect(() => {
    let unsubscribeAuth = () => {};
    
    try {
      if (Object.keys(firebaseConfig).length > 0) {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);

        const authenticate = async () => {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            safeConsoleLog("Firebase authentication failed:", error);
            setUserId(crypto.randomUUID()); 
          }
        };

        unsubscribeAuth = firebaseAuth.onAuthStateChanged(user => {
          if (user) {
            setUserId(user.uid);
          } else {
            setUserId(crypto.randomUUID());
          }
          setLoading(false);
        });

        authenticate();
      } else {
        safeConsoleLog("Firebase config is missing. Running in mock data mode.");
        setLoading(false);
        // Mock data if Firestore is not available (for demonstration)
        setUsers([
            { id: '1', name: 'Dave Richards', email: 'dave@mail.com', contact: '555-0101' },
            { id: '2', name: 'Abhishek Hari', email: 'hari@mail.com', contact: '555-0102' },
            { id: '3', name: 'Nishta Gupta', email: 'nishta@mail.com', contact: '555-0103' }
        ]);
      }
    } catch (error) {
      safeConsoleLog("Firebase initialization failed:", error);
      setLoading(false);
    }
    
    return () => unsubscribeAuth();
  }, []);

  // --- Firestore Data Listener ---
  useEffect(() => {
    let unsubscribeFirestore = () => {};

    if (db && userId) {
      const userCollectionPath = `/artifacts/${appId}/users/${userId}/users_collection`;
      const q = query(collection(db, userCollectionPath));

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const fetchedUsers = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        const sortedUsers = fetchedUsers.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
      }, (error) => {
        safeConsoleLog("Error listening to users collection:", error);
        showToast('Error loading users. Check console for details.');
      });
    }

    return () => unsubscribeFirestore();
  }, [db, userId]);

  // --- Drawer/Form Logic ---
  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ name: '', email: '', contact: '' });
  };

  const handleDelete = async (id) => {
    if (!db || !userId) {
      setUsers(users.filter(user => user.id !== id));
      showToast('User deleted (mock mode).');
      return;
    }

    try {
      const docRef = doc(db, `/artifacts/${appId}/users/${userId}/users_collection`, id);
      await deleteDoc(docRef);
      showToast('User deleted successfully!');
    } catch (error) {
      safeConsoleLog("Error deleting user:", error);
      showToast('Failed to delete user.');
    }
  };

  const handleView = (user) => {
    showToast(`Viewing details for ${user.name} - Check console`);
    safeConsoleLog(`View Details:\nName: ${user.name}\nEmail: ${user.email}\nContact: ${user.contact || 'N/A'}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please fill in required fields (Name and E-mail).');
      return;
    }

    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      contact: formData.contact.trim() || 'N/A',
      createdAt: new Date().toISOString()
    };

    if (!db || !userId) {
      const mockId = (Math.random() * 1000).toFixed(0).toString();
      setUsers(prev => [...prev, { ...newUser, id: mockId }]);
      handleCloseDrawer();
      showToast(`User ${newUser.name} added successfully (mock mode)!`);
      return;
    }

    try {
      const userCollectionRef = collection(db, `/artifacts/${appId}/users/${userId}/users_collection`);
      await addDoc(userCollectionRef, newUser);
      handleCloseDrawer();
      showToast(`User ${newUser.name} added successfully!`);
    } catch (error) {
      safeConsoleLog("Error adding user:", error);
      showToast('Failed to add user.');
    }
  };
  
  const displayUsers = users; 

  // Custom Loading Indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-600"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-600"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-purple-600"></div>
          <p className="text-gray-600 font-medium">Loading Application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased relative">
      <style>
        {`
          /* Animation for toast */
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut 3s ease-out forwards;
          }
        `}
      </style>
      
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header: Logo, Plain Area, and Icons (Matching the requested layout) */}
      <header className="bg-white border-b px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-start justify-center leading-none gap-0.5 whitespace-nowrap">
               <div className="bg-white text-black font-bold px-2 py-1 border-2 border-black">
                  LOGO
               </div>
                <div className="text-[7px] text-gray-500 mt-1 text-center font-medium mx-auto">ESTD <br />2025</div>
            </div>
            
            {/* Plain area for the search bar (kept empty as per the image) */}
            <div className="hidden md:block w-96"></div>
        </div>
        
        {/* Right Section: Icons */}
        <div className="flex items-center gap-1.5">
          {/* Headset/Support Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" aria-label="Support">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          {/* Notification Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" aria-label="Notifications">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          {/* User Profile Icon - CRITICAL: Toggles to ProfilePage */}
          <button 
            onClick={onToggleProfile} // <-- Calls function to switch to ProfilePage
            className="p-1 border border-purple-400 rounded-full hover:shadow-md transition-shadow" 
            aria-label="User Profile"
          >
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-purple-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-8 md:p-12 lg:p-16">
        
        {/* Table Container */}
        <div className="border border-gray-200 rounded-xl shadow-lg bg-white overflow-hidden">
          
          {/* Top Bar for Title and Add Button */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-strong text-gray-800">Users</h2>
              
              {/* Right Section: Add User Button (Purple) */}
              <button
                  onClick={handleOpenDrawer}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-colors rounded-lg shadow-md whitespace-nowrap"
              >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add user
              </button>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 tracking-wider w-1/12">
                    Sr. No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-5/12">
                    User name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-6/12">
                    E-mail
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-3/12">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {displayUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        {/* View Icon */}
                        <button
                          onClick={() => handleView(user)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-100 rounded-full transition-colors"
                          title="View Details"
                          aria-label={`View details for ${user.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* Delete Icon */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete User"
                          aria-label={`Delete ${user.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-lg">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD USER SIDE DRAWER --- */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            onClick={handleCloseDrawer}
          ></div>

          {/* Side Drawer Panel - Transition added for smooth entry/exit */}
          <div 
            className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Add User</h3>
              <button 
                onClick={handleCloseDrawer}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name of the user */}
                <div>
                    <label htmlFor="name" className="block text-xs text-gray-600 mb-2">
                    Name of the user
                    </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Type here"
                    required
                  />
                  
                </div>

                {/* E-mail and Contact in same row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs text-gray-600 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="Type here"
                      required
                    />
                    
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-xs text-gray-600 mb-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="Type here"
                    />
                    
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer - Fixed at bottom */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-6 py-2.5 text-sm font-medium text-purple-600 bg-white border border-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}