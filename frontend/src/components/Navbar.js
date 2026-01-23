import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  FolderKanban, 
  Users, 
  BarChart3, 
  LogOut, 
  Handshake, 
  Coins 
} from 'lucide-react';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase';       

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('userRole'); 
      navigate('/'); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Helper to check active route for styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* --- BRANDING SECTION --- */}
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <img 
            src="/logo.jpeg" 
            alt="ImpactHub Logo" 
            className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:ring-2 group-hover:ring-teal-500 transition-all" 
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight">ImpactHub</span>
        </Link>
      </div>
      
      {/* --- NAVIGATION LINKS --- */}
      <div className="hidden md:flex gap-6 text-sm font-medium">
        {[
          { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={18}/> },
          { name: 'Projects', path: '/projects', icon: <FolderKanban size={18}/> },
          { name: 'Partners', path: '/partners', icon: <Users size={18}/> },
          // New Links Added Here
          { name: 'Proposals', path: '/proposals/partnership', icon: <Handshake size={18}/> },
          { name: 'Grants', path: '/proposals/grant', icon: <Coins size={18}/> },
          { name: 'Impact', path: '/impact', icon: <BarChart3 size={18}/> },
        ].map((item) => (
          <Link 
            key={item.name}
            to={item.path} 
            className={`flex items-center gap-2 px-1 py-1 transition-colors relative ${
              isActive(item.path) 
              ? 'text-teal-600' 
              : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            {item.icon}
            {item.name}
            {isActive(item.path) && (
              <span className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-teal-600 rounded-t-full" />
            )}
          </Link>
        ))}
      </div>

      {/* --- USER ACTIONS --- */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="flex flex-col items-end">
          <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-bold border border-teal-100 uppercase tracking-wide shadow-sm">
            {user?.role || 'Guest'}
          </span>
        </div>

        <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-white text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition duration-200 border border-gray-200 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;