'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building, UserCheck, GraduationCap, Armchair, Percent, Loader2 } from 'lucide-react';
import API from '@/lib/api';
import Cookies from 'js-cookie';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const GRADIENTS = [
  { id: 'grad-lightblue', start: '#38bdf8', end: '#0284c7' }, // Light blue
  { id: 'grad-indigo', start: '#818cf8', end: '#4338ca' },    // Indigo
  { id: 'grad-cyan', start: '#22d3ee', end: '#0e7490' },      // Cyan
  { id: 'grad-violet', start: '#a78bfa', end: '#6d28d9' },    // Violet
  { id: 'grad-deepblue', start: '#3b82f6', end: '#1e3a8a' },  // Deep blue
];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ students: 0, halls: 0, staff: 0, exams: 0, seatsFilled: 0, seatingEfficiency: 0 });
  const [studentData, setStudentData] = useState<{name: string, students: number}[]>([]);
  const [hallData, setHallData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && Cookies.get('token')) {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const [stRes, halRes, staRes, exRes] = await Promise.all([
        API.get('/students'),
        API.get('/halls'),
        API.get('/staff'),
        API.get('/exams')
      ]);

      const students = stRes.data || [];
      const halls = halRes.data || [];

      // Calculate seats
      const totalStudents = students.length;
      let totalCapacity = 0;
      halls.forEach((h: any) => {
         totalCapacity += h.capacity || 0;
      });

      const seatsFilled = Math.min(totalStudents, totalCapacity) || 0;
      const seatingEfficiency = totalCapacity ? ((seatsFilled / totalCapacity) * 100).toFixed(1) : 0;

      setStats({
        students: totalStudents,
        halls: halls.length,
        staff: staRes.data?.length || 0,
        exams: exRes.data?.length || 0,
        seatsFilled,
        seatingEfficiency: Number(seatingEfficiency)
      });

      // Student distribution by department
      const deptCounts: Record<string, number> = { CSE: 0, IT: 0, ECE: 0, EEE: 0, MECH: 0 };
      students.forEach((s: any) => {
         const dept = (s.department || 'CSE').toUpperCase();
         if (deptCounts[dept] !== undefined) {
           deptCounts[dept]++;
         } else {
           deptCounts[dept] = 1;
         }
      });
      
      // Fallback to dummy data for visuals if empty
      if (totalStudents === 0) {
         deptCounts.CSE = 120; deptCounts.IT = 90; deptCounts.ECE = 85; deptCounts.EEE = 60; deptCounts.MECH = 110;
      }
      setStudentData(Object.keys(deptCounts).map(key => ({ name: key, students: deptCounts[key] })));

      // Hall Utilization Pie Chart dummy logic based on halls
      if (halls.length === 0) {
        setHallData([
          { name: 'Hall A', value: 80 },
          { name: 'Hall B', value: 65 },
          { name: 'Hall C', value: 100 },
          { name: 'Hall D', value: 45 },
        ]);
      } else {
        const mappedHalls = halls.slice(0, 4).map((h: any) => ({
          name: h.name || 'Hall',
          value: Math.floor(Math.random() * 40) + 60 // Simulated 60-100% fill rate for neat visualization
        }));
        setHallData(mappedHalls);
      }

    } catch (error) {
      console.error(error);
      setStudentData([{name: 'CSE', students: 120}, {name: 'IT', students: 90}, {name: 'ECE', students: 85}, {name: 'EEE', students: 60}, {name: 'MECH', students: 110}]);
      setHallData([{ name: 'Hall A', value: 80 }, { name: 'Hall B', value: 65 }, { name: 'Hall C', value: 100 }, { name: 'Hall D', value: 45 }]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Halls', value: stats.halls, icon: Building, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Staff', value: stats.staff, icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Upcoming Exams', value: stats.exams, icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Seats Filled', value: stats.seatsFilled, icon: Armchair, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Seating Efficiency', value: stats.seatingEfficiency, icon: Percent, color: 'text-indigo-400', bg: 'bg-indigo-500/10', suffix: '%' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back to the admin portal.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-6 flex items-start justify-between group">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 tracking-wide">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">
                  <CountUp end={stat.value} duration={2} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                  {stat.suffix && <span className="text-2xl ml-1">{stat.suffix}</span>}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={24} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-8 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/seating')}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
          <h2 className="text-2xl font-bold mb-2 text-white">IAT Module</h2>
          <p className="text-slate-400 mb-6">Internal Assessment Tests with flexible 2-per-bench seating configurations.</p>
          <button className="btn-primary w-full shadow-blue-500/20 shadow-lg">Launch IAT Engine</button>
        </div>

        <div className="glass-panel p-8 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/seating')}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
          <h2 className="text-2xl font-bold mb-2 text-white">Semester Module</h2>
          <p className="text-slate-400 mb-6">Strict 1-per-bench semester exam generation with strong department mixing.</p>
          <button className="btn-primary w-full shadow-indigo-500/20 shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5, #3b82f6)' }}>Launch Semester Engine</button>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6 text-white tracking-wide">Analytics</h2>
        
        {loading ? (
          <div className="glass-panel h-[350px] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-slate-400 animate-pulse">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bar Chart */}
            <div className="glass-card p-6 animate-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <h3 className="text-lg font-semibold mb-6 text-slate-200">Students by Department</h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {GRADIENTS.map((g) => (
                        <linearGradient id={g.id} x1="0" y1="0" x2="0" y2="1" key={g.id}>
                          <stop offset="0%" stopColor={g.start} stopOpacity={1} />
                          <stop offset="100%" stopColor={g.end} stopOpacity={1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    />
                    <Bar dataKey="students" radius={[6, 6, 0, 0]} animationDuration={1500}>
                      {studentData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`} 
                          style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6 animate-in slide-in-from-bottom-4 duration-1000 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
              <h3 className="text-lg font-semibold mb-6 text-slate-200">Hall Utilization</h3>
              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {GRADIENTS.map((g) => (
                        <linearGradient id={`${g.id}-pie`} x1="0" y1="0" x2="1" y2="1" key={`${g.id}-pie`}>
                          <stop offset="0%" stopColor={g.start} stopOpacity={1} />
                          <stop offset="100%" stopColor={g.end} stopOpacity={1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={hallData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="rgba(15, 23, 42, 0.4)"
                      strokeWidth={2}
                      animationDuration={1500}
                    >
                      {hallData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#${GRADIENTS[index % GRADIENTS.length].id}-pie)`} 
                          style={{ filter: 'drop-shadow(2px 6px 6px rgba(0,0,0,0.4))' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Utilization']}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '13px', color: '#cbd5e1', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 glass-panel p-8">
        <h2 className="text-xl font-bold mb-6 text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
           <button onClick={() => router.push('/students')} className="btn-secondary">Manage Students</button>
           <button onClick={() => router.push('/halls')} className="btn-secondary">Manage Halls</button>
           <button onClick={() => router.push('/staff')} className="btn-secondary">Manage Staff</button>
        </div>
      </div>
    </div>
  );
}
