import Stripe from 'stripe'

let _stripe = null

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}

// Named export for convenience
export const stripe = {
  checkout: {
    sessions: {
      create: (...args) => getStripe().checkout.sessions.create(...args),
    },
  },
  webhooks: {
    constructEvent: (...args) => getStripe().webhooks.constructEvent(...args),
  },
}
