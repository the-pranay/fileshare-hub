import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ['github', 'email'],
    required: true,
  },
  providerId: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Date,
    default: null,
  },  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user',
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },  // Storage quota (in bytes)
  storageQuota: {
    type: Number,
    default: 1073741824, // 1GB default
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  // Password for email auth
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    },
  },
  // Password reset tokens
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Virtual for remaining storage
UserSchema.virtual('remainingStorage').get(function() {
  return Math.max(0, this.storageQuota - this.storageUsed);
});

// Virtual for storage usage percentage
UserSchema.virtual('storageUsagePercentage').get(function() {
  return (this.storageUsed / this.storageQuota) * 100;
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
