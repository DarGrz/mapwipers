import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServiceRole } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        
        // Here you would:
        // 1. Update your database with the successful payment
        // 2. Send confirmation email to customer
        // 3. Start the service process
        // 4. Notify your team
        
        await handleSuccessfulPayment(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        
        // Handle failed payment - log the failure
        try {
          // For invoices, we might not have a direct payment_intent reference
          // Instead, we can look for orders by customer email or other metadata
          const customerEmail = failedInvoice.customer_email;
          if (customerEmail) {
            const { error } = await supabaseServiceRole
              .from('orders')
              .update({
                payment_status: 'failed',
                updated_at: new Date().toISOString()
              })
              .eq('customer_email', customerEmail)
              .eq('payment_status', 'pending');

            if (error) {
              console.error('Error updating failed payment status:', error);
            }
          }
        } catch (dbError) {
          console.error('Database error updating failed payment:', dbError);
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Retrieve customer and order details
    const customer = await stripe.customers.retrieve(session.customer as string);
    
    const customerEmail = customer && typeof customer !== 'string' && !customer.deleted 
      ? customer.email 
      : session.customer_details?.email || 'unknown';
    
    console.log('Processing successful payment:', {
      sessionId: session.id,
      customerId: session.customer,
      customerEmail,
      orderId: session.metadata?.orderId,
      businessName: session.metadata?.businessName,
      serviceType: session.metadata?.serviceType,
      amountTotal: session.amount_total
    });

    // Update order status in database
    try {
      const { error } = await supabaseServiceRole
        .from('orders')
        .update({
          payment_status: 'completed',
          payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id);

      if (error) {
        console.error('Error updating order status:', error);
      } else {
        console.log('Order status updated successfully for session:', session.id);
      }
    } catch (dbError) {
      console.error('Database error updating order:', dbError);
    }

    // Automatically send invoice after successful payment
    try {
      if (session.invoice) {
        const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id;
        
        if (invoiceId) {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          
          // Send the invoice if it hasn't been sent yet
          if (invoice.status === 'draft' || invoice.status === 'open') {
            await stripe.invoices.sendInvoice(invoiceId);
            console.log('Invoice automatically sent:', invoiceId);
          }
        }
      }
    } catch (invoiceError) {
      console.error('Error sending invoice automatically:', invoiceError);
      // Don't fail the webhook if invoice sending fails
    }

    // TODO: Implement additional business logic:
    
    // 1. Save order to database
    /*
    await saveOrderToDatabase({
      orderId: session.metadata?.orderId,
      customerId: session.customer,
      businessName: session.metadata?.businessName,
      serviceType: session.metadata?.serviceType,
      status: 'paid',
      amount: session.amount_total,
      currency: session.currency,
      paymentDate: new Date()
    });
    */

    // 2. Send confirmation email
    /*
    await sendConfirmationEmail({
      customerEmail: session.customer_details?.email,
      orderId: session.metadata?.orderId,
      businessName: session.metadata?.businessName,
      serviceType: session.metadata?.serviceType
    });
    */

    // 3. Notify your team to start the service
    /*
    await notifyTeam({
      orderId: session.metadata?.orderId,
      businessName: session.metadata?.businessName,
      serviceType: session.metadata?.serviceType,
      customerEmail: session.customer_details?.email
    });
    */

    console.log('Successfully processed payment for order:', session.metadata?.orderId);
  } catch (error) {
    console.error('Error handling successful payment:', error);
    // Consider implementing retry logic or alerting system
  }
}

// TODO: Implement these functions based on your infrastructure:

/*
async function saveOrderToDatabase(orderData: any) {
  // Save to your database (PostgreSQL, MongoDB, etc.)
}

async function sendConfirmationEmail(emailData: any) {
  // Send email using your email service (SendGrid, AWS SES, etc.)
}

async function notifyTeam(notificationData: any) {
  // Send notification to your team (Slack, Discord, email, etc.)
}
*/
