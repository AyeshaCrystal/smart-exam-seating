'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id: string) => {
    try {
      await API.put(`/complaints/${id}`, { status: 'resolved' });
      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Complaints</h1>
          <p className="text-slate-400 mt-1">Manage and resolve seating grievances</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-2">No complaints found</p>
            <p className="text-sm">All student issues have been resolved.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-[var(--card-border)]">
                  <th className="p-4 font-medium text-slate-300">Status</th>
                  <th className="p-4 font-medium text-slate-300">Student</th>
                  <th className="p-4 font-medium text-slate-300">Message</th>
                  <th className="p-4 font-medium text-slate-300">Date</th>
                  <th className="p-4 font-medium text-slate-300 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="border-b border-[var(--card-border)] hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      {c.status === 'resolved' ? (
                        <span className="flex items-center gap-1 text-xs font-medium -blue-500 -blue-500/10 px-2 py-1 rounded-md border -blue-500/20 w-fit">
                          <CheckCircle size={14} /> Resolved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 w-fit">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {c.studentId ? (
                        <div>
                          <p className="font-medium text-white">{c.studentId.name}</p>
                          <p className="text-xs text-blue-300 font-mono">{c.studentId.registerNumber}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unknown</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate" title={c.message}>
                      {c.message}
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {c.status === 'pending' && (
                        <button 
                          onClick={() => markResolved(c._id)}
                          className="btn-secondary text-xs py-1"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
