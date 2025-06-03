import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import File from '@/lib/models/File';
import User from '@/lib/models/User';

export async function GET() {
  try {
    // Test database connection
    await connectToDatabase();
    
    // Get basic stats
    const totalFiles = await File.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeFiles = await File.countDocuments({ isActive: true });
    
    // Get recent upload
    const recentFile = await File.findOne().sort({ uploadedAt: -1 }).select('uploadedAt');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        totalFiles,
        totalUsers,
        activeFiles,
        lastUpload: recentFile?.uploadedAt || null
      },
      timestamp: new Date().toISOString(),
      environment: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        nextauthUrl: process.env.NEXTAUTH_URL || 'Not set',
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        pinataApiKey: process.env.PINATA_API_KEY ? 'Set' : 'Not set'
      }
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name,
      timestamp: new Date().toISOString(),
      environment: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        nextauthUrl: process.env.NEXTAUTH_URL || 'Not set',
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        pinataApiKey: process.env.PINATA_API_KEY ? 'Set' : 'Not set'
      }
    }, { status: 500 });
  }
}