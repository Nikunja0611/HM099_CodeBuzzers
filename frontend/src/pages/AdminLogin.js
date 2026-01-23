import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';

const AdminLogin = ({ setAdminAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded credentials as requested
    if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('adminAuth', 'true'); // <--- CRITICAL
    setAdminAuth(true);
    navigate('/admin/dashboard');
} else {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
        <div className="flex justify-center mb-6">
            <div className="bg-teal-500 p-3 rounded-full">
                <ShieldCheck size={32} className="text-white"/>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Portal</h2>
        
        {error && <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Username</label>
            <div className="relative mt-1">
                <User size={16} className="absolute left-3 top-3 text-gray-500"/>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Password</label>
             <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-3 text-gray-500"/>
                <input 
                  type="password" 
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded transition">
            Access Control
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;