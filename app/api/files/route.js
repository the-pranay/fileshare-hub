import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/mongodb';
import File from '@/lib/models/File';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const userId = searchParams.get('userId');

    // Check if user is admin or requesting their own files
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = {};
    
    if (session.user.role !== 'admin') {
      // Regular users can only see their own files
      query.uploadedBy = session.user.id;
    } else if (userId) {
      // Admin can filter by specific user
      query.uploadedBy = userId;
    }

    const skip = (page - 1) * limit;

    const files = await File.find(query)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name email')
      .select('-password'); // Don't include password in response

    const total = await File.countDocuments(query);

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Files fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user owns the file or is admin
    if (file.uploadedBy?.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete - mark as inactive
    file.isActive = false;
    await file.save();

    return NextResponse.json({ success: true, message: 'File deleted successfully' });

  } catch (error) {
    console.error('File delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    const { fileId, action, ...updateData } = await request.json();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user owns the file or is admin
    if (file.uploadedBy?.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle different actions
    switch (action) {
      case 'toggleActive':
        file.isActive = !file.isActive;
        break;
      case 'updateSettings':
        if (updateData.maxDownloads !== undefined) {
          file.maxDownloads = updateData.maxDownloads;
        }
        if (updateData.expiresAt !== undefined) {
          file.expiresAt = updateData.expiresAt;
        }
        if (updateData.password !== undefined) {
          file.password = updateData.password;
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await file.save();

    return NextResponse.json({ 
      success: true, 
      message: 'File updated successfully',
      file: {
        id: file._id,
        isActive: file.isActive,
        maxDownloads: file.maxDownloads,
        expiresAt: file.expiresAt,
        hasPassword: !!file.password,
      }
    });

  } catch (error) {
    console.error('File update error:', error);
    return NextResponse.json(
      { error: 'Failed to update file', details: error.message },
      { status: 500 }
    );
  }
}