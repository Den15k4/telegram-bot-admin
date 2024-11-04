"use client";

import { useEffect, useState } from 'react';
import { AuthCheck } from '@/components/auth/auth-check';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Панель управления</h1>
              </div>
              <div className="flex items-center gap-4">
                {user && <span className="text-gray-600">{user.email}</span>}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {user && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Информация о пользователе</h2>
              <div className="space-y-2">
                <p><span className="font-medium">ID:</span> {user.id}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Роль:</span> {user.role}</p>
                <p>
                  <span className="font-medium">Дата регистрации:</span>{' '}
                  {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthCheck>
  );
}