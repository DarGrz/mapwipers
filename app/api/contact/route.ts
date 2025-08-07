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

    // Wysyłanie maila do administratora
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
        console.error('❌ Błąd wysyłania maila do administratora:', emailResult.error);
        // Kontynuujemy mimo błędu - nie chcemy blokować użytkownika
      } else {
        console.log('✅ Mail do administratora wysłany pomyślnie');
      }
    } catch (emailError) {
      console.error('❌ Wyjątek podczas wysyłania maila do administratora:', emailError);
      // Kontynuujemy mimo błędu
    }

    // Wysyłanie automatycznej odpowiedzi do klienta
    try {
      const autoReplyResult = await sendAutoReply({
        name,
        email,
        urgency: urgency || 'normal'
      });

      if (!autoReplyResult.success) {
        console.error('❌ Błąd wysyłania automatycznej odpowiedzi:', autoReplyResult.error);
        // Kontynuujemy mimo błędu
      } else {
        console.log('✅ Automatyczna odpowiedź wysłana pomyślnie');
      }
    } catch (autoReplyError) {
      console.error('❌ Wyjątek podczas wysyłania automatycznej odpowiedzi:', autoReplyError);
      // Kontynuujemy mimo błędu
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
