import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { 
  Users, Trash2, Activity, Database, Server, 
  ShieldAlert, CheckCircle, Search, Download, 
  PieChart as PieIcon, BarChart3, AlertCircle, Loader2, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Separate loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- NEW: REAL-TIME CLOCK STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();
  const COLORS = ['#0D9488', '#0F766E', '#115E59', '#134E4A', '#2DD4BF'];

  // --- 1. CLOCK EFFECT ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'projects' && projects.length === 0) fetchProjects();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error("Stats Load Error", err); } 
    finally { setLoadingStats(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
    } catch (err) { console.error("Users Load Error", err); } 
    finally { setLoadingUsers(false); }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
        const res = await api.get('/projects');
        setProjects(res.data);
    } catch (err) { console.error("Projects Load Error", err); } 
    finally { setLoadingProjects(false); }
  };

  // --- ACTIONS ---
  const handleDeleteUser = async (id) => {
    if(window.confirm("Are you sure? This will ban the user.")) {
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
            fetchStats();
        } catch (error) { alert("Error deleting user"); }
    }
  };

  const handleDeleteProject = async (id) => {
    if(window.confirm("Delete this project?")) {
        try {
            await api.delete(`/admin/projects/${id}`);
            fetchProjects();
            fetchStats();
        } catch (error) { alert("Error deleting project"); }
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('adminAuth'); 
      navigate('/admin');
  };

  // --- FILTERING ---
  const filteredUsers = users.filter(u => 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.owner || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- EXPORT ---
  const handleExport = () => {
    let dataToExport = [];
    let fileName = 'impacthub_data.csv';

    if (activeTab === 'users') {
        if (filteredUsers.length === 0) return alert("No user data to export.");
        dataToExport = filteredUsers.map(u => ({
            ID: u._id,
            Name: u.name || u.orgName || 'N/A',
            Email: u.email,
            Role: u.role,
            Organization: u.orgName || 'N/A'
        }));
        fileName = 'impacthub_users.csv';
    } 
    else if (activeTab === 'projects') {
        if (filteredProjects.length === 0) return alert("No project data to export.");
        dataToExport = filteredProjects.map(p => ({
            ID: p._id,
            Title: p.title,
            Owner: p.owner,
            Status: p.status,
            ImpactScore: p.impact_score,
            DateCreated: new Date(p.created_at).toLocaleDateString()
        }));
        fileName = 'impacthub_projects.csv';
    } 
    else {
        if (!stats) return alert("No stats data available.");
        dataToExport = [
            { Metric: 'Total Users', Value: stats.total_users },
            { Metric: 'Total Projects', Value: stats.total_projects },
            { Metric: 'Active Projects', Value: stats.active_projects },
            ...stats.user_distribution.map(d => ({ Metric: `User Type: ${d.name}`, Value: d.value }))
        ];
        fileName = 'impacthub_overview.csv';
    }

    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
        headers.join(','), 
        ...dataToExport.map(row => headers.map(header => {
            let val = row[header] ? String(row[header]) : '';
            if (val.includes(',')) val = `"${val}"`; 
            return val;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingStats) return (
    <div className="bg-gray-900 h-screen text-teal-400 flex flex-col items-center justify-center gap-4">
        <Activity className="animate-spin" size={48} />
        <span className="font-mono text-sm">INITIALIZING ADMIN PROTOCOLS...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex">
      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-teal-400 flex items-center gap-3">
                <ShieldAlert size={28} /> Impact<span className="text-white">Admin</span>
            </h1>
            <p className="text-gray-500 text-xs mt-2 font-mono">v2.4.0 SYSTEM ACCESS</p>
        </div>
        
        <nav className="space-y-2 flex-1 p-6">
            <SidebarItem 
                icon={<BarChart3 size={20}/>} 
                label="System Overview" 
                active={activeTab === 'overview'} 
                onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
            />
            <SidebarItem 
                icon={<Users size={20}/>} 
                label="User Database" 
                active={activeTab === 'users'} 
                onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
            />
            <SidebarItem 
                icon={<Database size={20}/>} 
                label="Project Repository" 
                active={activeTab === 'projects'} 
                onClick={() => { setActiveTab('projects'); setSearchTerm(''); }}
            />
        </nav>

        <div className="p-6 border-t border-gray-700">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 hover:bg-red-900/20 px-4 py-3 rounded-lg transition-colors font-bold">
                <AlertCircle size={20} /> Logout
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto h-screen bg-[#0f172a]">
        
        {/* Header Bar */}
        <header className="bg-gray-800 border-b border-gray-700 p-6 sticky top-0 z-20 flex justify-between items-center shadow-lg">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {activeTab === 'overview' ? 'Dashboard Overview' : 
                    activeTab === 'users' ? 'User Management' : 'Project Data Control'}
                </h2>
                {/* Mobile-only date view could go here if needed */}
            </div>
            
            <div className="flex items-center gap-6">
                
                {/* --- REAL-TIME CLOCK DISPLAY --- */}
                <div className="hidden md:flex flex-col items-end border-r border-gray-700 pr-6 mr-2">
                    <div className="flex items-center gap-2 text-teal-400 font-bold font-mono text-xl leading-none">
                        <Clock size={18} className="animate-pulse"/>
                        {currentTime.toLocaleTimeString()}
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="flex gap-4">
                    {(activeTab === 'users' || activeTab === 'projects') && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-900 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none w-64 text-sm"
                            />
                        </div>
                    )}
                    <button 
                        onClick={handleExport}
                        className="bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-lg transition shadow-lg shadow-teal-900/50 active:scale-95" 
                        title="Export Data as CSV"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>
        </header>

        <div className="p-8">
            
            {/* --- VIEW: OVERVIEW --- */}
            {activeTab === 'overview' && stats && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard label="Total Users" value={stats.total_users} icon={<Users className="text-teal-400"/>} />
                        <StatCard label="Total Projects" value={stats.total_projects} icon={<Database className="text-blue-400"/>} />
                        <StatCard label="Active Projects (Global)" value={stats.active_projects} icon={<Activity className="text-green-400"/>} highlight />
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">System Status</h3>
                                <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                                    <CheckCircle size={20} /> All Systems Go
                                </div>
                            </div>
                            <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[98%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User Distribution Chart */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <PieIcon size={20} className="text-teal-400"/> User Composition
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={stats.user_distribution} 
                                            innerRadius={60} 
                                            outerRadius={80} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                        >
                                            {stats.user_distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-4 flex-wrap">
                                {stats.user_distribution.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                        {entry.name}: <span className="text-white font-bold">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-teal-400"/> Recent Platform Activity
                            </h3>
                            <div className="space-y-4">
                                {stats.recent_activity && stats.recent_activity.length > 0 ? stats.recent_activity.map((act, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 bg-gray-700/30 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
                                        <div className="bg-teal-900/50 p-2 rounded-lg text-teal-400 mt-1"><Database size={16}/></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-200">New Project Created</p>
                                            <p className="text-xs text-teal-400 font-mono">"{act.title}"</p>
                                            <p className="text-[10px] text-gray-500 mt-1">{new Date(act.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 text-sm">No recent activity logged.</p>}
                            </div>
                        </div>
                    </div>

                    {/* AI Health Status */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                        <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 flex items-center gap-2">
                            <Server size={16}/> AI Engine Diagnostics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(stats.ai_status).map(([model, status]) => (
                                <div key={model} className="flex justify-between items-center p-4 bg-gray-900 rounded-lg border border-gray-700">
                                    <span className="capitalize text-sm font-medium text-gray-300">{model.replace('_', ' ')}</span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW: USERS --- */}
            {activeTab === 'users' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
                    {loadingUsers ? (
                         <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            Fetching User Database...
                         </div>
                    ) : (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 text-gray-200 uppercase font-bold text-xs tracking-wider">
                            <tr>
                                <th className="p-4">Entity Name</th>
                                <th className="p-4">Email Address</th>
                                <th className="p-4">Type/Role</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                <tr key={u._id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4 font-bold text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow">
                                            {(u.orgName || u.name || 'U')[0]}
                                        </div>
                                        {u.orgName || u.name || 'Unknown'}
                                    </td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                            u.role === 'NGO' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                            u.role === 'Startup' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                            'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        }`}>
                                            {u.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteUser(u._id)} className="text-gray-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition">
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 italic">No users matching search found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>
            )}

            {/* --- VIEW: PROJECTS --- */}
            {activeTab === 'projects' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
                    {loadingProjects ? (
                         <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            Fetching Project Repository...
                         </div>
                    ) : (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 text-gray-200 uppercase font-bold text-xs tracking-wider">
                            <tr>
                                <th className="p-4">Project Information</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Impact Score</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredProjects.length > 0 ? filteredProjects.map(p => (
                                <tr key={p._id} className="hover:bg-gray-700/50 transition">
                                    <td className="p-4">
                                        <p className="font-bold text-white">{p.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</p>
                                    </td>
                                    <td className="p-4 text-xs">{p.owner}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${
                                            p.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                            {p.status || 'Planning'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-teal-400">{p.impact_score || 0}%</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteProject(p._id)} className="text-gray-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition">
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 italic">No projects matching search found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const SidebarItem = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 font-medium ${
            active ? 'bg-teal-600/20 text-teal-400 border border-teal-600/30' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon} {label}
    </button>
);

const StatCard = ({ label, value, icon, highlight }) => (
    <div className={`p-6 rounded-xl border shadow-xl transition-transform hover:-translate-y-1 ${
        highlight 
        ? 'bg-gradient-to-br from-teal-900/50 to-gray-800 border-teal-500/30' 
        : 'bg-gray-800 border-gray-700'
    }`}>
        <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-teal-400' : 'text-gray-400'}`}>{label}</h3>
            {icon}
        </div>
        <p className="text-3xl font-bold text-white font-mono">{value}</p>
    </div>
);

export default AdminDashboard;