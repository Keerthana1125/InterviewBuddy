User Profile Management Dashboard (React & Firestore)

This repository contains a responsive, single-page application built with React and Tailwind CSS for managing a user's professional profile information. Data persistence is handled using Google Cloud Firestore.

The application is structured as a main dashboard (UserManagement) that allows users to switch to a detailed Profile Page to view and edit their information across different modules: Basic Info, Education & Skills, and Work Experience.

🚀 Features:

Single-File Architecture: The profile page logic is consolidated into a single React file (UserProfileManager.jsx) for easy deployment and collaboration.

Real-time Data Persistence: Utilizes Firebase Firestore to securely store and retrieve user profile data in real-time.

Responsive Dual-Column Layout: All form sections (Basic Info, Education, Experience) use a responsive grid to display fields in two columns on desktop screens and collapse to a single column on mobile.

Modular Forms: Profile data is organized into three distinct, tabbed sections for clear separation of concerns.

Optimistic UI: Data updates are handled immediately and reflected in the UI upon successful save to Firestore.

🛠️ Technology Stack:

Frontend: React (Functional Components and Hooks)

Styling: Tailwind CSS (for rapid, utility-first styling)

Database: Firebase Firestore (Real-time NoSQL database)

Authentication: Firebase Auth (using custom/anonymous sign-in handled by the hosting environment)


