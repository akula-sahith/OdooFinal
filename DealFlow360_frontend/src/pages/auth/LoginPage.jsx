import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, Shield, Sparkles, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('alex.rep@dealflow360.com');
  const [password, setPassword] = useState('SalesRepPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const userRole = res.user?.role?.toUpperCase() || '';
      
      if (userRole === 'CUSTOMER') {
        navigate('/portal');
      } else if (userRole === 'FINANCE') {
        navigate('/approvals');
      } else {
        navigate('/workspace');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-600 text-white font-black text-2xl shadow-md">
            DF
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            DealFlow<span className="text-sky-600">360</span>
          </h1>
          <p className="text-xs text-slate-500">
            Self-Governing Sales Operations &amp; Quotation Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-blue-100 p-8 rounded-2xl shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rep@dealflow360.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white text-xs font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white text-xs font-mono transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Workspace
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Preset Demo Role Selectors */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Quick Fill Demo Credentials
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dealflow360.com', 'AdminPassword123!')}
                className="p-2.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left text-slate-800 transition-colors"
              >
                <div className="font-bold text-sky-900 text-xs">System Admin</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">admin@dealflow360.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.rep@dealflow360.com', 'SalesRepPass123!')}
                className="p-2.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left text-slate-800 transition-colors"
              >
                <div className="font-bold text-sky-900 text-xs">Alex SalesRep</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">alex.rep@dealflow360.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('jordan.mgr@dealflow360.com', 'ManagerPass123!')}
                className="p-2.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left text-slate-800 transition-colors"
              >
                <div className="font-bold text-sky-900 text-xs">Jordan Manager</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">jordan.mgr@dealflow360.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('fiona.fin@dealflow360.com', 'FinancePass123!')}
                className="p-2.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left text-slate-800 transition-colors"
              >
                <div className="font-bold text-sky-900 text-xs">Fiona Finance</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">fiona.fin@dealflow360.com</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Link to="/register" className="hover:text-sky-600 transition-colors font-semibold">
              Internal User Register &rarr;
            </Link>
            <Link to="/portal/signup" className="hover:text-sky-600 transition-colors font-semibold">
              Customer Portal Signup &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
