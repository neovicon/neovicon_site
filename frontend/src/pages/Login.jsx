import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Loader2 } from 'lucide-react';
import { login, signup } from '../services/auth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
        // If user is admin, redirect to admin layout, else home
        if (data?.data?.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const data = await signup(username, email, password);
        // By default new user is not admin
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isLogin ? 'login' : 'sign up'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-glow/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="bg-glass p-8 rounded-2xl w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border border-cyan-glow/50 bg-dark-900 flex items-center justify-center mb-4 relative group">
             <div className="absolute inset-0 bg-gradient-neon opacity-40 blur-md rounded-full"></div>
             <span className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-neon z-10" style={{ letterSpacing: '-0.05em'}}>N</span>
          </div>
          <h2 className="text-2xl font-bold tracking-widest text-white">{isLogin ? 'SIGN IN' : 'SIGN UP'}</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/50 transition-all"
                placeholder="johndoe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-glow focus:ring-1 focus:ring-purple-glow/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-neon hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-cyan-glow hover:text-white transition-colors font-semibold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
