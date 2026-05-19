import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: planData } = await supabase
    .from('user_plans')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  let stripeCustomerId = planData?.stripe_customer_id as string | undefined

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      metadata: { clerk_user_id: userId },
    })
    stripeCustomerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/generate`,
    metadata: { clerk_user_id: userId },
    subscription_data: { metadata: { clerk_user_id: userId } },
  })

  return Response.json({ url: session.url })
}
