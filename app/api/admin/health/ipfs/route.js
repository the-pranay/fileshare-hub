import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { testPinataConnection } from '@/lib/pinataService';

export async function GET(request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }// Test Pinata IPFS connection
    const isConnected = await testPinataConnection();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        status: 'error',
        error: 'Failed to connect to Pinata IPFS',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
      return NextResponse.json({
      success: true,
      status: 'healthy',
      service: 'Pinata IPFS',
      message: 'Successfully connected to Pinata',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Pinata IPFS health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      service: 'Pinata IPFS',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
