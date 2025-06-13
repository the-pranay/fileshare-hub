import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0">
          {/* Copyright and Developer Credit */}
          <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1 text-center sm:text-left">
            <div>© 2025 FileShareHub. All rights reserved.</div>
            <div className="mt-1">
              Developed by{' '}
              <a
                href="https://github.com/the-pranay"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                the-pranay
              </a>
            </div>
          </div>

          {/* Links and Icons */}
          <div className="flex items-center space-x-6 order-1 sm:order-2">            {/* Social/GitHub Link */}
            <a
              href="https://github.com/the-pranay/fileshare-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
              aria-label="View FileShare Hub on GitHub"
              title="View source code on GitHub"
            >
              <svg
                className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>            {/* Divider */}
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Footer Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/upload"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Upload Files
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}