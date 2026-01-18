import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { auth } from '../firebase';
import { Sparkles, Plus, Trash2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_availability: 'Medium',
    budget_pct: 0
  });
  const [milestones, setMilestones] = useState([{ title: '', date: '' }]);
  
  // --- AI STATE ---
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  
  // CHANGED: State is now an Array
  const [selectedSDGs, setSelectedSDGs] = useState(["17"]); 

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMilestoneChange = (index, field, value) => {
    const newMs = [...milestones];
    newMs[index][field] = value;
    setMilestones(newMs);
  };

  // Toggle Logic for Multi-Selection
  const toggleSDG = (sdgValue) => {
    setSelectedSDGs(prev => {
      if (prev.includes(sdgValue)) {
        // Remove if exists (prevent removing if it's the only one?)
        return prev.length > 1 ? prev.filter(s => s !== sdgValue) : prev;
      } else {
        // Add if not exists
        return [...prev, sdgValue];
      }
    });
  };

  const handleClassify = async () => {
    if (!formData.description) return alert("Enter description first");
    setAiLoading(true);
    setAiResults([]); 
    
    try {
      const res = await api.post('/predict_sdg', { description: formData.description });
      const results = Array.isArray(res.data) ? res.data : [];
      setAiResults(results);

      // CHANGED: Auto-select ALL SDGs detected by AI (above threshold)
      if (results.length > 0) {
        const detectedSDGs = results.map(r => r.sdg);
        setSelectedSDGs(detectedSDGs);
      } else {
        alert("AI could not confidently classify. Defaulting to SDG 17.");
        setSelectedSDGs(["17"]);
      }
    } catch (error) {
      console.error(error);
      alert("AI Service Offline");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      return alert("Please fill in Title and Description");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        milestones,
        sdg: selectedSDGs, // SEND ARRAY TO BACKEND
        owner: auth.currentUser?.email || "Anonymous",
        collaborators: 1,
        milestones_pct: 0,
        time_elapsed_pct: 0,
        status: "Planning",
        created_at: new Date().toISOString()
      };

      await api.post('/projects', payload);
      alert("✅ Project Created Successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>

        {/* DETAILS CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4">Project Details</h2>
           <div className="space-y-4">
             <input name="title" onChange={handleInputChange} placeholder="Project Title" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
             <textarea name="description" onChange={handleInputChange} rows="4" placeholder="Project Description..." className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-bold text-gray-700">Resource Availability</label>
                    <select name="resource_availability" onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white mt-1">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700">Budget Used %</label>
                    <input type="number" name="budget_pct" onChange={handleInputChange} placeholder="0" className="w-full p-3 border rounded-lg mt-1" />
                </div>
             </div>
           </div>
        </div>

        {/* AI CLASSIFICATION CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-teal-600"/> AI SDG Classification</h2>
           </div>

           {aiResults.length === 0 ? (
             <div className="flex items-center gap-4">
               <button onClick={handleClassify} disabled={aiLoading} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-600 transition shadow-sm">
                 {aiLoading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18}/> Analyze Description</>}
               </button>
               <span className="text-sm text-gray-400">Click to detect applicable SDGs</span>
             </div>
           ) : (
             <div className="space-y-4">
                <div className="flex items-start gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                   <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                   <p>The AI detected relevant SDGs. <strong>Click badges to toggle</strong> selection.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {aiResults.map((res, idx) => {
                    const isSelected = selectedSDGs.includes(res.sdg);
                    return (
                        <div 
                          key={idx}
                          onClick={() => toggleSDG(res.sdg)}
                          className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all duration-200 ${
                            isSelected
                              ? 'bg-green-50 border-green-500 ring-2 ring-green-200 shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-green-300 opacity-60 hover:opacity-100'
                          }`}
                        >
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${isSelected ? 'bg-green-600' : 'bg-gray-400'}`}>
                             {res.sdg}
                           </div>
                           
                           <div>
                              <p className={`font-bold text-sm ${isSelected ? 'text-green-900' : 'text-gray-700'}`}>SDG {res.sdg}</p>
                              <p className="text-xs text-gray-500">{(res.confidence * 100).toFixed(1)}% Match</p>
                           </div>

                           {isSelected && <CheckCircle size={18} className="text-green-600 ml-2"/>}
                        </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                   <p className="text-xs text-gray-400">Selected: <span className="font-bold text-green-600">{selectedSDGs.join(", ")}</span></p>
                   <button onClick={() => setAiResults([])} className="text-xs text-teal-600 hover:underline">Re-analyze</button>
                </div>
             </div>
           )}
        </div>

        {/* MILESTONES CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4">Milestones</h2>
           {milestones.map((ms, i) => (
             <div key={i} className="flex gap-4 mb-3">
               <input onChange={(e) => handleMilestoneChange(i, 'title', e.target.value)} placeholder="Milestone Title" className="flex-1 p-3 border rounded-lg" />
               <input type="date" onChange={(e) => handleMilestoneChange(i, 'date', e.target.value)} className="p-3 border rounded-lg" />
               <button onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2/></button>
             </div>
           ))}
           <button onClick={() => setMilestones([...milestones, {title:'', date:''}])} className="text-teal-600 font-bold flex items-center gap-2 mt-2"><Plus size={18}/> Add Milestone</button>
        </div>

        <div className="flex justify-end gap-4">
           <button onClick={() => navigate('/dashboard')} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
           <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isSubmitting && <Loader2 className="animate-spin" size={18}/>}
              {isSubmitting ? "Creating..." : "Create Project"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;