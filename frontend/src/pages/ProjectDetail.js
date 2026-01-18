import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  ArrowLeft, Calendar, CheckCircle, TrendingUp, Target, Users, Building, Leaf, Loader2 
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [impactPrediction, setImpactPrediction] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch Project
        const projRes = await api.get(`/projects/${id}`);
        const pData = projRes.data;
        setProject(pData);

        // 2. Fetch Partner Recommendations
        // Wrap in try/catch in case this specific endpoint fails but project loads
        try {
            const recRes = await api.get(`/projects/${id}/recommendations`);
            setRecommendations(recRes.data);
        } catch (e) { console.warn("Recs failed", e); }

        // 3. Predict Impact Status (Model 3)
        try {
            const msCompleted = pData.milestones ? pData.milestones.filter(m => m.completed).length : 0;
            const totalMs = pData.milestones ? pData.milestones.length : 1;
            const msPct = (msCompleted / totalMs) * 100;
            
            const impRes = await api.post('/predict_impact', {
                milestones_pct: msPct,
                time_elapsed_pct: 20, 
                collaborators: pData.collaborators || 1,
                resource_availability: pData.resource_availability || 'Medium',
                budget_pct: pData.budget_pct || 10
            });
            setImpactPrediction(impRes.data.status);
        } catch (e) { 
            setImpactPrediction("Unavailable");
        }

      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0f766e]" size={40}/></div>;
  if (!project) return <div className="p-8 text-center text-gray-500">Project Not Found</div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-gray-500 hover:text-[#0f766e] mb-6 transition-colors font-medium">
        <ArrowLeft size={18} /> Back to Projects
      </button>

      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.title}</h1>
           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${project.status === 'At Risk' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
             {project.status || 'Active'}
           </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
           <span className="flex items-center gap-1.5"><Building size={16} className="text-gray-400"/> {project.owner || 'Organization'}</span>
           <span className="flex items-center gap-1.5"><Calendar size={16} className="text-gray-400"/> Started {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}</span>
        </div>
      </div>

      {/* TOP ROW: METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Impact Score */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide"><TrendingUp size={16}/> Impact Score</h3>
            <span className="text-5xl font-extrabold text-[#0f766e]">{project.impact_score || 0}%</span>
            <span className="text-xs text-gray-400 mt-2 font-medium bg-gray-50 px-2 py-1 rounded">Calculated Potential</span>
        </div>

        {/* AI Prediction */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide"><Leaf size={16}/> AI Forecast</h3>
            <div className="flex flex-col items-center">
                <CheckCircle size={40} className={impactPrediction === 'On Track' ? "text-emerald-500" : "text-gray-300"} />
                <span className={`text-xl font-bold mt-2 ${impactPrediction === 'On Track' ? "text-emerald-700" : "text-gray-600"}`}>
                    {impactPrediction}
                </span>
                <span className="text-xs text-gray-400 mt-1">Milestone Analysis</span>
            </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center space-y-4">
             <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">SDG Target</span>
                <span className="font-bold text-gray-800">Goal {project.sdg}</span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">Collaborators</span>
                <span className="font-bold text-gray-800">{project.collaborators || 1} Members</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Budget Used</span>
                <span className="font-bold text-gray-800">{project.budget_pct || 0}%</span>
             </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         {/* Left Column: Description & Milestones */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">About this Project</h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{project.description}</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Target size={20} className="text-[#0f766e]"/> Milestones</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{project.milestones ? project.milestones.length : 0} Total</span>
                </div>
                
                <div className="space-y-4">
                    {project.milestones && project.milestones.map((ms, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className={`mt-0.5 ${ms.completed ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <CheckCircle size={22} fill={ms.completed ? "currentColor" : "none"} className={ms.completed ? "text-emerald-500" : "text-gray-300"} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className={`font-semibold text-sm ${ms.completed ? 'text-gray-900 line-through decoration-gray-400' : 'text-gray-900'}`}>{ms.title}</p>
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{ms.date || 'No Date'}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Status: {ms.completed ? 'Completed' : 'Pending'}</p>
                            </div>
                        </div>
                    ))}
                    {(!project.milestones || project.milestones.length === 0) && <p className="text-gray-400 italic text-center py-4">No milestones defined.</p>}
                </div>
            </div>
         </div>

         {/* Right Column: AI Recommendations */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg"><Users size={20} className="text-[#0f766e]"/> AI Partner Matches</h3>
            <div className="space-y-3">
                {recommendations.length > 0 ? recommendations.map(rec => (
                    <div key={rec._id} className="border border-emerald-100 bg-emerald-50/30 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-sm leading-tight">{rec.orgName}</h4>
                            <span className="text-[10px] bg-white border border-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-bold uppercase tracking-tight">{rec.role}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">{rec.email}</p>
                        <button className="w-full py-2 bg-[#0f766e] hover:bg-[#0d6e66] text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                            Request Connection
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        <p>No matches found for SDG {project.sdg}</p>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProjectDetail;