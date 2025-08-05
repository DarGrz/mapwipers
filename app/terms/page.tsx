import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#0D2959]">Terms and Conditions</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">1. Company Information</h2>
          <p>
            These Terms and Conditions govern your use of services provided by:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <p><strong>Company:</strong> Dariusz Grzegorczyk</p>
            <p><strong>Address:</strong> Osiedle Oświecenia 57, 31-636 Kraków, Polska</p>
            <p><strong>Email:</strong> support@mapwipers.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">2. Service Description</h2>
          <p>
            MapWipers provides Google Business Profile management services, including but not limited to:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Google Business Profile removal services</li>
            <li>Google Business Profile reset services</li>
            <li>Related consultation and support services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">3. Acceptance of Terms</h2>
          <p>
            By using our services, you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you may not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">4. Service Requirements</h2>
          <p>
            Our services are exclusively available to businesses and companies. Individual consumers 
            are not eligible for our services. You must provide:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Valid company information and documentation</li>
            <li>Proof of business registration</li>
            <li>Valid Tax ID/VAT number</li>
            <li>Authorized representative contact information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">5. Payment Terms</h2>
          <p>
            Payment is required upfront before service commencement. We accept payments through 
            our secure payment processors. All prices are listed in PLN and include applicable taxes 
            where required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">6. Service Delivery</h2>
          <p>
            We will make reasonable efforts to complete services within the estimated timeframe. 
            However, completion times may vary depending on Google&apos;s response times and other 
            factors beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">7. Limitation of Liability</h2>
          <p>
            Our liability is limited to the amount paid for our services. We are not responsible 
            for any indirect, incidental, or consequential damages arising from the use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">8. Refund Policy</h2>
          <p>
            Refunds may be considered on a case-by-case basis. Please contact our support team 
            at support@mapwipers.com to discuss any concerns about our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">9. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to understand 
            how we collect, use, and protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">10. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by Polish law. Any disputes will be 
            resolved in the competent courts of Kraków, Poland.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">11. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-2">
            <p><strong>Email:</strong> support@mapwipers.com</p>
            <p><strong>Address:</strong> Osiedle Oświecenia 57, 31-636 Kraków, Polska</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-[#0D2959]">12. Updates to Terms</h2>
          <p>
            We reserve the right to update these Terms and Conditions at any time. 
            Changes will be effective immediately upon posting on our website.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
