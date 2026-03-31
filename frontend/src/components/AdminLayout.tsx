'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    
    let role = null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        role = user.role;
        setUserRole(role);
      } catch (e) {
        console.error(e);
      }
    }

    const publicPaths = ['/login'];
    
    if (!token && !publicPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!mounted) return null;

  const publicPaths = ['/login'];
  const hasToken = Cookies.get('token');

  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (!hasToken) {
    // Return null while navigating away
    return <div className="min-h-screen flex items-center justify-center"><span className="animate-pulse text-white">Redirecting to login...</span></div>;
  }

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  const isStudent = pathname.startsWith('/student') && !pathname.startsWith('/students');
  const isFaculty = pathname.startsWith('/faculty');

  if (isStudent || isFaculty) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex justify-between items-center z-10 sticky top-0 backdrop-blur-md">
          <div className="flex items-center justify-center pl-2">
            <div className="w-[210px] shrink-0">
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
          <button onClick={handleLogout} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 group active:text-orange-400 transition-all duration-200 bg-blue-500/10 hover:bg-blue-900/40 active:bg-orange-500/20 active:border-orange-500/30 active:scale-[0.98] px-4 py-2 rounded-lg border border-blue-500/20">
            <LogOut size={18} className="transition-colors duration-200 group-active:text-orange-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 pb-16">
        {children}
      </main>
    </div>
  );
}
