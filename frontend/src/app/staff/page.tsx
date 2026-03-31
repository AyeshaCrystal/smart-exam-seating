'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Plus, Trash2, UserCheck } from 'lucide-react';

export default function StaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await API.get('/staff');
      setStaffList(data);
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
      await API.post('/staff', { name, department, email, available: true });
      setName('');
      setDepartment('');
      setEmail('');
      fetchStaff();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add staff');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this staff member?')) return;
    try {
      await API.delete(`/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Staff</h1>
          <p className="text-slate-400 mt-1">Configure faculty for invigilation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" /> Add New Staff
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label-text">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Dr. John Doe" 
                />
              </div>
              <div>
                <label className="label-text">Department</label>
                <input 
                  type="text" 
                  required 
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Computer Science" 
                />
              </div>
              <div>
                <label className="label-text">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field" 
                  placeholder="john@example.com" 
                />
              </div>
              <button type="submit" disabled={adding} className="btn-primary w-full mt-4">
                {adding ? 'Adding...' : 'Add Staff'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading staff...</div>
            ) : staffList.length === 0 ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                <UserCheck size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium text-white mb-2">No staff added</p>
                <p className="text-sm">Use the form to add faculty members.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-[var(--card-border)]">
                    <th className="p-4 font-medium text-slate-300">Name</th>
                    <th className="p-4 font-medium text-slate-300">Department</th>
                    <th className="p-4 font-medium text-slate-300">Email</th>
                    <th className="p-4 font-medium text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff._id} className="border-b border-[var(--card-border)] hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{staff.name}</td>
                      <td className="p-4 text-slate-300">{staff.department}</td>
                      <td className="p-4 text-slate-300">{staff.email}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(staff._id)} className="text-slate-400 hover:-blue-500 p-2 rounded-lg hover:-blue-500/10">
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
