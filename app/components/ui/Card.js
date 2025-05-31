export default function Card({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  border = true,
  ...props 
}) {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg transition-all duration-200';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl'
  };
  
  const borderClass = border ? 'border border-gray-200 dark:border-gray-700' : '';
  
  const classes = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${borderClass} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
