'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    seatingType: 'internal',
    mixDepartments: true,
    avoidSameDeptAdjacent: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/settings');
      if (data) {
        setSettings({
          seatingType: data.seatingType || 'internal',
          mixDepartments: data.mixDepartments !== false,
          avoidSameDeptAdjacent: data.avoidSameDeptAdjacent !== false
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/settings', settings);
      alert('Settings saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration Rules</h1>
          <p className="text-slate-400 mt-1">Global rules for the seating arrangement engine</p>
        </div>
      </div>

      <div className="glass-panel p-8">
        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-[var(--card-border)]">
              <div className="mt-1">
                <input 
                  type="radio" 
                  id="internal" 
                  name="seatingType" 
                  value="internal"
                  checked={settings.seatingType === 'internal'}
                  onChange={e => setSettings({...settings, seatingType: e.target.value})}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
              <div>
                <label htmlFor="internal" className="text-lg font-medium text-white block cursor-pointer">Internal Exam (2 per bench)</label>
                <p className="text-sm text-slate-400 mt-1">Standard arrangement where two candidates are placed on each bench.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-[var(--card-border)]">
              <div className="mt-1">
                <input 
                  type="radio" 
                  id="semester" 
                  name="seatingType" 
                  value="semester"
                  checked={settings.seatingType === 'semester'}
                  onChange={e => setSettings({...settings, seatingType: e.target.value})}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
              <div>
                <label htmlFor="semester" className="text-lg font-medium text-white block cursor-pointer">Semester Exam (1 per bench)</label>
                <p className="text-sm text-slate-400 mt-1">Strict arrangement where only one candidate is placed per bench.</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--card-border)]">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <SettingsIcon size={20} className="text-blue-400" /> Advanced Constraints
              </h3>
              
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.mixDepartments}
                  onChange={e => setSettings({...settings, mixDepartments: e.target.checked})}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-slate-300">Mix students from different departments automatically</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.avoidSameDeptAdjacent}
                  onChange={e => setSettings({...settings, avoidSameDeptAdjacent: e.target.checked})}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <span className="text-slate-300">Prevent students of the same department from sitting directly adjacent</span>
              </label>
            </div>

            <div className="pt-6 border-t border-[var(--card-border)] flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
