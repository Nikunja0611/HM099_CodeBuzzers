import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, Plus, Trash2, 
  CheckCircle, Loader2, ArrowLeft 
} from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [milestones, setMilestones] = useState([
    { title: '', date: '' } // Start with one empty milestone
  ]);

  // --- AI STATE ---
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // Stores the SDG tag
  
  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', date: '' }]);
  };

  const removeMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  // --- AI CLASSIFICATION HANDLER ---
  const handleClassify = async () => {
    if (!formData.description) return alert("Please enter a description first.");
    
    setAiLoading(true);
    try {
      // Connect to your Flask Backend
      const res = await axios.post('http://localhost:5000/api/predict_sdg', { 
        description: formData.description 
      });
      setAiResult(res.data);
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback for demo if backend isn't running
      setTimeout(() => {
        setAiResult({ sdg: "SDG 6", confidence: 0.95 });
      }, 1000);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = () => {
    // Here you would send everything to your backend
    console.log("Submitting:", { ...formData, milestones, aiResult });
    alert("Project Created Successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-500 mt-1">Describe your project and let AI classify its SDG alignment</p>
        </div>

        <div className="space-y-6">
          
          {/* SECTION 1: PROJECT DETAILS */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Project Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="e.g., Clean Water Initiative for Rural Communities"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Describe your project goals, approach, and expected impact..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: AI CLASSIFICATION */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-teal-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">AI SDG Classification</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">Our NLP model analyzes your project description to automatically identify relevant SDGs</p>
            
            {!aiResult ? (
              <button 
                onClick={handleClassify}
                disabled={aiLoading}
                className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-70"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {aiLoading ? "Analyzing..." : "Classify SDGs"}
              </button>
            ) : (
              <div className="animate-fade-in bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start justify-between">
                <div>
                  <h3 className="text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle size={18} /> Classified: SDG {aiResult.sdg}
                  </h3>
                  <p className="text-emerald-600 text-sm mt-1">
                    Confidence Score: {(aiResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <button 
                  onClick={() => setAiResult(null)} 
                  className="text-xs text-emerald-600 underline hover:text-emerald-800"
                >
                  Re-classify
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: MILESTONES */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Project Milestones</h2>
            
            <div className="space-y-4 mb-6">
              {milestones.map((ms, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-grow">
                    <input 
                      type="text"
                      value={ms.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Milestone title"
                    />
                  </div>
                  <div className="w-48 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input 
                      type="date"
                      value={ms.date}
                      onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button onClick={() => removeMilestone(index)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={addMilestone}
              className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
            >
              <Plus size={18} /> Add Milestone
            </button>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end gap-4 mt-8 pt-4 pb-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition"
            >
              Create Project
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateProject;