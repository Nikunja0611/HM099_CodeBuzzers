import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      const role = localStorage.getItem('userRole') || 'Startup'; 
      
      setUser({ 
        email: result.user.email, 
        role: role,
        name: result.user.displayName,
        photo: result.user.photoURL
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- EMAIL LOGIN HANDLER ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = localStorage.getItem('userRole') || 'NGO'; 
      setUser({ email: userCredential.user.email, role: role });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-emerald-600/10 z-0"></div>

      {/* --- BACK BUTTON --- */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition font-medium z-20"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-gray-100">
        
        {/* --- LOGO & HEADER SECTION --- */}
        <div className="flex flex-col items-center mb-8">
         
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to continue your impact journey</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm mb-6 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">Or email login</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 font-bold hover:underline">
            Create Organization Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;