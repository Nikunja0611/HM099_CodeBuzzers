import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, Coins, Calendar, CheckCircle, AlertCircle, Loader2, Sparkles, FileText } from 'lucide-react';
import { api } from '../api';

const GrantApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, partner } = location.state || {};

  // --- REAL TIME USER CONTEXT ---
  // Assuming you store the logged-in user's ID in localStorage upon login
  const currentUserId = localStorage.getItem('user_id') || 'guest_user'; 

  const [activeTab, setActiveTab] = useState('details');
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [proposalId, setProposalId] = useState(null);

  const [formData, setFormData] = useState({
      title: project?.title || '',
      description: project?.description || '',
      duration: '12',
      beneficiaries: '5000+ Community Members'
  });

  const [budgetItems, setBudgetItems] = useState([
      { item: "Equipment", cost: 5000 },
      { item: "Training", cost: 2000 }
  ]);

  const [generatedDraft, setGeneratedDraft] = useState('');

  // 1. GENERATE DRAFT
  const handleGenerateDraft = async () => {
    setLoadingAI(true);
    try {
        const payload = {
            title: formData.title,
            description: formData.description,
            budget_items: budgetItems,
            impact_metrics: { beneficiaries: formData.beneficiaries, duration: formData.duration },
            type: 'grant',
            partner_name: partner?.orgName
        };
        const res = await api.post('/generate_draft', payload);
        setGeneratedDraft(res.data.draft);
        setActiveTab('draft');
    } catch (error) {
        alert("AI Generation failed. Please try again.");
    } finally {
        setLoadingAI(false);
    }
  };

  // 2. SAVE OR SUBMIT
  const handleSave = async (status) => {
      setIsSaving(true);
      try {
          const payload = {
              _id: proposalId,
              sender_id: currentUserId, // REAL USER ID
              project_id: project?._id,
              partner_id: partner?._id,
              partner_name: partner?.orgName,
              title: formData.title,
              content: generatedDraft,
              status: status,
              type: 'grant',
              budget_data: budgetItems
          };
          
          const res = await api.post('/grants/save', payload);
          if (res.data.id) setProposalId(res.data.id);
          
          if (status === 'Submitted') {
              alert(`Application Submitted to ${partner?.orgName} successfully!`);
              navigate('/grants'); // Go to Grants Tab
          } else {
              alert("Draft Saved!");
          }
      } catch (error) {
          alert("Failed to save.");
      } finally {
          setIsSaving(false);
      }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded border"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-bold">Grant Application: {partner?.orgName}</h1>
            </div>
            <div className="flex gap-3">
                <button onClick={() => handleSave('Draft')} disabled={isSaving} className="px-4 py-2 bg-white border rounded shadow-sm flex gap-2 items-center">
                    <Save size={16}/> Save Draft
                </button>
                <button onClick={() => handleSave('Submitted')} disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded shadow-sm flex gap-2 items-center">
                    <Send size={16}/> Submit Application
                </button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3 space-y-2">
                {['details', 'budget', 'draft'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2"><Sparkles size={14}/> AI Writer</div>
                    <p className="text-xs text-purple-600 mb-3">Let Gemini write the full proposal based on your details.</p>
                    <button onClick={handleGenerateDraft} disabled={loadingAI} className="w-full py-2 bg-purple-600 text-white rounded text-xs font-bold">
                        {loadingAI ? "Writing..." : "Generate Draft"}
                    </button>
                </div>
            </div>

            <div className="col-span-9 bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-bold">Project Title</label>
                        <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded"/>
                        <label className="block text-sm font-bold">Project Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded h-40"/>
                    </div>
                )}
                {activeTab === 'budget' && (
                    <div>
                        <h3 className="font-bold mb-4">Budget Breakdown</h3>
                        {budgetItems.map((b, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input value={b.item} onChange={e => {const n=[...budgetItems];n[i].item=e.target.value;setBudgetItems(n)}} className="border p-2 flex-1 rounded" placeholder="Item Name"/>
                                <input type="number" value={b.cost} onChange={e => {const n=[...budgetItems];n[i].cost=e.target.value;setBudgetItems(n)}} className="border p-2 w-32 rounded" placeholder="Cost"/>
                            </div>
                        ))}
                        <button onClick={() => setBudgetItems([...budgetItems, {item:'', cost:0}])} className="text-blue-600 text-sm font-bold mt-2">+ Add Item</button>
                    </div>
                )}
                {activeTab === 'draft' && (
                    <div className="h-full flex flex-col">
                        <textarea value={generatedDraft} onChange={e => setGeneratedDraft(e.target.value)} className="w-full flex-1 p-4 border rounded font-serif text-lg leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Generated draft will appear here..."/>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GrantApplication;