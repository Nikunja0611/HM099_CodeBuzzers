import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, FolderKanban, Users, BarChart3, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase';       

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('userRole'); 
      navigate('/'); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">IH</div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">ImpactHub</span>
        </Link>
      </div>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-teal-600 transition"><LayoutGrid size={18}/> Dashboard</Link>
        <Link to="/projects" className="flex items-center gap-2 hover:text-teal-600 transition"><FolderKanban size={18}/> Projects</Link>
        <Link to="/partners" className="flex items-center gap-2 hover:text-teal-600 transition"><Users size={18}/> Partners</Link>
        <Link to="/impact" className="flex items-center gap-2 hover:text-teal-600 transition"><BarChart3 size={18}/> Impact</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge Only */}
        <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-bold border border-teal-100 uppercase tracking-wide">
          {user?.role || 'Guest'}
        </span>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition border border-red-100"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;