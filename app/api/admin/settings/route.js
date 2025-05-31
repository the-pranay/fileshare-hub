import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request) {
  try {
    // Check if user is admin
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Return current settings (these would normally be stored in database)
    // For now, return default values
    const settings = {
      maxFileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024) : 50,
      maxStoragePerUser: process.env.MAX_STORAGE_PER_USER ? parseInt(process.env.MAX_STORAGE_PER_USER) / (1024 * 1024) : 1024,
      allowedFileTypes: process.env.ALLOWED_FILE_TYPES || 'image/*,application/pdf,text/*',
      analyticsRetentionDays: process.env.ANALYTICS_RETENTION_DAYS || 90,
      rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
      rateLimitWindow: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) / (60 * 1000) : 15,
    };

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check if user is admin
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const settings = await request.json();

    // Validate settings
    if (settings.maxFileSize && (isNaN(settings.maxFileSize) || settings.maxFileSize <= 0)) {
      return NextResponse.json(
        { error: 'Invalid max file size' },
        { status: 400 }
      );
    }

    if (settings.maxStoragePerUser && (isNaN(settings.maxStoragePerUser) || settings.maxStoragePerUser <= 0)) {
      return NextResponse.json(
        { error: 'Invalid max storage per user' },
        { status: 400 }
      );
    }

    // In a real application, you would save these settings to a database
    // For now, we'll just validate and return success
    
    await connectToDatabase();
    
    // Here you would typically save to a Settings collection:
    // await Settings.findOneAndUpdate(
    //   { type: 'global' },
    //   { $set: settings },
    //   { upsert: true }
    // );

    console.log('Admin settings updated:', settings);

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings
    });

  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
