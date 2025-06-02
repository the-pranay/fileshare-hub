// Set Owner Script for FileShare Hub
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified for script)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  provider: { type: String, default: 'email' },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  isOwner: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  emailVerified: Date,
  storageQuota: { type: Number, default: 1073741824 },
  storageUsed: { type: Number, default: 0 },
  lastLoginAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function setOwner() {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }
    
    const ownerEmail = 'thepranay2004@gmail.com';
    
    // First, remove owner status from any existing owners
    await User.updateMany(
      { isOwner: true },
      { $set: { isOwner: false } }
    );
    
    // Find the owner user
    let owner = await User.findOne({ email: ownerEmail });
    
    if (!owner) {
      console.log(`❌ User ${ownerEmail} not found. Please register this email first.`);
      console.log('To register, go to: http://localhost:3000/auth/signup');
      process.exit(1);
    }
    
    // Set as owner and admin
    await User.updateOne(
      { email: ownerEmail },
      { 
        $set: { 
          role: 'owner',
          isOwner: true 
        } 
      }
    );
    
    console.log(`✅ Successfully set ${ownerEmail} as the permanent owner!`);
    console.log('🏆 Owner privileges include:');
    console.log('  - All admin capabilities');
    console.log('  - Ability to promote/demote other admins');
    console.log('  - Cannot be demoted by other admins');
    console.log('  - Permanent access to all system features');
    console.log('  - Access to "Promote Admin" button on dashboard');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Sign in to your account');
    console.log('  2. Go to your dashboard');
    console.log('  3. You should see "Admin Dashboard" and "Promote Admin" buttons');
    
  } catch (error) {
    console.error('❌ Error setting owner:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

setOwner();
