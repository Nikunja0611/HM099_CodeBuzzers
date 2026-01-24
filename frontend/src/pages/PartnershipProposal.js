import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';

const PartnershipProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, partner } = location.state || {};
  const currentUserId = localStorage.getItem('user_id') || 'guest_user';

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // New error state

  useEffect(() => {
    const generate = async () => {
        // Prevent running if data missing or content already exists
        if(!project || !partner || content) return;
        
        setLoading(true);
        setErrorMsg(null);

        try {
            // 1. Sending request to Backend
            // Ensure your api.js baseURL is 'http://localhost:5000/api'
            const res = await api.post('/generate_draft', {
                title: project.title,
                description: project.description,
                partner_name: partner.orgName,
                type: 'partnership'
            });

            if (res.data.draft) {
                setContent(res.data.draft);
            } else {
                setErrorMsg("AI returned empty response.");
            }
        } catch(e) { 
            console.error("Proposal Generation Error:", e);
            // Display error in UI instead of silent fail
            setErrorMsg("Failed to generate draft. Backend may be offline or AI model unavailable.");
            setContent("Error: Could not generate proposal. Please try drafting manually.");
        } finally { 
            setLoading(false); 
        }
    };
    
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, partner]); // Removed 'content' from dependency to prevent loop

  const handleSend = async () => {
      setIsSaving(true);
      try {
          // 2. Submitting to Backend
          await api.post('/grants/submit', { // Using submit endpoint directly
              sender_id: currentUserId,
              project_id: project._id,
              partner_id: partner._id,
              partner_name: partner.orgName,
              title: `Partnership: ${project.title}`,
              content: content,
              type: 'partnership',
              status: 'Submitted'
          });
          alert("Proposal Sent Successfully!");
          navigate('/proposals'); 
      } catch(e) { 
          console.error(e);
          alert("Failed to send proposal. Check console for details."); 
      } finally { 
          setIsSaving(false); 
      }
  };

  if(!project || !partner) return (
    <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No project or partner selected.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between mb-6">
                <button onClick={() => navigate(-1)} className="p-2 border rounded hover:bg-gray-50"><ArrowLeft size={20}/></button>
                <div className="text-right">
                    <h1 className="text-xl font-bold">Proposal for {partner.orgName}</h1>
                    <p className="text-sm text-gray-500">Sender: {project.owner}</p>
                </div>
            </div>
            
            {/* AI Banner */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg flex gap-3 items-start border border-purple-100">
                <Sparkles className="text-purple-600 mt-1 flex-shrink-0" size={18}/>
                <div>
                    <p className="text-sm text-purple-800 font-bold">AI Generated Draft</p>
                    <p className="text-xs text-purple-600">Gemini has analyzed {partner.orgName}'s history to draft this personalized proposal.</p>
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex gap-2 items-center text-sm">
                    <AlertCircle size={16}/> {errorMsg}
                </div>
            )}

            {/* Content Area */}
            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400 border rounded-lg bg-gray-50">
                    <Loader2 className="animate-spin mb-3 text-purple-600" size={32}/>
                    <p className="font-medium animate-pulse">Drafting Proposal...</p>
                </div>
            ) : (
                <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    className="w-full h-96 p-6 border border-gray-300 rounded-xl font-serif text-lg leading-relaxed focus:ring-2 focus:ring-teal-500 outline-none shadow-inner"
                    placeholder="Proposal content will appear here..."
                />
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button 
                    onClick={handleSend} 
                    disabled={isSaving || loading || !content} 
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all text-white shadow-md ${
                        isSaving || loading || !content ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                    {isSaving ? 'Sending...' : 'Send Proposal'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default PartnershipProposal;