import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AdminLayout from '@/components/AdminLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Exam Seating System',
  description: 'Admin Portal for Smart Exam Seating Arrangement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
