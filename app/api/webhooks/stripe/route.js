import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/index'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      await handleCheckoutComplete(session)
    } catch (err) {
      console.error('[webhook] handleCheckoutComplete error', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session) {
  const supabase = await createServiceClient()

  // Parse cart items from metadata
  const cartItems = session.metadata?.cartItems
    ? JSON.parse(session.metadata.cartItems)
    : []

  if (!cartItems.length) return

  const customerName =
    session.customer_details?.name ?? 'Unknown'
  const customerEmail =
    session.customer_details?.email ?? ''
  const totalAmount = (session.amount_total ?? 0) / 100

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerName,
      customer_email: customerEmail,
      total_amount: totalAmount,
      stripe_session_id: session.id,
      status: 'paid',
    })
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message}`)
  }

  // Create order items and update stock
  for (const item of cartItems) {
    // Insert order item
    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
    })

    // Decrement stock
    const { data: variant } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', item.variantId)
      .single()

    if (variant) {
      await supabase
        .from('product_variants')
        .update({ stock: Math.max(0, variant.stock - item.quantity) })
        .eq('id', item.variantId)
    }
  }
}
