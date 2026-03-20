import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/index'

export async function POST(req) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: `Size: ${item.size}`,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
            size: item.size,
          },
        },
        unit_amount: Math.round(item.price * 100), // pence
      },
      quantity: item.quantity,
    }))

    // Build cart metadata for webhook
    const cartMeta = JSON.stringify(
      items.map(i => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      }))
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      metadata: { cartItems: cartMeta },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: items.reduce((s, i) => s + i.price * i.quantity, 0) >= 100 ? 0 : 499,
              currency: 'gbp',
            },
            display_name: 'Royal Mail Tracked 48',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'gbp' },
            display_name: 'DPD Express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 1 },
            },
          },
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
