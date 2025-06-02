import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadToPinata } from '@/lib/pinataService';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import connectDB from '@/lib/mongodb';
import File from '@/lib/models/File';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  createError, 
  ErrorTypes, 
  formatErrorResponse, 
  handleMongoError, 
  handleUploadError, 
  handleIPFSError,
  validateFileType,
  logError 
} from '@/lib/errorHandler';

export async function POST(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file');
    const maxDownloads = formData.get('maxDownloads');
    const expiresIn = formData.get('expiresIn'); // in hours
    const password = formData.get('password');
    
    if (!file) {
      throw createError(ErrorTypes.VALIDATION_ERROR, 'No file provided');
    }

    // Validate file size (50MB limit)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 52428800;
    if (file.size > maxSize) {
      throw createError(
        ErrorTypes.FILE_TOO_LARGE, 
        `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`
      );
    }

    // Validate file type
    try {
      validateFileType(file.type);
    } catch (validationError) {
      throw validationError;
    }    // Get user session (optional for anonymous uploads)
    const session = await getServerSession(authOptions);
    
    // Convert file to buffer for Pinata upload
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to IPFS via Pinata
    let uploadResult;
    try {
      uploadResult = await uploadToPinata(buffer, file.name, {
        size: file.size,
        mimeType: file.type,
        uploadedBy: session?.user?.email || 'anonymous'
      });
    } catch (ipfsError) {
      throw handleIPFSError(ipfsError);
    }
    
    // Generate unique download ID
    const downloadId = uuidv4().substring(0, 8);
    
    // Calculate expiration date
    let expiresAt = null;
    if (expiresIn && parseInt(expiresIn) > 0) {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    }    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';    // Create file record
    const fileRecord = new File({
      filename: file.name,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      cid: uploadResult.ipfsHash,
      downloadId,
      uploadedBy: session?.user?.id || null,
      expiresAt,
      maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
      password: password || null,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || '',
      ipfsUrl: uploadResult.url,
      gateway: uploadResult.gateway,
    });

    try {
      await fileRecord.save();
    } catch (mongoError) {
      throw handleMongoError(mongoError);
    }

    // Generate download URL and QR code
    const downloadUrl = `${process.env.NEXTAUTH_URL}/download/${downloadId}`;
    let qrCodeData;
    try {
      qrCodeData = await QRCode.toDataURL(downloadUrl);
    } catch (qrError) {
      // QR code generation is not critical, log error but continue
      logError(qrError, { context: 'QR code generation', downloadId });
      qrCodeData = null;
    }    return NextResponse.json({
      success: true,
      downloadId,
      downloadUrl,
      qrCode: qrCodeData,
      fileId: fileRecord._id,
      filename: file.name,
      size: file.size,
      cid: uploadResult.ipfsHash,
      ipfsUrl: uploadResult.url,
      expiresAt,
      maxDownloads,
    });

  } catch (error) {
    logError(error, { 
      context: 'File upload',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1'
    });

    // Handle specific error types
    if (error.isOperational) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    const unexpectedError = createError(
      ErrorTypes.UPLOAD_FAILED,
      'An unexpected error occurred during upload'
    );
    
    return NextResponse.json(
      formatErrorResponse(unexpectedError),
      { status: 500 }
    );
  }
}