'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Plus, Trash2, Building } from 'lucide-react';

export default function HallsPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [hallId, setHallId] = useState('');
  const [numberOfBenches, setNumberOfBenches] = useState('');
  const [benchType, setBenchType] = useState('long');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const { data } = await API.get('/halls');
      setHalls(data);
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
      await API.post('/halls', {
        hallId,
        numberOfBenches: Number(numberOfBenches),
        benchType
      });
      setHallId('');
      setNumberOfBenches('');
      setBenchType('long');
      fetchHalls();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add hall');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hall?')) return;
    try {
      await API.delete(`/halls/${id}`);
      fetchHalls();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Halls</h1>
          <p className="text-slate-400 mt-1">Configure physical examination venues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" /> Add New Hall
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label-text">Hall ID / Name</label>
                <input 
                  type="text" 
                  required 
                  value={hallId}
                  onChange={e => setHallId(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. CSE-101" 
                />
              </div>
              <div>
                <label className="label-text">Number of Benches</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={numberOfBenches}
                  onChange={e => setNumberOfBenches(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. 30" 
                />
              </div>
              <div>
                <label className="label-text">Bench Type</label>
                <select 
                  className="input-field"
                  value={benchType}
                  onChange={e => setBenchType(e.target.value)}
                >
                  <option value="long">Long Bench</option>
                  <option value="short">Short Bench</option>
                </select>
              </div>
              <button type="submit" disabled={adding} className="btn-primary w-full mt-4">
                {adding ? 'Adding...' : 'Add Hall'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading halls...</div>
            ) : halls.length === 0 ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                <Building size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-white mb-2">No halls added</p>
                <p className="text-sm">Use the form to add examination halls.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-[var(--card-border)]">
                    <th className="p-4 font-medium text-slate-300">Hall ID</th>
                    <th className="p-4 font-medium text-slate-300">Benches</th>
                    <th className="p-4 font-medium text-slate-300">Type</th>
                    <th className="p-4 font-medium text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {halls.map((hall) => (
                    <tr key={hall._id} className="border-b border-[var(--card-border)] hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{hall.hallId}</td>
                      <td className="p-4">{hall.numberOfBenches}</td>
                      <td className="p-4 capitalize text-slate-300">{hall.benchType}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(hall._id)} className="text-slate-400 hover:-blue-500 p-2 rounded-lg hover:-blue-500/10">
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
