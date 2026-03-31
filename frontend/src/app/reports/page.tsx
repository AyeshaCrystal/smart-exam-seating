'use client';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { FileDown, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const downloadReport = async (examId: string, subjectCode: string) => {
    try {
      const response = await API.get(`/reports/seating/${examId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `seating_report_${subjectCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to download report. Ensure seating is generated for this exam.');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seating Reports</h1>
          <p className="text-slate-400 mt-1">Download generated reports in PDF format</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-2">No exams available</p>
            <p className="text-sm">Create an exam to generate and download seating reports.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6">
            {exams.map((exam) => (
              <div key={exam._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-[var(--card-border)] hover:bg-slate-800/50 transition-colors">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exam.subjectName} <span className="text-blue-400 text-sm font-mono ml-2">{exam.subjectCode}</span></h3>
                  <div className="flex gap-4 mt-1 text-sm text-slate-400">
                    <span>{new Date(exam.date).toLocaleDateString()}</span>
                    <span>Session: {exam.session}</span>
                  </div>
                </div>
                <button 
                  onClick={() => downloadReport(exam._id, exam.subjectCode)}
                  className="btn-primary"
                >
                  <FileDown size={18} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
