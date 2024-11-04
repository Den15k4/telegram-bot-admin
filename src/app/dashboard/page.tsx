"use client";

import { useEffect, useState } from 'react';
import { AuthCheck } from '@/components/auth/auth-check';
import { 
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  Settings,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPayments: number;
  revenue: number;
  processedImages: number;
  averageCredits: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPayments: 0,
    revenue: 0,
    processedImages: 0,
    averageCredits: 0
  });

  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Здесь будем загружать статистику
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsageData(data.usageData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        {/* Навигационная панель */}
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
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Карточки со статистикой */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Пользователи</h3>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Активных: {stats.activeUsers}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Платежи</h3>
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalPayments}</p>
              <p className="text-sm text-gray-500">Выручка: {stats.revenue} ₽</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Обработано</h3>
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{stats.processedImages}</p>
              <p className="text-sm text-gray-500">Среднее: {stats.averageCredits} кредитов</p>
            </div>
          </div>

          {/* График использования */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Активность пользователей</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" />
                  <Line type="monotone" dataKey="images" stroke="#8B5CF6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Панель быстрых действий */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
              <MessageCircle className="h-6 w-6 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium">Рассылка</h3>
              <p className="text-sm text-gray-500">Отправить сообщение пользователям</p>
            </button>

            <button className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">Статистика</h3>
              <p className="text-sm text-gray-500">Подробный отчет</p>
            </button>

            <button className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
              <Settings className="h-6 w-6 text-purple-500 mb-4" />
              <h3 className="text-lg font-medium">Настройки</h3>
              <p className="text-sm text-gray-500">Конфигурация бота</p>
            </button>

            <button className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors">
              <AlertCircle className="h-6 w-6 text-red-500 mb-4" />
              <h3 className="text-lg font-medium">Логи</h3>
              <p className="text-sm text-gray-500">Просмотр ошибок</p>
            </button>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
}