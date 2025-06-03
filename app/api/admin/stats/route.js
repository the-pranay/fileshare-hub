import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import File from '@/lib/models/File';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);    if (!session || (session.user.role !== 'admin' && session.user.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );    }

    await connectToDatabase();

    // Get basic counts
    const [totalUsers, totalFiles] = await Promise.all([
      User.countDocuments(),
      File.countDocuments(),
    ]);

    // Get total downloads
    const downloadStats = await File.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloadCount' },
          totalStorage: { $sum: '$size' },
        },
      },
    ]);

    const stats = {
      totalUsers,
      totalFiles,
      totalDownloads: downloadStats[0]?.totalDownloads || 0,
      storageUsed: downloadStats[0]?.totalStorage || 0,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
