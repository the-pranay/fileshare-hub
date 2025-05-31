// Error handling utilities for FileShare Hub

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export const ErrorTypes = {
  // Authentication errors
  UNAUTHORIZED: { code: 'UNAUTHORIZED', statusCode: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', statusCode: 403 },
  INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', statusCode: 401 },
  TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', statusCode: 401 },
  
  // Validation errors
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', statusCode: 400 },
  INVALID_EMAIL: { code: 'INVALID_EMAIL', statusCode: 400 },
  WEAK_PASSWORD: { code: 'WEAK_PASSWORD', statusCode: 400 },
  
  // File errors
  FILE_TOO_LARGE: { code: 'FILE_TOO_LARGE', statusCode: 413 },
  INVALID_FILE_TYPE: { code: 'INVALID_FILE_TYPE', statusCode: 400 },
  FILE_NOT_FOUND: { code: 'FILE_NOT_FOUND', statusCode: 404 },
  UPLOAD_FAILED: { code: 'UPLOAD_FAILED', statusCode: 500 },
  
  // User errors
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404 },
  USER_EXISTS: { code: 'USER_EXISTS', statusCode: 409 },
  
  // Database errors
  DATABASE_ERROR: { code: 'DATABASE_ERROR', statusCode: 500 },
  CONNECTION_ERROR: { code: 'CONNECTION_ERROR', statusCode: 503 },
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', statusCode: 429 },
  
  // IPFS/Web3 errors
  IPFS_ERROR: { code: 'IPFS_ERROR', statusCode: 502 },
  STORAGE_ERROR: { code: 'STORAGE_ERROR', statusCode: 500 },
};

// Create specific error instances
export const createError = (type, message, details = null) => {
  const error = new AppError(message, type.statusCode, type.code);
  if (details) {
    error.details = details;
  }
  return error;
};

// Error response formatter for API routes
export const formatErrorResponse = (error) => {
  // Development vs production error details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response = {
    error: {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    }
  };

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    response.error.stack = error.stack;
  }

  // Add details if available
  if (error.details) {
    response.error.details = error.details;
  }

  return response;
};

// MongoDB error handler
export const handleMongoError = (error) => {
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return createError(
      ErrorTypes.USER_EXISTS,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    );
  }
  
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message);
    return createError(
      ErrorTypes.VALIDATION_ERROR,
      `Validation failed: ${messages.join(', ')}`
    );
  }
  
  if (error.name === 'CastError') {
    return createError(
      ErrorTypes.VALIDATION_ERROR,
      'Invalid ID format'
    );
  }
  
  return createError(
    ErrorTypes.DATABASE_ERROR,
    'Database operation failed'
  );
};

// File upload error handler
export const handleUploadError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return createError(
      ErrorTypes.FILE_TOO_LARGE,
      `File too large. Maximum size is ${formatBytes(error.limit)}`
    );
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return createError(
      ErrorTypes.VALIDATION_ERROR,
      'Too many files uploaded at once'
    );
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return createError(
      ErrorTypes.VALIDATION_ERROR,
      'Unexpected file field'
    );
  }
  
  return createError(
    ErrorTypes.UPLOAD_FAILED,
    'File upload failed'
  );
};

// IPFS/Web3 error handler
export const handleIPFSError = (error) => {
  if (error.message?.includes('429')) {
    return createError(
      ErrorTypes.RATE_LIMIT_EXCEEDED,
      'IPFS rate limit exceeded. Please try again later.'
    );
  }
  
  if (error.message?.includes('413')) {
    return createError(
      ErrorTypes.FILE_TOO_LARGE,
      'File too large for IPFS storage'
    );
  }
  
  if (error.message?.includes('401') || error.message?.includes('403')) {
    return createError(
      ErrorTypes.UNAUTHORIZED,
      'IPFS authentication failed'
    );
  }
  
  return createError(
    ErrorTypes.IPFS_ERROR,
    'IPFS storage operation failed'
  );
};

// Email service error handler
export const handleEmailError = (error) => {
  if (error.code === 'EAUTH') {
    return createError(
      ErrorTypes.UNAUTHORIZED,
      'Email authentication failed'
    );
  }
  
  if (error.code === 'ECONNECTION') {
    return createError(
      ErrorTypes.CONNECTION_ERROR,
      'Failed to connect to email server'
    );
  }
  
  return createError(
    ErrorTypes.STORAGE_ERROR,
    'Email service unavailable'
  );
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError(
      ErrorTypes.INVALID_EMAIL,
      'Please enter a valid email address'
    );
  }
  return true;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw createError(
      ErrorTypes.WEAK_PASSWORD,
      'Password must be at least 6 characters long'
    );
  }
  
  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    throw createError(
      ErrorTypes.WEAK_PASSWORD,
      'Password must contain at least one letter and one number'
    );
  }
  
  return true;
};

export const validateFileType = (mimeType, allowedTypes = []) => {
  if (allowedTypes.length === 0) {
    // Default allowed types
    allowedTypes = [
      'image/*',
      'application/pdf',
      'text/*',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }
  
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.replace('/*', '/'));
    }
    return mimeType === type;
  });
  
  if (!isAllowed) {
    throw createError(
      ErrorTypes.INVALID_FILE_TYPE,
      `File type ${mimeType} is not allowed`
    );
  }
  
  return true;
};

// Utility functions
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Logger for errors
export const logError = (error, context = {}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', logData);
  } else {
    // In production, you might want to send to a logging service
    console.error(JSON.stringify(logData));
  }
};

// Rate limiting helper
export const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamps] of requests.entries()) {
      const filtered = timestamps.filter(time => time > windowStart);
      if (filtered.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, filtered);
      }
    }
    
    // Check current user
    const userRequests = requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      throw createError(
        ErrorTypes.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded. Maximum ${maxRequests} requests per ${Math.round(windowMs / 60000)} minutes.`
      );
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};
