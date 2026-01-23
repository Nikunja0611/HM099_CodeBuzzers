import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Download, Save, FileText, MapPin, Building, Sparkles, Loader2 } from 'lucide-react';
// 1. Import the SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const PartnershipProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, partner } = location.state || {};

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateDraft = async () => {
      if (project && partner) {
        setLoading(true);
        setSubject(`Collaboration Opportunity: ${project.title} & ${partner.orgName}`);

        try {
          // 2. Initialize Gemini with your Key
          const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });

          // 3. Construct the Prompt
          const prompt = `
            Write a professional partnership proposal email.
            
            **Sender Project:** "${project.title}" (Focus: ${project.description}) owned by ${project.owner}.
            **Recipient Partner:** "${partner.orgName}" located in ${partner.location}.
            **Partner Interests:** ${partner.interests}.
            **Partner Skills:** ${partner.skills}.
            
            **Goal:** Propose a strategic collaboration aligning our project's goals with their expertise.
            
            **Tone:** Professional, persuasive, and concise.
            **Output:** Just the email body text.
          `;

          // 4. Generate Content
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          setContent(text);
        } catch (error) {
          console.error("Error generating proposal:", error);
          setContent("Error generating draft. Please check your API key and try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    generateDraft();
  }, [project, partner]);

  if (!project || !partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md">
            <FileText size={48} className="text-gray-300 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Draft Selected</h2>
            <p className="text-gray-500 mb-6">Please select a project and a partner from the dashboard to draft a proposal.</p>
            <button onClick={() => navigate('/projects')} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold">Go to Projects</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
                <ArrowLeft size={18} className="mr-2"/> Back
            </button>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition">
                    <Save size={16}/> Save Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition">
                    <Download size={16}/> Download PDF
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Recipient Details</h3>
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                            <Building size={20}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{partner.orgName}</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {partner.location}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400 font-bold block mb-1">Focus Areas</span>
                            <p className="text-sm text-gray-700 font-medium">{partner.interests || 'General Development'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400 font-bold block mb-1">Match Score</span>
                            <p className="text-lg text-green-600 font-black">{partner.match_score || 85}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                    <Sparkles className="text-yellow-300 mb-4" size={24}/>
                    <h3 className="font-bold text-lg mb-2">AI Optimization</h3>
                    <p className="text-teal-50 text-sm opacity-90 leading-relaxed">
                        Gemini AI has analyzed {partner.orgName}'s history and drafted this proposal to maximize alignment with your SDG goals.
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Line</label>
                            <input 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="animate-spin mb-4 text-teal-600" size={32}/>
                                <p className="animate-pulse font-medium">Gemini is drafting your proposal...</p>
                            </div>
                        ) : (
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-96 p-4 border border-gray-200 rounded-xl text-gray-700 leading-relaxed focus:ring-2 focus:ring-teal-500 outline-none resize-none font-mono text-sm"
                            />
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
                            <Send size={18}/> Send Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipProposal;