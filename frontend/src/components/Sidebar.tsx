'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Building, GraduationCap, 
  Settings, UserCheck, CalendarDays, FileText,
  LogOut, MessageSquare
} from 'lucide-react';
import Cookies from 'js-cookie';

import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Halls', href: '/halls', icon: Building },
  { name: 'Staff', href: '/staff', icon: UserCheck },
  { name: 'Exams', href: '/exams', icon: GraduationCap },
  { name: 'Seating Engine', href: '/seating', icon: CalendarDays },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 glass-panel border-y-0 border-l-0 rounded-none rounded-r-2xl flex flex-col z-50">
      <div className="py-4 px-2 flex justify-center items-center">
        <div className="w-[210px]">
          <Image 
            src="/logo.png" 
            alt="College Logo" 
            width={210} 
            height={210} 
            className="object-contain w-full h-auto drop-shadow-md"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group active:bg-orange-500/20 active:text-orange-400 active:border-orange-500/30 active:scale-[0.98] ${
                isActive 
                  ? 'bg-blue-500/20 text-blue-400 shadow-inner border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-blue-900/40 hover:text-blue-200 border border-transparent'
              }`}
            >
              <Icon size={20} className={`transition-colors duration-200 group-active:text-orange-400 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-300'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--card-border)]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group text-slate-400 hover:bg-blue-900/40 hover:text-blue-200 active:bg-orange-500/20 active:text-orange-400 active:scale-[0.98]"
        >
          <LogOut size={20} className="transition-colors duration-200 group-active:text-orange-400" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
