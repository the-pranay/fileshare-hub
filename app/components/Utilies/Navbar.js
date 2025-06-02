'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useToast } from '@/app/components/ui/Toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { success } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      success('Signed out', 'You have been successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                FileShare
                <span className="text-gray-800 dark:text-gray-200">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Upload
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>                  {(session.user?.role === 'admin' || session.user?.role === 'owner') && (
                    <Link
                      href="/admin"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Admin
                    </Link>
                  )}
                  {session.user?.role === 'owner' && (
                    <Link
                      href="/promote-admin"
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      👑 Manage Admins
                    </Link>
                  )}
                </>
              )}
              
              {/* Authentication Button */}
              {session ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md transition-colors duration-200"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-90' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-96 opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2 shadow-lg">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>                {(session.user?.role === 'admin' || session.user?.role === 'owner') && (
                  <Link
                    href="/admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                {session.user?.role === 'owner' && (
                  <Link
                    href="/promote-admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👑 Manage Admins
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile Authentication */}
            {session ? (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.name || session.user?.email}
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}