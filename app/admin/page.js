'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Loading from '@/app/components/ui/Loading';
import Badge from '@/app/components/ui/Badge';
import { formatBytes, formatDate } from '@/lib/utils';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalDownloads: 0,
    storageUsed: 0,
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadAdminData();
  }, [session, status, router]);

  const loadAdminData = async () => {
    try {
      const [statsRes, filesRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/files?limit=10'),
        fetch('/api/admin/users?limit=10'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setRecentFiles(filesData.files);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setRecentUsers(usersData.users);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loading size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users, files, and system settings
              </p>
            </div>            <div className="flex gap-4">
              <Link href="/admin/analytics">
                <Button variant="outline">Analytics</Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline">Settings</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDownloads}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatBytes(stats.storageUsed)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Files */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Files</h2>
              <Link href="/admin/files">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file._id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.filename}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatBytes(file.size)} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={file.isExpired ? 'danger' : 'success'}>
                      {file.isExpired ? 'Expired' : 'Active'}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {file.downloadCount} downloads
                    </span>
                  </div>
                </div>
              ))}
              {recentFiles.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No files found
                </p>
              )}
            </div>
          </Card>

          {/* Recent Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Users</h2>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user.fileCount || 0} files
                    </span>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Users
              </Button>
            </Link>
            
            <Link href="/admin/files">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manage Files
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Button>
            </Link>
            
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
