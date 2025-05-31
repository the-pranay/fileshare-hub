import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../../../../lib/emailService';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        type: 'password-reset'
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    );

    // Update user with reset token and expiry
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
    });    // In a production environment, you would send an email here
    // For now, we'll just log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    console.log('Password reset link for', email, ':', resetUrl);

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Password reset email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Continue with success response for security (don't reveal email sending failure)
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
