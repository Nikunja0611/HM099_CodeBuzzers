import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';

// --- PAGES ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Projects from './pages/Projects';           // <--- THIS WAS MISSING
import ProjectDetail from './pages/ProjectDetail'; // <--- THIS WAS MISSING
import Partners from './pages/Partners';
import Impact from './pages/Impact';
import EditProject from './pages/EditProject';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
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
        {/* Public Route: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes: Redirect to Dashboard if already logged in */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />

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
                  
                  {/* Project Routes */}
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/impact" element={<Impact />} />
                  <Route path="/projects/:id/edit" element={<EditProject />} />

                  {/* Redirect unknown paths to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
                <ChatWidget />
              </>
            ) : (
              // Redirect to Landing Page if not logged in
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;