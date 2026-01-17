import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Building, Globe, 
  Target, BarChart3, Users, BookOpen 
} from 'lucide-react';

const Partners = () => {
  const [filterType, setFilterType] = useState('All Types');

  // MOCK DATA: Matching your screenshot content
  const partners = [
    {
      id: 1,
      name: "EduTech Solutions",
      location: "Bangalore, India",
      type: "Startup",
      typeColor: "bg-blue-100 text-blue-700",
      desc: "EdTech startup providing AI-powered personalized learning for underserved communities.",
      sdgIcons: ["bg-red-500", "bg-pink-500", "bg-orange-500"], // 4, 5, 10
      skills: ["AI/ML", "Mobile Development", "Data Analytics"]
    },
    {
      id: 2,
      name: "Ministry of Rural Development",
      location: "New Delhi, India",
      type: "Government",
      typeColor: "bg-purple-100 text-purple-700",
      desc: "Government body focused on rural development and poverty alleviation programs.",
      sdgIcons: ["bg-red-600", "bg-yellow-500", "bg-red-700", "bg-blue-400"], // 1, 2, 8, 9
      skills: ["Policy Implementation", "Funding Allocation", "Infrastructure"]
    },
    {
      id: 3,
      name: "IIT Climate Research Lab",
      location: "Chennai, India",
      type: "Research",
      typeColor: "bg-orange-100 text-orange-700",
      desc: "Premier research institution focused on climate modeling and renewable energy research.",
      sdgIcons: ["bg-yellow-400", "bg-green-600"], // 7, 13
      skills: ["Data Modeling", "Research", "Publications"]
    },
    {
      id: 4,
      name: "WaterAid India",
      location: "Pune, India",
      type: "NGO",
      typeColor: "bg-green-100 text-green-700",
      desc: "Leading NGO focused on water sanitation and hygiene education.",
      sdgIcons: ["bg-cyan-500"], // 6
      skills: ["Sanitation", "Hygiene", "Community Outreach"]
    },
    {
      id: 5,
      name: "SolarTech Innovations",
      location: "Hyderabad, India",
      type: "Startup",
      typeColor: "bg-blue-100 text-blue-700",
      desc: "Developing affordable solar solutions for rural electrification.",
      sdgIcons: ["bg-yellow-400", "bg-green-500"], // 7, 11
      skills: ["Solar Tech", "Engineering", "Rural Access"]
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
        <p className="text-gray-500 mt-1">Discover and connect with organizations working on SDGs</p>
      </div>

      {/* Search & Filters Row */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        
        {/* Type Filter Dropdown */}
        <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 min-w-[140px] justify-between">
                <div className="flex items-center gap-2">
                    <Filter size={18} /> 
                    <span>{filterType}</span>
                </div>
            </button>
            {/* Dropdown Menu (Hover based for simplicity) */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10">
                {['All Types', 'NGO', 'Startup', 'Government', 'Research'].map(type => (
                    <div 
                        key={type} 
                        onClick={() => setFilterType(type)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center"
                    >
                        {type}
                        {filterType === type && <span className="text-teal-600">✓</span>}
                    </div>
                ))}
            </div>
        </div>

        <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
                <Target size={18} /> 
                <span>All SDGs</span>
            </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">Showing {partners.length} organizations</p>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition group">
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                {/* Organization Icon Placeholder */}
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                    <Building size={24}/>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={12}/> {p.location}
                    </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${p.typeColor}`}>
                {p.type}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {p.desc}
            </p>

            {/* SDG Icons */}
            <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">SDG Focus Areas</p>
                <div className="flex gap-2">
                    {p.sdgIcons.map((color, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full ${color} opacity-90 border-2 border-white shadow-sm`}></div>
                    ))}
                </div>
            </div>

            {/* Key Skills Pills */}
            <div>
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                    {p.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium border border-gray-200">
                            {skill}
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