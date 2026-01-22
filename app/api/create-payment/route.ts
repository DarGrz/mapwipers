import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getRequestInfo, logOrder } from '@/lib/logging';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderData,
      formData,
      totalPrice,
      serviceType,
      locale
    } = body;

    if (!orderData || !formData || !totalPrice || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const currency = 'usd';
    const finalPrice = totalPrice;

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
          currency: currency,
          product_data: {
            name: `Google Maps ${serviceType === 'remove' ? 'Profile Removal' : 'Profile Reset'} Service`,
            description: `${serviceType === 'remove' ? 'Complete removal' : 'Reset reviews'} for ${orderData.selectedBusiness.name}`,
            metadata: {
              businessName: orderData.selectedBusiness.name,
              serviceType: serviceType
            }
          },
          unit_amount: Math.round(finalPrice * 100), // Convert to cents/grosze
        },
        quantity: 1,
      }
    ];

    // Add addon line items if selected
    if (orderData.yearProtection) {
      const protectionPrice = 199;
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: '1-Year Protection',
            description: 'Protection against future negative reviews for 1 year'
          },
          unit_amount: Math.round(protectionPrice * 100),
        },
        quantity: 1,
      });
    }

    if (orderData.expressService) {
      const expressPrice = 99;
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: 'Express Service',
            description: 'Priority processing within 24-48 hours'
          },
          unit_amount: Math.round(expressPrice * 100),
        },
        quantity: 1,
      });
    }

    // VAT reverse charge applies to all transactions (Polish company selling internationally)
    // Customer is always liable for VAT in their jurisdiction
    const automaticTaxConfig = {
      enabled: true,
      liability: {
        type: 'self' as const // Reverse charge - customer is liable for VAT
      }
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      line_items: lineItems,
      automatic_tax: automaticTaxConfig,
      customer_update: {
        address: 'auto', // Automatically save address entered in checkout
        shipping: 'auto' // Automatically save shipping info if provided
      },
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
          // Invoice will be automatically sent via webhook after successful payment (see /api/stripe/webhook/route.ts)
          custom_fields: [
            {
              name: "Business & Service",
              value: `${orderData.selectedBusiness.name} - ${serviceType === 'remove' ? 'Complete Profile Removal' : 'Profile Reset (Reviews Only)'}`
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
          footer: "Thank you for choosing MapWipers. Service will begin immediately after payment confirmation. VAT reverse charge applies - customer is responsible for VAT calculation and payment in their jurisdiction. Seller: MapWipers (NIP: PL6782978644).",
          metadata: {
            orderId: `ORDER_${Date.now()}`,
            businessPlaceId: orderData.selectedBusiness.place_id || '',
            vatReverseCharge: 'true',
            customerCountry: formData.companyCountry || 'US',
            customerTaxId: formData.companyTaxId || ''
          }
        }
      },
      payment_intent_data: {
        metadata: {
          orderId: `ORDER_${Date.now()}`,
          businessName: orderData.selectedBusiness.name,
          serviceType: serviceType,
          vatReverseCharge: 'true',
          customerCountry: formData.companyCountry || 'US'
        }
      }
    });

    console.log('Stripe checkout session created:', {
      sessionId: session.id,
      customerId: customer.id,
      business: orderData.selectedBusiness.name,
      service: serviceType,
      amount: totalPrice,
      vatReverseCharge: true,
      customerCountry: formData.companyCountry || 'US'
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
      currency: currency.toUpperCase(),
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
