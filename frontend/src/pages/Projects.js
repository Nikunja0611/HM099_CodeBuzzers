import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  Search, Plus, Users, Target, TrendingUp, Loader2, Filter, ChevronDown, ArrowRight
} from 'lucide-react';

// Standard UN SDG Colors Mapping
const SDG_COLORS = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A'
};

// Tooltip Titles for SDGs
const SDG_TITLES = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Clean Energy', 8: 'Decent Work',
  9: 'Industry', 10: 'Inequalities', 11: 'Sustainable Cities', 12: 'Consumption',
  13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land', 16: 'Peace', 17: 'Partnerships'
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sdgFilter, setSdgFilter] = useState('All');

  // Helper to calculate progress percentage
  const calculateProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return (completed / milestones.length) * 100;
  };

  useEffect(() => {
    const fetchProjectsWithAI = async () => {
        try {
            const res = await api.get('/projects');
            const loadedProjects = res.data;

            // Fetch AI Status for each project to ensure list view matches Details view
            const enrichedProjects = await Promise.all(loadedProjects.map(async (p) => {
                try {
                    // Using the same logic/constants as ProjectDetails to get consistent status
                    const aiRes = await api.post('/predict_impact', {
                        milestones_pct: calculateProgress(p.milestones) / 100, 
                        time_elapsed_pct: 0.2, // Consistent with ProjectDetails default
                        collaborators: p.collaborators || 1,
                        resource_availability: p.resource_availability || 'Medium',
                        budget_pct: p.budget_pct || 10
                    });
                    // Override the DB status with the fresh AI status
                    return { ...p, status: aiRes.data.status };
                } catch (err) {
                    console.error("AI Status fetch failed for", p.title);
                    return p; // Fallback to DB status
                }
            }));

            setProjects(enrichedProjects);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchProjectsWithAI();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || 
        (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

    const matchesSDG = sdgFilter === 'All' || 
        (p.sdg && (Array.isArray(p.sdg) ? p.sdg.includes(sdgFilter) : p.sdg.toString() === sdgFilter.toString()));

    return matchesSearch && matchesStatus && matchesSDG;
  });

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'excellent': return 'bg-sky-50 text-sky-700 border-sky-100'; // New AI Status
        case 'on track': // AI Status
        case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'at risk': return 'bg-red-50 text-red-700 border-red-100';
        case 'planning': return 'bg-blue-50 text-blue-700 border-blue-100';
        default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-1">Browse and manage SDG-aligned projects</p>
        </div>
        <button onClick={() => navigate('/new-project')} className="bg-[#0f766e] hover:bg-[#0d6e66] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all"
          />
        </div>
        
        <div className="flex gap-3">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer transition-colors"
                >
                    <option value="All">All Status</option>
                    <option value="Excellent">Excellent</option>
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Planning">Planning</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select 
                    value={sdgFilter}
                    onChange={(e) => setSdgFilter(e.target.value)}
                    className="appearance-none pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer transition-colors"
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

      <p className="text-sm text-gray-500 mb-6 font-medium">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
           <div className="col-span-3 py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
             <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
             <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
           </div>
        ) : filteredProjects.map((p) => {
            const milestoneCount = p.milestones ? p.milestones.length : 0;
            const progress = calculateProgress(p.milestones);
            const sdgList = Array.isArray(p.sdg) ? p.sdg : [p.sdg];

            return (
              <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#0f766e] transition-colors line-clamp-2 w-3/4">
                    {p.title}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${getStatusStyle(p.status)}`}>
                    {p.status || 'Active'}
                  </span>
                </div>
                
                <p className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1">
                    <Users size={12} /> {p.owner || 'Organization Name'}
                </p>
                
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {p.description}
                </p>
                
                {/* --- IMPROVED SDG ICONS (SQUARES) --- */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {sdgList.slice(0, 4).map((sdg, i) => (
                        <div 
                            key={i}
                            className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-help group/icon relative"
                            style={{ backgroundColor: SDG_COLORS[sdg] || '#ccc' }}
                        >
                            {/* Number */}
                            <span className="text-sm font-black leading-none">{sdg}</span>
                            
                            {/* Tiny label below number */}
                            <span className="text-[6px] font-medium uppercase opacity-80 leading-none mt-0.5">Goal</span>

                            {/* Tooltip on Hover */}
                            <div className="absolute bottom-full mb-2 hidden group-hover/icon:block whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                                {SDG_TITLES[sdg] || `SDG ${sdg}`}
                            </div>
                        </div>
                    ))}
                    {sdgList.length > 4 && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs border border-gray-200">
                            +{sdgList.length - 4}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>Progress</span>
                        <span>{p.milestones ? p.milestones.filter(m=>m.completed).length : 0}/{milestoneCount || 4} milestones</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ 
                                width: `${progress || 5}%`,
                                backgroundColor: p.status === 'At Risk' ? '#ef4444' : (p.status === 'Excellent' ? '#0284c7' : '#0f766e')
                            }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5"><Users size={14}/> {p.collaborators || 1}</span>
                        <span className="flex items-center gap-1.5 text-green-600 font-bold"><TrendingUp size={14}/> {p.impact_score || 0}%</span>
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${p._id}`);
                        }}
                        className="text-teal-700 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100"
                    >
                        View Project <ArrowRight size={14} />
                    </button>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Projects;