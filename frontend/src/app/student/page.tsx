'use client';
import { useEffect, useState } from 'react';
import API from '@/lib/api';
import { AlertCircle, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AdmitCard {
  exam: {
    _id: string;
    subjectName: string;
    subjectCode: string;
    date: string;
    session: string;
  };
  hall: {
    hallId: string;
    numberOfBenches: number;
    benchType: string;
  };
  seatNumber: string;
}

export default function StudentDashboard() {
  const [admitCards, setAdmitCards] = useState<AdmitCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const admitRes = await API.get('/student/admit-card');
      setAdmitCards(admitRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="text-blue-400" /> My Admit Cards
        </h2>
        
        {admitCards.length === 0 ? (
          <div className="glass-panel p-6 text-center text-slate-400">
            No exams scheduled for you at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admitCards.map((card, i) => (
              <div key={i} className="glass-card p-6 border-t-4 border-t-blue-500 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{card.exam.subjectName}</h3>
                  <p className="text-sm text-slate-400 mb-4">{card.exam.subjectCode}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-xs mb-1">Date & Session</p>
                      <p className="font-semibold">{new Date(card.exam.date).toLocaleDateString()} | {card.exam.session}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-xs mb-1">Location</p>
                      <p className="font-semibold text-blue-400">Hall: {card.hall.hallId}</p>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Assigned Seat</p>
                      <p className="text-2xl font-bold text-white">{card.seatNumber}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <FileText className="text-blue-400" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
