import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Calendar, CheckCircle, TrendingUp, Target, Users, Building, Leaf, Loader2 } from 'lucide-react';

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

        // 2. Fetch Partner Recommendations (Model 2)
        const recRes = await api.get(`/projects/${id}/recommendations`);
        setRecommendations(recRes.data);

        // 3. Predict Impact Status (Model 3)
        // Calculate derived features for the model
        const msCompleted = pData.milestones ? pData.milestones.filter(m => m.completed).length : 0;
        const totalMs = pData.milestones ? pData.milestones.length : 1;
        const msPct = (msCompleted / totalMs) * 100;
        
        // Call the AI Endpoint
        const impRes = await api.post('/predict_impact', {
            milestones_pct: msPct,
            time_elapsed_pct: 20, // Mock for demo, or calculate based on created_at
            collaborators: pData.collaborators || 1,
            resource_availability: pData.resource_availability || 'Medium',
            budget_pct: pData.budget_pct || 10
        });
        setImpactPrediction(impRes.data.status);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;
  if (!project) return <div>Not Found</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-6 transition">
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
           <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{project.status}</span>
        </div>
        <p className="text-gray-500 mt-2 flex items-center gap-4 text-sm">
           <span className="flex items-center gap-1"><Building size={14}/> {project.owner}</span>
           <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(project.created_at).toLocaleDateString()}</span>
        </p>
      </div>

      {/* TOP ROW: IMPACT & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Impact Score Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><TrendingUp size={18}/> Impact Score</h3>
            <span className="text-5xl font-bold text-teal-600">{project.impact_score}%</span>
            <span className="text-xs text-gray-400 mt-1">Calculated Potential</span>
        </div>

        {/* AI Status Prediction Card (Model 3 Result) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Leaf size={18}/> AI Status Prediction</h3>
            <div className="flex flex-col items-center">
                <CheckCircle size={40} className={impactPrediction === 'On Track' ? "text-green-500" : "text-red-500"} />
                <span className={`text-xl font-bold mt-2 ${impactPrediction === 'On Track' ? "text-green-600" : "text-red-600"}`}>
                    {impactPrediction}
                </span>
                <span className="text-xs text-gray-400">Based on milestones & resources</span>
            </div>
        </div>
      </div>

      {/* MIDDLE: DESCRIPTION & MILESTONES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target size={18}/> Milestones</h3>
                <div className="space-y-3">
                    {project.milestones && project.milestones.map((ms, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <CheckCircle className="text-gray-300" size={20}/>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{ms.title}</p>
                                <p className="text-xs text-gray-500">Target: {ms.date}</p>
                            </div>
                        </div>
                    ))}
                    {(!project.milestones || project.milestones.length === 0) && <p className="text-gray-400 italic">No milestones set.</p>}
                </div>
            </div>
         </div>

         {/* RIGHT: PARTNER RECOMMENDATIONS (Model 2 Result) */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={18}/> AI Partner Matches</h3>
            <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map(rec => (
                    <div key={rec._id} className="border border-green-100 bg-green-50/50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-gray-800 text-sm">{rec.orgName}</h4>
                            <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded uppercase font-bold text-gray-500">{rec.role}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{rec.email}</p>
                        <button className="w-full py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition">Connect</button>
                    </div>
                )) : <p className="text-gray-400 text-sm">No matches found for SDG {project.sdg}</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProjectDetail;