import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api'; 
import { 
  Mail, Lock, Building2, Globe, ArrowRight, 
  AlertCircle, Loader2, ArrowLeft, Briefcase, Target 
} from 'lucide-react';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    role: 'NGO',
    interests: 'SDG 1', 
    location: 'India'   
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
        location: formData.location
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
        location: formData.location
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
      {/* --- BACK BUTTON --- */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition font-medium"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        
        {/* --- LOGO SECTION --- */}
        <div className="flex flex-col items-center mb-8">
  
          <h2 className="text-xl font-semibold text-gray-700">Create your account</h2>
          <p className="text-sm text-gray-500">Empowering sustainable collaboration</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle size={16}/> {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignup} 
          className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition mb-6 font-medium text-gray-700"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax_loader.gif" alt="" className="hidden" />
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign up with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                name="orgName" 
                onChange={handleChange} 
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                placeholder="e.g. Green Future" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select name="role" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none bg-white appearance-none">
                      <option value="NGO">NGO</option>
                      <option value="Startup">Startup</option>
                      <option value="Government">Government</option>
                  </select>
                </div>
             </div>
             <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Focus Area</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select name="interests" onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none bg-white appearance-none">
                      <option value="SDG 1">No Poverty</option>
                      <option value="SDG 6">Clean Water</option>
                      <option value="SDG 13">Climate Action</option>
                  </select>
                </div>
             </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email" 
                name="email" 
                onChange={handleChange} 
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                placeholder="name@organization.com"
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Create Account <ArrowRight size={18}/></>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;