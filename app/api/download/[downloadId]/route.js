import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import File from '@/lib/models/File';

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
    }    // Increment download count
    fileRecord.downloadCount += 1;
    await fileRecord.save();

    // Get file from IPFS via Pinata gateway
    const ipfsUrl = fileRecord.ipfsUrl || `${process.env.PINATA_GATEWAY_URL}${fileRecord.cid}`;
    
    try {
      const response = await fetch(ipfsUrl);
      
      if (!response.ok) {
        return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
      }      // Get the file data
      const fileData = await response.arrayBuffer();
      
      return new Response(fileData, {
        headers: {
          'Content-Type': fileRecord.mimeType,
          'Content-Disposition': `attachment; filename="${fileRecord.originalName}"`,
          'Content-Length': fileRecord.size.toString(),
        },
      });
      
    } catch (fetchError) {
      console.error('IPFS fetch error:', fetchError);
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

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