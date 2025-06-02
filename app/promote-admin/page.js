'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Badge from '@/app/components/ui/Badge';
import Loading from '@/app/components/ui/Loading';
import { useToast } from '@/app/components/ui/Toast';

export default function PromoteAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { success, error } = useToast();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only owners and admins can access this page
    if (session.user.role !== 'admin' && session.user.role !== 'owner') {
      router.push('/dashboard');
      return;
    }

    loadUsers();
  }, [session, status, router]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/promote-admin');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const promoteUser = async (userEmail, action = 'promote') => {
    setLoading(true);
    try {
      const response = await fetch('/api/promote-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          action: action,
        }),
      });

      const data = await response.json();

      if (data.success) {
        success('Success!', data.message);
        setEmail('');
        loadUsers(); // Refresh user list
      } else {
        error('Error', data.error);
      }
    } catch (err) {
      error('Error', 'Failed to change user role');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      promoteUser(email.trim());
    }
  };

  const getRoleBadgeColor = (role, isOwner) => {
    if (isOwner) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    if (role === 'admin') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getRoleDisplay = (role, isOwner) => {
    if (isOwner) return 'Owner';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const canModifyUser = (user) => {
    // Owner can modify anyone except themselves (to prevent self-demotion)
    if (session?.user?.role === 'owner') {
      return user.email !== session.user.email;
    }
    // Admins can only modify regular users
    return user.role === 'user' && !user.isOwner;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Role Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Promote users to admin role to access admin panel
          </p>
        </div>

        {/* Promote User Form */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Promote User to Admin
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Processing...' : 'Promote to Admin'}
              </Button>
              <Button
                type="button"
                onClick={loadUsers}
                variant="outline"
              >
                Load Users
              </Button>
            </div>
          </form>
        </Card>

        {/* Users List */}
        {users.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Users
            </h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={getRoleBadgeColor(user.role, user.isOwner)}
                    >
                      {getRoleDisplay(user.role, user.isOwner)}
                    </Badge>
                    {canModifyUser(user) ? (
                      user.role !== 'admin' ? (
                        <Button
                          onClick={() => promoteUser(user.email, 'promote')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={loading}
                        >
                          Make Admin
                        </Button>
                      ) : (
                        <Button
                          onClick={() => promoteUser(user.email, 'demote')}
                          size="sm"
                          variant="outline"
                          disabled={loading}
                        >
                          Remove Admin
                        </Button>
                      )
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Cannot modify
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}        {/* Instructions */}
        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            {session.user.role === 'owner' ? 'Owner Privileges' : 'Admin Management'}
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            {session.user.role === 'owner' ? (
              <>
                <p>🏆 <strong>You are the site owner</strong> - You have full administrative privileges</p>
                <p>• Promote/demote any user to/from admin role</p>
                <p>• Access all admin panels and system settings</p>
                <p>• Cannot be demoted by other administrators</p>
                <p>• Permanent access to owner dashboard</p>
              </>
            ) : (
              <>
                <p>👑 <strong>Admin Management Panel</strong></p>
                <p>• Promote regular users to admin role</p>
                <p>• Demote admin users back to regular users</p>
                <p>• Cannot modify owner account</p>
                <p>• Access admin panel at <strong>/admin</strong></p>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
