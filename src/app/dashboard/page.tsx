// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/');
          return;
        }

        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Информация о пользователе</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Роль:</span> {user.role}</p>
          <p>
            <span className="font-medium">Дата регистрации:</span>{' '}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}