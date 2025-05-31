import { NextResponse } from 'next/server';
import { Web3Storage } from 'web3.storage';
import connectDB from '@/lib/mongodb';
import File from '@/lib/models/File';

const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { downloadId } = params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    // Find file by downloadId
    const fileRecord = await File.findOne({ downloadId, isActive: true });
    
    if (!fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if file is expired
    if (fileRecord.isExpired) {
      return NextResponse.json({ error: 'File has expired' }, { status: 410 });
    }

    // Check download limit
    if (fileRecord.isDownloadLimitReached) {
      return NextResponse.json({ error: 'Download limit reached' }, { status: 410 });
    }

    // Check password if required
    if (fileRecord.password && fileRecord.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Increment download count
    fileRecord.downloadCount += 1;
    await fileRecord.save();

    // Get file from IPFS
    const res = await web3Storage.get(fileRecord.cid);
    const files = await res.files();
    const file = files[0];

    if (!file) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

    // Stream the file
    const fileStream = file.stream();
    
    return new Response(fileStream, {
      headers: {
        'Content-Type': fileRecord.mimeType,
        'Content-Disposition': `attachment; filename="${fileRecord.originalName}"`,
        'Content-Length': fileRecord.size.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const { downloadId } = params;
    const { password } = await request.json();

    // Find file by downloadId
    const fileRecord = await File.findOne({ downloadId, isActive: true });
    
    if (!fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if file is expired
    if (fileRecord.isExpired) {
      return NextResponse.json({ error: 'File has expired' }, { status: 410 });
    }

    // Check download limit
    if (fileRecord.isDownloadLimitReached) {
      return NextResponse.json({ error: 'Download limit reached' }, { status: 410 });
    }

    // Check password if required
    if (fileRecord.password && fileRecord.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Return file info for preview
    return NextResponse.json({
      success: true,
      filename: fileRecord.originalName,
      size: fileRecord.size,
      mimeType: fileRecord.mimeType,
      downloadCount: fileRecord.downloadCount,
      maxDownloads: fileRecord.maxDownloads,
      expiresAt: fileRecord.expiresAt,
    });

  } catch (error) {
    console.error('File info error:', error);
    return NextResponse.json(
      { error: 'Failed to get file info', details: error.message },
      { status: 500 }
    );
  }
}