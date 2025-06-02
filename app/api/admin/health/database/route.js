import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Test database connection
    await connectToDatabase();
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
