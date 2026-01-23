import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { 
  ArrowLeft, Calendar, User, CheckCircle, Circle, 
  Target, Zap, Handshake, MapPin, Loader2, 
  Activity, Building, AlertTriangle, TrendingUp, Info,
  Coins, BookOpen, Globe
} from 'lucide-react';

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
  
  const [aiStatus, setAiStatus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // --- LOCATION MATCHING ALGORITHM ---
  const getLocationDetails = (loc1, loc2) => {
      if (!loc1 || !loc2) return { score: 0, label: "No Match" };
      const s1 = loc1.toString().toLowerCase().trim();
      const s2 = loc2.toString().toLowerCase().trim();
      if (s1 === s2) return { score: 100, label: "Exact Match" };
      if (s1.includes(s2) || s2.includes(s1)) return { score: 80, label: "Region Match" };
      const words1 = s1.split(/[\s,-]+/).filter(w => w.length > 2); 
      const words2 = s2.split(/[\s,-]+/).filter(w => w.length > 2);
      if (words1.length > 0 && words2.length > 0 && words1[0] === words2[0]) return { score: 85, label: "City Match" };
      const commonWords = words1.filter(word => words2.includes(word));
      if (commonWords.length > 0) return { score: 50 + (commonWords.length * 10), label: "Country/Area Match" };
      return { score: 0, label: "No Match" }; 
  };

  const getSDGDetails = (pSdgs, partnerInterests) => {
    if (!pSdgs || !partnerInterests) return { score: 0, matches: [] };
    const pSet = new Set(Array.isArray(pSdgs) ? pSdgs.map(s => String(s)) : [String(pSdgs)]);
    const partnerArray = partnerInterests.split(',').map(s => s.replace(/[^0-9]/g, '').trim()).filter(s => s);
    const partnerSet = new Set(partnerArray);
    const matches = [];
    pSet.forEach(s => { if (partnerSet.has(s)) matches.push(s); });
    if (pSet.size === 0) return { score: 0, matches: [] };
    const score = (matches.length / pSet.size) * 100;
    return { score: Math.min(Math.round(score), 100), matches };
  };

  const calculateTimeElapsed = (createdAt, deadline = null) => {
    if (!createdAt) return 0;
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const end = deadline ? new Date(deadline).getTime() : start + (90 * 24 * 60 * 60 * 1000);
    const totalDuration = end - start;
    const elapsed = now - start;
    if (totalDuration <= 0) return 0;
    const pct = (elapsed / totalDuration) * 100;
    return Math.max(0, Math.min(pct, 100));
  };

  const calculateProgress = (milestones) => {
      if (!milestones || milestones.length === 0) return 0;
      const completed = milestones.filter(m => m.completed).length;
      return (completed / milestones.length) * 100;
  };

  const fetchData = useCallback(async (isInitialLoad = false) => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      const projData = projRes.data;
      setProject(projData);

      if (isInitialLoad) {
          const recRes = await api.get(`/projects/${id}/recommendations`);
          let recs = recRes.data || [];
          recs = recs.sort((a, b) => {
             const scoreA = (a.match_score || 0);
             const scoreB = (b.match_score || 0);
             if (scoreA !== scoreB) return scoreB - scoreA;
             const locA = getLocationDetails(projData.location, a.location).score;
             const locB = getLocationDetails(projData.location, b.location).score;
             return locB - locA;
          });
          setRecommendations(recs);
      }

      if (projData) {
         setAnalyzing(true); 
         const realMilestonePct = calculateProgress(projData.milestones);
         const realTimeElapsed = calculateTimeElapsed(projData.created_at, projData.deadline);
         const impactRes = await api.post('/predict_impact', {
           milestones_pct: realMilestonePct / 100, 
           time_elapsed_pct: realTimeElapsed / 100, 
           collaborators: projData.collaborators || 1,
           resource_availability: projData.resource_availability || 'Medium',
           budget_pct: projData.budget_pct || 0
         });
         setTimeout(() => {
             setAiStatus(impactRes.data); 
             setAnalyzing(false);         
         }, 1500); 
      }
    } catch (err) {
      console.error("Error loading details", err);
      setAnalyzing(false);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(true); 
  }, [fetchData]);

  const handleToggleMilestone = async (index) => {
    if (!project) return;
    const newMilestones = [...(project.milestones || [])];
    newMilestones[index].completed = !newMilestones[index].completed;
    const updatedProject = { ...project, milestones: newMilestones };
    setProject(updatedProject); 
    try {
        await api.put(`/projects/${id}`, { milestones: newMilestones });
        fetchData(false); 
    } catch (error) {
        console.error("Failed to save milestone", error);
    }
  };

  const handleRequestPartnership = (partner) => { navigate('/proposals/partnership', { state: { project, partner } }); };
  const handleRequestGrant = (partner) => { navigate('/proposals/grant', { state: { project, partner } }); };

  const generateDynamicInsights = (status, progressPct) => {
    if (!project) return { analysis: [], actions: [] };
    const budget = project.budget_pct || 0;
    const timeElapsed = calculateTimeElapsed(project.created_at, project.deadline);
    const analysis = [];
    const actions = [];
    const diff = progressPct - timeElapsed;
    const cleanProgress = Math.round(progressPct);
    const cleanTime = Math.round(timeElapsed);

    if (diff > 10) analysis.push(`You are ${Math.round(diff)}% ahead of schedule.`);
    else if (diff < -15) { analysis.push(`Falling behind: ${cleanTime}% time passed but only ${cleanProgress}% complete.`); actions.push("Re-evaluate timeline or reduce scope."); }
    else analysis.push(`On track: Progress aligns with timeline.`);
    if (budget > progressPct + 20) analysis.push(`Overspending detected: Budget used (${budget}%) exceeds progress.`);
    return { analysis: analysis.slice(0, 3), actions: actions.slice(0, 3) };
  };

  const getStatusStyles = (status) => {
    if (!status) return {}; 
    switch (status) {
      case 'Excellent': return { color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-100', icon: <TrendingUp size={32} strokeWidth={3} /> };
      case 'On Track': return { color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100', icon: <CheckCircle size={32} strokeWidth={3} /> };
      case 'At Risk': return { color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', icon: <AlertTriangle size={32} strokeWidth={3} /> };
      default: return { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: <Loader2 size={32} className="animate-spin" /> };
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;
  if (!project) return <div className="p-8 text-center">Project not found</div>;

  const sdgList = Array.isArray(project.sdg) ? project.sdg : [project.sdg];
  const progressPct = calculateProgress(project.milestones);
  const completedCount = (project.milestones ? project.milestones.filter(m => m.completed).length : 0) || 0;
  let globalConfidence = 85; 
  if (project.confidence !== undefined && project.confidence !== null) { globalConfidence = Number(project.confidence); if (globalConfidence > 0 && globalConfidence <= 1) globalConfidence *= 100; }
  const currentStatus = aiStatus ? aiStatus.status : 'Loading...';
  const currentConfidence = aiStatus ? Number(aiStatus.confidence) : 0;
  const statusStyle = getStatusStyles(currentStatus);
  const { analysis, actions } = aiStatus ? generateDynamicInsights(currentStatus, progressPct) : { analysis: [], actions: [] };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm px-8 py-5">
        <button onClick={() => navigate('/projects')} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 text-sm font-medium transition-colors">
          <ArrowLeft size={16} className="mr-1"/> Back to Projects
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{project.status || 'Planning'}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                 <span className="flex items-center gap-1"><User size={14}/> {project.owner}</span>
                 <span className="flex items-center gap-1"><Calendar size={14}/> Created {new Date(project.created_at).toLocaleDateString()}</span>
                 <span className="flex items-center gap-1"><MapPin size={14}/> {project.location || 'Remote/Global'}</span>
              </div>
           </div>
           <div className="flex gap-3">
              <button onClick={() => navigate(`/projects/${id}/edit`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 transition">Edit Project</button>
              <button className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold text-sm hover:bg-teal-800 shadow-sm transition">Share Report</button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About This Project</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{project.description}</p>
           </div>
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Zap className="text-teal-600" size={20}/> AI-Classified SDG Alignment</h3>
              <div className="flex flex-wrap gap-4">
                 {sdgList.map((sdgNum, idx) => {
                    let specificConf = globalConfidence;
                    if (project.sdg_scores && project.sdg_scores[String(sdgNum)]) specificConf = project.sdg_scores[String(sdgNum)];
                    return (<div key={idx} className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center min-w-[140px] border border-gray-100 flex-1"><div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md" style={{ backgroundColor: SDG_COLORS[sdgNum] || '#19486A' }}>{sdgNum}</div><h4 className="font-bold text-gray-900 text-sm">{SDG_LABELS[sdgNum] || `Goal ${sdgNum}`}</h4><p className="text-xs text-green-600 font-bold mt-1">{Number(specificConf).toFixed(0)}% Confidence</p></div>);
                 })}
              </div>
           </div>
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Target size={20}/> Milestones</h3><span className="text-sm text-gray-500 font-medium">{completedCount}/{project.milestones?.length || 0} completed</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-8"><div className="bg-teal-600 h-2 rounded-full transition-all duration-700" style={{width: `${progressPct}%`}}></div></div>
              <div className="space-y-4">{(!project.milestones || project.milestones.length === 0) ? (<p className="text-gray-400 italic text-center py-4">No milestones added yet.</p>) : project.milestones.map((ms, i) => (<div key={i} onClick={() => handleToggleMilestone(i)} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${ms.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-teal-300'}`}><div className={`mr-4 ${ms.completed ? 'text-green-600' : 'text-gray-300'}`}>{ms.completed ? <CheckCircle size={24} fill="#d1fae5"/> : <Circle size={24}/>}</div><div className="flex-1"><p className={`font-bold text-sm ${ms.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>{ms.title}</p><p className="text-xs text-gray-500 mt-1">Due: {ms.date || 'Flexible'}</p></div></div>))}</div>
           </div>
           <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 mt-8"><Handshake className="text-teal-700" size={20}/> AI Partner Matches</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.length === 0 ? (
                      <div className="col-span-2 p-6 bg-white rounded-xl text-center text-gray-400 text-sm border border-dashed border-gray-200">{project.sdg ? "AI is searching..." : "Add SDGs to get partner recommendations."}</div>
                  ) : recommendations.map((rec) => {
                      const locData = getLocationDetails(project.location, rec.location);
                      const sdgData = getSDGDetails(project.sdg, rec.interests);
                      const aiScore = rec.match_score || 0;
                      const isLocalMatch = locData.score > 50;

                      return (
                        <div key={rec._id} className={`bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all h-full flex flex-col ${isLocalMatch ? 'border-teal-300 ring-1 ring-teal-100' : 'border-gray-200'}`}>
                            {isLocalMatch && <div className="mb-2"><span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded flex items-center w-fit gap-1"><MapPin size={10} fill="currentColor" /> {locData.label}</span></div>}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 bg-[#0F766E] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"><Building size={20} /></div>
                                    <div>
                                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{rec.orgName}</h4>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><MapPin size={10} className={isLocalMatch ? "text-teal-600" : ""}/> <span className={isLocalMatch ? "font-bold text-teal-700" : ""}>{rec.location || 'Global'}</span></div>
                                    </div>
                                </div>
                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase">{rec.role || 'NGO'}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">{rec.description || `Specialized in ${rec.interests || 'sustainable development'}.`}</p>
                            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1"><BookOpen size={10}/> Match Analysis</p>
                                <div className="space-y-3">
                                    <div><div className="flex justify-between text-[11px] mb-1"><span className="font-bold text-gray-700 flex items-center gap-1"><Zap size={10}/> Semantic Fit</span><span className="font-bold text-teal-700">{aiScore}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-teal-600 h-1.5 rounded-full transition-all" style={{width: `${aiScore}%`}}></div></div><p className="text-[10px] text-gray-400 mt-0.5">Based on shared skills and mission.</p></div>
                                    <div><div className="flex justify-between text-[11px] mb-1"><span className="font-bold text-gray-700 flex items-center gap-1"><Target size={10}/> SDG Alignment</span><span className="font-bold text-blue-700">{sdgData.score}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{width: `${sdgData.score}%`}}></div></div>{sdgData.matches.length > 0 ? (<div className="flex gap-1 mt-1">{sdgData.matches.map(s => (<span key={s} className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded font-bold">Goal {s}</span>))}</div>) : <p className="text-[10px] text-gray-400 mt-0.5">No direct SDG overlap.</p>}</div>
                                    <div><div className="flex justify-between text-[11px] mb-1"><span className="font-bold text-gray-700 flex items-center gap-1"><Globe size={10}/> Proximity</span><span className="font-bold text-purple-700">{locData.score}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{width: `${locData.score}%`}}></div></div><p className="text-[10px] text-gray-400 mt-0.5">{locData.label}</p></div>
                                </div>
                            </div>
                            {/* UPDATED: GREEN GRANT BUTTON */}
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button onClick={() => handleRequestPartnership(rec)} className="py-2.5 bg-white border border-[#108a55] text-[#108a55] hover:bg-green-50 text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <Handshake size={14}/> Partner
                                </button>
                                <button onClick={() => handleRequestGrant(rec)} className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <Coins size={14}/> Grant
                                </button>
                            </div>
                        </div>
                      );
                  })}
               </div>
           </div>
        </div>
        <div className="space-y-6">
           {analyzing ? (
              <div className="rounded-2xl p-6 shadow-sm border border-gray-100 bg-white flex flex-col items-center justify-center min-h-[300px]">
                  <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
                  <p className="text-sm font-bold text-gray-500 animate-pulse">Running Impact Analysis...</p>
                  <p className="text-xs text-gray-400 mt-2">Checking milestones, budget, and resources</p>
              </div>
           ) : (
              <div className={`rounded-2xl p-6 shadow-sm border ${statusStyle.borderColor} bg-white relative overflow-hidden transition-all duration-500 ease-in-out`}>
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${statusStyle.bgColor.replace('bg-', 'bg-')}`}></div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2"><Activity size={16}/> AI Status Forecast</h3>
                  <div className="flex flex-col items-center text-center mb-6">
                      <div className={`w-20 h-20 ${statusStyle.bgColor} rounded-full flex items-center justify-center ${statusStyle.color} mb-3 shadow-inner`}>{statusStyle.icon}</div>
                      <h4 className={`text-2xl font-black ${statusStyle.color}`}>{currentStatus}</h4>
                      <div className="flex items-center gap-1 mt-1 bg-gray-100 px-3 py-1 rounded-full"><Zap size={10} className="text-gray-400"/><p className="text-xs text-gray-500 font-bold">{currentConfidence.toFixed(1)}% Confidence Model</p></div>
                  </div>
                  <div className="mb-6">
                      <h5 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1"><Info size={12} className="text-gray-400"/> Why this status?</h5>
                      {analysis.length > 0 ? (
                          <div className="space-y-2">{analysis.map((point, i) => (<div key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-snug"><CheckCircle size={12} className={`mt-0.5 shrink-0 ${statusStyle.color}`}/> <span>{point}</span></div>))}</div>
                      ) : <p className="text-xs text-gray-400 italic">Not enough data to generate insights.</p>}
                  </div>
                  {actions.length > 0 && (<div className={`rounded-xl p-4 ${statusStyle.bgColor} border ${statusStyle.borderColor}`}><h5 className={`text-xs font-bold uppercase mb-2 ${statusStyle.color}`}>Recommended Actions</h5><ul className="space-y-2">{actions.map((action, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 bg-gray-400`}></div>{action}</li>)}</ul></div>)}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;