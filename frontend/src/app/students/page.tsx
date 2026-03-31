'use client';
import { useState, useEffect, useRef } from 'react';
import API from '@/lib/api';
import { Upload, Trash2, X, Users } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/students');
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await API.post('/students/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchStudents();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      alert('Upload failed. Ensure standard Excel format (Name, Register Number, Department, Section).');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to DELETE ALL students?')) return;
    try {
      await API.delete('/students');
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
          <p className="text-slate-400 mt-1">Upload and manage student data</p>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? 'Uploading...' : <><Upload size={18} /> Upload Excel/CSV</>}
          </button>
          
          {students.length > 0 && (
            <button onClick={handleDeleteAll} className="btn-secondary -blue-500 hover:-blue-500 hover:-blue-500/10 -blue-500/20">
              <Trash2 size={18} /> Delete All
            </button>
          )}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <Users size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-2">No students found</p>
            <p className="text-sm">Upload an Excel file to import students.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-[var(--card-border)]">
                  <th className="p-4 font-medium text-slate-300">Name</th>
                  <th className="p-4 font-medium text-slate-300">Register No</th>
                  <th className="p-4 font-medium text-slate-300">Department</th>
                  <th className="p-4 font-medium text-slate-300">Section</th>
                  <th className="p-4 font-medium text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-[var(--card-border)] hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">{student.name}</td>
                    <td className="p-4 font-mono text-sm text-blue-300">{student.registerNumber}</td>
                    <td className="p-4">
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs font-medium border border-blue-500/20">
                        {student.department}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{student.section}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(student._id)} className="text-slate-400 hover:-blue-500 transition-colors p-2 rounded-lg hover:-blue-500/10">
                        <X size={18} />
                      </button>
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
