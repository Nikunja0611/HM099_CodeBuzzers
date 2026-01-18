import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; 
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Plus, Target, Users, TrendingUp, Bell, Loader2
} from 'lucide-react';

// Colors extracted from the image for the SDG Chart
const SDG_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, partners: 0, sdg_dist: [] });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
            api.get('/stats'),
            api.get('/projects')
        ]);
        
        setStats(statsRes.data);
        setProjects(projectsRes.data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare Chart Data with Multi-color mapping
  const chartData = stats.sdg_dist.map((item, index) => ({
    name: `SDG ${item._id}`,
    value: item.count,
    color: SDG_COLORS[index % SDG_COLORS.length] // Cycle through colors
  }));

  // Styled to match the Green/Grey bars in the image
  const statusData = [
    { name: 'Active', value: stats.active, color: '#22c55e' }, // Green
    { name: 'Total', value: stats.total, color: '#94a3b8' },   // Grey/Slate
  ];

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, Green Future Foundation</p>
        </div>
        <button 
          onClick={() => navigate('/new-project')} 
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Active Projects', value: stats.active, icon: <Target size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Partners', value: stats.partners || 0, icon: <Users size={24}/>, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Avg Impact Score', value: '65%', icon: <TrendingUp size={24}/>, color: 'text-teal-600', bg: 'bg-gray-100' },
          { title: 'Pending Requests', value: '0', icon: <Bell size={24}/>, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between relative overflow-hidden">
            <div className="z-10">
              <p className="text-sm font-medium text-gray-400 mb-4">{stat.title}</p>
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} bg-opacity-50`}>
                {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* SDG Distribution (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">SDG Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={chartData} 
                    innerRadius={65} 
                    outerRadius={85} 
                    paddingAngle={4} 
                    dataKey="value"
                    stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Project Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData} barSize={35}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={60} 
                    tick={{fontSize: 13, fill: '#6b7280', fontWeight: 500}} 
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                   {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <button onClick={() => navigate('/projects')} className="text-sm font-medium text-teal-600 hover:text-teal-700">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
               <p className="text-gray-400 font-medium">No projects yet. Click "New Project" to start!</p>
            </div>
          ) : projects.map((p) => (
            <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-bold text-gray-900 truncate pr-2 w-3/4 text-lg group-hover:text-teal-600 transition-colors">{p.title}</h3>
                 <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.status || 'Planning'}
                 </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
              
              <div className="mb-4">
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Impact Score</span>
                    <span>{p.impact_score || 0}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{width: `${p.impact_score || 0}%`}}></div>
                 </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 font-medium pt-4 border-t border-gray-50">
                <span className="flex items-center gap-1"><Users size={14}/> {p.collaborators || 1} Partners</span>
                <span className="text-teal-600">SDG {p.sdg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;