'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    businessName: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could show an error message to the user here
      alert('Sorry, there was an error submitting your message. Please try again or email us directly at support@mapwipers.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white text-black font-[family-name:var(--font-geist-sans)]">
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#0D2959] mb-4">Message Sent Successfully!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for contacting us. We&apos;ve received your message and will get back to you within 24 hours.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200 mb-6">
              <p className="text-sm text-gray-600">
                <strong>What happens next?</strong><br/>
                Our support team will review your message and respond via email. For urgent GMB profile issues, we&apos;ll prioritize your case and contact you within 2-4 hours.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#F17313] text-white rounded-full font-semibold hover:bg-[#F17313]/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D2959] mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Have questions about our GMB profile removal services? Need help with a specific case? 
            Our expert team is here to assist you.
          </p>
          <div className="w-20 h-1 bg-[#F17313] mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0D2959] mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#0D2959] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0D2959] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-[#0D2959] mb-2">
                  Business Name (if applicable)
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>

              {/* Subject and Urgency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#0D2959] mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent"
                    placeholder="Brief subject of your inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-[#0D2959] mb-2">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent"
                  >
                    <option value="normal">Normal (24-48 hours)</option>
                    <option value="urgent">Urgent (2-4 hours)</option>
                    <option value="emergency">Emergency (Within 1 hour)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#0D2959] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F17313] focus:border-transparent resize-vertical"
                  placeholder="Please describe your situation in detail. Include the Google Business Profile URL if you have one, and any specific issues you're experiencing."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-[#F17313] text-white font-semibold rounded-lg hover:bg-[#F17313]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Response Times */}
            <div className="bg-gradient-to-br from-[#0D2959]/5 to-[#F17313]/5 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-[#0D2959] mb-6">Response Times</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-[#0D2959]">General Inquiries</p>
                    <p className="text-sm text-gray-600">24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-[#0D2959]">Urgent Cases</p>
                    <p className="text-sm text-gray-600">2-4 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-[#0D2959]">Emergency Support</p>
                    <p className="text-sm text-gray-600">Within 1 hour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Contact Methods */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-[#0D2959] mb-6">Other Ways to Reach Us</h3>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#F17313]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F17313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0D2959]">Email Support</h4>
                    <p className="text-gray-600 text-sm mb-2">For detailed inquiries and documentation</p>
                    <a href="mailto:support@mapwipers.com" className="text-[#F17313] hover:underline font-medium">
                      support@mapwipers.com
                    </a>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#0D2959]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0D2959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0D2959]">Live Chat</h4>
                    <p className="text-gray-600 text-sm mb-2">Available during business hours</p>
                    <button className="text-[#0D2959] hover:underline font-medium">
                      Start Chat (Mon-Fri 9AM-6PM EST)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-r from-[#F17313]/10 to-[#0D2959]/10 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#0D2959] mb-2">Need Quick Answers?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check our FAQ section for instant answers to common questions about GMB profile removal.
              </p>
              <Link
                href="/#faq"
                className="inline-flex items-center text-[#F17313] hover:underline font-medium text-sm"
              >
                Visit FAQ Section
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#0D2959] to-[#F17313] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Don&apos;t wait for fake profiles to damage your business reputation. Start your case today.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-[#0D2959] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Case Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
