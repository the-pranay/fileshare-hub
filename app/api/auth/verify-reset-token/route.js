import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '../../../../lib/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return NextResponse.json(
          { error: 'Invalid token type' },
          { status: 400 }
        );
      }

      await connectToDatabase();

      // Check if user exists and token matches
      const user = await User.findById(decoded.userId);
      
      if (!user || user.resetToken !== token || user.resetTokenExpiry < new Date()) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { valid: true, email: user.email },
        { status: 200 }
      );

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
