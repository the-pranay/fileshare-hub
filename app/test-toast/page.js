'use client';

import { useToast } from '@/app/components/ui/Toast';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export default function ToastTestPage() {
  const { success, error, warning, info } = useToast();

  const testToasts = () => {
    success('Success!', 'This is a success toast message positioned below the navbar');
    
    setTimeout(() => {
      error('Error!', 'This is an error toast message');
    }, 1000);
    
    setTimeout(() => {
      warning('Warning!', 'This is a warning toast message');
    }, 2000);
    
    setTimeout(() => {
      info('Info!', 'This is an info toast message');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Toast Position Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Test the toast notification positioning to ensure they appear below the navbar
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={testToasts}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Test All Toast Types
            </Button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Button 
                onClick={() => success('Success!', 'Upload completed successfully')}
                className="bg-green-600 hover:bg-green-700"
              >
                Success Toast
              </Button>
              
              <Button 
                onClick={() => error('Error!', 'Upload failed - please try again')}
                variant="destructive"
              >
                Error Toast
              </Button>
              
              <Button 
                onClick={() => warning('Warning!', 'File size is close to limit')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Warning Toast
              </Button>
              
              <Button 
                onClick={() => info('Info!', 'Processing your request...')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Info Toast
              </Button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Toast Positioning Check
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>✅ Toasts should appear in the top-right corner</li>
              <li>✅ Toasts should be positioned below the navbar (not overlapping)</li>
              <li>✅ Multiple toasts should stack vertically</li>
              <li>✅ Toasts should have proper spacing from screen edges</li>
              <li>✅ Toasts should be dismissible with X button</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
