import React, { useState } from 'react';
import axios from 'axios';
import { Bot } from 'lucide-react';

const CreateProject = () => {
  const [desc, setDesc] = useState('');
  const [aiResult, setAiResult] = useState(null);

  const handleAnalyze = async () => {
    // Call your Flask API
    const res = await axios.post('http://localhost:5000/api/predict_sdg', { description: desc });
    setAiResult(res.data);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-40"
          placeholder="Describe your initiative..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="mt-6 flex items-center justify-between">
            <button 
                onClick={handleAnalyze}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2 transition"
            >
                <Bot size={20}/> Classify with AI
            </button>
        </div>

        {/* AI Result Card */}
        {aiResult && (
          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg animate-pulse-once">
            <h3 className="text-green-800 font-bold flex items-center gap-2">
                ✅ AI Classification Complete
            </h3>
            <p className="mt-1 text-green-700">
                Target Goal: <strong>{aiResult.sdg}</strong>
            </p>
            <p className="text-xs text-green-600 mt-2">
                Confidence: {(aiResult.confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CreateProject;