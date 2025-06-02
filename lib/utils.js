import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Generate unique download ID
export function generateDownloadId() {
  return crypto.randomBytes(8).toString('hex');
}

// Generate secure UUID
export function generateUUID() {
  return uuidv4();
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format bytes (alias for formatFileSize for compatibility)
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format date
export function formatDate(date, options = {}) {
  if (!date) return 'Unknown';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  return new Date(date).toLocaleDateString('en-US', formatOptions);
}

// Validate file type
export function isValidFileType(mimeType, allowedTypes = []) {
  if (allowedTypes.length === 0) return true; // Allow all if no restrictions
  return allowedTypes.includes(mimeType);
}

// Check if file size is within limit
export function isValidFileSize(size, maxSize = 52428800) { // 50MB default
  return size <= maxSize;
}

// Generate expiration date
export function generateExpirationDate(hours = 24) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

// Sanitize filename
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Get file extension
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

// Generate QR code data URL
export function generateQRCodeURL(text) {
  // This will be implemented with the qrcode library
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}

// Get client IP address
export function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.ip ||
         'unknown';
}
