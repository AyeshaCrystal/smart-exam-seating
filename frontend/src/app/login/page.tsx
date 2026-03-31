'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import API from '@/lib/api';
import { Lock, User, LogIn, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';

export default function UnifiedLogin() {
  const [activeTab, setActiveTab] = useState<'admin' | 'student' | 'faculty'>('admin');
  
  // Credentials state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [registerNumber, setRegisterNumber] = useState('101');
  const [staffId, setStaffId] = useState('STF001');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'admin') {
        const { data } = await API.post('/auth/login', { username, password });
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        router.push('/');
      } else if (activeTab === 'student') {
        const { data } = await API.post('/auth/login/student', { registerNumber });
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        router.push('/student');
      } else if (activeTab === 'faculty') {
        const { data } = await API.post('/auth/login/staff', { staffId });
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        router.push('/faculty');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <div className="text-center mb-10 relative z-10 w-full max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mb-4 tracking-tight">
          SmartExam Portal
        </h1>
        <p className="text-slate-400 text-lg">Centralized Seating & Invigilation Management</p>
      </div>

      <div className="glass-panel w-full max-w-md p-1 relative z-10 shadow-2xl border border-slate-700/60 overflow-hidden">
        
        {/* Tab Header */}
        <div className="flex bg-slate-900/50 p-2 rounded-t-[14px]">
          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ShieldCheck size={18} /> Admin
          </button>
          <button
            onClick={() => { setActiveTab('student'); setError(''); }}
            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'student' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button
            onClick={() => { setActiveTab('faculty'); setError(''); }}
            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'faculty' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <UserCheck size={18} /> Faculty
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 pb-10">
          <div className="mb-8 text-center">
            {activeTab === 'admin' && <p className="text-slate-300 font-medium">Administrator Login</p>}
            {activeTab === 'student' && <p className="text-slate-300 font-medium">Student Dashboard Login</p>}
            {activeTab === 'faculty' && <p className="text-slate-300 font-medium">Faculty Invigilation Login</p>}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-500 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {activeTab === 'admin' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-bold ml-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-bold ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-500" />
                    </div>
                    <input
                      type="password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'student' && (
              <div className="space-y-1 animate-in zoom-in-95 duration-200">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold ml-1">Register Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GraduationCap size={18} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter Reg. Number"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'faculty' && (
              <div className="space-y-1 animate-in zoom-in-95 duration-200">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold ml-1">Staff ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCheck size={18} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${
                activeTab === 'admin' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 text-white' :
                activeTab === 'student' ? 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 text-white' :
                'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/30 text-white'
              }`}
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <LogIn size={20} />
                  Access Portal
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
