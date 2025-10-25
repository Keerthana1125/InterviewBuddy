import React, { useState, useEffect } from "react";
import UserManagement from "./components/UserManagement";
import ProfilePage from "./components/ProfilePage";

function App() {
  // Initialize state from localStorage or default to false (UserManagement)
  const [showProfile, setShowProfile] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView === 'profile';
  });
  
  // Save the current view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentView', showProfile ? 'profile' : 'dashboard');
  }, [showProfile]);
  
  // Handle browser back/forward buttons
  useEffect(() => {
    // Push initial state
    if (!window.history.state) {
      window.history.pushState({ view: showProfile ? 'profile' : 'dashboard' }, '');
    }
    
    // Listen for back/forward button clicks
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setShowProfile(event.state.view === 'profile');
      } else {
        // If no state, go back to dashboard
        setShowProfile(false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Toggle function passed down to the Profile Icons
  const toggleProfile = () => {
    setShowProfile(prev => {
      const newValue = !prev;
      // Push new state to history so back button works
      window.history.pushState(
        { view: newValue ? 'profile' : 'dashboard' }, 
        ''
      );
      return newValue;
    });
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Conditionally render the correct component */}
      {showProfile ? (
        <ProfilePage onToggle={toggleProfile} />
      ) : (
        <UserManagement onToggleProfile={toggleProfile} />
      )}
    </div>
  );
}

export default App;