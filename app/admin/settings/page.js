'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Loading from '@/app/components/ui/Loading';
import { useToast } from '@/app/components/ui/Toast';

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const [settings, setSettings] = useState({
    maxFileSize: '50',
    maxStoragePerUser: '1024',
    allowedFileTypes: 'image/*,application/pdf,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    analyticsRetentionDays: '90',
    rateLimitMax: '100',
    rateLimitWindow: '15',
  });
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    email: 'checking',
    ipfs: 'checking',
  });
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      router.push('/dashboard');
      return;
    }

    checkSystemStatus();
  }, [session, status, router]);
  const checkSystemStatus = async () => {
    // Check email configuration (via API)
    try {
      const emailResponse = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-config' })
      });
      const emailResult = await emailResponse.json();
      setSystemStatus(prev => ({
        ...prev,
        email: emailResult.success ? 'healthy' : 'error'
      }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, email: 'error' }));
    }

    // Check database connection (via API)
    try {
      const dbResponse = await fetch('/api/admin/health/database');
      const dbResult = await dbResponse.json();
      setSystemStatus(prev => ({
        ...prev,
        database: dbResult.success ? 'healthy' : 'error'
      }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, database: 'error' }));
    }

    // Check IPFS connection (via API)
    try {
      const ipfsResponse = await fetch('/api/admin/health/ipfs');
      const ipfsResult = await ipfsResponse.json();
      setSystemStatus(prev => ({
        ...prev,
        ipfs: ipfsResult.success ? 'healthy' : 'error'
      }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, ipfs: 'error' }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });      if (response.ok) {
        success('Settings saved', 'Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      error('Save failed', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });      if (response.ok) {
        success('Email test', 'Test email sent successfully!');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (err) {
      error('Email test failed', 'Failed to send test email. Check email configuration.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'checking':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'error':
        return '❌';
      case 'checking':
        return '🔄';
      default:
        return '⚪';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading admin settings..." />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Settings
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage system configuration and monitor service health
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/admin">
                <Button variant="outline">Back to Admin Panel</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Database</p>
                <p className={`text-sm ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database === 'checking' ? 'Checking...' : 
                   systemStatus.database === 'healthy' ? 'Connected' : 'Connection Failed'}
                </p>
              </div>
              <span className="text-2xl">{getStatusIcon(systemStatus.database)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Service</p>
                <p className={`text-sm ${getStatusColor(systemStatus.email)}`}>
                  {systemStatus.email === 'checking' ? 'Checking...' : 
                   systemStatus.email === 'healthy' ? 'Configured' : 'Configuration Error'}
                </p>
              </div>
              <span className="text-2xl">{getStatusIcon(systemStatus.email)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">IPFS Storage</p>
                <p className={`text-sm ${getStatusColor(systemStatus.ipfs)}`}>
                  {systemStatus.ipfs === 'checking' ? 'Checking...' : 
                   systemStatus.ipfs === 'healthy' ? 'Connected' : 'Connection Failed'}
                </p>
              </div>
              <span className="text-2xl">{getStatusIcon(systemStatus.ipfs)}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              onClick={checkSystemStatus}
              variant="outline"
              size="sm"
            >
              Refresh Status
            </Button>
            <Button
              onClick={handleTestEmail}
              variant="outline"
              size="sm"
              disabled={loading || systemStatus.email !== 'healthy'}
            >
              Test Email
            </Button>
          </div>
        </Card>

        {/* File Upload Settings */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            File Upload Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum File Size (MB)
              </label>
              <Input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Storage Per User (MB)
              </label>
              <Input
                type="number"
                value={settings.maxStoragePerUser}
                onChange={(e) => setSettings({ ...settings, maxStoragePerUser: e.target.value })}
                placeholder="1024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Allowed File Types (MIME types, comma-separated)
              </label>
              <Input
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                placeholder="image/*,application/pdf,text/*"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use wildcards like image/* or specific types like application/pdf
              </p>
            </div>
          </div>
        </Card>

        {/* Rate Limiting Settings */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Rate Limiting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Requests
              </label>
              <Input
                type="number"
                value={settings.rateLimitMax}
                onChange={(e) => setSettings({ ...settings, rateLimitMax: e.target.value })}
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Window (minutes)
              </label>
              <Input
                type="number"
                value={settings.rateLimitWindow}
                onChange={(e) => setSettings({ ...settings, rateLimitWindow: e.target.value })}
                placeholder="15"
              />
            </div>
          </div>
        </Card>

        {/* Data Retention Settings */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Retention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analytics Retention (days)
              </label>
              <Input
                type="number"
                value={settings.analyticsRetentionDays}
                onChange={(e) => setSettings({ ...settings, analyticsRetentionDays: e.target.value })}
                placeholder="90"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                How long to keep analytics data before automatic cleanup
              </p>
            </div>
          </div>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? <Loading size="sm" text="Saving..." /> : 'Save Settings'}
          </Button>        </div>
      </div>
    </div>
  );
}
