import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  ArrowLeft, Calendar, User, CheckCircle, Circle, 
  Target, TrendingUp, Zap, Handshake, MapPin, Loader2, 
  ShieldCheck, AlertTriangle, Share2, Edit3, ExternalLink
} from 'lucide-react';

// SDG Helper Data
const SDG_DATA = {
  1: { title: 'No Poverty', color: '#E5243B' },
  2: { title: 'Zero Hunger', color: '#DDA63A' },
  3: { title: 'Good Health', color: '#4C9F38' },
  4: { title: 'Quality Education', color: '#C5192D' },
  5: { title: 'Gender Equality', color: '#FF3A21' },
  6: { title: 'Clean Water', color: '#26BDE2' },
  7: { title: 'Clean Energy', color: '#FCC30B' },
  13: { title: 'Climate Action', color: '#3F7E44' },
  17: { title: 'Partnerships', color: '#19486A' },
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [aiStatus, setAiStatus] = useState({ status: 'Loading...', confidence: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, recRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/recommendations`)
      ]);
      setProject(projRes.data);
      setRecommendations(recRes.data);

      // Fetch Impact Prediction
      if (projRes.data) {
         const impactRes = await api.post('/predict_impact', {
            milestones_pct: calculateProgress(projRes.data.milestones) / 100, 
            time_elapsed_pct: 0.2,
            collaborators: projRes.data.collaborators || 1,
            resource_availability: projRes.data.resource_availability || 'Medium',
            budget_pct: projRes.data.budget_pct || 10
         });
         setAiStatus(impactRes.data);
      }
    } catch (err) {
      console.error("Error loading project details", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (milestones) => {
      if (!milestones || milestones.length === 0) return 0;
      const completed = milestones.filter(m => m.completed).length;
      return (completed / milestones.length) * 100;
  };

  // --- HANDLERS ---

  const handleToggleMilestone = async (index) => {
    if (!project) return;
    
    // 1. Optimistic UI Update
    const newMilestones = [...project.milestones];
    newMilestones[index].completed = !newMilestones[index].completed;
    
    const updatedProject = { ...project, milestones: newMilestones };
    setProject(updatedProject); // Update UI immediately

    // 2. API Call to Save
    try {
        await api.put(`/projects/${id}`, { milestones: newMilestones });
    } catch (error) {
        console.error("Failed to save milestone", error);
        alert("Failed to save. Reverting...");
        fetchData(); // Revert on error
    }
  };

  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("📋 Link copied to clipboard!");
  };

  const handleEdit = () => {
      // In a real app, navigate to an edit page
      alert("Edit mode would open here.");
      navigate(`/projects/${id}/edit`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;
  if (!project) return <div className="p-8 text-center">Project not found</div>;

  const sdgList = Array.isArray(project.sdg) ? project.sdg : [project.sdg];
  const progressPct = calculateProgress(project.milestones);
  const completedCount = project.milestones?.filter(m => m.completed).length || 0;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 font-sans">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <button onClick={() => navigate('/projects')} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 text-sm font-medium transition-colors">
            <ArrowLeft size={16} className="mr-1"/> Back to Projects
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {project.status || 'Planning'}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14}/> {project.owner}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> Started {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button onClick={handleEdit} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Edit3 size={16}/> Edit Project
                </button>
                <button onClick={handleShare} className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 shadow-sm flex items-center gap-2">
                    <Share2 size={16}/> Share Report
                </button>
            </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* ABOUT */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About This Project</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {project.description}
              </p>
           </div>

           {/* SDG ALIGNMENT */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Zap className="text-teal-500" size={20}/> AI-Classified SDG Alignment
              </h3>
              
              <div className="flex flex-wrap gap-4">
                 {sdgList.map((sdgNum, idx) => {
                    const data = SDG_DATA[sdgNum] || { title: `Goal ${sdgNum}`, color: '#19486A' };
                    return (
                        <div key={idx} className="bg-white rounded-xl p-4 pr-8 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                           <div 
                             className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                             style={{ backgroundColor: data.color }}
                           >
                              {sdgNum}
                           </div>
                           <div>
                                <h4 className="font-bold text-gray-900">{data.title}</h4>
                                <p className="text-xs text-green-600 font-bold mt-0.5">
                                    {(project.confidence || 0.85 * 100).toFixed(0)}% Match
                                </p>
                           </div>
                        </div>
                    );
                 })}
              </div>
           </div>

           {/* MILESTONES (INTERACTIVE) */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Target size={20}/> Milestones</h3>
                 <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{completedCount}/{project.milestones?.length || 0} Done</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
                 <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{width: `${progressPct}%`}}></div>
              </div>

              <div className="space-y-3">
                 {(!project.milestones || project.milestones.length === 0) ? (
                    <p className="text-gray-400 italic text-center py-4">No milestones tracked yet.</p>
                 ) : project.milestones.map((ms, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleToggleMilestone(i)}
                        className={`group flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${ms.completed ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100 hover:border-teal-300 hover:shadow-sm'}`}
                    >
                       <div className={`mr-4 transition-colors ${ms.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-teal-400'}`}>
                          {ms.completed ? <CheckCircle size={24} fill="currentColor" className="text-green-100" /> : <Circle size={24}/>}
                       </div>
                       <div className="flex-1">
                          <p className={`font-bold text-sm ${ms.completed ? 'text-green-800 line-through decoration-green-800/30' : 'text-gray-800'}`}>{ms.title}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={10}/> Due: {ms.date || 'Flexible'}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-6">
           
           {/* IMPACT SCORE */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <TrendingUp size={14}/> Impact Potential
               </h3>
               <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0f766e" strokeWidth="3" strokeDasharray={`${project.impact_score}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-teal-700 text-sm">{project.impact_score}%</div>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900">High Impact</h4>
                      <p className="text-xs text-gray-500">Predicted by Model 3</p>
                  </div>
               </div>
           </div>

           {/* AI STATUS */}
           <div className={`rounded-2xl p-6 border ${aiStatus.status === 'On Track' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                 <ShieldCheck size={14}/> Status Forecast
               </h3>
               <div className="flex items-center gap-3">
                   {aiStatus.status === 'On Track' ? <CheckCircle className="text-green-600" size={28}/> : <AlertTriangle className="text-red-600" size={28}/>}
                   <div>
                       <h4 className={`font-bold text-lg ${aiStatus.status === 'On Track' ? 'text-green-800' : 'text-red-800'}`}>{aiStatus.status}</h4>
                       <p className="text-xs text-gray-500">Based on milestones & resources</p>
                   </div>
               </div>
           </div>

           {/* PARTNER RECOMMENDATIONS */}
           <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Handshake className="text-teal-600" size={20}/> Partner Matches
               </h3>
               
               <div className="space-y-4">
                  {recommendations.length === 0 ? (
                      <div className="p-6 bg-white rounded-xl text-center text-gray-400 text-sm border border-dashed border-gray-200">
                          AI is analyzing partners...
                      </div>
                  ) : recommendations.map((rec) => (
                      <div key={rec._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-green-200 hover:shadow-md transition-all group">
                          
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex gap-3">
                                 <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center font-bold text-teal-700 shrink-0">
                                    {rec.orgName ? rec.orgName[0] : 'O'}
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-gray-900 text-sm leading-tight">{rec.orgName || rec.email}</h4>
                                     <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                        <MapPin size={10}/> {rec.location || 'Mumbai, India'}
                                     </div>
                                 </div>
                             </div>
                             <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 uppercase">
                                {rec.role || 'NGO'}
                             </span>
                          </div>

                          {/* Skills / Interests Pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                             <span className="px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-[10px] text-gray-500 font-medium">Climate Action</span>
                             <span className="px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-[10px] text-gray-500 font-medium">Research</span>
                          </div>

                          {/* AI Score Section */}
                          <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-100 flex justify-between items-center">
                             <div>
                                <span className="text-[10px] font-bold text-green-800 block">AI Match Score</span>
                                <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle size={10}/> High Synergy</span>
                             </div>
                             <span className="text-xl font-black text-green-600">92%</span>
                          </div>

                          <button className="w-full py-2.5 bg-[#108a55] hover:bg-[#0d7547] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                             <ExternalLink size={14}/> Request Partnership
                          </button>
                      </div>
                  ))}
               </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;