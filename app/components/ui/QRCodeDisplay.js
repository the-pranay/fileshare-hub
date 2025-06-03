'use client';

import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

export default function QRCodeDisplay({ qrCode, downloadUrl, filename, size = 'sm' }) {
  const [showModal, setShowModal] = useState(false);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  if (!qrCode) return null;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <img 
            src={qrCode} 
            alt="QR Code for download link"
            className={`${sizeClasses[size]} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            QR Code
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Scan to download • Click to enlarge
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadQRCode}
            className="text-xs"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="QR Code">
        <div className="text-center space-y-4">
          <div className="bg-white p-6 rounded-lg inline-block">
            <img 
              src={qrCode} 
              alt="QR Code for download link"
              className="w-64 h-64 mx-auto"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan this QR code to download: <strong>{filename}</strong>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={downloadUrl}
                readOnly
                className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 text-gray-600 dark:text-gray-300"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(downloadUrl)}
              >
                Copy URL
              </Button>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              onClick={downloadQRCode}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Download QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
