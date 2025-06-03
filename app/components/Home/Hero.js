'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/upload');
  };

  const handleLearnMore = () => {
    setShowGuideModal(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Add your email subscription logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Share Files
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Seamlessly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The fastest and most secure way to share your files with anyone, anywhere. 
            Upload, share, and collaborate with ease.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">No Registration Required</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Start Sharing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleLearnMore}
              className="transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </Button>
          </div>

          {/* Email Subscription */}
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get notified about new features and updates
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-300">Files Shared</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-300">Happy Users</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-300">Uptime</div>
          </div>
        </div>
      </div>      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-500"></div>      {/* Guide Modal */}
      <Modal 
        isOpen={showGuideModal} 
        onClose={() => setShowGuideModal(false)}
        title="Complete File Sharing Guide"
        size="lg"
      >
        <div className="max-h-96 sm:max-h-[32rem] overflow-y-auto px-2 sm:px-0">
          <div className="space-y-4">
            {/* Introduction */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Welcome to FileShare Hub
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                FileShare Hub is your secure, fast, and reliable platform for sharing files with anyone, anywhere. 
                Follow this comprehensive guide to get started.
              </p>
            </div>            {/* Step 1: Upload Files */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm mr-3 shadow-lg">1</span>
                Upload Your Files
              </h4>
              <ul className="text-gray-700 dark:text-gray-200 space-y-2 ml-10">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  Click "Start Sharing Now" or navigate to the Upload page
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  Drag and drop files or click to browse
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  Supported file types: Documents, Images, Videos, Archives, etc.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  Maximum file size: 100MB per file
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  Upload multiple files at once
                </li>
              </ul>
            </div>

            {/* Step 2: Set Options */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm mr-3 shadow-lg">2</span>
                Configure Sharing Options
              </h4>
              <ul className="text-gray-700 dark:text-gray-200 space-y-2 ml-10">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  Set expiration time (1 hour to 30 days)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  Add password protection (optional)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  Set download limits
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  Choose visibility settings
                </li>
              </ul>
            </div>

            {/* Step 3: Share */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-100 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm mr-3 shadow-lg">3</span>
                Share Your Files
              </h4>
              <ul className="text-gray-700 dark:text-gray-200 space-y-2 ml-10">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 mt-1">•</span>
                  Copy the generated share link
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 mt-1">•</span>
                  Send via email, messaging, or social media
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 mt-1">•</span>
                  Track downloads and views
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 mt-1">•</span>
                  Receive notifications when files are accessed
                </li>
              </ul>
            </div>            {/* Features */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-green-100 dark:border-gray-700">
              <h4 className="text-md font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                🚀 Key Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-gray-700 dark:text-gray-200 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <strong className="text-blue-600 dark:text-blue-400">🔒 End-to-End Encryption</strong><br />
                  <span className="text-sm">Your files are encrypted during upload and storage</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <strong className="text-purple-600 dark:text-purple-400">⚡ Lightning Fast</strong><br />
                  <span className="text-sm">Optimized for speed with global CDN</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
                  <strong className="text-indigo-600 dark:text-indigo-400">📱 Mobile Friendly</strong><br />
                  <span className="text-sm">Works perfectly on all devices</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <strong className="text-green-600 dark:text-green-400">🔗 Easy Sharing</strong><br />
                  <span className="text-sm">Simple links that work everywhere</span>
                </div>
              </div>
            </div>            {/* Security */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-yellow-100 dark:border-gray-700">
              <h4 className="text-md font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                🛡️ Security & Privacy
              </h4>
              <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  Files are automatically deleted after expiration
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  No file content is stored on our servers permanently
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  Optional password protection
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  Download tracking and limits
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  GDPR compliant
                </li>
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-pink-100 dark:border-gray-700">
              <h4 className="text-md font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                💡 Pro Tips
              </h4>
              <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2 mt-1">•</span>
                  Create an account to track all your shared files
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2 mt-1">•</span>
                  Use short expiration times for sensitive files
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2 mt-1">•</span>
                  Compress large files before uploading
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2 mt-1">•</span>
                  Use descriptive filenames for better organization
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2 mt-1">•</span>
                  Check our analytics to see who downloaded your files
                </li>
              </ul>
            </div>            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 backdrop-blur-sm p-6 rounded-lg border border-blue-200 dark:border-gray-600 shadow-lg">
              <h4 className="text-md font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Ready to Start?
              </h4>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Join thousands of users who trust FileShare Hub for their file sharing needs.
              </p>
              <Button 
                onClick={() => {
                  setShowGuideModal(false);
                  router.push('/upload');
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Start Uploading Now
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
