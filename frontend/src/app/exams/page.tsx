'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [date, setDate] = useState('');
  const [session, setSession] = useState('FN');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await API.get('/exams');
      setExams(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await API.post('/exams', { subjectName, subjectCode, date, session });
      setSubjectName('');
      setSubjectCode('');
      setDate('');
      setSession('FN');
      fetchExams();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add exam');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this exam?')) return;
    try {
      await API.delete(`/exams/${id}`);
      fetchExams();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Exams</h1>
          <p className="text-slate-400 mt-1">Configure subjects and schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" /> Add New Exam
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label-text">Subject Name</label>
                <input 
                  type="text" 
                  required 
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Data Structures" 
                />
              </div>
              <div>
                <label className="label-text">Subject Code</label>
                <input 
                  type="text" 
                  required 
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. CS201" 
                />
              </div>
              <div>
                <label className="label-text">Date</label>
                <input 
                  type="date" 
                  required 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="input-field [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                />
              </div>
              <div>
                <label className="label-text">Session</label>
                <select 
                  className="input-field"
                  value={session}
                  onChange={e => setSession(e.target.value)}
                >
                  <option value="FN">Forenoon (FN)</option>
                  <option value="AN">Afternoon (AN)</option>
                </select>
              </div>
              <button type="submit" disabled={adding} className="btn-primary w-full mt-4">
                {adding ? 'Adding...' : 'Add Exam'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading exams...</div>
            ) : exams.length === 0 ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                <GraduationCap size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-white mb-2">No exams scheduled</p>
                <p className="text-sm">Use the form to add upcoming exams.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-[var(--card-border)]">
                    <th className="p-4 font-medium text-slate-300">Subject</th>
                    <th className="p-4 font-medium text-slate-300">Code</th>
                    <th className="p-4 font-medium text-slate-300">Date</th>
                    <th className="p-4 font-medium text-slate-300">Session</th>
                    <th className="p-4 font-medium text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id} className="border-b border-[var(--card-border)] hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{exam.subjectName}</td>
                      <td className="p-4 font-mono text-sm text-blue-300">{exam.subjectCode}</td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          {new Date(exam.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${exam.session === 'FN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : '-blue-500/10 -blue-500 -blue-500/20'}`}>
                          {exam.session}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(exam._id)} className="text-slate-400 hover:-blue-500 p-2 rounded-lg hover:-blue-500/10">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
