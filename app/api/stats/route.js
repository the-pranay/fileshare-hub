import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import File from '@/lib/models/File';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get total statistics
    const totalFiles = await File.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeFiles = await File.countDocuments({ isActive: true });
    const totalDownloads = await File.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);
    
    // Calculate uptime (assuming service started when first file was uploaded)
    const firstFile = await File.findOne().sort({ uploadedAt: 1 }).select('uploadedAt');
    const uptimeStart = firstFile?.uploadedAt || new Date();
    const uptimeDays = Math.floor((new Date() - new Date(uptimeStart)) / (1000 * 60 * 60 * 24));
    
    // Get recent activity (files uploaded in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUploads = await File.countDocuments({ 
      uploadedAt: { $gte: oneDayAgo } 
    });
    
    // Get user growth (users registered in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalFiles,
        totalUsers,
        activeFiles,
        totalDownloads: totalDownloads[0]?.total || 0,
        uptimeDays: Math.max(uptimeDays, 1), // At least 1 day
        recentUploads,
        newUsers,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Stats API error:', error);
    
    // Return fallback stats if database fails
    return NextResponse.json({
      success: false,
      stats: {
        totalFiles: 1000, // Fallback numbers
        totalUsers: 250,
        activeFiles: 850,
        totalDownloads: 5000,
        uptimeDays: 30,
        recentUploads: 12,
        newUsers: 5,
        lastUpdated: new Date().toISOString()
      },
      error: 'Using fallback stats'
    });
  }
}
