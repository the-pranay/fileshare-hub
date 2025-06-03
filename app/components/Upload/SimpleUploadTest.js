'use client';

import { useState } from 'react';

export default function SimpleUploadTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Size:', file.size);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      setResult(data);
      console.log('Upload successful:', data);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Simple Upload Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select File:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="p-3 bg-gray-100 rounded">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {file.type}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <h3 className="font-bold">Upload Successful!</h3>
            <p><strong>Download ID:</strong> {result.downloadId}</p>
            <p><strong>Download URL:</strong> <a href={result.downloadUrl} className="text-blue-600 underline">{result.downloadUrl}</a></p>
            <p><strong>IPFS Hash:</strong> {result.cid}</p>
            <p><strong>File Size:</strong> {result.size} bytes</p>
          </div>
        )}
      </div>
    </div>
  );
}
