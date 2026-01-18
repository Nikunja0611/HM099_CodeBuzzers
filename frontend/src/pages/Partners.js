import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Search, MapPin, Building, Loader2, Filter } from 'lucide-react';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSDG, setSelectedSDG] = useState('All SDGs');

  useEffect(() => {
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Unique lists for dropdown options based on actual data
  const uniqueTypes = ['All Types', ...new Set(partners.map(p => p.role).filter(Boolean))];
  // Assuming 'interests' contains "SDG 1", "SDG 2" etc. or we just hardcode 1-17
  const sdgOptions = ['All SDGs', ...Array.from({length: 17}, (_, i) => `SDG ${i+1}`)];

  // COMPLETE FILTERING LOGIC
  const filteredPartners = partners.filter(p => {
    // 1. Text Search (Name or Email)
    const matchesSearch = 
      (p.orgName && p.orgName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Type Filter
    const matchesType = selectedType === 'All Types' || p.role === selectedType;

    // 3. SDG Filter (Checks if the partner's interests string contains the selected SDG)
    const matchesSDG = selectedSDG === 'All SDGs' || 
      (p.interests && p.interests.includes(selectedSDG.replace('SDG ', ''))); 
      // Note: Adjust the .includes logic depending on whether your DB stores "SDG 1" or just "1"

    return matchesSearch && matchesType && matchesSDG;
  });

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 mt-1">Discover and connect with organizations working on SDGs</p>
      </div>

      {/* --- SEARCH BAR & FILTERS SECTION --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        
        {/* Text Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
          />
        </div>

        {/* Filter Group */}
        <div className="flex gap-4">
          
          {/* Type Dropdown */}
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Filter size={16} />
             </div>
             <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm appearance-none cursor-pointer min-w-[140px]"
             >
                {uniqueTypes.map(type => (
                   <option key={type} value={type}>{type}</option>
                ))}
             </select>
          </div>

          {/* SDG Dropdown */}
          <div className="relative">
             <select 
                value={selectedSDG}
                onChange={(e) => setSelectedSDG(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm appearance-none cursor-pointer min-w-[120px]"
             >
                {sdgOptions.map(sdg => (
                   <option key={sdg} value={sdg}>{sdg}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length === 0 ? (
            <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No partners found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedType('All Types'); setSelectedSDG('All SDGs');}}
                  className="mt-2 text-teal-600 font-medium hover:underline"
                >
                  Clear filters
                </button>
            </div>
        ) : filteredPartners.map((p) => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                    <Building size={24}/>
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate" title={p.orgName}>
                        {p.orgName || "Unnamed Org"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                        <MapPin size={12}/> {p.email}
                    </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap ${p.role === 'NGO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {p.role || 'Member'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 flex-grow">
               Focus Area: <span className="font-semibold text-teal-600">{p.interests || 'General'}</span>
            </p>

            <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition mt-auto">
                View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;