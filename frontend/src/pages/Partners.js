import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Search, MapPin, Building, Loader2 } from 'lucide-react';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/partners')
      .then(res => setPartners(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPartners = partners.filter(p => 
    (p.orgName && p.orgName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 mt-1">Discover organizations (Real Users)</p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500">No partners found.</p>
        ) : filteredPartners.map((p) => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                    <Building size={24}/>
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{p.orgName || "Unnamed Org"}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                        <MapPin size={12}/> {p.email}
                    </div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-md font-bold uppercase bg-blue-100 text-blue-700 whitespace-nowrap">
                {p.role || 'Member'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
               Focus Area: <span className="font-semibold text-teal-600">{p.interests || 'General'}</span>
            </p>

            <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition">
                View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;