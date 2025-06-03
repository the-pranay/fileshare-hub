import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import QRCode from 'qrcode';
import connectToDatabase from '@/lib/mongodb';
import File from '@/lib/models/File';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Find the file
    let query = { _id: fileId };
    
    // Non-admin users can only regenerate QR codes for their own files
    if (session.user.role !== 'admin') {
      query.uploadedBy = session.user.id;
    }
    
    const file = await File.findOne(query);
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Generate QR code
    const downloadUrl = `${process.env.NEXTAUTH_URL}/download/${file.downloadId}`;
    const qrCodeData = await QRCode.toDataURL(downloadUrl);
    
    // Update the file with the QR code
    await File.findByIdAndUpdate(fileId, {
      qrCode: qrCodeData
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeData,
      message: 'QR code generated successfully'
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
