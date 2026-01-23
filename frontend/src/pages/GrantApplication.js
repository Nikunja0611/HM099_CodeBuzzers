import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, Coins, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// 1. Import SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const GrantApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, partner } = location.state || {};

  const [activeTab, setActiveTab] = useState('details');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Auto-generate summary on load
  useEffect(() => {
    const generateSummary = async () => {
        if (project && !executiveSummary) {
            setLoadingAI(true);
            try {
                const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                
                const prompt = `
                    Write a concise Executive Summary for a grant application for the project "${project.title}".
                    Description: ${project.description}.
                    Focus on Social Impact and ROI. Max 150 words.
                `;
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                setExecutiveSummary(response.text());
            } catch (error) {
                console.error("AI Error", error);
                setExecutiveSummary(project.description); // Fallback
            } finally {
                setLoadingAI(false);
            }
        }
    };
    generateSummary();
  }, [project]);


  if (!project) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md">
              <Coins size={48} className="text-gray-300 mx-auto mb-4"/>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Project Selected</h2>
              <button onClick={() => navigate('/projects')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-4">Select Project</button>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Grant Application</h1>
                    <p className="text-sm text-gray-500">Drafting for: <span className="font-bold text-blue-600">{partner?.orgName || 'Funding Body'}</span></p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Save size={16}/> Save Draft
                </button>
                <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-md flex items-center gap-2">
                    <Send size={16}/> Submit Application
                </button>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
            
            {/* SIDEBAR TABS */}
            <div className="col-span-12 md:col-span-3 space-y-2">
                {['details', 'budget', 'impact', 'review'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
                            activeTab === tab 
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                            : 'text-gray-500 hover:bg-white hover:text-gray-700'
                        }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
                        <AlertCircle size={16}/> AI Insight
                    </div>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        Gemini is optimizing your Executive Summary for maximum funding probability based on {partner?.orgName}'s history.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="col-span-12 md:col-span-9">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
                    
                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="space-y-6 max-w-3xl">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                                <input defaultValue={project.title} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                                    Executive Summary
                                    {loadingAI && <span className="text-teal-600 flex items-center gap-1 text-xs font-normal"><Loader2 size={12} className="animate-spin"/> AI Drafting...</span>}
                                </label>
                                <textarea 
                                    rows="6" 
                                    value={executiveSummary} 
                                    onChange={(e) => setExecutiveSummary(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 leading-relaxed"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Months)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18}/>
                                        <input type="number" defaultValue="12" className="w-full pl-10 p-3 border border-gray-200 rounded-lg outline-none"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Beneficiaries</label>
                                    <input defaultValue="5000+ Community Members" className="w-full p-3 border border-gray-200 rounded-lg outline-none"/>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BUDGET TAB */}
                    {activeTab === 'budget' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-bold text-gray-900">Budget Breakdown</h2>
                                <span className="text-2xl font-black text-blue-600">$50,000.00</span>
                            </div>
                            
                            {[
                                { item: "Equipment & Hardware", cost: 15000 },
                                { item: "Personnel & Training", cost: 20000 },
                                { item: "Operational Logistics", cost: 10000 },
                                { item: "Monitoring & Evaluation", cost: 5000 }
                            ].map((row, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <input defaultValue={row.item} className="flex-1 bg-transparent font-medium text-gray-800 outline-none"/>
                                    <div className="w-32 relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                                        <input defaultValue={row.cost} className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-right font-mono text-sm"/>
                                    </div>
                                </div>
                            ))}
                            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg transition w-fit">
                                + Add Line Item
                            </button>
                        </div>
                    )}

                    {/* IMPACT TAB */}
                    {activeTab === 'impact' && (
                        <div className="text-center py-12">
                            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <CheckCircle size={32}/>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">SDG Alignment Verified</h2>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                The AI has automatically mapped your project outcomes to <strong>SDG {project.sdg?.join(', ')}</strong> indicators required by this grant.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GrantApplication;