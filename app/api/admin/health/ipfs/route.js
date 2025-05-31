import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

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

    // Test IPFS/Web3.Storage connection
    const token = process.env.WEB3_STORAGE_TOKEN;
    if (!token) {
      return NextResponse.json({
        success: false,
        status: 'error',
        error: 'WEB3_STORAGE_TOKEN not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test Web3.Storage API
    const response = await fetch('https://api.web3.storage/user/account', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: 'error',
        error: 'Web3.Storage API authentication failed',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      data: {
        account: data.email || 'Connected',
        storageUsed: data.usedStorage || 'Unknown'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('IPFS health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
