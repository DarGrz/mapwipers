import nodemailer from 'nodemailer';

console.log('📧 Konfiguracja SMTP:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
  hasPass: !!process.env.SMTP_PASS
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, // Stały port dla SSL/TLS
  secure: true, // Wymagane dla portu 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true // Wymagaj prawidłowego certyfikatu SSL
  },
  debug: true,
  logger: true
});

export async function sendAdminNotification({
  orderType,
  companyName,
  orderId
}: {
  orderType: 'profile-removal' | 'review-removal';
  companyName: string;
  orderId: string;
}) {
  const adminEmail = 'support@mapwipers.com'; // Fixed email address

  const orderTypeText = orderType === 'profile-removal' ? 'profile removal' : 'review removal';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject: `⚡ New Order: ${orderTypeText} - ${companyName}`,
    html: `
      <h2>New Order in System</h2>
      <p>Type: <strong>${orderTypeText}</strong></p>
      <p>Company: <strong>${companyName}</strong></p>
      <p>Order ID: <strong>${orderId}</strong></p>
      
    `
  };
  try {
    console.log('📧 Attempting to send notification:', {
      to: adminEmail,
      from: mailOptions.from,
      subject: mailOptions.subject,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP verification error:', verifyError);
      throw verifyError;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Notification sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    });
    return info;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  businessName,
  urgency
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  businessName?: string;
  urgency: string;
}) {
  const adminEmail = 'support@mapwipers.com'; // Default recipient address

  const urgencyText = urgency === 'urgent' ? '🔥 URGENT' : urgency === 'emergency' ? '🚨 EMERGENCY' : '📝 Normal';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    replyTo: email,
    subject: `${urgencyText} - Contact: ${subject} - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D2959; border-bottom: 2px solid #F17313; padding-bottom: 10px;">
          📧 New Contact Message
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          ${businessName ? `<p><strong>Business Name:</strong> ${businessName}</p>` : ''}
          <p><strong>Priority:</strong> <span style="color: ${urgency === 'emergency' ? '#dc2626' : urgency === 'urgent' ? '#f59e0b' : '#059669'};">${urgencyText}</span></p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #0D2959;">Message:</h3>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #F17313; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
          <p><strong>Technical Information:</strong></p>
          <p>Received: ${new Date().toLocaleString('en-US')}</p>
          <p>Environment: ${process.env.NODE_ENV === 'development' ? 'localhost' : 'production'}</p>
        </div>
      </div>
    `
  };
  
  try {
    console.log('📧 Attempting to send contact message:', {
      to: adminEmail,
      from: mailOptions.from,
      subject: mailOptions.subject,
      urgency
    });

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP verification error:', verifyError);
      throw verifyError;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Contact message sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    });
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error sending contact message:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred while sending the message' 
    };
  }
}

// Function for sending automatic reply to client
export async function sendAutoReply({
  name,
  email,
  urgency
}: {
  name: string;
  email: string;
  urgency: string;
}) {
  const responseTime = urgency === 'emergency' ? 'within 1 hour' : 
                      urgency === 'urgent' ? 'within 2-4 hours' : 
                      'within 24-48 hours';

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'MapWipers - Message Received Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0D2959 0%, #F17313 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">MapWipers</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Google Profile Removal</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #0D2959; margin-top: 0;">Thank you for contacting us, ${name}!</h2>
          
          <p>We have received your message and are already processing it. Our expert team will respond to you <strong>${responseTime}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0D2959; margin-top: 0;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>We analyze your case for the best strategy</li>
              <li>We prepare a personalized solution</li>
              <li>We contact you with details and next steps</li>
            </ul>
          </div>
          
          ${urgency === 'emergency' ? `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;"><strong>⚡ Urgent Case</strong> - Our team has been notified about the urgency of your case and will contact you in expedited mode.</p>
          </div>
          ` : ''}
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mapwipers.com'}" 
               style="display: inline-block; background-color: #F17313; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Visit Our Website
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
            <p><strong>MapWipers</strong><br>
            Email: <a href="mailto:support@mapwipers.com">support@mapwipers.com</a><br>
            Website: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mapwipers.com'}">${process.env.NEXT_PUBLIC_SITE_URL || 'mapwipers.com'}</a></p>
            
            <p style="font-size: 12px; margin-top: 15px;">
              This message was sent automatically. If you did not submit a contact form, please ignore this message.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Auto-reply sent successfully:', {
      to: email,
      messageId: info.messageId
    });
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    return { success: false, error };
  }
}
