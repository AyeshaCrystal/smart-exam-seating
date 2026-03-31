'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Settings, Users, Building, AlertCircle } from 'lucide-react';

export default function SeatingPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'hall' | 'student'>('hall');

  const [examType, setExamType] = useState<'IAT' | 'Semester'>('IAT');

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchSeating(selectedExam);
    } else {
      setArrangements([]);
    }
  }, [selectedExam]);

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

  const fetchSeating = async (examId: string) => {
    try {
      const { data } = await API.get(`/seating/${examId}`);
      setArrangements(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedExam) return alert('Select an exam first');
    setGenerating(true);
    try {
      await API.post('/seating/generate', { examId: selectedExam, examType });
      fetchSeating(selectedExam);
      alert('Seating generated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate seating');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seating Engine</h1>
          <p className="text-slate-400 mt-1">Generate and visualize exam seating</p>
        </div>
      </div>

      <div className="glass-panel p-6 mb-8 flex flex-wrap items-end gap-4 border border-[var(--card-border)] bg-gradient-to-br from-slate-900/80 to-slate-800/80">
        <div className="flex-1 min-w-[250px]">
          <label className="label-text mb-2 block font-semibold text-white">Target Exam</label>
          <select 
            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">-- Select Exam to Arrange --</option>
            {exams.map(ex => (
              <option key={ex._id} value={ex._id}>
                {ex.subjectName} ({ex.subjectCode}) • {new Date(ex.date).toLocaleDateString()} {ex.session}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label-text mb-2 block font-semibold text-white">Exam Type</label>
          <select 
            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={examType}
            onChange={(e) => setExamType(e.target.value as 'IAT' | 'Semester')}
          >
            <option value="IAT">Internal Assessment Test (IAT)</option>
            <option value="Semester">Semester Exam</option>
          </select>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={!selectedExam || generating}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30"
        >
          {generating ? 'Processing Engine...' : <><Settings size={20} className="animate-[spin_4s_linear_infinite]" /> Generate Arrangement</>}
        </button>
      </div>

      {selectedExam && arrangements.length > 0 && (
        <>
          <div className="flex gap-4 mb-6 bg-slate-800/40 p-1.5 rounded-xl w-fit border border-slate-700/50 backdrop-blur-md">
            <button 
              className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium transition-all ${viewMode === 'hall' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              onClick={() => setViewMode('hall')}
            >
              <Building size={18} /> Hall Visuals
            </button>
            <button 
              className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-medium transition-all ${viewMode === 'student' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              onClick={() => setViewMode('student')}
            >
              <Users size={18} /> Master List
            </button>
          </div>

          {viewMode === 'student' && (
            <div className="glass-panel overflow-hidden border border-slate-700/50 rounded-2xl shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700/50">
                    <th className="p-4 text-slate-300 font-semibold">Student Name</th>
                    <th className="p-4 text-slate-300 font-semibold">Reg No</th>
                    <th className="p-4 text-slate-300 font-semibold">Dept</th>
                    <th className="p-4 text-slate-300 font-semibold">Hall</th>
                    <th className="p-4 text-slate-300 font-semibold">Seat No</th>
                  </tr>
                </thead>
                <tbody>
                  {arrangements.flatMap(a => a.seatingArrangement.map((seat: any) => (
                    <tr key={`${a._id}-${seat.seatNumber}`} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-medium text-white">{seat.studentId?.name || 'Vacant'}</td>
                      <td className="p-4 text-slate-400 font-mono text-sm">{seat.studentId?.registerNumber || '-'}</td>
                      <td className="p-4"><span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1.5 rounded-md font-medium text-slate-300">{seat.studentId?.department || '-'}</span></td>
                      <td className="p-4 font-bold text-blue-400 bg-blue-500/5 rounded-l-lg">{a.hallId.hallId}</td>
                      <td className="p-4 font-mono font-bold -blue-500 -blue-500/5 rounded-r-lg">{seat.seatNumber}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'hall' && (
            <div className="space-y-8">
              {arrangements.map((hallPlan) => (
                <div key={hallPlan._id} className="glass-panel p-8 border border-slate-700/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-8 flex flex-col md:flex-row md:items-center justify-between text-white border-b border-slate-700/50 pb-4 gap-4">
                      <span className="flex items-center gap-3">
                        <span className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20"><Building size={24} /></span>
                        Hall {hallPlan.hallId.hallId}
                      </span>
                      <div className="flex flex-col md:items-end gap-1">
                        <span className="text-sm font-medium -blue-500 -blue-500/10 px-4 py-1.5 rounded-full border -blue-500/20">
                          Invigilator: {hallPlan.invigilator ? hallPlan.invigilator.name : 'Unassigned'}
                        </span>
                        <span className="text-sm font-medium text-blue-300 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                          Total Capacity: {hallPlan.seatingArrangement.length}
                        </span>
                      </div>
                    </h3>

                    
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-5">
                      {hallPlan.seatingArrangement.map((seat: any) => (
                        <div 
                          key={seat.seatNumber} 
                          className={`p-4 rounded-xl border-2 transition-transform hover:scale-105 ${seat.studentId ? 'bg-slate-800 hover:bg-slate-700 border-slate-700/80 shadow-lg' : 'bg-slate-900/50 border-dashed border-slate-700 hover:border-slate-500'}`}
                        >
                          <div className="text-xs font-mono text-slate-500 mb-3 border-b border-slate-700/50 pb-2 flex justify-between items-center">
                            <span className="uppercase tracking-wider font-semibold">Seat</span>
                            <span className="-blue-500 -blue-500/10 px-2 py-0.5 rounded font-bold border -blue-500/20">{seat.seatNumber}</span>
                          </div>
                          {seat.studentId ? (
                            <div className="mt-1">
                              <p className="text-sm font-bold text-white truncate" title={seat.studentId.name}>{seat.studentId.name}</p>
                              <p className="text-[11px] font-mono text-slate-400 mt-1">{seat.studentId.registerNumber}</p>
                              <div className="mt-4 flex">
                                <span className="text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-blue-500/20 -blue-500/20 text-blue-300 px-2.5 py-1 rounded-md border border-blue-500/20">
                                  {seat.studentId.department}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 opacity-40">
                              <AlertCircle size={20} className="text-slate-400 mb-2" />
                              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Vacant</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedExam && arrangements.length === 0 && !loading && (
        <div className="glass-panel p-16 text-center shadow-xl border border-slate-700/50 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
              <Settings size={40} className="text-blue-500 animate-[spin_10s_linear_infinite]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">System Ready</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              The engine is ready. Click the generation button above to run the allocation algorithm and distribute students optimally.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
