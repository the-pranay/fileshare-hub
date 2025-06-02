// Script to promote a user to admin role
// Usage: node scripts/make-admin.js your-email@example.com

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// User model schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: null },
  provider: { type: String, enum: ['github', 'email'], required: true },
  providerId: { type: String, default: null },
  emailVerified: { type: Date, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: Date.now },
  storageQuota: { type: Number, default: 1073741824 },
  storageUsed: { type: Number, default: 0 },
  password: {
    type: String,
    required: function() { return this.provider === 'email'; }
  },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function makeAdmin(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`User with email ${email} not found!`);
      console.log('Available users:');
      const users = await User.find({}, 'email name role');
      users.forEach(u => console.log(`- ${u.email} (${u.name}) - Role: ${u.role}`));
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ Successfully promoted ${user.name} (${user.email}) to admin role!`);
    console.log(`User can now access admin panel at: http://localhost:3000/admin`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address:');
  console.error('Usage: node scripts/make-admin.js your-email@example.com');
  process.exit(1);
}

makeAdmin(email);
