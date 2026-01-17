import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api'; // Use API helper
import { Mail, Lock, Building2, Globe, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    role: 'NGO',
    interests: 'SDG 1', // Default interest
    location: 'India'   // Default location
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
      // Proceed anyway since Firebase Auth worked
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Join ImpactHub</h2>
          <p className="text-gray-500">Connect for global impact</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}

        <button onClick={handleGoogleSignup} className="w-full border border-gray-300 py-3 rounded-lg flex justify-center gap-2 hover:bg-gray-50 transition mb-6">
           Sign up with Google
        </button>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Organization Name</label>
            <input name="orgName" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Green Future" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-semibold text-gray-700">Type</label>
                <select name="role" onChange={handleChange} className="w-full p-3 border rounded-lg outline-none bg-white">
                    <option value="NGO">NGO</option>
                    <option value="Startup">Startup</option>
                    <option value="Government">Government</option>
                </select>
             </div>
             <div>
                <label className="text-sm font-semibold text-gray-700">Focus Area</label>
                <select name="interests" onChange={handleChange} className="w-full p-3 border rounded-lg outline-none bg-white">
                    <option value="SDG 1">No Poverty</option>
                    <option value="SDG 6">Clean Water</option>
                    <option value="SDG 13">Climate Action</option>
                    {/* Add more as needed */}
                </select>
             </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" required />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-teal-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;