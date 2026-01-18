import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; 
import { auth } from '../firebase'; 
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Plus, Target, Users, TrendingUp, Bell, Loader2, 
  ArrowUpRight, Sparkles, LayoutGrid, Activity, Clock, CheckCircle, Zap
} from 'lucide-react';

// Vibrant SDG Colors
const SDG_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', 
  '#6366f1', '#a855f7', '#d946ef', '#ec4899'
];

// Helper function for relative time
const timeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) > 5 ? Math.floor(seconds) + " seconds ago" : "Just now";
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl z-50">
        <p className="font-bold text-gray-800 text-sm mb-1">{payload[0].name}</p>
        <p className="text-teal-600 font-bold text-lg">
          {payload[0].value} <span className="text-xs text-gray-400 font-normal">Projects</span>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, partners: 0, sdg_dist: [] });
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("Partner"); // Default fallback
  const [loading, setLoading] = useState(true);
  
  // Get Current User Email securely
  const currentUserEmail = auth.currentUser ? auth.currentUser.email : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats, Projects, AND Partners (to find current user's org name)
        const [statsRes, projectsRes, partnersRes] = await Promise.all([
            api.get('/stats'),
            api.get('/projects'),
            api.get('/partners')
        ]);
        
        setStats(statsRes.data);
        setProjects(projectsRes.data);

        // Find current user's organization name
        if (auth.currentUser) {
            const myProfile = partnersRes.data.find(p => p.email === auth.currentUser.email);
            if (myProfile && myProfile.orgName) {
                setUserName(myProfile.orgName);
            } else if (auth.currentUser.displayName) {
                setUserName(auth.currentUser.displayName);
            } else {
                // Fallback to email prefix if no name found
                setUserName(auth.currentUser.email.split('@')[0]);
            }
        }

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const myRecentProjects = projects
    .filter(p => p.owner === currentUserEmail)
    .slice(0, 3);

  const myActivity = projects
    .filter(p => p.owner === currentUserEmail)
    .slice(0, 5); 

  // Format Data for Charts
  const chartData = stats.sdg_dist.map((item, index) => ({
    name: `SDG ${item._id}`,
    value: item.count,
    color: SDG_COLORS[index % SDG_COLORS.length]
  }));

  const statusData = [
    { name: 'Active', value: stats.active, color: '#10b981' }, 
    { name: 'Total', value: stats.total, color: '#64748b' },   
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-teal-600 mb-4" size={48}/>
      <p className="text-gray-500 animate-pulse font-medium">Loading ImpactHub...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#F3F4F6] min-h-screen font-sans">
      
      {/* --- WELCOME BANNER --- */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 mb-10 shadow-lg text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
              <Sparkles size={14} className="text-yellow-300" />
              <span className="text-xs font-semibold tracking-wide uppercase">Impact Dashboard</span>
            </div>
            {/* DYNAMIC USER NAME DISPLAYED HERE */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-teal-50 max-w-xl text-sm md:text-base opacity-90">
              You're making great progress. Here is an overview of your active projects, partners, and SDG impact metrics.
            </p>
          </div>
          <button 
            onClick={() => navigate('/new-project')} 
            className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} /> Create Project
          </button>
        </div>
      </div>

      {/* --- STATS GRID (UPDATED TO SHOW GLOBAL STATS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          // CHANGED: Now shows 'stats.active' instead of 'myRecentProjects.length'
          { title: 'Total Active Projects', value: stats.active, icon: <Target size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
          { title: 'Partners', value: stats.partners || 0, icon: <Users size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
          { title: 'Avg Impact Score', value: '78%', icon: <TrendingUp size={24}/>, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+3%' },
          { title: 'Pending Requests', value: '0', icon: <Bell size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50', trend: '0' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                 <ArrowUpRight size={12} className="mr-1"/> {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- ANALYTICS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <LayoutGrid size={20} className="text-gray-400"/> SDG Distribution
             </h3>
             <button className="text-gray-400 hover:text-teal-600"><TrendingUp size={18}/></button>
          </div>
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={8}>
                  {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-4xl font-extrabold text-gray-900">{stats.total}</span>
               <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Projects</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Zap size={20} className="text-gray-400"/> Project Status
             </h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 13, fill: '#6b7280', fontWeight: 600}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} background={{ fill: '#f9fafb', radius: [0, 8, 8, 0] }}>
                   {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- MY RECENT PROJECTS --- */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Recent Projects</h2>
            <p className="text-gray-500 text-sm mt-1">Projects managed by {userName}</p>
          </div>
          <button onClick={() => navigate('/projects')} className="group flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
            View All <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myRecentProjects.length === 0 ? (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
               <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-300"><LayoutGrid size={32}/></div>
               <p className="text-gray-900 font-bold mb-1">No projects found</p>
               <p className="text-gray-400 text-sm mb-4">Start your first project to see it here.</p>
               <button onClick={() => navigate('/new-project')} className="text-teal-600 font-bold text-sm hover:underline">Create Project</button>
            </div>
          ) : myRecentProjects.map((p) => (
            <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full">
              <div className={`h-2 w-full ${p.impact_score > 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}></div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-gray-50 p-2.5 rounded-xl text-gray-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"><Target size={20} /></div>
                   <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide bg-gray-100 text-gray-600">{p.status || 'Planning'}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{p.description}</p>
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5"><span>Impact Score</span><span className="text-green-600">{p.impact_score || 0}%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full bg-green-500" style={{width: `${p.impact_score || 0}%`}}></div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MY RECENT ACTIVITY --- */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-8">
          <Activity size={22} className="text-teal-600"/>
          <h2 className="text-2xl font-bold text-gray-900">Your Recent Activity</h2>
        </div>

        <div className="space-y-2">
          {myActivity.length === 0 ? (
             <div className="text-center text-gray-400 italic py-4">You haven't created any projects yet.</div>
          ) : myActivity.map((p) => (
            <div key={p._id + 'activity'} className="flex gap-4 items-start p-4 hover:bg-[#F8F9FA] rounded-2xl transition-colors group cursor-default">
               <div className="mt-1 relative">
                 <div className="bg-teal-100 p-2 rounded-full text-teal-600 z-10 relative group-hover:scale-110 transition-transform">
                   <CheckCircle size={18} strokeWidth={2.5} />
                 </div>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-100 -z-0 group-last:hidden"></div>
               </div>
               <div className="flex-1">
                 <p className="text-gray-900 font-bold text-sm">
                    You Created a Project: <span className="text-teal-700">{p.title}</span>
                 </p>
                 <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{p.description.substring(0, 60)}...</p>
                 <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                   <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                     <Clock size={12}/> {timeAgo(p.created_at)}
                   </span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;