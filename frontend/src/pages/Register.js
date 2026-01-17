import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Building2, Globe, ArrowRight, AlertCircle } from 'lucide-react';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    role: 'NGO'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GOOGLE SIGNUP HANDLER ---
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      // Save role for this new user
      localStorage.setItem('userRole', formData.role); 
      
      setUser({ 
        email: result.user.email, 
        role: formData.role,
        name: result.user.displayName
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Google Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- EMAIL SIGNUP HANDLER ---
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      localStorage.setItem('userRole', formData.role);
      
      setUser({ email: userCredential.user.email, role: formData.role });
      navigate('/dashboard');

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError('Failed to create account. Try a stronger password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white z-0"></div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg relative z-10 border border-gray-100">
        
        <div className="text-center mb-6">
           <Link to="/" className="inline-block">
             <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-teal-200">IH</div>
           </Link>
          <h2 className="text-3xl font-bold text-gray-800">Join ImpactHub</h2>
          <p className="text-gray-500 mt-2">Connect your organization to the global SDG network</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleSignup}
          type="button"
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or register with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          
          {/* Organization Fields (Keep these visible so even Google users see context) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="orgName"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="e.g. Green Future Foundation"
                value={formData.orgName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Organization</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="role"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="NGO">NGO (Non-Profit)</option>
                <option value="Startup">Startup</option>
                <option value="Government">Government Agency</option>
              </select>
            </div>
          </div>

          {/* Email/Pass */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="contact@org.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;