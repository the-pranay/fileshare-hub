import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
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

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user with new password and clear reset token
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });

      return NextResponse.json(
        { message: 'Password reset successfully' },
        { status: 200 }
      );

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
