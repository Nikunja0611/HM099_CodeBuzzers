import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api'; 
import { 
  Mail, Lock, Building2, Globe, ArrowRight, 
  AlertCircle, Loader2, ArrowLeft, Briefcase, Target, FileText, Zap 
} from 'lucide-react';

// Predefined Skills List (Alphabetical)
const SKILL_OPTIONS = [
  "Advocacy & Policy",
  "Agriculture & Farming",
  "AI & Machine Learning",
  "Capacity Building",
  "Climate Research",
  "Community Outreach",
  "Data Analysis",
  "Disaster Management",
  "Education & Training",
  "Fundraising & Grants",
  "Healthcare Services",
  "Infrastructure Development",
  "Legal Aid & Human Rights",
  "Project Management",
  "Public Health",
  "Renewable Energy",
  "Social Entrepreneurship",
  "Sustainability Consulting",
  "Waste Management",
  "Water & Sanitation"
];

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    role: 'NGO',
    interests: 'SDG 1', 
    location: 'India',
    description: '',
    skills: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToDB = async (userPayload) => {
    try {
      await api.post('/register', userPayload);
    } catch (err) {
      console.error("Failed to save user to Mongo:", err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const userPayload = {
        email: result.user.email,
        orgName: result.user.displayName,
        role: formData.role,
        interests: formData.interests,
        location: formData.location,
        description: "Organization joined via Google Platform.",
        skills: "General Collaboration"
      };
      await saveUserToDB(userPayload);
      localStorage.setItem('userRole', formData.role);
      setUser(userPayload);
      navigate('/dashboard');
    } catch (err) {
      setError('Google Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userPayload = {
        email: result.user.email,
        orgName: formData.orgName,
        role: formData.role,
        interests: formData.interests,
        location: formData.location,
        description: formData.description,
        skills: formData.skills
      };
      await saveUserToDB(userPayload);
      localStorage.setItem('userRole', formData.role);
      setUser(userPayload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 font-sans relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition font-medium"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Create Partner Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join the global network for sustainable impact</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle size={16}/> {error}
          </div>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-5">
          
          {/* Row 1: Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input name="orgName" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Green Future" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input name="location" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="City, Country" required />
                </div>
              </div>
          </div>

          {/* Row 2: Type & Interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Organization Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select name="role" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none bg-white">
                      <option value="NGO">NGO</option>
                      <option value="Startup">Startup</option>
                      <option value="Government">Government</option>
                      <option value="Corporate">Corporate</option>
                  </select>
                </div>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Primary SDG Focus</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select name="interests" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none bg-white">
                      {[...Array(17)].map((_, i) => (
                          <option key={i} value={`SDG ${i+1}`}>SDG {i+1}</option>
                      ))}
                  </select>
                </div>
             </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Short Description</label>
            <div className="relative">
               <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
               <textarea name="description" onChange={handleChange} rows="2" className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Briefly describe your mission..." required />
            </div>
          </div>

          {/* Row 4: Skills (With Datalist) */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Key Skills (Type to see suggestions)</label>
            <div className="relative">
               <Zap className="absolute left-3 top-3 text-gray-400" size={18} />
               <input 
                 list="skill-options"
                 name="skills" 
                 onChange={handleChange} 
                 className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                 placeholder="e.g. AI, Fundraising, Water Sanitation" 
               />
               {/* Datalist for Autocomplete */}
               <datalist id="skill-options">
                  {SKILL_OPTIONS.map((skill, index) => (
                    <option key={index} value={skill} />
                  ))}
               </datalist>
            </div>
          </div>

          {/* Row 5: Auth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="email" name="email" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="password" name="password" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="••••••••" required />
                </div>
              </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18}/></>}
          </button>
        </form>
        
        <div className="mt-6 text-center">
           <button onClick={handleGoogleSignup} className="text-sm text-gray-600 font-medium hover:text-gray-800 flex items-center justify-center gap-2 mx-auto border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax_loader.gif" alt="" className="hidden" />
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign up with Google
           </button>
           <p className="mt-4 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign In</Link></p>
        </div>

      </div>
    </div>
  );
};

export default Register;