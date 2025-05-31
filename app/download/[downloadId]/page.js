'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Loading from '@/app/components/ui/Loading';
import Badge from '@/app/components/ui/Badge';
import { formatBytes, formatDate } from '@/lib/utils';

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const { downloadId } = params;
  
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);

  useEffect(() => {
    if (downloadId) {
      fetchFileInfo();
    }
  }, [downloadId]);

  const fetchFileInfo = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/download/${downloadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setFileInfo(data);
        setPasswordRequired(false);
      } else {
        if (response.status === 401) {
          setPasswordRequired(true);
          setError('Password required to access this file');
        } else if (response.status === 404) {
          setError('File not found');
        } else if (response.status === 410) {
          setError(data.error || 'File is no longer available');
        } else {
          setError(data.error || 'Failed to load file information');
        }
      }
    } catch (error) {
      console.error('Error fetching file info:', error);
      setError('Failed to load file information');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      fetchFileInfo();
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');
      
      const url = `/api/download/${downloadId}${password ? `?password=${encodeURIComponent(password)}` : ''}`;
      
      const response = await fetch(url);

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileInfo.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        // Refresh file info to update download count
        setTimeout(() => {
          fetchFileInfo();
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (mimeType.startsWith('video/')) {
      return (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (mimeType.startsWith('audio/')) {
      return (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else if (mimeType.includes('pdf')) {
      return (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              File Download
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Secure file sharing via FileShare Hub
            </p>
          </div>

          <Card className="p-8">
            {error && !passwordRequired && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Go to Homepage
                  </Button>
                </div>
              </div>
            )}

            {passwordRequired && (
              <div className="mb-6">
                <div className="text-center mb-6">
                  <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Password Required
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This file is password protected. Please enter the password to continue.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={!password.trim() || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? 'Verifying...' : 'Access File'}
                  </Button>
                </form>
              </div>
            )}

            {fileInfo && (
              <div className="space-y-6">
                {/* File Info */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getFileIcon(fileInfo.mimeType)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {fileInfo.filename}
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatBytes(fileInfo.size)}</span>
                    <span>•</span>
                    <span>Downloaded {fileInfo.downloadCount} times</span>
                  </div>
                </div>

                {/* File Details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="secondary">{fileInfo.mimeType}</Badge>
                  </div>
                  
                  {fileInfo.maxDownloads && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Download Limit:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {fileInfo.downloadCount} / {fileInfo.maxDownloads}
                      </span>
                    </div>
                  )}
                  
                  {fileInfo.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expires:</span>
                      <span className={`text-sm ${new Date(fileInfo.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        {formatDate(fileInfo.expiresAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="space-y-4">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-3"
                  >
                    {downloading ? (
                      <div className="flex items-center justify-center">
                        <Loading size="sm" />
                        <span className="ml-2">Downloading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download File
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/')}
                      className="text-sm"
                    >
                      Upload Your Own Files
                    </Button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mb-1 font-medium">
                        Secure Download
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        This file is securely stored on IPFS and will be downloaded directly to your device. 
                        Always scan downloaded files with antivirus software.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
