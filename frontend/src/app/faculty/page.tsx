'use client';
import { useEffect, useState } from 'react';
import API from '@/lib/api';
import { AlertCircle, FileText, CheckCircle2, Users, MapPin, Search } from 'lucide-react';

interface Duty {
  _id: string;
  examId: {
    _id: string;
    subjectName: string;
    subjectCode: string;
    date: string;
    session: string;
  };
  hallId: {
    hallId: string;
    numberOfBenches: number;
    benchType: string;
  };
  seatingArrangement?: Array<{
    studentId: {
      _id: string;
      name: string;
      registerNumber: string;
    };
    seatNumber: string;
    present: boolean;
  }>;
}

export default function FacultyDashboard() {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dutyRes = await API.get('/faculty/duties');
      setDuties(dutyRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDutyDetails = async (id: string) => {
    try {
      const res = await API.get(`/faculty/duties/${id}`);
      setSelectedDuty(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAttendance = async (studentId: string, present: boolean) => {
    if (!selectedDuty) return;
    try {
      await API.post(`/faculty/duties/${selectedDuty._id}/attendance`, { studentId, present });
      // Update local state instead of refetching for speed
      setSelectedDuty({
        ...selectedDuty,
        seatingArrangement: selectedDuty.seatingArrangement?.map(s => 
          s.studentId._id === studentId ? { ...s, present } : s
        )
      });
    } catch (error) {
      console.error(error);
    }
  };



  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="-blue-500" /> My Invigilation Duties
        </h2>
        
        {duties.length === 0 ? (
          <div className="glass-panel p-6 text-center text-slate-400">
            You currently have no invigilation duties assigned.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {duties.map((duty) => (
              <div 
                key={duty._id} 
                onClick={() => fetchDutyDetails(duty._id)}
                className={`glass-card p-6 border-t-4 rounded-xl cursor-pointer transition-all ${selectedDuty?._id === duty._id ? 'border-t-pink-500 bg-slate-800' : 'border-t-blue- hover:bg-slate-800/80'}`}
              >
                <h3 className="text-lg font-bold text-white mb-1">{duty.examId.subjectName}</h3>
                <p className="text-sm text-slate-400 mb-4">{duty.examId.subjectCode}</p>
                <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <MapPin size={16} className="-blue-500" />
                  Hall: {duty.hallId.hallId}
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 mt-4 text-sm text-center">
                  <span className="font-semibold text-pink-400">{new Date(duty.examId.date).toLocaleDateString()}</span> - <span className="font-semibold">{duty.examId.session}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDuty && selectedDuty.seatingArrangement && (
        <div className="glass-panel p-6 border border-pink-500/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-pink-400" /> Seating & Attendance
            </h2>
            <div className="-blue-500/10 -blue-500 px-4 py-2 rounded-lg text-sm border -blue-500/20">
              Hall: <span className="font-bold">{selectedDuty.hallId.hallId}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                  <th className="p-3">Seat No.</th>
                  <th className="p-3">Register Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {selectedDuty.seatingArrangement.map((seat, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-semibold text-pink-300">{seat.seatNumber}</td>
                    <td className="p-3">{seat.studentId?.registerNumber || 'N/A'}</td>
                    <td className="p-3">{seat.studentId?.name || 'N/A'}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleMarkAttendance(seat.studentId._id, true)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${seat.present ? '-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(seat.studentId._id, false)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${!seat.present ? '-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
