import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate both email and password
    if (email !== adminEmail || password !== adminPassword) {
      console.log('Auth failed - Email or password mismatch');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Auth successful - Setting cookie');

    // Create response with success
    const response = NextResponse.json({ success: true });
    
    // Set secure session cookie (valid for 1 hour)
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/' // Allow access from all paths
    });

    console.log('Cookie set successfully');

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check authentication status
export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session');
    
    if (adminSession?.value === 'authenticated') {
      return NextResponse.json({ authenticated: true });
    }
    
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Admin auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

// DELETE endpoint for logout
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the admin session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Immediately expire
      path: '/' // Match the path used when setting
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
