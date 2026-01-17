import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';       // New
import Register from './pages/Register'; // New

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Recover role from localStorage (hackathon shortcut)
        const role = localStorage.getItem('userRole') || 'NGO';
        setUser({ email: currentUser.email, role: role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600">Loading ImpactHub...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Pass setUser to Login/Register so they can update state immediately */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            user ? (
              <>
                <Navbar user={user} />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-project" element={<CreateProject />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
                <ChatWidget />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;