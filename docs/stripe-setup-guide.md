# Payment System Setup Guide

This guide will walk you through setting up the complete Stripe payment integration for your MapWipers application.

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Next.js Application**: Your app should be running locally or deployed

## Step 1: Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Stripe API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
   - **Publishable Key**: Starts with `pk_test_` (for testing)
   - **Secret Key**: Starts with `sk_test_` (for testing)

3. Update `.env.local` with your actual keys:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   NEXT_PUBLIC_DOMAIN=http://localhost:3000
   ```

## Step 2: Set Up Stripe Webhook

1. Go to the [Stripe Webhooks Dashboard](https://dashboard.stripe.com/webhooks)

2. Click "Add endpoint"

3. Set the endpoint URL:
   - **Local Development**: Use ngrok or similar tool to expose your local server
   - **Production**: `https://yourdomain.com/api/stripe/webhook`

4. Select events to listen for:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`

5. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
   ```

## Step 3: Test the Payment Flow

### Local Development with ngrok

1. Install ngrok: [ngrok.com/download](https://ngrok.com/download)

2. Start your Next.js app:
   ```bash
   npm run dev
   ```

3. In another terminal, expose your local server:
   ```bash
   ngrok http 3000
   ```

4. Update your webhook endpoint in Stripe Dashboard with the ngrok URL:
   ```
   https://your-ngrok-url.ngrok.io/api/stripe/webhook
   ```

5. Update your `.env.local` domain:
   ```env
   NEXT_PUBLIC_DOMAIN=https://your-ngrok-url.ngrok.io
   ```

### Testing with Stripe Test Cards

Use these test card numbers for different scenarios:

- **Successful Payment**: `4242 4242 4242 4242`
- **Declined Payment**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

Other details for testing:
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any valid zip code

## Step 4: Verify the Complete Flow

1. **Order Creation**: Fill out the form and submit an order
2. **Payment Processing**: Should redirect to Stripe Checkout
3. **Payment Success**: Should redirect to `/payment/success` page
4. **Webhook Processing**: Check your server logs for webhook events
5. **Email Notifications**: (You'll need to implement email service)

## Step 5: Production Deployment

### Environment Variables for Production

Update your production environment with:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_DOMAIN=https://yourdomain.com
```

### Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Set up monitoring for failed payments
- [ ] Configure email notifications
- [ ] Set up database logging for orders

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check that `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard
   - Ensure the webhook endpoint URL is correct

2. **Payment not redirecting properly**
   - Verify `NEXT_PUBLIC_DOMAIN` is set correctly
   - Check that success/cancel URLs are accessible

3. **TypeScript errors**
   - Run `npm run build` to check for compilation errors
   - Ensure all environment variables are properly typed

### Debug Commands

```bash
# Check environment variables
npm run env-check

# Test webhook locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# View Stripe logs
stripe logs tail
```

## Next Steps

1. **Email Integration**: Set up email notifications for order confirmations
2. **Database Integration**: Store order data in your database
3. **Order Management**: Build admin interface for managing orders
4. **Analytics**: Track payment conversion rates
5. **Error Handling**: Implement comprehensive error handling and retry logic

## Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Webhook Testing**: [webhook.site](https://webhook.site) for testing webhooks
