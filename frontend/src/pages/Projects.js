import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, MoreHorizontal, 
  Users, Target, TrendingUp, AlertCircle 
} from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');

  // Mock Data matching your screenshot
  const projects = [
    {
      id: 1,
      title: "Clean Water Initiative for Rural Maharashtra",
      org: "WaterAid India",
      status: "Active",
      statusColor: "bg-green-100 text-green-700",
      desc: "Implementing sustainable water purification systems in 50 villages across Maharashtra using solar-powered filtration...",
      sdgs: ["bg-cyan-500", "bg-red-500", "bg-yellow-500"], // Colors for SDG icons
      progress: 50,
      milestones: "2/4",
      collaborators: 3,
      trend: "78%"
    },
    {
      id: 2,
      title: "AI-Powered Learning Platform for Girls",
      org: "EduTech Solutions",
      status: "Active",
      statusColor: "bg-green-100 text-green-700",
      desc: "Developing a mobile-first learning platform with AI tutoring to improve education access for girls in underserved areas.",
      sdgs: ["bg-red-500", "bg-pink-500", "bg-orange-500"],
      progress: 75,
      milestones: "3/4",
      collaborators: 2,
      trend: "85%"
    },
    {
      id: 3,
      title: "Climate-Smart Agriculture Program",
      org: "IIT Climate Research Lab",
      status: "At Risk",
      statusColor: "bg-red-100 text-red-700",
      desc: "Research and implementation of climate-resilient farming practices using AI-based crop prediction and soil analysis.",
      sdgs: ["bg-yellow-500", "bg-green-600", "bg-emerald-500"],
      progress: 25,
      milestones: "1/4",
      collaborators: 3,
      trend: "62%"
    },
    {
      id: 4,
      title: "Clean Water",
      org: "Green Future Foundation",
      status: "Planning",
      statusColor: "bg-gray-100 text-gray-700",
      desc: "Initial planning phase for urban water sanitation drive.",
      sdgs: ["bg-cyan-500"],
      progress: 0,
      milestones: "0/2",
      collaborators: 1,
      trend: "0%"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Browse and manage SDG-aligned projects</p>
        </div>
        <button 
          onClick={() => navigate('/new-project')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        
        <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                <Filter size={18} /> 
                <span>All Status</span>
            </button>
        </div>
        <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                <Target size={18} /> 
                <span>All SDGs</span>
            </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Showing {projects.length} of {projects.length} projects</p>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div 
            key={p.id} 
            onClick={() => navigate(`/projects/${p.id}`)} // Navigate to detail page
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-teal-600 transition">{p.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase whitespace-nowrap ml-2 ${p.statusColor}`}>
                {p.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">{p.org}</p>
            <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">{p.desc}</p>

            {/* SDG Icons */}
            <div className="flex gap-2 mb-6">
              {p.sdgs.map((color, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${color} opacity-90`}></div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
               <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                 <span>Progress</span>
                 <span>{p.milestones} milestones</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${p.status === 'At Risk' ? 'bg-red-500' : 'bg-teal-600'}`} 
                    style={{width: `${p.progress}%`}}
                  ></div>
               </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Users size={16}/> {p.collaborators}</span>
                    <span className="flex items-center gap-1.5"><Target size={16}/> {p.milestones}</span>
                </div>
                <span className={`font-bold flex items-center gap-1 ${p.status === 'At Risk' ? 'text-red-500' : 'text-green-600'}`}>
                    <TrendingUp size={16}/> {p.trend}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;