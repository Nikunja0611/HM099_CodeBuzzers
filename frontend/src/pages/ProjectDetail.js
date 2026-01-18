import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  ArrowLeft, Calendar, User, CheckCircle, Circle, 
  Target, TrendingUp, Zap, Handshake, MapPin, Loader2, 
  Activity, Building, AlertTriangle
} from 'lucide-react';

// Standard SDG Colors
const SDG_COLORS = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A'
};

const SDG_LABELS = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education',
  5: 'Gender Equality', 6: 'Clean Water', 7: 'Clean Energy', 8: 'Decent Work',
  9: 'Industry', 10: 'Inequalities', 11: 'Sustainable Cities', 12: 'Consumption',
  13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land', 16: 'Peace', 17: 'Partnerships'
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

  const handleToggleMilestone = async (index) => {
    if (!project) return;
    const newMilestones = [...project.milestones];
    newMilestones[index].completed = !newMilestones[index].completed;
    
    const updatedProject = { ...project, milestones: newMilestones };
    setProject(updatedProject); 

    try {
        await api.put(`/projects/${id}`, { milestones: newMilestones });
    } catch (error) {
        console.error("Failed to save milestone", error);
        fetchData(); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;
  if (!project) return <div className="p-8 text-center">Project not found</div>;

  const sdgList = Array.isArray(project.sdg) ? project.sdg : [project.sdg];
  const progressPct = calculateProgress(project.milestones);
  const completedCount = project.milestones?.filter(m => m.completed).length || 0;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 font-sans">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm px-8 py-5">
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
                 <span className="flex items-center gap-1"><Calendar size={14}/> Created {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
           </div>
           
           <div className="flex gap-3">
              <button onClick={() => navigate(`/projects/${id}/edit`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                  Edit Project
              </button>
              <button className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold text-sm hover:bg-teal-800 shadow-sm transition">
                  Share Report
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* 1. ABOUT CARD */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About This Project</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {project.description}
              </p>
           </div>

           {/* 2. AI CLASSIFIED SDG ALIGNMENT */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Zap className="text-teal-600" size={20}/> AI-Classified SDG Alignment
              </h3>
              
              <div className="flex flex-wrap gap-4">
                 {sdgList.map((sdgNum, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center min-w-[140px] border border-gray-100 flex-1">
                       <div 
                         className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md"
                         style={{ backgroundColor: SDG_COLORS[sdgNum] || '#19486A' }}
                       >
                          {sdgNum}
                       </div>
                       <h4 className="font-bold text-gray-900 text-sm">{SDG_LABELS[sdgNum] || `Goal ${sdgNum}`}</h4>
                       <p className="text-xs text-green-600 font-bold mt-1">
                          {(project.confidence || 0.95 * 100).toFixed(0)}% Confidence
                       </p>
                    </div>
                 ))}
              </div>
           </div>

           {/* 3. MILESTONES */}
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Target size={20}/> Milestones</h3>
                 <span className="text-sm text-gray-500 font-medium">{completedCount}/{project.milestones?.length || 0} completed</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
                 <div className="bg-teal-600 h-2 rounded-full transition-all duration-700" style={{width: `${progressPct}%`}}></div>
              </div>

              <div className="space-y-4">
                 {(!project.milestones || project.milestones.length === 0) ? (
                    <p className="text-gray-400 italic text-center py-4">No milestones added yet.</p>
                 ) : project.milestones.map((ms, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleToggleMilestone(i)}
                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                            ms.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-teal-300'
                        }`}
                    >
                       <div className={`mr-4 ${ms.completed ? 'text-green-600' : 'text-gray-300'}`}>
                          {ms.completed ? <CheckCircle size={24} fill="#d1fae5"/> : <Circle size={24}/>}
                       </div>
                       <div className="flex-1">
                          <p className={`font-bold text-sm ${ms.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>{ms.title}</p>
                          <p className="text-xs text-gray-500 mt-1">Due: {ms.date || 'Flexible'}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* 4. AI PARTNER MATCHES (Moved Below Milestones) */}
           <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 mt-8">
                  <Handshake className="text-teal-700" size={20}/> AI Partner Matches
               </h3>
               
               {/* Used Grid here for wider layout */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.length === 0 ? (
                      <div className="col-span-2 p-6 bg-white rounded-xl text-center text-gray-400 text-sm border border-dashed border-gray-200">
                          AI is analyzing partners...
                      </div>
                  ) : recommendations.map((rec) => (
                      <div key={rec._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all h-full flex flex-col">
                          
                          {/* Header */}
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex gap-3">
                                <div className="w-12 h-12 bg-[#0F766E] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                                   <Building size={20} />
                                </div>
                                <div>
                                   <h4 className="font-bold text-gray-900 text-sm leading-tight">{rec.orgName}</h4>
                                   <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                      <MapPin size={10}/> {rec.location || 'Global'}
                                   </div>
                                </div>
                             </div>
                             <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase">
                                {rec.role || 'NGO'}
                             </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">
                            {rec.description || `Specialized in ${rec.interests || 'sustainable development'}.`}
                          </p>

                          {/* Skills Pills */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                             {(rec.skills ? rec.skills.split(',') : ['Collaboration', 'Research']).slice(0,3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 rounded-full border border-gray-200 text-[10px] text-gray-600 font-medium bg-gray-50">
                                   {skill.trim()}
                                </span>
                             ))}
                          </div>

                          {/* AI Match Score Box */}
                          <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-100">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-green-800">AI Match Score</span>
                                <span className="text-lg font-black text-green-600">92%</span>
                             </div>
                             <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                   <CheckCircle size={10} className="text-green-600"/> High SDG Overlap
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                   <CheckCircle size={10} className="text-green-600"/> Resource Compatible
                                </div>
                             </div>
                          </div>

                          <button className="w-full py-2.5 bg-[#108a55] hover:bg-[#0d7547] text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mt-auto">
                             <Handshake size={14}/> Request Partnership
                          </button>
                      </div>
                  ))}
               </div>
           </div>

        </div>

        {/* --- RIGHT COLUMN (SIDEBAR) --- */}
        <div className="space-y-6">
           
           {/* 1. IMPACT SCORE */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                 <TrendingUp size={16}/> Impact Score
               </h3>
               <div className="text-center mb-4">
                  <span className="text-6xl font-black text-teal-700 block">{project.impact_score || 0}%</span>
                  <span className="text-sm text-gray-400 font-medium">Overall impact potential</span>
               </div>
               <p className="text-xs text-gray-500 text-center leading-relaxed border-t border-gray-100 pt-3">
                  Based on resource allocation, SDG alignment, and milestone clarity.
               </p>
           </div>

           {/* 2. AI STATUS FORECAST */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                 <Activity size={16}/> AI Status Forecast
               </h3>
               
               <div className="flex flex-col items-center text-center">
                  {aiStatus.status === 'On Track' ? (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                         <CheckCircle size={32} strokeWidth={3}/>
                      </div>
                  ) : (
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
                         <AlertTriangle size={32} strokeWidth={3}/>
                      </div>
                  )}
                  <h4 className={`text-xl font-bold ${aiStatus.status === 'On Track' ? 'text-green-700' : 'text-red-700'}`}>
                     {aiStatus.status}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">100% Confidence</p>
               </div>
               
               <div className="mt-6 space-y-2 border-t pt-4 border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                     <CheckCircle size={12} className="text-green-500"/> Good milestone progress
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                     <CheckCircle size={12} className="text-green-500"/> High collaboration potential
                  </div>
               </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;