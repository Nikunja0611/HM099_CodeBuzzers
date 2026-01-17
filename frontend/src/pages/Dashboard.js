import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Plus, Target, Users, TrendingUp, Bell, 
  CheckCircle, Clock, Droplets, Heart 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- MOCK DATA FOR CHARTS ---
  const sdgData = [
    { name: 'SDG 6', value: 3, color: '#0ea5e9' }, // Blue
    { name: 'SDG 5', value: 1, color: '#ef4444' }, // Red
    { name: 'SDG 4', value: 1, color: '#a855f7' }, // Purple
    { name: 'SDG 13', value: 1, color: '#22c55e' }, // Green
    { name: 'SDG 7', value: 1, color: '#eab308' }, // Yellow
    { name: 'SDG 10', value: 1, color: '#ec4899' }, // Pink
  ];

  const statusData = [
    { name: 'Active', value: 65, color: '#22c55e' }, // Green
    { name: 'At Risk', value: 25, color: '#ef4444' }, // Red
    { name: 'Planning', value: 90, color: '#94a3b8' }, // Grey
  ];

  // --- MOCK DATA FOR PROJECT CARDS ---
  const projects = [
    {
      id: 1,
      title: "Clean Water",
      org: "Green Future Foundation",
      status: "Planning",
      desc: "Implementing sustainable water systems...",
      sdgIcon: <Droplets size={16} className="text-white" />,
      sdgColor: "bg-cyan-500",
      progress: 71,
      milestones: "0/2",
      collaborators: 1,
      totalMilestones: 2,
      trend: "+71%"
    },
    {
      id: 2,
      title: "Blood Donation Drive",
      org: "Green Future Foundation",
      status: "Planning",
      desc: "Organizing city-wide blood donation camps...",
      sdgIcon: <Heart size={16} className="text-white" />,
      sdgColor: "bg-red-500",
      progress: 30,
      milestones: "0/2",
      collaborators: 1,
      totalMilestones: 2,
      trend: "+30%"
    },
    {
      id: 3,
      title: "Clean Water & Sanitation",
      org: "Green Future Foundation",
      status: "Planning",
      desc: "Sanitation drive in rural districts...",
      sdgIcon: <Droplets size={16} className="text-white" />,
      sdgColor: "bg-cyan-500",
      progress: 56,
      milestones: "0/1",
      collaborators: 1,
      totalMilestones: 1,
      trend: "+56%"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Green Future Foundation</p>
        </div>
        <button 
          onClick={() => navigate('/new-project')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* --- STATS CARDS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Active Projects', value: '2', icon: <Target size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Partners', value: '5', icon: <Users size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Avg Impact Score', value: '65%', icon: <TrendingUp size={24}/>, color: 'text-teal-600', bg: 'bg-teal-50' },
          { title: 'Pending Requests', value: '0', icon: <Bell size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* SDG Distribution (Donut Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">SDG Distribution</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sdgData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {sdgData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-3xl font-bold text-gray-800">9</span>
                <span className="text-xs text-gray-500 uppercase">Goals</span>
              </div>
            </div>
          </div>
          {/* Legend Labels (Optional visuals to match screenshot lines) */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-gray-500">
             {sdgData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></span>
                    {d.name}
                </div>
             ))}
          </div>
        </div>

        {/* Project Status Overview (Horizontal Bar) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Project Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- MY PROJECTS SECTION --- */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Projects</h2>
          <button className="text-sm font-medium text-gray-500 hover:text-teal-600 flex items-center gap-1 transition">
            View All <TrendingUp size={14}/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-500">{p.org}</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-semibold uppercase">
                    {p.status}
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{p.desc}</p>

              {/* Progress Icon & Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.sdgColor}`}>
                        {p.sdgIcon}
                    </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{p.milestones} milestones</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${p.progress}%`}}></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Users size={14}/> {p.collaborators}</span>
                    <span className="flex items-center gap-1"><Target size={14}/> {p.totalMilestones} milestones</span>
                </div>
                <span className="text-green-600 font-bold flex items-center gap-1">
                    <TrendingUp size={14}/> {p.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RECENT ACTIVITY SECTION --- */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-6">
            {[
                { text: "SolarTech Innovations joined Clean Water Initiative", time: "2 hours ago" },
                { text: "Milestone completed: Site Assessment for Water Project", time: "5 hours ago" },
                { text: "New partnership request from IIT Climate Research Lab", time: "1 day ago" }
            ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1">
                        <CheckCircle size={20} className="text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-800 font-medium">{item.text}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={12} /> {item.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;