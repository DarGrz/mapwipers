# Stripe Payment Integration Plan

## Overview
This document outlines how to integrate Stripe payments with invoice functionality for the MapWipers application.

## Stripe Features We'll Use

### 1. Stripe Checkout (Recommended for MVP)
- **Pros**: Easy to implement, handles payment forms, supports invoices
- **Features**: Automatic invoice generation, multiple payment methods, mobile-optimized
- **Implementation**: Redirect to Stripe-hosted checkout page

### 2. Stripe Customer Management
- **Purpose**: Store customer information for invoicing
- **Features**: Company details, billing addresses, tax IDs
- **API**: Create customers with metadata for company info

### 3. Stripe Invoicing
- **Purpose**: Generate professional invoices with company details
- **Features**: Automatic VAT/tax calculation, PDF generation, email delivery
- **API**: Create invoices with line items and customer data

### 4. Stripe Tax (Optional)
- **Purpose**: Automatic tax calculation for different countries
- **Features**: VAT, GST, and other tax types based on customer location

## Implementation Steps

### Step 1: Setup Stripe Account & API Keys
```bash
# Install Stripe SDK
npm install stripe @stripe/stripe-js

# Environment variables needed:
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 2: Create Stripe Customer with Company Info
```typescript
// When order is submitted, create/update Stripe customer
const customer = await stripe.customers.create({
  email: formData.email,
  name: `${formData.firstName} ${formData.lastName}`,
  phone: formData.phone,
  address: formData.isCompany ? {
    line1: formData.companyAddress,
    city: formData.companyCity,
    postal_code: formData.companyZip,
    country: formData.companyCountry,
  } : undefined,
  metadata: {
    isCompany: formData.isCompany ? 'true' : 'false',
    companyName: formData.companyName || '',
    taxId: formData.companyTaxId || '',
    orderType: 'gmb_service',
    businessName: orderData.selectedBusiness.name
  }
});
```

### Step 3: Create Checkout Session with Invoice
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customer.id,
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: `Google Maps ${serviceType} Service`,
        description: `${serviceType} service for ${businessName}`,
      },
      unit_amount: totalPrice * 100, // Convert to cents
    },
    quantity: 1,
  }],
  invoice_creation: {
    enabled: true,
    invoice_data: {
      description: `Google Maps ${serviceType} Service`,
      custom_fields: [
        {
          name: "Business Name",
          value: businessName
        },
        {
          name: "Service Type", 
          value: serviceType === 'remove' ? 'Profile Removal' : 'Profile Reset'
        }
      ],
      footer: "Payment due upon service completion. Service will be performed within estimated timeframe.",
    }
  },
  success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
});
```

### Step 4: Handle Webhooks
```typescript
// Handle successful payments and update order status
app.post('/api/stripe/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Order paid, start service
      break;
    case 'invoice.payment_succeeded':
      // Invoice paid
      break;
    case 'invoice.payment_failed':
      // Handle failed payment
      break;
  }

  res.json({received: true});
});
```

## Payment Flow

### Current Flow (Post-Service Payment)
1. Customer selects service and fills form
2. Order submitted → Service starts
3. Service completed → Invoice sent
4. Customer pays invoice

### Recommended Flow (Upfront Payment)
1. Customer selects service and fills form
2. Redirect to Stripe Checkout
3. Payment completed → Service starts
4. Service completed → Confirmation sent

## Invoice Details

### Company Invoices Include:
- Company name and address
- VAT/Tax ID (if provided)
- Service description
- Amount and currency
- Payment terms
- Company logo (optional)

### Individual Invoices Include:
- Customer name and email
- Service description  
- Amount and currency
- Payment confirmation

## File Structure
```
app/
├── api/
│   ├── stripe/
│   │   ├── create-checkout/route.ts
│   │   ├── webhook/route.ts
│   │   └── invoice/route.ts
│   └── create-payment/route.ts (update existing)
├── components/
│   ├── OrderForm.tsx (updated with company fields)
│   └── PaymentSuccess.tsx
└── order-confirmation/
    └── page.tsx (updated)
```

## Next Steps

1. **Install Stripe**: `npm install stripe @stripe/stripe-js`
2. **Setup Environment Variables**: Add Stripe keys to .env.local
3. **Update API Route**: Implement actual Stripe checkout in `/api/create-payment/route.ts`
4. **Test with Stripe Test Cards**: Use test mode for development
5. **Setup Webhooks**: Configure webhook endpoint for payment confirmations
6. **Handle Edge Cases**: Failed payments, refunds, service cancellations

## Test Cards for Development
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155

Would you like me to implement any specific part of this integration?
