import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, sendAutoReply } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, businessName, urgency } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log('📧 Contact form submission:', {
      name,
      email,
      subject,
      message,
      businessName,
      urgency,
      timestamp: new Date().toISOString(),
    });

    // Sending email to administrator
    try {
      const emailResult = await sendContactEmail({
        name,
        email,
        subject,
        message,
        businessName,
        urgency: urgency || 'normal'
      });

      if (!emailResult.success) {
        console.error('❌ Error sending email to administrator:', emailResult.error);
        // Continue despite error - we don't want to block the user
      } else {
        console.log('✅ Email to administrator sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Exception during admin email sending:', emailError);
      // Continue despite error
    }

    // Sending automatic reply to client
    try {
      const autoReplyResult = await sendAutoReply({
        name,
        email,
        urgency: urgency || 'normal'
      });

      if (!autoReplyResult.success) {
        console.error('❌ Error sending auto-reply:', autoReplyResult.error);
        // Continue despite error
      } else {
        console.log('✅ Auto-reply sent successfully');
      }
    } catch (autoReplyError) {
      console.error('❌ Exception during auto-reply sending:', autoReplyError);
      // Continue despite error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
