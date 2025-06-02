import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { email, action } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if current user has permission to promote/demote
    if (session) {
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent modifying owner account (except by owner themselves)
    if (user.isOwner && session?.user?.email !== 'thepranay2004@gmail.com') {
      return NextResponse.json(
        { error: 'Cannot modify owner account' },
        { status: 403 }
      );
    }

    // Promote to admin or demote to user (cannot promote to owner)
    let newRole;
    if (action === 'promote') {
      newRole = user.isOwner ? 'owner' : 'admin';
    } else {
      newRole = user.isOwner ? 'owner' : 'user'; // Owner cannot be demoted
    }
    
    user.role = newRole;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `User ${user.name} (${user.email}) role changed to: ${newRole}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOwner: user.isOwner,
      },
    });

  } catch (error) {
    console.error('Role change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if current user has permission to view users
    if (session) {
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    }
    
    // List all users with their roles
    const users = await User.find({}, 'name email role isOwner createdAt').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOwner: user.isOwner,
        createdAt: user.createdAt,
      })),
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
