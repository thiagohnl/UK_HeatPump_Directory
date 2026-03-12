import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe';
import { SITE_URL } from '@/lib/constants';

const priceMap: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual: process.env.STRIPE_PRICE_ANNUAL,
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { plan } = await request.json();
    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const { data: installer } = await supabase
      .from('installers')
      .select('id, stripe_customer_id, company_name, email')
      .eq('claimed_by', user.id)
      .single();

    if (!installer) {
      return NextResponse.json({ error: 'No installer profile' }, { status: 404 });
    }

    // Create or reuse Stripe customer
    let customerId = installer.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          installer_id: installer.id,
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      const admin = createAdminClient();
      await admin
        .from('installers')
        .update({ stripe_customer_id: customerId })
        .eq('id', installer.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?upgraded=true`,
      cancel_url: `${SITE_URL}/dashboard/upgrade`,
      metadata: { installer_id: installer.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
