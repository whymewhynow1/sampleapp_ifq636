import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-5/12 bg-[#151929] relative overflow-hidden flex-col p-10 text-white min-h-screen">
    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-600/10" />
    <div className="absolute top-16 -right-12 w-56 h-56 rounded-full bg-indigo-600/10" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/20" />

    <div className="flex items-center gap-2 z-10">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-sm" />
      </div>
      <span className="font-bold text-lg">LearnLib</span>
    </div>

    <div className="my-auto z-10">
      <h1 className="text-4xl font-bold leading-tight mb-4">
        Your gateway to<br />curated learning.
      </h1>
      <p className="text-gray-400 text-sm mb-10">
        Browse thousands of resources across<br />programming, design, data science & more.
      </p>
      <div className="flex flex-col gap-3">
        {['1,000+ resources', 'Free to browse', 'Personalized bookmarks'].map((f) => (
          <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-200">{f}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/auth/login', formData);
      login(data);
      navigate('/resources');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent";

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <span className="flex-1 text-sm font-semibold py-2 text-center bg-white rounded-lg shadow text-gray-800">
              Login
            </span>
            <Link to="/register" className="flex-1 text-sm text-gray-500 py-2 text-center hover:text-gray-700">
              Register
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue.</p>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <input type="email" value={formData.email} onChange={set('email')} placeholder="you@example.com" className={inputClass} required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input type="password" value={formData.password} onChange={set('password')} placeholder="••••••••" className={inputClass} required />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-1">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <div className="flex-1 h-px bg-gray-200" />
              or
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button type="button" className="w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              Continue with Google
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Sign up →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
