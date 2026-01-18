import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { 
  Sparkles, Save, ArrowLeft, Trash2, Plus, Loader2, AlertCircle 
} from 'lucide-react';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planning',
    resource_availability: 'Medium',
    budget_pct: 0
  });
  
  const [milestones, setMilestones] = useState([]);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [selectedSDGs, setSelectedSDGs] = useState([]);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        const data = res.data;
        
        setFormData({
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'Planning',
            resource_availability: data.resource_availability || 'Medium',
            budget_pct: data.budget_pct || 0
        });
        
        setMilestones(data.milestones || []);
        
        // Handle SDG array or single string
        if (Array.isArray(data.sdg)) {
            setSelectedSDGs(data.sdg);
        } else if (data.sdg) {
            setSelectedSDGs([data.sdg]);
        }
        
      } catch (err) {
        console.error("Failed to load project", err);
        alert("Error loading project data");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMs = [...milestones];
    newMs[index][field] = value;
    setMilestones(newMs);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', date: '', completed: false }]);
  };

  const toggleSDG = (sdgVal) => {
    setSelectedSDGs(prev => 
        prev.includes(sdgVal) 
        ? prev.filter(s => s !== sdgVal)
        : [...prev, sdgVal]
    );
  };

  const handleReClassify = async () => {
    if (!formData.description) return alert("Enter description first");
    setAiLoading(true);
    try {
      const res = await api.post('/predict_sdg', { description: formData.description });
      const results = Array.isArray(res.data) ? res.data : [res.data];
      setAiResults(results);
      
      // Auto-select detected SDGs
      if (results.length > 0) {
          setSelectedSDGs(results.map(r => r.sdg));
      }
    } catch (error) {
      console.error(error);
      alert("AI Service Offline");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const payload = {
            ...formData,
            milestones,
            sdg: selectedSDGs,
            // Impact score will be recalculated by backend logic or kept as is
        };

        await api.put(`/projects/${id}`, payload);
        alert("✅ Project Updated Successfully!");
        navigate(`/projects/${id}`); // Go back to details page
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update project.");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <button onClick={() => navigate(`/projects/${id}`)} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
                <ArrowLeft size={16}/> Cancel
            </button>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-6 text-gray-800">Core Details</h2>
           <div className="space-y-5">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Project Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
             </div>
             
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Resource Availability</label>
                    <select name="resource_availability" value={formData.resource_availability} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Budget Used %</label>
                    <input type="number" name="budget_pct" value={formData.budget_pct} onChange={handleInputChange} className="w-full p-3 border rounded-lg" />
                </div>
             </div>
           </div>
        </div>

        {/* AI CLASSIFICATION CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-teal-600"/> SDG Classification</h2>
              <button onClick={handleReClassify} disabled={aiLoading} className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-lg font-bold hover:bg-teal-100 transition">
                  {aiLoading ? "Analyzing..." : "Re-Analyze Description"}
              </button>
           </div>
            
           {/* Display Selected SDGs */}
           <div className="space-y-4">
               {selectedSDGs.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                       {selectedSDGs.map(sdg => (
                           <span key={sdg} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                               SDG {sdg}
                               <button onClick={() => toggleSDG(sdg)} className="hover:text-red-500">×</button>
                           </span>
                       ))}
                   </div>
               )}

               {/* AI Results Display (if newly analyzed) */}
               {aiResults.length > 0 && (
                   <div className="bg-blue-50 p-4 rounded-lg mt-4">
                       <p className="text-sm text-blue-800 font-bold mb-2 flex items-center gap-2">
                           <AlertCircle size={16}/> AI Suggestions:
                       </p>
                       <div className="flex flex-wrap gap-2">
                           {aiResults.map((res, i) => (
                               <button 
                                   key={i}
                                   onClick={() => toggleSDG(res.sdg)}
                                   className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${selectedSDGs.includes(res.sdg) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 hover:border-green-400'}`}
                               >
                                   SDG {res.sdg} ({Math.round(res.confidence * 100)}%)
                               </button>
                           ))}
                       </div>
                   </div>
               )}
           </div>
        </div>

        {/* MILESTONES CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4">Milestones</h2>
           <div className="space-y-3">
               {milestones.map((ms, i) => (
                 <div key={i} className="flex gap-4 items-center">
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                       <input 
                           value={ms.title} 
                           onChange={(e) => handleMilestoneChange(i, 'title', e.target.value)} 
                           placeholder="Milestone Title" 
                           className="col-span-2 p-2.5 border rounded-lg text-sm" 
                       />
                       <input 
                           type="date" 
                           value={ms.date} 
                           onChange={(e) => handleMilestoneChange(i, 'date', e.target.value)} 
                           className="p-2.5 border rounded-lg text-sm" 
                       />
                   </div>
                   <button onClick={() => removeMilestone(i)} className="text-gray-400 hover:text-red-500 p-2">
                       <Trash2 size={18}/>
                   </button>
                 </div>
               ))}
           </div>
           <button onClick={addMilestone} className="mt-4 text-teal-600 font-bold text-sm flex items-center gap-2 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors w-fit">
               <Plus size={18}/> Add New Milestone
           </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pb-10">
           <button onClick={() => navigate(`/projects/${id}`)} className="px-6 py-3 text-gray-600 font-bold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
               Cancel
           </button>
           <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg flex items-center gap-2 disabled:opacity-70">
              {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
              {isSaving ? "Saving..." : "Save Changes"}
           </button>
        </div>

      </div>
    </div>
  );
};

export default EditProject;