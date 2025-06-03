import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import File from '@/lib/models/File';
import User from '@/lib/models/User';

export async function GET(request) {  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    await connectToDatabase();

    // Build query
    const query = {};
    if (search) {
      query.filename = { $regex: search, $options: 'i' };
    }
    if (status === 'expired') {
      query.expiresAt = { $lt: new Date() };
    } else if (status === 'active') {
      query.$or = [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null },
      ];
    }

    // Get files with user information
    const files = await File.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },      {
        $addFields: {
          isExpired: {
            $cond: {
              if: { $ifNull: ['$expiresAt', false] },
              then: { $lt: ['$expiresAt', new Date()] },
              else: false,
            },
          },
          uploader: {
            name: '$user.name',
            email: '$user.email',
          },
        },
      },
      {
        $project: {
          user: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await File.countDocuments(query);    return NextResponse.json({
      files,
      totalPages: Math.ceil(total / limit),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Admin files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Delete file
    const file = await File.findByIdAndDelete(fileId);

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Note: In a production environment, you might want to also delete the file from IPFS
    // However, IPFS doesn't allow deletion of pinned content easily

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
