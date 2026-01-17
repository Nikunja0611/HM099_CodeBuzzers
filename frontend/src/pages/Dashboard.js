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

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, partners: 0, sdg_dist: [] });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats and Projects in parallel
        const [statsRes, projectsRes] = await Promise.all([
            api.get('/stats'),
            api.get('/projects')
        ]);
        
        setStats(statsRes.data);
        // Take only the first 3 projects for the dashboard view
        setProjects(projectsRes.data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare Chart Data
  const chartData = stats.sdg_dist.map(item => ({
    name: `SDG ${item._id}`,
    value: item.count,
    color: '#0ea5e9' 
  }));

  const statusData = [
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Total', value: stats.total, color: '#94a3b8' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your impact</p>
        </div>
        <button onClick={() => navigate('/new-project')} className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-teal-700">
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Active Projects', value: stats.active, icon: <Target size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Partners', value: stats.partners || 0, icon: <Users size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Avg Impact Score', value: '78%', icon: <TrendingUp size={24}/>, color: 'text-teal-600', bg: 'bg-teal-50' },
          { title: 'Pending Requests', value: '0', icon: <Bell size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">SDG Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={index} fill={entry.color || '#0ea5e9'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Project Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                   {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT PROJECTS LIST */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
          <button onClick={() => navigate('/projects')} className="text-sm text-teal-600 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-400">No projects yet. Click "New Project" to start!</p>
            </div>
          ) : projects.map((p) => (
            <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between mb-3">
                 <h3 className="font-bold text-gray-900 truncate pr-2 w-3/4">{p.title}</h3>
                 <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">{p.status || 'Planning'}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{p.description}</p>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                 <div className="bg-blue-600 h-2 rounded-full" style={{width: `${p.impact_score || 50}%`}}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span><Users size={14} className="inline mr-1"/> {p.collaborators || 1}</span>
                <span className="text-green-600 font-bold">SDG {p.sdg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;