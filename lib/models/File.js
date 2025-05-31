import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true, // IPFS Content Identifier
  },
  downloadId: {
    type: String,
    required: true,
    unique: true, // Unique short ID for download links
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for anonymous uploads
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null, // null for no expiration
  },
  maxDownloads: {
    type: Number,
    default: null, // null for unlimited downloads
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
FileSchema.index({ downloadId: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ expiresAt: 1 });
FileSchema.index({ isActive: 1 });

// Virtual for checking if file is expired
FileSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for checking if download limit reached
FileSchema.virtual('isDownloadLimitReached').get(function() {
  if (!this.maxDownloads) return false;
  return this.downloadCount >= this.maxDownloads;
});

// Virtual for checking if file is downloadable
FileSchema.virtual('isDownloadable').get(function() {
  return this.isActive && !this.isExpired && !this.isDownloadLimitReached;
});

export default mongoose.models.File || mongoose.model('File', FileSchema);
