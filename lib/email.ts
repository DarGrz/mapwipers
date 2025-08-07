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
  const adminEmail = 'd.grzegorczyk@outlook.com'; // Stały adres email

  const orderTypeText = orderType === 'profile-removal' ? 'usunięcia profilu' : 'usunięcia opinii';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject: `⚡ Nowe zamówienie: ${orderTypeText} - ${companyName}`,
    html: `
      <h2>Nowe zamówienie w systemie</h2>
      <p>Typ: <strong>${orderTypeText}</strong></p>
      <p>Firma: <strong>${companyName}</strong></p>
      <p>ID zamówienia: <strong>${orderId}</strong></p>
      
    `
  };
  try {
    console.log('📧 Próba wysłania powiadomienia:', {
      to: adminEmail,
      from: mailOptions.from,
      subject: mailOptions.subject,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    // Weryfikacja połączenia przed wysłaniem
    try {
      await transporter.verify();
      console.log('✅ Połączenie SMTP zweryfikowane pomyślnie');
    } catch (verifyError) {
      console.error('❌ Błąd weryfikacji SMTP:', verifyError);
      throw verifyError;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Powiadomienie wysłane:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    });
    return info;
  } catch (error) {
    console.error('❌ Błąd wysyłki powiadomienia:', error);
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
  const adminEmail = 'd.grzegorczyk@outlook.com'; // Domyślny adres odbiorcy

  const urgencyText = urgency === 'urgent' ? '🔥 PILNE' : urgency === 'emergency' ? '🚨 AWARIA' : '📝 Normalne';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    replyTo: email,
    subject: `${urgencyText} - Kontakt: ${subject} - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D2959; border-bottom: 2px solid #F17313; padding-bottom: 10px;">
          📧 Nowa wiadomość kontaktowa
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Imię i nazwisko:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Temat:</strong> ${subject}</p>
          ${businessName ? `<p><strong>Nazwa firmy:</strong> ${businessName}</p>` : ''}
          <p><strong>Priorytet:</strong> <span style="color: ${urgency === 'emergency' ? '#dc2626' : urgency === 'urgent' ? '#f59e0b' : '#059669'};">${urgencyText}</span></p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #0D2959;">Wiadomość:</h3>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #F17313; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
          <p><strong>Informacje techniczne:</strong></p>
          <p>Otrzymano: ${new Date().toLocaleString('pl-PL')}</p>
          <p>IP: ${process.env.NODE_ENV === 'development' ? 'localhost' : 'production'}</p>
        </div>
      </div>
    `
  };
  
  try {
    console.log('📧 Próba wysłania wiadomości kontaktowej:', {
      to: adminEmail,
      from: mailOptions.from,
      subject: mailOptions.subject,
      urgency
    });

    // Weryfikacja połączenia przed wysłaniem
    try {
      await transporter.verify();
      console.log('✅ Połączenie SMTP zweryfikowane pomyślnie');
    } catch (verifyError) {
      console.error('❌ Błąd weryfikacji SMTP:', verifyError);
      throw verifyError;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Wiadomość kontaktowa wysłana:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    });
    return { success: true, info };
  } catch (error) {
    console.error('❌ Błąd wysyłki wiadomości kontaktowej:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Wystąpił nieznany błąd podczas wysyłania wiadomości' 
    };
  }
}

// Funkcja do wysyłania automatycznej odpowiedzi do klienta
export async function sendAutoReply({
  name,
  email,
  urgency
}: {
  name: string;
  email: string;
  urgency: string;
}) {
  const responseTime = urgency === 'emergency' ? 'w ciągu 1 godziny' : 
                      urgency === 'urgent' ? 'w ciągu 2-4 godzin' : 
                      'w ciągu 24-48 godzin';

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'MapWipers - Potwierdzenie otrzymania wiadomości',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0D2959 0%, #F17313 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">MapWipers</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Profesjonalne usuwanie fałszywych profili Google</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #0D2959; margin-top: 0;">Dziękujemy za kontakt, ${name}!</h2>
          
          <p>Otrzymaliśmy Twoją wiadomość i przetwarzamy ją już teraz. Nasz zespół ekspertów odpowie Ci <strong>${responseTime}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0D2959; margin-top: 0;">Co dzieje się dalej?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Analizujemy Twoją sprawę pod kątem najlepszej strategii działania</li>
              <li>Przygotowujemy spersonalizowane rozwiązanie</li>
              <li>Skontaktujemy się z Tobą z szczegółami i następnymi krokami</li>
            </ul>
          </div>
          
          ${urgency === 'emergency' ? `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;"><strong>⚡ Sprawa pilna</strong> - Nasz zespół został powiadomiony o pilności Twojej sprawy i skontaktuje się z Tobą w trybie przyspieszonym.</p>
          </div>
          ` : ''}
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mapwipers.com'}" 
               style="display: inline-block; background-color: #F17313; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Odwiedź naszą stronę
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
            <p><strong>MapWipers</strong><br>
            Email: <a href="mailto:support@mapwipers.com">support@mapwipers.com</a><br>
            Strona: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mapwipers.com'}">${process.env.NEXT_PUBLIC_SITE_URL || 'mapwipers.com'}</a></p>
            
            <p style="font-size: 12px; margin-top: 15px;">
              Ta wiadomość została wysłana automatycznie. Jeśli nie wysyłałeś(-aś) formularza kontaktowego, zignoruj tę wiadomość.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Automatyczna odpowiedź wysłana:', {
      to: email,
      messageId: info.messageId
    });
    return { success: true, info };
  } catch (error) {
    console.error('❌ Błąd wysyłki automatycznej odpowiedzi:', error);
    return { success: false, error };
  }
}
