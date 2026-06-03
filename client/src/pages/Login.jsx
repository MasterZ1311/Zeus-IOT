import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { SharpBolt } from '../components/SharpBolt';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('zeus_admin_token');
    if (token) {
      fetch('http://localhost:3000/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) navigate('/admin');
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      localStorage.setItem('zeus_admin_token', data.token);
      localStorage.setItem('zeus_admin_user', data.username);
      navigate('/admin');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative px-4 circuit-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md">
        <div className="glass-panel rounded-xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary to-secondary"></div>
          
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
              <SharpBolt className="text-secondary w-6 h-6" />
            </div>
            <h1 className="font-headline-xl text-3xl text-secondary glow-text tracking-tighter uppercase mt-2">ZEUS IOT</h1>
            <p className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">Admin Authorization Required</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-error-container/20 border border-error/30 text-error text-sm p-3 rounded flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-code-sm text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Username</label>
              <input 
                className="input-field w-full rounded p-3 font-body-md bg-black/30 border border-tertiary/20 focus:border-tertiary outline-none text-on-surface" 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username" 
                required 
                autoFocus 
              />
            </div>

            <div>
              <label className="block font-code-sm text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Password</label>
              <input 
                className="input-field w-full rounded p-3 font-body-md bg-black/30 border border-tertiary/20 focus:border-tertiary outline-none text-on-surface" 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="btn-thunderbolt w-full py-4 mt-4 font-headline-md text-base uppercase tracking-widest flex items-center justify-center gap-2">
              <span>Sign In</span>
              <LogIn className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-xs font-code-sm text-on-surface-variant hover:text-tertiary transition-colors">
              RETURN TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
