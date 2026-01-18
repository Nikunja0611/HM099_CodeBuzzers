import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Search, MapPin, Building, Loader2, Filter, ChevronDown, Plus } from 'lucide-react';

// Standard SDG Colors
const SDG_COLORS = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A'
};

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSDG, setSelectedSDG] = useState('All SDGs');

  useEffect(() => {
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueTypes = ['All Types', 'NGO', 'Startup', 'Government'];
  const sdgOptions = ['All SDGs', ...Array.from({length: 17}, (_, i) => `SDG ${i+1}`)];

  const filteredPartners = partners.filter(p => {
    const matchesSearch = 
      (p.orgName && p.orgName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.skills && p.skills.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All Types' || p.role === selectedType;
    
    // Check if interests string contains the SDG number
    const sdgNum = selectedSDG.replace('SDG ', '');
    const matchesSDG = selectedSDG === 'All SDGs' || 
      (p.interests && p.interests.includes(sdgNum));

    return matchesSearch && matchesType && matchesSDG;
  });

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
            <p className="text-gray-500 mt-1">Discover and connect with organizations working on SDGs</p>
        </div>
        
      </div>

      {/* --- SEARCH & FILTERS (Fixed Alignment) --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search organizations or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm focus:bg-gray-50 transition-colors"
          />
        </div>
        
        {/* Divider only visible on desktop */}
        <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
        
        <div className="flex gap-4 px-2 items-center w-full md:w-auto justify-between md:justify-start">
             <div className="relative">
                 <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-6 appearance-none hover:text-teal-600"
                 >
                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
             </div>
             
             <div className="relative">
                 <select 
                    value={selectedSDG}
                    onChange={(e) => setSelectedSDG(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-6 appearance-none hover:text-teal-600"
                 >
                    {sdgOptions.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
             </div>
        </div>
      </div>

      {/* --- PARTNER CARDS GRID (3 Columns) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                No partners found matching your filters.
            </div>
        ) : filteredPartners.map((p) => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative group">
            
            {/* Header: Icon + Info + Badge */}
            <div className="flex justify-between items-start mb-4">
               <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#0F766E] rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-sm">
                     <Building size={18} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-bold text-gray-900 text-sm leading-tight truncate pr-2" title={p.orgName}>
                        {p.orgName || 'Organization Name'}
                     </h3>
                     <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                        <MapPin size={10}/> {p.location || 'Global'}
                     </div>
                  </div>
               </div>
               
               {/* Role Badge */}
               <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wide shrink-0 ${
                   p.role === 'NGO' ? 'bg-green-50 text-green-700 border-green-100' : 
                   p.role === 'Startup' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                   p.role === 'Government' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                   'bg-gray-50 text-gray-600 border-gray-100'
               }`}>
                  {p.role}
               </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-5 line-clamp-2 leading-relaxed h-8">
               {p.description || "An organization dedicated to sustainable development goals."}
            </p>

            {/* SDG Focus Areas */}
            <div className="mb-4">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Focus Areas</p>
               <div className="flex gap-1.5">
                  {(Array.isArray(p.interests) ? p.interests : (p.interests || "").split(','))
                    .map(s => s.trim().replace('SDG', '').replace(/[^0-9]/g, '')) 
                    .filter(Boolean)
                    .slice(0, 5)
                    .map((num, i) => (
                        <div 
                            key={i} 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm cursor-help"
                            style={{ backgroundColor: SDG_COLORS[num] || '#999' }}
                            title={`SDG ${num}`}
                        >
                            {num}
                        </div>
                  ))}
               </div>
            </div>

            {/* Key Skills */}
            <div className="mt-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                    {(p.skills ? p.skills.split(',') : ['Management', 'Research', 'Strategy']).slice(0,3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[10px] font-medium text-gray-600 truncate max-w-[100px]">
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;