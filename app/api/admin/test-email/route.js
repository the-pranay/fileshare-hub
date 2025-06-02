import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { sendWelcomeEmail, testEmailConfig } from '../../../../lib/emailService';

export async function POST(request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { email, action } = await request.json();
    
    // Test email configuration only
    if (action === 'test-config') {
      const result = await testEmailConfig();
      return NextResponse.json(result);
    }
    
    // Send test email
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Send test email (using welcome email template for testing)
    await sendWelcomeEmail(email, 'Admin Test');
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
