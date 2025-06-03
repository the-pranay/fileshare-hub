'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UploadDebugTest() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, message, details = null) => {
    setTestResults(prev => [...prev, { test, success, message, details, timestamp: new Date().toISOString() }]);
  };

  const testAnonymousUpload = async () => {
    try {
      const testContent = 'Test file content for anonymous upload';
      const blob = new Blob([testContent], { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', blob, 'test-anonymous.txt');

      console.log('🔍 Testing anonymous upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        addResult('Anonymous Upload', true, 'Successfully uploaded file anonymously', result);
      } else {
        addResult('Anonymous Upload', false, `Upload failed: ${response.status}`, result);
      }
    } catch (error) {
      addResult('Anonymous Upload', false, `Error: ${error.message}`, { error: error.toString() });
    }
  };

  const testAuthenticatedUpload = async () => {
    if (!session) {
      addResult('Authenticated Upload', false, 'No active session found', { session: status });
      return;
    }

    try {
      const testContent = 'Test file content for authenticated upload';
      const blob = new Blob([testContent], { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', blob, 'test-authenticated.txt');

      console.log('🔍 Testing authenticated upload...');
      console.log('Session data:', session);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure cookies are sent
      });

      const result = await response.json();
      
      if (response.ok) {
        addResult('Authenticated Upload', true, 'Successfully uploaded file with authentication', result);
      } else {
        addResult('Authenticated Upload', false, `Upload failed: ${response.status}`, result);
      }
    } catch (error) {
      addResult('Authenticated Upload', false, `Error: ${error.message}`, { error: error.toString() });
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    // Test session info
    addResult('Session Check', !!session, `Session status: ${status}`, { 
      hasSession: !!session, 
      userEmail: session?.user?.email,
      userId: session?.user?.id 
    });

    await testAnonymousUpload();
    await testAuthenticatedUpload();
    
    setTesting(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Upload Authentication Debug Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>User:</strong> {session?.user?.email || 'Not logged in'}</p>
          <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={runAllTests}
          disabled={testing}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {testing ? 'Running Tests...' : 'Run Upload Tests'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click "Run Upload Tests" to start.</p>
        ) : (
          testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded border-l-4 ${
                result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className={`mr-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✅' : '❌'}
                </span>
                <strong>{result.test}</strong>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mb-2">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600">Show Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
