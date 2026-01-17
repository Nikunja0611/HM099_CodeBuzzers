import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  LineChart, Line, Legend 
} from 'recharts';
import { 
  TrendingUp, Folder, Users, Globe, Target, 
  Droplets, Heart, Zap, BookOpen, Scale, 
  Layout, Sun, Briefcase, MousePointer, Smile, 
  CloudRain, Anchor, Hexagon, Component 
} from 'lucide-react';

const Impact = () => {

  // --- MOCK DATA FOR CHARTS ---
  const sdgData = [
    { name: 'SDG 6', value: 3, color: '#0ea5e9' }, // Cyan
    { name: 'SDG 5', value: 1, color: '#f97316' }, // Orange
    { name: 'SDG 4', value: 1, color: '#dc2626' }, // Red
    { name: 'SDG 3', value: 1, color: '#16a34a' }, // Green
    { name: 'SDG 2', value: 1, color: '#eab308' }, // Yellow
    { name: 'SDG 15', value: 1, color: '#84cc16' }, // Lime
    { name: 'SDG 13', value: 1, color: '#15803d' }, // Dark Green
    { name: 'SDG 10', value: 1, color: '#ec4899' }, // Pink
    { name: 'SDG 7', value: 1, color: '#facc15' }, // Yellow
  ];

  const statusData = [
    { name: 'Active', value: 2.5, color: '#22c55e' }, // Green
    { name: 'At Risk', value: 1, color: '#ef4444' },  // Red
    { name: 'Planning', value: 3, color: '#94a3b8' }, // Grey
  ];

  const progressData = [
    { name: 'Jan', score: 45, projects: 1 },
    { name: 'Feb', score: 52, projects: 2 },
    { name: 'Mar', score: 61, projects: 3 },
    { name: 'Apr', score: 71, projects: 5 },
    { name: 'May', score: 78, projects: 6 },
    { name: 'Jun', score: 85, projects: 7 },
  ];

  // --- SDG CARD DATA ---
  const sdgCards = [
    { id: 6, title: "Clean Water", count: 3, icon: <Droplets size={20}/>, color: "text-cyan-500", bg: "bg-cyan-50" },
    { id: 2, title: "Zero Hunger", count: 1, icon: <Sun size={20}/>, color: "text-yellow-600", bg: "bg-yellow-50" },
    { id: 3, title: "Good Health", count: 1, icon: <Heart size={20}/>, color: "text-red-500", bg: "bg-red-50" },
    { id: 4, title: "Quality Education", count: 1, icon: <BookOpen size={20}/>, color: "text-red-600", bg: "bg-red-50" },
    { id: 5, title: "Gender Equality", count: 1, icon: <Scale size={20}/>, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 7, title: "Clean Energy", count: 1, icon: <Zap size={20}/>, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: 10, title: "Reduced Inequalities", count: 1, icon: <Component size={20}/>, color: "text-pink-500", bg: "bg-pink-50" },
    { id: 13, title: "Climate Action", count: 1, icon: <Globe size={20}/>, color: "text-green-600", bg: "bg-green-50" },
    { id: 15, title: "Life on Land", count: 1, icon: <Layout size={20}/>, color: "text-lime-600", bg: "bg-lime-50" },
    { id: 1, title: "No Poverty", count: 0, icon: <Target size={20}/>, color: "text-red-700", bg: "bg-red-50" },
    { id: 8, title: "Decent Work", count: 0, icon: <Briefcase size={20}/>, color: "text-red-800", bg: "bg-red-50" },
    { id: 9, title: "Industry & Innovation", count: 0, icon: <Hexagon size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
    { id: 11, title: "Sustainable Cities", count: 0, icon: <Building size={20}/>, color: "text-orange-500", bg: "bg-orange-50" }, // Building icon needs import if used
    { id: 12, title: "Responsible Consumption", count: 0, icon: <Anchor size={20}/>, color: "text-yellow-700", bg: "bg-yellow-50" },
    { id: 14, title: "Life Below Water", count: 0, icon: <CloudRain size={20}/>, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 16, title: "Peace & Justice", count: 0, icon: <Scale size={20}/>, color: "text-blue-700", bg: "bg-blue-50" },
    { id: 17, title: "Partnerships", count: 0, icon: <Users size={20}/>, color: "text-blue-900", bg: "bg-blue-50" },
  ];

  // Custom Building icon since I didn't import it above in the list but used in array
  function Building({size, className}) { return <Layout size={size} className={className} /> }


  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
        <p className="text-gray-500 mt-1">Track progress and impact across all SDG-aligned projects</p>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Average Impact', value: '71%', icon: <TrendingUp size={24}/>, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Active Projects', value: '2', icon: <Folder size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Organizations', value: '6', icon: <Users size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'SDGs Addressed', value: '9', icon: <Globe size={24}/>, color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* --- MILESTONE PROGRESS BAR --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20}/> Overall Milestone Progress
        </h3>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
            <div className="bg-teal-600 h-4 rounded-full" style={{width: '35%'}}></div>
        </div>
        <div className="flex justify-end text-sm text-gray-600 font-semibold">
            6/17 <span className="text-gray-400 font-normal ml-1">milestones completed</span>
        </div>
      </div>

      {/* --- CHARTS ROW (Donut & Bar) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* SDG Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">SDG Distribution</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={sdgData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={2} 
                  dataKey="value"
                >
                  {sdgData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
             {/* Labels around the chart would be complex in pure Recharts, 
                 so we rely on Tooltip or Legend for simplicity in this demo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="block text-xl font-bold text-gray-400">Total</span>
                </div>
            </div>
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Project Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={statusData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- IMPACT PROGRESS LINE CHART --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Impact Progress Over Time</h3>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Avg Impact Score" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="projects" name="Active Projects" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* --- SDG COVERAGE ANALYSIS GRID --- */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Anchor className="text-gray-800" size={20}/> SDG Coverage Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdgCards.map((card) => (
                <div key={card.id} className={`flex items-center justify-between p-4 rounded-xl border ${card.count > 0 ? 'border-gray-100 bg-white' : 'border-dashed border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">SDG {card.id}</p>
                            <p className={`font-bold text-sm ${card.count > 0 ? 'text-gray-900' : 'text-gray-500'}`}>{card.title}</p>
                        </div>
                    </div>
                    {card.count > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                            {card.count}
                        </span>
                    )}
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Impact;