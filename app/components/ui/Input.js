'use client';

export default function Input({ 
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  ...props 
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    dark:bg-gray-800 dark:border-gray-600 dark:text-white
    ${error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
