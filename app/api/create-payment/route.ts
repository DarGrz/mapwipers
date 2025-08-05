import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logOrder, getRequestInfo } from '@/lib/logging';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      orderData, 
      formData,
      totalPrice,
      serviceType 
    } = body;

    if (!orderData || !formData || !totalPrice || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    const customerData: Stripe.CustomerCreateParams = {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      metadata: {
        orderType: 'gmb_service',
        businessName: orderData.selectedBusiness.name,
        serviceType: serviceType,
        yearProtection: orderData.yearProtection ? 'true' : 'false',
        expressService: orderData.expressService ? 'true' : 'false'
      }
    };

    // Add company information if provided
    if (formData.isCompany && formData.companyName) {
      customerData.address = {
        line1: formData.companyAddress,
        city: formData.companyCity,
        postal_code: formData.companyZip,
        country: formData.companyCountry === 'Poland' ? 'PL' : 'US', // Map country names to ISO codes
      };
      
      // Ensure metadata is an object before adding properties
      if (customerData.metadata === '') {
        customerData.metadata = {};
      }
      
      (customerData.metadata as Record<string, string>).companyName = formData.companyName;
      (customerData.metadata as Record<string, string>).isCompany = 'true';
      if (formData.companyTaxId) {
        (customerData.metadata as Record<string, string>).taxId = formData.companyTaxId;
      }
    }

    const customer = await stripe.customers.create(customerData);

    // Create line items for the service
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Google Maps ${serviceType === 'remove' ? 'Profile Removal' : 'Profile Reset'} Service`,
            description: `${serviceType === 'remove' ? 'Complete removal' : 'Reset reviews'} for ${orderData.selectedBusiness.name}`,
            metadata: {
              businessName: orderData.selectedBusiness.name,
              serviceType: serviceType
            }
          },
          unit_amount: Math.round(totalPrice * 100), // Convert to cents
        },
        quantity: 1,
      }
    ];

    // Add addon line items if selected
    if (orderData.yearProtection) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: '1-Year Protection',
            description: 'Protection against future negative reviews for 1 year'
          },
          unit_amount: Math.round(199 * 100), // Assuming $199 for year protection
        },
        quantity: 1,
      });
    }

    if (orderData.expressService) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Express Service',
            description: 'Priority processing within 24-48 hours'
          },
          unit_amount: Math.round(99 * 100), // Assuming $99 for express service
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?canceled=true`,
      metadata: {
        orderId: `ORDER_${Date.now()}`,
        businessName: orderData.selectedBusiness.name,
        serviceType: serviceType,
        customerEmail: formData.email
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Google Maps ${serviceType === 'remove' ? 'Profile Removal' : 'Profile Reset'} Service`,
          custom_fields: [
            {
              name: "Business Name",
              value: orderData.selectedBusiness.name
            },
            {
              name: "Service Type",
              value: serviceType === 'remove' ? 'Complete Profile Removal' : 'Profile Reset (Reviews Only)'
            },
            {
              name: "Processing Time",
              value: orderData.expressService 
                ? "24-48 hours (Express)" 
                : serviceType === 'reset' 
                  ? "3-5 business days" 
                  : "5-7 business days"
            }
          ],
          footer: "Thank you for choosing MapWipers. Service will begin immediately after payment confirmation.",
          metadata: {
            orderId: `ORDER_${Date.now()}`,
            businessPlaceId: orderData.selectedBusiness.place_id || ''
          }
        }
      },
      payment_intent_data: {
        metadata: {
          orderId: `ORDER_${Date.now()}`,
          businessName: orderData.selectedBusiness.name,
          serviceType: serviceType
        }
      }
    });

    console.log('Stripe checkout session created:', {
      sessionId: session.id,
      customerId: customer.id,
      business: orderData.selectedBusiness.name,
      service: serviceType,
      amount: totalPrice
    });

    // Get request info for logging
    const requestInfo = getRequestInfo(req);
    const sessionId = req.cookies.get('session_id')?.value;

    // Log the order
    const addons = [];
    if (orderData.yearProtection) addons.push('yearProtection');
    if (orderData.expressService) addons.push('expressService');

    const orderResult = await logOrder({
      session_id: sessionId,
      customer_email: formData.email,
      customer_name: `${formData.firstName} ${formData.lastName}`,
      company_name: formData.isCompany ? formData.companyName : undefined,
      nip: formData.isCompany ? formData.companyTaxId : undefined,
      phone: formData.phone,
      service_type: serviceType,
      addons: addons,
      total_amount: totalPrice,
      currency: 'USD',
      payment_status: 'pending',
      stripe_session_id: session.id,
      // GMB/Business information
      business_place_id: orderData.selectedBusiness.id,
      business_name: orderData.selectedBusiness.name,
      business_address: orderData.selectedBusiness.formatted_address || orderData.selectedBusiness.address,
      business_phone: orderData.selectedBusiness.formatted_phone_number || orderData.selectedBusiness.phoneNumber,
      business_website: orderData.selectedBusiness.website,
      business_rating: orderData.selectedBusiness.rating,
      business_google_url: orderData.selectedBusiness.googleMapsUrl,
      ...requestInfo
    });

    if (!orderResult.success) {
      console.error('Failed to log order:', orderResult.error);
      // Still continue with the payment process, but log the error
    } else {
      console.log('Order logged successfully:', orderResult.data);
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      customerId: customer.id,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Stripe payment processing error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment processing failed: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process payment. Please try again.' },
      { status: 500 }
    );
  }
}
