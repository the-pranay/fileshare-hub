'use client';

import { useState } from 'react';
import Button from '../ui/Button';

export default function Hero() {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    // Add your get started logic here
    console.log('Get started clicked');
  };

  const handleLearnMore = () => {
    // Add your learn more logic here
    console.log('Learn more clicked');
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
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
}
