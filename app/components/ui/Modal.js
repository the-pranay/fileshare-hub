'use client';

import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
    const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl lg:max-w-4xl',
    xl: 'max-w-4xl lg:max-w-6xl',
    full: 'max-w-7xl'
  };
    return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-black/50 to-purple-900/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">        <div className={`
          modal-content relative w-full ${sizes[size]} bg-gradient-to-br from-white via-blue-50/80 to-purple-50/80 dark:from-gray-800 dark:via-gray-900/90 dark:to-gray-800 rounded-lg shadow-xl border border-blue-100 dark:border-gray-700
          transform transition-all duration-300 ${className}
        `}>{/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-blue-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 via-white/50 to-purple-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 rounded-t-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
