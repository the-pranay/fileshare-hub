// Script to set permanent owner for FileShare Hub
const connectToDatabase = require('../lib/mongodb.js').default;
const User = require('../lib/models/User.js').default;
require('dotenv').config({ path: '.env.local' });

async function setOwner() {
  try {
    await connectToDatabase();
    
    const ownerEmail = 'thepranay2004@gmail.com';
    
    // First, remove owner status from any existing owners
    await User.updateMany(
      { isOwner: true },
      { $set: { isOwner: false } }
    );
    
    // Find or create the owner user
    let owner = await User.findOne({ email: ownerEmail });
    
    if (!owner) {
      console.log(`User ${ownerEmail} not found. Please register this email first.`);
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
    
    console.log(`✅ Successfully set ${ownerEmail} as the permanent owner and admin!`);
    console.log('Owner privileges include:');
    console.log('- All admin capabilities');
    console.log('- Ability to promote/demote other admins');
    console.log('- Cannot be demoted by other admins');
    console.log('- Permanent access to all system features');
    
  } catch (error) {
    console.error('❌ Error setting owner:', error);
  } finally {
    process.exit(0);
  }
}

setOwner();
