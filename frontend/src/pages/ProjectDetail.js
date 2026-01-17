import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Share2, MoreHorizontal, CheckCircle, 
  AlertCircle, Droplets, Heart, Zap, MapPin, Building, Leaf,
  TrendingUp, Target, Users // <--- Added these missing imports
} from 'lucide-react';

const ProjectDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Back Navigation */}
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-6 transition">
        <ArrowLeft size={18} /> Back to Projects
      </button>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Clean Water Initiative for Rural Maharashtra</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">Active</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Building size={14}/> WaterAid India</span>
            <span className="flex items-center gap-1"><Calendar size={14}/> Created 2024-01-01</span>
        </div>
      </div>

      {/* TOP ROW: About & Impact Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Description */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">About This Project</h3>
            <p className="text-gray-600 leading-relaxed">
                Implementing sustainable water purification systems in 50 villages across Maharashtra using solar-powered filtration technology. This project aims to reduce waterborne diseases by 40% in the target demographic within the first year of implementation.
            </p>
        </div>
        
        {/* Right: Impact Score */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><TrendingUp size={18}/> Impact Score</h3>
            <span className="text-5xl font-bold text-teal-600 mb-1">78%</span>
            <span className="text-xs text-gray-400">Overall impact potential</span>
        </div>
      </div>

      {/* MIDDLE ROW: AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* AI SDG Alignment */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="text-teal-600" size={18}/> AI-Classified SDG Alignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SDG 6 */}
                <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm">
                        <Droplets size={20}/>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Clean Water</span>
                    <span className="text-xs text-cyan-600 font-semibold mt-1">95% confidence</span>
                </div>
                {/* SDG 3 */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm">
                        <Heart size={20}/>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Good Health</span>
                    <span className="text-xs text-red-600 font-semibold mt-1">78% confidence</span>
                </div>
                {/* SDG 7 */}
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white mb-2 shadow-sm">
                        <Zap size={20}/>
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Clean Energy</span>
                    <span className="text-xs text-yellow-600 font-semibold mt-1">65% confidence</span>
                </div>
            </div>
        </div>

        {/* AI Status Prediction */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="text-teal-600" size={18}/> AI Status Prediction
            </h3>
            <div className="flex flex-col items-center justify-center py-2">
                <CheckCircle size={48} className="text-green-500 mb-2" />
                <span className="text-xl font-bold text-green-600">On Track</span>
                <span className="text-xs text-gray-400 mb-4">100% confidence</span>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">Key Factors:</p>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-green-500"/> Good milestone progress</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-green-500"/> Strong collaboration network</div>
            </div>
        </div>
      </div>

      {/* BOTTOM ROW: Milestones & Collaborators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Milestones */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Target size={18}/> Milestones</h3>
                <span className="text-sm text-gray-500">2/4 completed</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                <div className="bg-teal-600 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>

            <div className="space-y-3">
                {/* Completed Item */}
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20}/>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 line-through decoration-gray-400 text-sm">Site Assessment Complete</p>
                        <p className="text-xs text-gray-500">Due: 2024-01-15</p>
                    </div>
                </div>
                 {/* Completed Item */}
                 <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20}/>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 line-through decoration-gray-400 text-sm">First 10 Villages Installed</p>
                        <p className="text-xs text-gray-500">Due: 2024-03-01</p>
                    </div>
                </div>
                {/* Pending Item */}
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Community Training Done</p>
                        <p className="text-xs text-gray-500">Due: 2024-04-15</p>
                    </div>
                </div>
                 {/* Pending Item */}
                 <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">All 50 Villages Complete</p>
                        <p className="text-xs text-gray-500">Due: 2024-06-30</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Collaborators */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={18}/> Collaborators (3)</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-teal-50 p-3 rounded-lg border border-teal-100">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs">W</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">WaterAid India</p>
                        <p className="text-xs text-teal-600 font-semibold">Project Owner</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Ministry of Rural Dev...</p>
                        <p className="text-xs text-gray-500">Government</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">S</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">SolarTech Innovations</p>
                        <p className="text-xs text-gray-500">Startup</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* AI PARTNER RECOMMENDATIONS (Final Section) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                <Leaf className="text-teal-600" size={20}/> AI Partner Recommendations
            </h3>
            <p className="text-gray-500 text-sm">Based on SDG alignment, domain expertise, and resource compatibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recommendation 1 */}
            <div className="border border-green-100 rounded-xl p-5 hover:shadow-md transition bg-green-50/30">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold"><Building size={20}/></div>
                        <div>
                            <h4 className="font-bold text-gray-900">IIT Climate Research Lab</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin size={12}/> Chennai, India
                            </div>
                        </div>
                    </div>
                    <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Research</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">Premier research institution focused on climate modeling and renewable energy research.</p>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">SDG Focus Areas</p>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white"><Zap size={12}/></div>
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"><Leaf size={12}/></div>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-emerald-700">AI Match Score</span>
                        <span className="text-lg font-bold text-emerald-600">92%</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex gap-1"><CheckCircle size={12} className="text-emerald-500"/> Shares focus on SDG 7</li>
                        <li className="flex gap-1"><CheckCircle size={12} className="text-emerald-500"/> Expertise in Climate Science</li>
                    </ul>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                    Request Partnership
                </button>
            </div>

            {/* Recommendation 2 */}
            <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold"><Building size={20}/></div>
                        <div>
                            <h4 className="font-bold text-gray-900">EduTech Solutions</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin size={12}/> Bangalore, India
                            </div>
                        </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Startup</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">EdTech startup providing AI-powered personalized learning for underserved communities.</p>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">SDG Focus Areas</p>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"><Heart size={12}/></div>
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600">AI Match Score</span>
                        <span className="text-lg font-bold text-gray-600">15%</span>
                    </div>
                     <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex gap-1"><CheckCircle size={12} className="text-gray-400"/> Expertise in EdTech</li>
                    </ul>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                    Request Partnership
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;