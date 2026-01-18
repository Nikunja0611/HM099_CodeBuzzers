import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  ResponsiveContainer, ComposedChart, Line, AreaChart, Area, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  Heart, Leaf, Zap, Download, Users, TrendingUp, 
  Award, Loader2, ArrowUpRight 
} from 'lucide-react';

const Impact = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch purely IMPACT-related metrics here, distinct from operational dashboard data
    const fetchImpactData = async () => {
      try {
        // Example API call: /stats/impact_deep_dive
        // This simulates receiving specialized impact data
        const res = await api.get('/stats/impact_metrics');
        setImpactData(res.data);
      } catch (err) {
        console.warn("Using fallback data for demonstration", err);
        // FALLBACK DATA: Use this structure in your backend
        setImpactData({
           sroi_current: 3.4, // Social Return on Investment (e.g., $1 spent = $3.4 social value)
           total_beneficiaries: 12450,
           co2_saved_tons: 850,
           community_sentiment: 88, // % Positive
           
           // Chart 1: Investment vs Impact (Efficiency)
           investment_vs_impact: [
             { month: 'Jan', investment: 20, beneficiaries: 1200 },
             { month: 'Feb', investment: 25, beneficiaries: 1900 },
             { month: 'Mar', investment: 22, beneficiaries: 2400 }, // Efficiency went up!
             { month: 'Apr', investment: 30, beneficiaries: 3800 },
             { month: 'May', investment: 28, beneficiaries: 4200 },
             { month: 'Jun', investment: 35, beneficiaries: 5100 },
           ],

           // Chart 2: Cumulative Environmental Offset
           eco_data: [
             { month: 'Jan', carbon: 10, water: 50 },
             { month: 'Feb', carbon: 25, water: 120 },
             { month: 'Mar', carbon: 45, water: 200 },
             { month: 'Apr', carbon: 80, water: 350 },
             { month: 'May', carbon: 120, water: 500 },
             { month: 'Jun', carbon: 180, water: 750 },
           ],

           // Chart 3: Qualitative Scoring Radar
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

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Deep Impact Analytics</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
             Measuring outcomes, not just outputs.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors">
            <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI ROW: Different from Dashboard (SROI, Beneficiaries, CO2) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Metric 1: SROI */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={60} className="text-indigo-600"/>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Social ROI (SROI)</p>
            <div className="flex items-end gap-2">
                <h3 className="text-4xl font-extrabold text-indigo-600">{impactData?.sroi_current}x</h3>
                <span className="mb-1 text-sm font-medium text-green-600 flex items-center">
                    <ArrowUpRight size={14}/> +0.4
                </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">For every $1 invested, ${impactData?.sroi_current} of social value is created.</p>
        </div>

        {/* Metric 2: Beneficiaries */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={60} className="text-pink-600"/>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Direct Beneficiaries</p>
            <h3 className="text-4xl font-extrabold text-gray-900">
                {(impactData?.total_beneficiaries / 1000).toFixed(1)}k
            </h3>
            <p className="text-xs text-gray-400 mt-2">Lives directly improved by initiatives.</p>
        </div>

        {/* Metric 3: Carbon */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Leaf size={60} className="text-emerald-600"/>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Environmental Offset</p>
            <h3 className="text-4xl font-extrabold text-emerald-600">{impactData?.co2_saved_tons}</h3>
            <p className="text-xs text-gray-400 mt-2">Tons of CO₂ equivalent avoided.</p>
        </div>

        {/* Metric 4: Sentiment */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart size={60} className="text-red-500"/>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Community Sentiment</p>
            <h3 className="text-4xl font-extrabold text-gray-900">{impactData?.community_sentiment}%</h3>
            <p className="text-xs text-gray-400 mt-2">Positive feedback from stakeholders.</p>
        </div>
      </div>

      {/* --- COMPLEX CHARTS SECTION --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
         {/* CHART 1: Cost Efficiency (Composed Chart) - Takes up 2 columns */}
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

         {/* CHART 2: Project Quality Radar - Takes up 1 column */}
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

      {/* CHART 3: Environmental Area Chart (Full Width) */}
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