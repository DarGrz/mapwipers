import { NextRequest, NextResponse } from 'next/server';

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

    // Here you would typically:
    // 1. Send an email notification to your support team
    // 2. Store the message in a database
    // 3. Send an auto-reply to the customer
    // 4. Log the inquiry for tracking purposes

    // For now, we'll just log the data and return success
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      businessName,
      urgency,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you might want to:
    // - Send email using a service like Resend, SendGrid, or AWS SES
    // - Store in a database like Supabase (which you already have set up)
    // - Send Slack/Discord notifications for urgent inquiries
    // - Create a ticket in your support system

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
