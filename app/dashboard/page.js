'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Loading from '@/app/components/ui/Loading';
import Badge from '@/app/components/ui/Badge';
import FileUploader from '@/app/components/Upload/FileUploader';
import { formatBytes, formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchFiles();
    }
  }, [session, currentPage]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (data.files) {
        setFiles(data.files);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchFiles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleToggleActive = async (fileId) => {
    try {
      const response = await fetch('/api/files', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          action: 'toggleActive',
        }),
      });
      
      if (response.ok) {
        fetchFiles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling file status:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your uploaded files and share them securely.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pagination.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {files.filter(file => file.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {files.reduce((sum, file) => sum + file.downloadCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>        {/* Upload Button & Admin Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {showUploader ? 'Hide Uploader' : 'Upload New File'}
          </Button>
          
          {/* Admin/Owner Controls */}
          {(session.user.role === 'admin' || session.user.role === 'owner') && (
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                Admin Dashboard
              </Button>
              
              {session.user.role === 'owner' && (
                <Button
                  onClick={() => router.push('/promote-admin')}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900"
                >
                  Promote Admin
                </Button>
              )}
            </div>
          )}
        </div>

        {/* File Uploader */}
        {showUploader && (
          <div className="mb-8">
            <Card className="p-6">
              <FileUploader onUploadComplete={fetchFiles} />
            </Card>
          </div>
        )}

        {/* Files List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Files</h2>
            <Button
              variant="outline"
              onClick={fetchFiles}
              className="text-sm"
            >
              Refresh
            </Button>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {file.originalName}
                        </h3>
                        <Badge variant={file.isActive ? 'success' : 'secondary'}>
                          {file.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {file.password && (
                          <Badge variant="warning">Password Protected</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatBytes(file.size)}</span>
                        <span>Downloads: {file.downloadCount}{file.maxDownloads ? `/${file.maxDownloads}` : ''}</span>
                        <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                        {file.expiresAt && (
                          <span className={new Date(file.expiresAt) < new Date() ? 'text-red-500' : ''}>
                            Expires: {formatDate(file.expiresAt)}
                          </span>
                        )}
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={`${window.location.origin}/download/${file.downloadId}`}
                            readOnly
                            className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 text-gray-600 dark:text-gray-300"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${window.location.origin}/download/${file.downloadId}`)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(file._id)}
                      >
                        {file.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteFile(file._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} files
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {pagination.pages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
