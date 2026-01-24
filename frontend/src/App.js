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
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Partners from './pages/Partners';
import Impact from './pages/Impact';
import EditProject from './pages/EditProject';
import PartnershipProposal from './pages/PartnershipProposal';
import GrantApplication from './pages/GrantApplication';

// --- ADMIN PAGES ---
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// --- SECURITY WRAPPER (Add This) ---
const AdminProtectedRoute = ({ children }) => {
  // Check LocalStorage directly to persist across refreshes
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    // If not admin, redirect to Admin Login immediately
    return <Navigate to="/admin" replace />;
  }
  
  // If admin, render the Dashboard
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // We keep this state to force re-renders when login happens
  const [adminAuth, setAdminAuth] = useState(localStorage.getItem('adminAuth') === 'true');

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
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        
        {/* --- AUTH ROUTES --- */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />

        {/* --- ADMIN ROUTES (SECURED) --- */}
        <Route 
          path="/admin" 
          element={
            // If already logged in, go to dashboard, else show login
            localStorage.getItem('adminAuth') === 'true' 
            ? <Navigate to="/admin/dashboard" /> 
            : <AdminLogin setAdminAuth={setAdminAuth} />
          } 
        />
        
        {/* THIS IS THE FIXED ROUTE */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
               <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />

        {/* --- USER PROTECTED ROUTES --- */}
        <Route 
          path="/*" 
          element={
            user ? (
              <>
                <Navbar user={user} />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-project" element={<CreateProject />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/edit" element={<EditProject />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/impact" element={<Impact />} />
                  <Route path="/proposals/partnership" element={<PartnershipProposal />} />
                  <Route path="/proposals/grant" element={<GrantApplication />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
                <ChatWidget />
              </>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;