import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { auth } from '../firebase';
import { Sparkles, Calendar, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_availability: 'Medium', // Feature for Model 3
    budget_pct: 0                   // Feature for Model 3
  });
  const [milestones, setMilestones] = useState([{ title: '', date: '' }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMilestoneChange = (index, field, value) => {
    const newMs = [...milestones];
    newMs[index][field] = value;
    setMilestones(newMs);
  };

  const handleClassify = async () => {
    if (!formData.description) return alert("Enter description first");
    setAiLoading(true);
    try {
      const res = await api.post('/predict_sdg', { description: formData.description });
      setAiResult(res.data);
    } catch (error) {
      console.error(error);
      alert("AI Service Offline");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        milestones,
        sdg: aiResult ? aiResult.sdg : "17", // Default if not classified
        confidence: aiResult ? aiResult.confidence : 0,
        owner: auth.currentUser?.email || "Anonymous",
        collaborators: 1,
        milestones_pct: 0, // Start at 0
        time_elapsed_pct: 0
      };
      await api.post('/projects', payload);
      navigate('/dashboard');
    } catch (error) {
      alert("Failed to create project");
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
                    <label className="text-sm font-bold text-gray-700">Resource Availability (Model Feature)</label>
                    <select name="resource_availability" onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white mt-1">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700">Budget Used % (Model Feature)</label>
                    <input type="number" name="budget_pct" onChange={handleInputChange} placeholder="0" className="w-full p-3 border rounded-lg mt-1" />
                </div>
             </div>
           </div>
        </div>

        {/* AI CARD */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-teal-600"/> AI SDG Classification</h2>
           {!aiResult ? (
             <button onClick={handleClassify} disabled={aiLoading} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
               {aiLoading ? "Analyzing..." : "Classify SDGs"}
             </button>
           ) : (
             <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex justify-between items-center">
                <div>
                   <p className="text-green-800 font-bold flex items-center gap-2"><CheckCircle size={18}/> Classified: SDG {aiResult.sdg}</p>
                   <p className="text-xs text-green-600">Confidence: {(aiResult.confidence * 100).toFixed(0)}%</p>
                </div>
                <button onClick={() => setAiResult(null)} className="text-xs underline text-green-700">Reset</button>
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
           <button onClick={() => navigate('/dashboard')} className="px-6 py-3 text-gray-600 font-bold">Cancel</button>
           <button onClick={handleSubmit} className="px-8 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg">Create Project</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;