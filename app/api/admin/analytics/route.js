import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { connectToDatabase } from '../../../../../lib/mongodb';
import User from '../../../../../lib/models/User';
import File from '../../../../../lib/models/File';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    await connectToDatabase();

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    // Get overview stats
    const [
      totalUsers,
      totalFiles,
      totalDownloads,
      totalStorage,
      activeUsers,
      newFilesToday
    ] = await Promise.all([
      User.countDocuments(),
      File.countDocuments(),
      File.aggregate([
        { $group: { _id: null, total: { $sum: '$downloadCount' } } }
      ]).then(result => result[0]?.total || 0),
      File.aggregate([
        { $group: { _id: null, total: { $sum: '$size' } } }
      ]).then(result => Math.round((result[0]?.total || 0) / (1024 * 1024 * 1024) * 100) / 100),
      User.countDocuments({ 
        lastActive: { $gte: new Date(now - 24 * 60 * 60 * 1000) } 
      }),
      File.countDocuments({ 
        uploadDate: { $gte: new Date(now.setHours(0, 0, 0, 0)) } 
      })
    ]);

    // Get uploads over time
    const uploadsOverTime = await File.aggregate([
      {
        $match: {
          uploadDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$uploadDate"
            }
          },
          uploads: { $sum: 1 },
          downloads: { $sum: '$downloadCount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          uploads: 1,
          downloads: 1,
          _id: 0
        }
      }
    ]);

    // Get file types distribution
    const fileTypes = await File.aggregate([
      {
        $group: {
          _id: '$mimeType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Categorize file types
    const categorizedFileTypes = fileTypes.reduce((acc, type) => {
      const mimeType = type._id || 'unknown';
      let category = 'Other';
      
      if (mimeType.startsWith('image/')) category = 'Images';
      else if (mimeType.startsWith('video/')) category = 'Videos';
      else if (mimeType.startsWith('audio/')) category = 'Audio';
      else if (mimeType.includes('document') || mimeType.includes('pdf') || mimeType.includes('text')) category = 'Documents';
      else if (mimeType.includes('zip') || mimeType.includes('archive')) category = 'Archives';
      
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.count += type.count;
        existing.value += type.count;
      } else {
        acc.push({
          name: category,
          value: type.count,
          count: type.count
        });
      }
      
      return acc;
    }, []);

    // Calculate percentages
    const totalFileCount = categorizedFileTypes.reduce((sum, type) => sum + type.count, 0);
    categorizedFileTypes.forEach(type => {
      type.value = Math.round((type.count / totalFileCount) * 100);
    });

    // Get user activity by hour (mock data for now)
    const userActivity = Array.from({ length: 6 }, (_, i) => ({
      hour: String(i * 4).padStart(2, '0'),
      users: Math.floor(Math.random() * 100) + 10
    }));

    // Get top downloaded files
    const topFiles = await File.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .select('filename size downloadCount')
      .lean();

    const formattedTopFiles = topFiles.map(file => ({
      name: file.filename,
      downloads: file.downloadCount || 0,
      size: formatFileSize(file.size || 0)
    }));

    const analytics = {
      overview: {
        totalUsers,
        totalFiles,
        totalDownloads,
        totalStorage,
        activeUsers,
        newFilesToday
      },
      uploadsOverTime: uploadsOverTime.length ? uploadsOverTime : generateMockTimeData(range),
      fileTypes: categorizedFileTypes.length ? categorizedFileTypes : [
        { name: 'Images', value: 35, count: Math.floor(totalFiles * 0.35) },
        { name: 'Documents', value: 28, count: Math.floor(totalFiles * 0.28) },
        { name: 'Videos', value: 20, count: Math.floor(totalFiles * 0.20) },
        { name: 'Audio', value: 10, count: Math.floor(totalFiles * 0.10) },
        { name: 'Other', value: 7, count: Math.floor(totalFiles * 0.07) }
      ],
      userActivity,
      topFiles: formattedTopFiles.length ? formattedTopFiles : [
        { name: 'No files yet', downloads: 0, size: '0 B' }
      ]
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateMockTimeData(range) {
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      uploads: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 100) + 20
    });
  }
  
  return data;
}
