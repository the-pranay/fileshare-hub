'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useToast } from '../components/ui/Toast';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Fetch analytics data
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [session, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      error('Error', 'Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demonstration (replace with real data from API)
  const sampleStats = {
    overview: {
      totalUsers: 1234,
      totalFiles: 5678,
      totalDownloads: 9876,
      totalStorage: 2.4, // GB
      activeUsers: 456,
      newFilesToday: 89
    },
    uploadsOverTime: [
      { date: '2024-01-01', uploads: 45, downloads: 120 },
      { date: '2024-01-02', uploads: 67, downloads: 145 },
      { date: '2024-01-03', uploads: 89, downloads: 167 },
      { date: '2024-01-04', uploads: 56, downloads: 134 },
      { date: '2024-01-05', uploads: 78, downloads: 189 },
      { date: '2024-01-06', uploads: 92, downloads: 201 },
      { date: '2024-01-07', uploads: 103, downloads: 234 }
    ],
    fileTypes: [
      { name: 'Images', value: 35, count: 1234 },
      { name: 'Documents', value: 28, count: 987 },
      { name: 'Videos', value: 20, count: 654 },
      { name: 'Audio', value: 10, count: 321 },
      { name: 'Archives', value: 7, count: 234 }
    ],
    userActivity: [
      { hour: '00', users: 12 },
      { hour: '04', users: 8 },
      { hour: '08', users: 45 },
      { hour: '12', users: 78 },
      { hour: '16', users: 92 },
      { hour: '20', users: 56 }
    ],
    topFiles: [
      { name: 'presentation.pdf', downloads: 234, size: '2.4 MB' },
      { name: 'project-demo.mp4', downloads: 189, size: '45.6 MB' },
      { name: 'report.docx', downloads: 156, size: '1.2 MB' },
      { name: 'design.zip', downloads: 123, size: '12.8 MB' },
      { name: 'image.png', downloads: 98, size: '3.4 MB' }
    ]
  };

  const data = stats || sampleStats;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Comprehensive insights into your FileShare Hub usage
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalFiles.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalStorage} GB</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Files Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.newFilesToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload/Download Trends */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload & Download Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.uploadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="uploads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="downloads" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* File Types Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.fileTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.fileTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity & Top Files */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Activity by Hour */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity by Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Downloaded Files */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Downloaded Files</h3>
            <div className="space-y-4">
              {data.topFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{file.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{file.downloads}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
