import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, Plus, Users, Target, TrendingUp, Loader2 } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter(p => 
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Browse and manage all SDG initiatives</p>
        </div>
        <button onClick={() => navigate('/new-project')} className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-teal-700">
          <Plus size={20} /> New Project
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
           <p className="text-gray-500 col-span-3 text-center">No projects found.</p>
        ) : filteredProjects.map((p) => (
          <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-teal-600 transition line-clamp-1">{p.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full font-bold uppercase bg-green-100 text-green-700">{p.status || 'Active'}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 line-clamp-3">{p.description}</p>
            
            <div className="mb-4">
               <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded border border-teal-100">
                 SDG {p.sdg}
               </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Users size={16}/> {p.collaborators || 1}</span>
                    <span className="flex items-center gap-1"><Target size={16}/> {p.milestones ? p.milestones.length : 0}</span>
                </div>
                <span className="font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp size={16}/> {p.impact_score || 0}%
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;