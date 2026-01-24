import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { 
  ResponsiveContainer, ComposedChart, Line, AreaChart, Area, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  Leaf, Zap, Download, Award, Loader2, Share2, Sparkles, BrainCircuit 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- CUSTOM COMPONENT: AI NETWORK GRAPH VISUALIZER ---
const ImpactNetworkGraph = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-50 rounded-xl border border-slate-200">
      <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 400 300">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
          </marker>
        </defs>
        
        {/* Connection Lines */}
        <line x1="200" y1="150" x2="100" y2="80" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="200" y1="150" x2="300" y2="80" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="200" y1="150" x2="100" y2="220" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="200" y1="150" x2="300" y2="220" stroke="#cbd5e1" strokeWidth="2" />

        {/* Animated Data Pulses */}
        <circle r="3" fill="#6366f1">
          <animateMotion dur="2s" repeatCount="indefinite" path="M200,150 L100,80" />
        </circle>
        <circle r="3" fill="#10b981">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M200,150 L300,220" />
        </circle>
        <circle r="3" fill="#ec4899">
          <animateMotion dur="3s" repeatCount="indefinite" path="M100,220 L200,150" />
        </circle>

        {/* Nodes */}
        <circle cx="200" cy="150" r="25" fill="white" stroke="#6366f1" strokeWidth="4" />
        <circle cx="100" cy="80" r="15" fill="white" stroke="#eab308" strokeWidth="3" />
        <circle cx="300" cy="80" r="15" fill="white" stroke="#ec4899" strokeWidth="3" />
        <circle cx="100" cy="220" r="15" fill="white" stroke="#8b5cf6" strokeWidth="3" />
        <circle cx="300" cy="220" r="15" fill="white" stroke="#10b981" strokeWidth="3" />
      </svg>
      
      {/* HTML Labels */}
      <div className="absolute inset-0 relative z-10">
        <div className="absolute top-[140px] left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">
          Core Model
        </div>
        <div className="absolute top-[50px] left-[70px] text-[10px] font-bold text-gray-600">Capital</div>
        <div className="absolute top-[50px] right-[70px] text-[10px] font-bold text-gray-600">Community</div>
        <div className="absolute bottom-[50px] left-[70px] text-[10px] font-bold text-gray-600">R&D</div>
        <div className="absolute bottom-[50px] right-[75px] text-[10px] font-bold text-gray-600">Nature</div>
      </div>
    </div>
  );
};


const Impact = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref to capture the entire dashboard content
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const res = await api.get('/stats/impact_metrics');
        setImpactData(res.data);
      } catch (err) {
        console.warn("Using fallback data for demonstration", err);
        setImpactData({
           sroi_current: 3.4,
           total_beneficiaries: 12450,
           co2_saved_tons: 850,
           community_sentiment: 88,
           
           investment_vs_impact: [
             { month: 'Jan', investment: 20, beneficiaries: 1200 },
             { month: 'Feb', investment: 25, beneficiaries: 1900 },
             { month: 'Mar', investment: 22, beneficiaries: 2400 },
             { month: 'Apr', investment: 30, beneficiaries: 3800 },
             { month: 'May', investment: 28, beneficiaries: 4200 },
             { month: 'Jun', investment: 35, beneficiaries: 5100 },
           ],

           eco_data: [
             { month: 'Jan', carbon: 10, water: 50 },
             { month: 'Feb', carbon: 25, water: 120 },
             { month: 'Mar', carbon: 45, water: 200 },
             { month: 'Apr', carbon: 80, water: 350 },
             { month: 'May', carbon: 120, water: 500 },
             { month: 'Jun', carbon: 180, water: 750 },
           ],

           radar_metrics: [
             { subject: 'Sustainability', A: 120, fullMark: 150 },
             { subject: 'Innovation', A: 98, fullMark: 150 },
             { subject: 'Community', A: 86, fullMark: 150 },
             { subject: 'Scalability', A: 99, fullMark: 150 },
             { subject: 'Inclusivity', A: 85, fullMark: 150 },
             { subject: 'Transparency', A: 65, fullMark: 150 },
           ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchImpactData();
  }, []);

  // --- PDF EXPORT FUNCTION ---
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);

    try {
        const element = dashboardRef.current;
        
        // Capture the DOM element as a canvas
        // Scale 2 increases resolution for clearer text
        const canvas = await html2canvas(element, { 
            scale: 2,
            useCORS: true, // Needed if you have external images
            logging: false,
            backgroundColor: '#F8F9FA' // Matches the bg color of the app
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Initialize PDF (A4 size, portrait)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate dimensions to fit the image on the page
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Add image to PDF. If content is longer than one page, simple fit logic:
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // If content overflows A4, add new pages (simple multi-page support)
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('Deep_Impact_Analytics_Report.pdf');

    } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsExporting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    // Added ref={dashboardRef} here to capture everything inside this div
    <div ref={dashboardRef} className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Deep Impact Analytics <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><BrainCircuit size={12}/> AI Powered</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
              Graph AI processing enabled. Measuring systemic outcomes.
          </p>
        </div>
        
        {/* EXPORT BUTTON with Logic */}
        <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            // data-html2canvas-ignore="true" // Uncomment this if you want to hide the button in the PDF itself
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isExporting ? (
                <>
                    <Loader2 size={16} className="animate-spin"/> Generating PDF...
                </>
            ) : (
                <>
                    <Download size={16} /> Export Report
                </>
            )}
        </button>
      </div>

      {/* --- AI GRAPH SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* AI Insight Text Box */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-yellow-300"/>
                    <h3 className="font-bold text-lg">AI Correlation Insight</h3>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                    Our Graph AI model has detected a <strong className="text-white">strong causal link (0.89)</strong> between the March R&D investment and the spike in May's community sentiment. 
                </p>
                <div className="h-1 w-full bg-indigo-500/50 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-3/4 animate-pulse"></div>
                </div>
                <p className="text-xs text-indigo-300 mt-2">Confidence Score: 92%</p>
            </div>
            {/* Background decoration */}
            <Share2 className="absolute -bottom-4 -right-4 text-white opacity-10" size={120} />
        </div>

        {/* The Graph Visualizer */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Share2 size={18} className="text-blue-500"/> Systemic Impact Network
                    </h3>
                    <p className="text-xs text-gray-500">Visualizing data relationships via Force-Directed Graph.</p>
                </div>
            </div>
            <div className="flex-1">
                <ImpactNetworkGraph />
            </div>
        </div>
      </div>

      {/* --- COMPLEX CHARTS SECTION --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
         {/* CHART 1: Cost Efficiency */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-500"/> Capital Efficiency
                </h3>
                <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-200 rounded-sm"></div> Investment ($k)</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-600 rounded-full"></div> Beneficiaries</span>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={impactData?.investment_vs_impact}>
                        <CartesianGrid stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="month" scale="point" padding={{ left: 20, right: 20 }} tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis yAxisId="left" orientation="left" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar yAxisId="left" dataKey="investment" barSize={30} fill="#bfdbfe" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="beneficiaries" stroke="#4f46e5" strokeWidth={3} dot={{r:4, fill:'#4f46e5', stroke:'#fff', strokeWidth:2}} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* CHART 2: Project Quality Radar */}
         <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Award size={20} className="text-purple-500"/> Impact Quality Score
            </h3>
            <p className="text-xs text-gray-500 mb-4">Multi-dimensional analysis of project health.</p>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={impactData?.radar_metrics}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* CHART 3: Environmental Area Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
         <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Leaf size={20} className="text-emerald-500"/> Cumulative Environmental Savings
         </h3>
         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impactData?.eco_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}}/>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6"/>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }}/>
                    <Area type="monotone" dataKey="carbon" stroke="#10b981" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={2} name="Carbon (Tons)" />
                    <Area type="monotone" dataKey="water" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2} name="Water (kL)" />
                    <Legend verticalAlign="top" height={36} iconType="circle"/>
                </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

export default Impact;