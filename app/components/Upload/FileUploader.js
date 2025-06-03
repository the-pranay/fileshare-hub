'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useToast } from '@/app/components/ui/Toast';
import { formatBytes } from '@/lib/utils';

export default function FileUploader({ onUploadComplete }) {
  const { data: session, status } = useSession();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSettings, setUploadSettings] = useState({
    expiresIn: '', // hours
    maxDownloads: '',
    password: '',
  });
  const [showSettings, setShowSettings] = useState(false);
  const { success, error } = useToast();

  // Log session status for debugging
  useEffect(() => {
    console.log('🔍 Session status update:', {
      status,
      hasSession: !!session,
      userEmail: session?.user?.email,
      userId: session?.user?.id
    });
  }, [session, status]);
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      error('File too large', 'File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('🚀 Starting file upload:', {
        name: file.name,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString()
      });

      const formData = new FormData();
      formData.append('file', file);
      
      // Add settings if provided
      if (uploadSettings.expiresIn) {
        formData.append('expiresIn', uploadSettings.expiresIn);
      }
      if (uploadSettings.maxDownloads) {
        formData.append('maxDownloads', uploadSettings.maxDownloads);
      }
      if (uploadSettings.password) {
        formData.append('password', uploadSettings.password);
      }

      console.log('📤 Sending upload request to /api/upload');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 85));
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure session cookies are sent
      });

      clearInterval(progressInterval);
      setUploadProgress(90);

      console.log('📥 Upload response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      let result;
      try {
        result = await response.json();
        console.log('📋 Response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        throw new Error('Server returned invalid response');
      }

      setUploadProgress(100);

      if (!response.ok) {
        const errorMessage = result.error?.message || result.error || `Upload failed with status ${response.status}`;
        console.error('❌ Upload failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Upload successful:', result);
      setUploadedFile(result);
      
      // Reset form
      setUploadSettings({
        expiresIn: '',
        maxDownloads: '',
        password: '',
      });
      setShowSettings(false);

      // Show success message
      success('Upload successful!', 'Your file has been uploaded to IPFS and is ready to share');

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }

    } catch (error) {
      console.error('💥 Upload error:', error);
      
      // Provide more detailed error information
      let userMessage = 'An error occurred while uploading your file';
      
      if (error.message.includes('Failed to fetch')) {
        userMessage = 'Network error - please check your connection and try again';
      } else if (error.message.includes('413')) {
        userMessage = 'File too large - please try a smaller file';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'Authentication issue - please refresh the page and try again';
      } else if (error.message) {
        userMessage = error.message;
      }
      
      error('Upload failed', userMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [uploadSettings, onUploadComplete, success, error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  });
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied!', 'Link copied to clipboard');
    } catch (error) {
      error('Copy failed', 'Failed to copy link to clipboard');
    }
  };

  const handleNewUpload = () => {
    setUploadedFile(null);
    setUploadSettings({
      expiresIn: '',
      maxDownloads: '',
      password: '',
    });
    setShowSettings(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Status Indicator */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              status === 'loading' ? 'bg-yellow-400' :
              session ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {status === 'loading' ? 'Checking authentication...' :
               session ? `Signed in as ${session.user.email}` : 'Not signed in (anonymous upload)'}
            </span>
          </div>
          {session && (
            <Badge variant="success" size="sm">Authenticated</Badge>
          )}
        </div>
      </Card>

      {/* Upload Area */}
      <Card padding="lg">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <Loading size="lg" text="Uploading to IPFS..." />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploadProgress}% uploaded
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  or click to select a file (max 50MB)
                </p>
              </div>
              
              <Button variant="outline">
                Choose File
              </Button>
            </div>
          )}
        </div>
      </Card>      {/* Upload Settings */}
      {!uploadedFile && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Settings (Optional)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </Button>
          </div>
          
          {showSettings && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expires After (hours)
                  </label>
                  <Input
                    type="number"
                    placeholder="24"
                    value={uploadSettings.expiresIn}
                    onChange={(e) => setUploadSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
                </div>

                {/* Max Downloads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Downloads
                  </label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={uploadSettings.maxDownloads}
                    onChange={(e) => setUploadSettings(prev => ({ ...prev, maxDownloads: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited downloads</p>
                </div>
              </div>

              {/* Password Protection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password (Optional)
                </label>
                <Input
                  type="password"
                  placeholder="Enter password to protect file"
                  value={uploadSettings.password}
                  onChange={(e) => setUploadSettings(prev => ({ ...prev, password: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">File will be password protected if provided</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Upload Result */}
      {uploadedFile && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              File Uploaded Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your file has been uploaded to IPFS and is ready to share
            </p>
          </div>
          
          <div className="space-y-6">
            {/* File Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filename:</span>
                <span className="text-sm text-gray-900 dark:text-white">{uploadedFile.filename}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Size:</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatBytes(uploadedFile.size)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Download ID:</span>
                <Badge variant="secondary">{uploadedFile.downloadId}</Badge>
              </div>
            </div>

            {/* Download Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Download Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={uploadedFile.downloadUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => copyToClipboard(uploadedFile.downloadUrl)}
                  variant="outline"
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* QR Code */}
            {uploadedFile.qrCode && (
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  QR Code
                </label>
                <div className="inline-block p-4 bg-white rounded-lg">
                  <img 
                    src={uploadedFile.qrCode} 
                    alt="QR Code for download link"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleNewUpload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Upload Another File
              </Button>
              <Button
                onClick={() => window.open(uploadedFile.downloadUrl, '_blank')}
                variant="outline"
              >
                Test Download
              </Button>
            </div>
          </div>
        </Card>      )}
    </div>
  );
}
