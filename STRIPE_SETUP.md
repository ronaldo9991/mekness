# Stripe Payment Integration Setup

## Overview
Mekness Dashboard now supports Stripe payments for deposits, including:
- **Credit/Debit Cards** - Instant card payments
- **Cryptocurrency** - Bitcoin, Ethereum, USDT, USDC via Stripe Checkout

## Setup Instructions

### 1. Create Stripe Account
1. Sign up at [https://stripe.com](https://stripe.com)
2. Complete account verification
3. Enable your account for live payments

### 2. Get API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

### 3. Configure Environment Variables

#### Backend (.env)
```bash
# Stripe Secret Key (server-side)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Secret (from Stripe CLI or Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5000
```

#### Frontend (.env or vite config)
```bash
# Stripe Publishable Key (client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 4. Setup Webhooks

#### Option A: Using Stripe CLI (Development)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Copy the webhook signing secret to .env
```

#### Option B: Using Stripe Dashboard (Production)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
6. Copy the **Signing secret** to your .env file

### 5. Enable Cryptocurrency Payments (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings** → **Payment methods**
3. Enable **Crypto** payments
4. Select supported cryptocurrencies:
   - Bitcoin (BTC)
   - Ethereum (ETH)
   - USD Coin (USDC)
   - Tether (USDT)

## Testing

### Test Card Numbers
Stripe provides test cards for development:

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined card |
| 4000 0000 0000 0341 | Requires authentication (3D Secure) |

**Use any:**
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

### Test Cryptocurrency
In test mode, Stripe simulates crypto payments. No real cryptocurrency is needed.

## Payment Flow

### Credit/Debit Card
1. User enters deposit amount
2. Selects "Credit/Debit Card (Stripe)"
3. System creates Stripe Payment Intent
4. Payment is processed instantly
5. Funds added to trading account upon success

### Cryptocurrency
1. User enters deposit amount
2. Selects "Cryptocurrency (Stripe)"
3. Chooses crypto (BTC, ETH, USDT, USDC)
4. Redirects to Stripe Checkout
5. User completes crypto payment
6. Webhook confirms payment
7. Funds added to trading account

## API Endpoints

### Create Card Payment Intent
```http
POST /api/stripe/create-payment-intent
Content-Type: application/json

{
  "amount": 100.00,
  "tradingAccountId": "account-id",
  "paymentMethod": "card"
}
```

### Create Crypto Payment
```http
POST /api/stripe/create-crypto-payment
Content-Type: application/json

{
  "amount": 100.00,
  "tradingAccountId": "account-id",
  "cryptocurrency": "BTC"
}
```

### Webhook Endpoint
```http
POST /api/stripe/webhook
Stripe-Signature: {signature}

{event_data}
```

## Security Best Practices

1. **Never expose Secret Key** in client-side code
2. **Always use HTTPS** in production
3. **Verify webhook signatures** (already implemented)
4. **Set minimum deposit** amounts ($10 minimum)
5. **Validate amounts** server-side (already implemented)
6. **Use environment variables** for all keys
7. **Enable 3D Secure** for card payments
8. **Monitor Stripe Dashboard** for suspicious activity

## Error Handling

The integration handles:
- ✅ Invalid payment methods
- ✅ Insufficient funds
- ✅ Declined cards
- ✅ Network errors
- ✅ Webhook verification failures
- ✅ Amount validation

## Going Live

### Checklist
- [ ] Replace test keys with live keys
- [ ] Set up production webhook endpoint
- [ ] Enable cryptocurrency payments (if needed)
- [ ] Configure HTTPS on your domain
- [ ] Test with real small amounts
- [ ] Update Stripe account information
- [ ] Enable fraud detection rules
- [ ] Set up email notifications

### Update Environment Variables
```bash
# Production keys (starts with pk_live_ and sk_live_)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
FRONTEND_URL=https://yourdomain.com
```

## Troubleshooting

### Webhooks Not Receiving Events
- Check webhook URL is correct and accessible
- Verify webhook signing secret matches .env
- Check Stripe logs in dashboard
- Ensure server is running and accessible

### Payments Not Processing
- Verify API keys are correct
- Check Stripe Dashboard for error logs
- Ensure amount meets minimum ($10)
- Verify trading account exists

### Crypto Payments Failing
- Ensure crypto is enabled in Stripe Dashboard
- Check supported cryptocurrencies match
- Verify redirect URLs are correct

## Support

- **Stripe Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Mekness Support**: support@mekness.com

## Fees

### Stripe Fees (approximate, check current rates)
- **Card Payments**: 2.9% + $0.30 per successful charge
- **Cryptocurrency**: 2.9% + $0.30 per successful charge
- **International Cards**: +1.5%
- **Currency Conversion**: +1%

*Note: Fees are deducted by Stripe before funds reach your account.*

## Live Dashboard Access

Once live, monitor payments at:
- **Dashboard**: https://dashboard.stripe.com
- **Payments**: https://dashboard.stripe.com/payments
- **Customers**: https://dashboard.stripe.com/customers
- **Disputes**: https://dashboard.stripe.com/disputes

