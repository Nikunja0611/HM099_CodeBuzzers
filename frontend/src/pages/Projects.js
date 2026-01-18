import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  Search, Plus, Users, Target, TrendingUp, Loader2, Filter, ChevronDown 
} from 'lucide-react';

// Standard UN SDG Colors Mapping
const SDG_COLORS = {
  1: '#E5243B', // No Poverty
  2: '#DDA63A', // Zero Hunger
  3: '#4C9F38', // Good Health
  4: '#C5192D', // Quality Education
  5: '#FF3A21', // Gender Equality
  6: '#26BDE2', // Clean Water
  7: '#FCC30B', // Affordable Energy
  8: '#A21942', // Decent Work
  9: '#FD6925', // Industry/Infra
  10: '#DD1367', // Reduced Inequality
  11: '#FD9D24', // Sustainable Cities
  12: '#BF8B2E', // Consumption
  13: '#3F7E44', // Climate Action
  14: '#0A97D9', // Life Below Water
  15: '#56C02B', // Life on Land
  16: '#00689D', // Peace/Justice
  17: '#19486A', // Partnerships
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sdgFilter, setSdgFilter] = useState('All');

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Updated Filtering Logic: Combines Search + Status + SDG
  const filteredProjects = projects.filter(p => {
    // 1. Text Search (Title or Description)
    const matchesSearch = 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Status Filter
    const matchesStatus = statusFilter === 'All' || 
        (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

    // 3. SDG Filter
    const matchesSDG = sdgFilter === 'All' || 
        (p.sdg && p.sdg.toString() === sdgFilter.toString());

    return matchesSearch && matchesStatus && matchesSDG;
  });

  // Helper for Status Badge styling
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'active': return 'bg-green-50 text-green-700 border-green-100';
        case 'at risk': return 'bg-red-50 text-red-700 border-red-100';
        case 'planning': return 'bg-gray-100 text-gray-600 border-gray-200';
        default: return 'bg-teal-50 text-teal-700 border-teal-100';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-1">Browse and manage SDG-aligned projects</p>
        </div>
        <button onClick={() => navigate('/new-project')} className="bg-[#0f766e] hover:bg-[#0d6e66] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none shadow-sm text-sm"
          />
        </div>
        
        {/* Filter Dropdowns */}
        <div className="flex gap-3">
            {/* Status Filter */}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Planning">Planning</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            {/* SDG Filter */}
            <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select 
                    value={sdgFilter}
                    onChange={(e) => setSdgFilter(e.target.value)}
                    className="appearance-none pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                    <option value="All">All SDGs</option>
                    {Object.keys(SDG_COLORS).map(num => (
                        <option key={num} value={num}>SDG {num}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
           <div className="col-span-3 py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-400">No projects found matching your criteria.</p>
           </div>
        ) : filteredProjects.map((p) => {
            // Logic for Progress Bar
            const milestoneCount = p.milestones ? p.milestones.length : 0;
            const completedCount = p.milestones ? p.milestones.filter(m => m.completed).length : 0;
            const progress = milestoneCount > 0 ? (completedCount / milestoneCount) * 100 : 0;
            
            // Logic for SDG Color
            const sdgColor = SDG_COLORS[p.sdg] || '#0ea5e9';

            return (
              <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-teal-100 transition-all duration-200 cursor-pointer flex flex-col h-full group">
                
                {/* 1. Header: Title & Status */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#0f766e] transition-colors line-clamp-2 w-3/4">
                    {p.title}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${getStatusStyle(p.status)}`}>
                    {p.status || 'Active'}
                  </span>
                </div>
                
                {/* 2. Subtitle: Owner/Org */}
                <p className="text-xs font-medium text-gray-400 mb-4">{p.owner || 'Organization Name'}</p>
                
                {/* 3. Description */}
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {p.description}
                </p>
                
                {/* 4. SDG Badge (Functional Color Mapping) */}
                <div className="flex items-center gap-2 mb-5">
                    <div 
                        className="flex items-center gap-2 px-2 py-1 rounded-md text-white font-bold text-xs shadow-sm"
                        style={{ backgroundColor: sdgColor }}
                        title={`Sustainable Development Goal ${p.sdg}`}
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
                        SDG {p.sdg}
                    </div>
                </div>

                {/* 5. Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium text-gray-700">{completedCount}/{milestoneCount || 4} milestones</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                                width: `${progress || 10}%`,
                                backgroundColor: p.status === 'At Risk' ? '#ef4444' : '#0f766e' 
                            }}
                        ></div>
                    </div>
                </div>

                {/* 6. Footer Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-gray-400"/> {p.collaborators || 1}</span>
                        <span className="flex items-center gap-1.5"><Target size={14} className="text-gray-400"/> {milestoneCount || 4}</span>
                    </div>
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600"/> {p.impact_score || 0}%
                    </span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Projects;